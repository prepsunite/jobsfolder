import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

function safeTimingEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!webhookSecret) {
      console.error('[api/webhook] RAZORPAY_WEBHOOK_SECRET is not configured.');
      return res.status(500).send('Webhook Secret Not Configured');
    }

    if (!signature) {
      return res.status(400).send('Missing webhook signature');
    }

    let rawBuffer;
    if (Buffer.isBuffer(req.body)) {
      rawBuffer = req.body;
    } else if (typeof req.body === 'string') {
      rawBuffer = Buffer.from(req.body, 'utf8');
    } else if (req.rawBody && Buffer.isBuffer(req.rawBody)) {
      rawBuffer = req.rawBody;
    } else {
      rawBuffer = await getRawBody(req);
    }

    // Mandatory constant-time HMAC SHA-256 verification
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBuffer)
      .digest('hex');

    if (!safeTimingEqual(expectedSig, signature)) {
      console.warn('[api/webhook] Invalid webhook signature attempt');
      return res.status(400).send('Invalid webhook signature');
    }

    let event;
    try {
      event = JSON.parse(rawBuffer.toString('utf8'));
    } catch (parseErr) {
      console.error('[api/webhook] Failed to parse JSON event:', parseErr.message);
      return res.status(400).send('Invalid JSON payload');
    }

    const eventType = event?.event;
    const eventId = event?.event_id || event?.id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Initialize Supabase Admin Client
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[api/webhook] Supabase service role credentials missing.');
      return res.status(500).send('Database credentials missing');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Webhook Deduplication & Idempotency Store [P1-01]
    const { error: dedupError } = await supabaseAdmin.from('webhook_events').insert([
      {
        event_id: eventId,
        event_type: eventType || 'unknown',
        payload: event,
        processed_at: new Date().toISOString(),
      },
    ]);

    if (dedupError) {
      // Error code 23505 indicates unique constraint violation (duplicate event_id)
      if (dedupError.code === '23505' || dedupError.message?.includes('duplicate key')) {
        console.log(`[api/webhook] Duplicate event ${eventId} already processed. Returning 200 OK.`);
        return res.status(200).send('OK');
      }
      console.warn(`[api/webhook] Non-fatal dedup insert warning:`, dedupError.message);
    }

    // 2. Process Events
    if (eventType === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      if (payment) {
        const orderId = payment.order_id;
        const paymentId = payment.id;
        const userEmail = (payment.email || payment.notes?.userEmail || '').toLowerCase().trim();

        if (orderId && userEmail) {
          // Attempt authoritative fulfillment via RPC [P0-01, P1-02]
          const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('fulfill_payment_order', {
            p_order_id: orderId,
            p_payment_id: paymentId,
            p_user_email: userEmail,
          });

          if (rpcError) {
            console.error('[api/webhook] fulfill_payment_order RPC error:', rpcError.message);
            // Fallback: direct table updates if RPC is pending migration
            const { itemType = 'SINGLE_PAPER', examId } = payment.notes || {};
            const amount = payment.amount ? payment.amount / 100 : 59;
            const normalizedItemType = itemType.toUpperCase();

            await supabaseAdmin.from('transactions').upsert(
              [
                {
                  user_email: userEmail,
                  payment_id: paymentId,
                  order_id: orderId,
                  amount,
                  currency: 'INR',
                  status: 'SUCCESS',
                  item_type: normalizedItemType,
                  exam_id: examId || null,
                },
              ],
              { onConflict: 'payment_id' }
            );

            if ((normalizedItemType === 'SINGLE_PAPER' || normalizedItemType === 'SINGLE') && examId) {
              const paperExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
              await supabaseAdmin.from('user_paper_purchases').upsert(
                [
                  {
                    user_email: userEmail,
                    exam_id: examId,
                    payment_id: paymentId,
                    amount_paid: amount,
                    expires_at: paperExpiresAt,
                  },
                ],
                { onConflict: 'payment_id' }
              );
            } else {
              let days = 30;
              let planName = 'PrepUnite Pro (5 Mock Exams/mo)';
              if (normalizedItemType.startsWith('ULTRA')) {
                if (normalizedItemType.includes('6M')) {
                  days = 180;
                  planName = 'PrepUnite Ultra 6-Month Pass (Unlimited)';
                } else if (normalizedItemType.includes('1Y') || normalizedItemType.includes('YEARLY')) {
                  days = 365;
                  planName = 'PrepUnite Ultra 1-Year Pass (Unlimited)';
                } else {
                  days = 30;
                  planName = 'PrepUnite Ultra (Unlimited)';
                }
              } else if (normalizedItemType.startsWith('PRO')) {
                if (normalizedItemType.includes('6M')) {
                  days = 180;
                  planName = 'PrepUnite Pro 6-Month Pass (5 Mock Exams/mo)';
                } else if (normalizedItemType.includes('1Y') || normalizedItemType.includes('YEARLY')) {
                  days = 365;
                  planName = 'PrepUnite Pro 1-Year Pass (5 Mock Exams/mo)';
                } else {
                  days = 30;
                  planName = 'PrepUnite Pro (5 Mock Exams/mo)';
                }
              }

              // Atomic extension fallback
              let baseTime = Date.now();
              const { data: existingSub } = await supabaseAdmin
                .from('user_subscriptions')
                .select('expires_at')
                .eq('user_email', userEmail)
                .eq('status', 'ACTIVE')
                .gt('expires_at', new Date().toISOString())
                .order('expires_at', { ascending: false })
                .limit(1)
                .maybeSingle();

              if (existingSub?.expires_at) {
                const expMs = new Date(existingSub.expires_at).getTime();
                if (expMs > baseTime) baseTime = expMs;
              }

              const expiresAt = new Date(baseTime + days * 24 * 60 * 60 * 1000).toISOString();
              await supabaseAdmin.from('user_subscriptions').upsert(
                [
                  {
                    user_email: userEmail,
                    plan_name: planName,
                    payment_id: paymentId,
                    status: 'ACTIVE',
                    expires_at: expiresAt,
                  },
                ],
                { onConflict: 'payment_id' }
              );
            }
          } else {
            console.log(`[api/webhook] Successfully fulfilled order ${orderId} via RPC for ${userEmail}`);
          }
        }
      }
    } else if (eventType === 'refund.processed' || eventType === 'refund.created') {
      // 3. Handle Refunds [P1-03]
      const refund = event.payload?.refund?.entity;
      const paymentId = refund?.payment_id || event.payload?.payment?.entity?.id;

      if (paymentId) {
        console.log(`[api/webhook] Processing refund for payment ${paymentId}`);
        const { error: revokeError } = await supabaseAdmin.rpc('revoke_payment_entitlement', {
          p_payment_id: paymentId,
          p_reason: 'REFUND_PROCESSED',
        });

        if (revokeError) {
          console.warn('[api/webhook] revoke_payment_entitlement RPC error:', revokeError.message);
          // Fallback revocation
          await supabaseAdmin
            .from('user_subscriptions')
            .update({ status: 'REVOKED', expires_at: new Date().toISOString() })
            .eq('payment_id', paymentId);
          await supabaseAdmin
            .from('user_paper_purchases')
            .update({ expires_at: new Date().toISOString() })
            .eq('payment_id', paymentId);
          await supabaseAdmin
            .from('transactions')
            .update({ status: 'REFUNDED' })
            .eq('payment_id', paymentId);
        }
      }
    } else if (eventType === 'payment.dispute.created' || eventType === 'dispute.created') {
      // 4. Handle Disputes / Chargebacks [P1-03]
      const dispute = event.payload?.dispute?.entity;
      const paymentId = dispute?.payment_id;

      if (paymentId) {
        console.log(`[api/webhook] Processing dispute for payment ${paymentId}`);
        const { error: revokeError } = await supabaseAdmin.rpc('revoke_payment_entitlement', {
          p_payment_id: paymentId,
          p_reason: 'DISPUTE_FILED',
        });

        if (revokeError) {
          console.warn('[api/webhook] Dispute revoke RPC error:', revokeError.message);
          await supabaseAdmin
            .from('user_subscriptions')
            .update({ status: 'REVOKED', expires_at: new Date().toISOString() })
            .eq('payment_id', paymentId);
          await supabaseAdmin
            .from('user_paper_purchases')
            .update({ expires_at: new Date().toISOString() })
            .eq('payment_id', paymentId);
          await supabaseAdmin
            .from('transactions')
            .update({ status: 'DISPUTED' })
            .eq('payment_id', paymentId);
        }
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('[api/webhook] Error processing webhook:', error?.message || 'Unknown error');
    return res.status(500).send('Webhook Processing Error');
  }
}
