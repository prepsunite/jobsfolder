import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

function safeTimingEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
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

    const body = JSON.stringify(req.body);
    const expectedSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (!safeTimingEqual(expectedSig, signature)) {
      console.warn('[api/webhook] Invalid webhook signature');
      return res.status(400).send('Invalid webhook signature');
    }

    const event = req.body;
    if (event?.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      if (payment) {
        const { itemType = 'SINGLE_PAPER', examId } = payment.notes || {};
        const userEmail = payment.email || payment.notes?.userEmail;
        const amount = payment.amount ? payment.amount / 100 : 99;
        const paymentId = payment.id;
        const orderId = payment.order_id;

        if (userEmail) {
          const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
          const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

          if (supabaseUrl && supabaseServiceKey) {
            const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
              auth: { persistSession: false, autoRefreshToken: false },
            });

            const normalizedEmail = userEmail.toLowerCase().trim();

            // Log transaction (idempotent write)
            await supabaseAdmin.from('transactions').upsert(
              [
                {
                  user_email: normalizedEmail,
                  payment_id: paymentId,
                  order_id: orderId,
                  amount,
                  currency: 'INR',
                  status: 'SUCCESS',
                  item_type: itemType,
                  exam_id: examId || null,
                },
              ],
              { onConflict: 'payment_id' }
            );

            if (itemType === 'SINGLE_PAPER' && examId) {
              const paperExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
              await supabaseAdmin.from('user_paper_purchases').upsert(
                [
                  {
                    user_email: normalizedEmail,
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
              let planName = 'Jobsfolder Pro Monthly Pass';
              if (itemType === 'QUARTERLY') {
                days = 90;
                planName = 'Jobsfolder Pro Quarterly Pass';
              } else if (itemType === 'YEARLY') {
                days = 365;
                planName = 'Jobsfolder Master Yearly Pass';
              }

              const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
              await supabaseAdmin.from('user_subscriptions').upsert(
                [
                  {
                    user_email: normalizedEmail,
                    plan_name: planName,
                    payment_id: paymentId,
                    status: 'ACTIVE',
                    expires_at: expiresAt,
                  },
                ],
                { onConflict: 'payment_id' }
              );
            }
          }
        }
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('[api/webhook] Error processing webhook:', error?.message || 'Unknown error');
    return res.status(500).send('Webhook Processing Error');
  }
}
