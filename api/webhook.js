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

    // Verify webhook signature if secret is present
    if (webhookSecret) {
      if (!signature) {
        return res.status(400).send('Missing webhook signature');
      }

      const body = JSON.stringify(req.body);
      const expectedSig = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      if (!safeTimingEqual(expectedSig, signature)) {
        return res.status(400).send('Invalid webhook signature');
      }
    }

    const event = req.body;
    if (event?.event === 'payment.captured') {
      const payment = event.payload?.payment?.entity;
      if (payment) {
        const { itemType = 'SINGLE_PAPER', examId } = payment.notes || {};
        const userEmail = payment.email || 'student@jobsfolder.com';
        const amount = payment.amount / 100;
        const paymentId = payment.id;

        const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseServiceKey) {
          const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

          // Log transaction (idempotent write)
          await supabaseAdmin.from('transactions').insert([{
            user_email: userEmail,
            payment_id: paymentId,
            order_id: payment.order_id,
            amount,
            status: 'SUCCESS',
            item_type: itemType,
            exam_id: examId,
          }]);

          if (itemType === 'SINGLE_PAPER' && examId) {
            const paperExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
            await supabaseAdmin.from('user_paper_purchases').insert([{
              user_email: userEmail,
              exam_id: examId,
              payment_id: paymentId,
              amount_paid: amount,
              expires_at: paperExpiresAt,
            }]);
          } else if (itemType === 'MONTHLY_PASS') {

            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
            await supabaseAdmin.from('user_subscriptions').insert([{
              user_email: userEmail,
              plan_name: 'Jobsfolder Pro Monthly Pass',
              payment_id: paymentId,
              status: 'ACTIVE',
              expires_at: expiresAt,
            }]);
          }
        }
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('[api/webhook] Error:', error);
    return res.status(500).send('Webhook Processing Error');
  }
}

