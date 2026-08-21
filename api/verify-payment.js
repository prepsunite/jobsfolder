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
      userEmail,
      itemType = 'SINGLE_PAPER',
      examId,
      amount = 99,
    } = req.body || {};

    if (!userEmail || typeof userEmail !== 'string' || !userEmail.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid userEmail is required for payment verification.' });
    }

    if (!razorpay_signature || !razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, error: 'Missing payment signature, payment ID, or order metadata.' });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      console.error('[api/verify-payment] RAZORPAY_KEY_SECRET is not configured.');
      return res.status(500).json({ success: false, error: 'Payment gateway configuration missing on server.' });
    }

    // 1. Mandatory HMAC SHA-256 Verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body)
      .digest('hex');

    if (!safeTimingEqual(expectedSignature, razorpay_signature)) {
      console.warn('[api/verify-payment] Invalid payment signature attempt:', { razorpay_payment_id, razorpay_order_id });
      return res.status(400).json({ success: false, error: 'Invalid payment signature. Verification failed.' });
    }

    // 2. Initialize Supabase Admin Client
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[api/verify-payment] Supabase service role credentials not configured.');
      return res.status(500).json({ success: false, error: 'Database service configuration missing.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const normalizedEmail = userEmail.toLowerCase().trim();

    // 3. Log Transaction (Idempotent by payment_id)
    await supabaseAdmin.from('transactions').upsert(
      [
        {
          user_email: normalizedEmail,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          amount,
          currency: 'INR',
          status: 'SUCCESS',
          item_type: itemType,
          exam_id: examId || null,
        },
      ],
      { onConflict: 'payment_id' }
    );

    // 4. Grant Entitlement based on purchase type
    if (itemType === 'SINGLE_PAPER' && examId) {
      const paperExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 Year Access
      await supabaseAdmin.from('user_paper_purchases').upsert(
        [
          {
            user_email: normalizedEmail,
            exam_id: examId,
            payment_id: razorpay_payment_id,
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
            payment_id: razorpay_payment_id,
            status: 'ACTIVE',
            expires_at: expiresAt,
          },
        ],
        { onConflict: 'payment_id' }
      );
    }

    return res.status(200).json({
      success: true,
      isUnlocked: true,
      message: 'Payment verified and access securely granted on database.',
    });
  } catch (error) {
    console.error('[api/verify-payment] Exception:', error);
    return res.status(500).json({ success: false, error: 'Payment verification server error.' });
  }
}

