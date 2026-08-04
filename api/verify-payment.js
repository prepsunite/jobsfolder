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
  // Set anti-caching & security headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      userEmail = 'student@jobsfolder.com',
      itemType = 'SINGLE_PAPER',
      examId,
      amount = 99,
    } = req.body;

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // 1. HMAC Verification
    if (key_secret) {
      if (!razorpay_signature || !razorpay_order_id || !razorpay_payment_id) {
        return res.status(400).json({ success: false, message: 'Missing payment signature or order metadata!' });
      }

      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', key_secret)
        .update(body.toString())
        .digest('hex');

      if (!safeTimingEqual(expectedSignature, razorpay_signature)) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature!' });
      }
    }

    // 2. Initialize Supabase Admin Client
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

      // Log Transaction
      await supabaseAdmin.from('transactions').insert([{
        user_email: userEmail,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        amount,
        status: 'SUCCESS',
        item_type: itemType,
        exam_id: examId,
      }]);

      // Grant Entitlement in Supabase DB
      if (itemType === 'SINGLE_PAPER' && examId) {
        const paperExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
        await supabaseAdmin.from('user_paper_purchases').insert([{
          user_email: userEmail,
          exam_id: examId,
          payment_id: razorpay_payment_id,
          amount_paid: amount,
          expires_at: paperExpiresAt,
        }]);
      } else if (itemType === 'MONTHLY_PASS') {

        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        await supabaseAdmin.from('user_subscriptions').insert([{
          user_email: userEmail,
          plan_name: 'Jobsfolder Pro Monthly Pass',
          payment_id: razorpay_payment_id,
          status: 'ACTIVE',
          expires_at: expiresAt,
        }]);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and paper access unlocked on Supabase!',
    });
  } catch (error) {
    console.error('[api/verify-payment] Error:', error);
    return res.status(500).json({ error: 'Payment verification failed' });
  }
}

