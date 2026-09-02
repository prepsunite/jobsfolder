import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const PRICING_CATALOG = {
  SINGLE_PAPER: 99,
  SINGLE: 99,
  MONTHLY: 299,
  MONTHLY_PASS: 299,
  QUARTERLY: 699,
  YEARLY: 1999,
};

function safeTimingEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export default async function handler(req, res) {
  // Anti-caching & security headers
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
      userEmail: bodyEmail,
      itemType = 'SINGLE_PAPER',
      examId,
      amount,
    } = req.body || {};

    if (!razorpay_signature || !razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, error: 'Missing payment signature, payment ID, or order metadata.' });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      console.error('[api/verify-payment] RAZORPAY_KEY_SECRET configuration missing on server.');
      return res.status(500).json({ success: false, error: 'Payment gateway configuration missing on server.' });
    }

    // 1. Mandatory HMAC SHA-256 Verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body)
      .digest('hex');

    if (!safeTimingEqual(expectedSignature, razorpay_signature)) {
      console.warn('[api/verify-payment] Invalid payment signature attempt for order:', razorpay_order_id);
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

    // 3. Authenticate user from JWT token if available, fallback to body email
    let verifiedEmail = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        if (user?.email) {
          verifiedEmail = user.email.toLowerCase().trim();
        }
      } catch (authErr) {
        console.warn('[api/verify-payment] JWT verification warning:', authErr?.message);
      }
    }

    if (!verifiedEmail && bodyEmail && typeof bodyEmail === 'string' && bodyEmail.includes('@')) {
      verifiedEmail = bodyEmail.toLowerCase().trim();
    }

    if (!verifiedEmail) {
      return res.status(400).json({ success: false, error: 'A valid user email or authorization session is required for payment verification.' });
    }

    const normalizedItemType = itemType.toUpperCase();
    const verifiedAmount = PRICING_CATALOG[normalizedItemType] || (typeof amount === 'number' && amount > 0 ? amount : 99);

    // 4. Log Transaction (Idempotent by payment_id)
    await supabaseAdmin.from('transactions').upsert(
      [
        {
          user_email: verifiedEmail,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          amount: verifiedAmount,
          currency: 'INR',
          status: 'SUCCESS',
          item_type: normalizedItemType,
          exam_id: examId || null,
        },
      ],
      { onConflict: 'payment_id' }
    );

    // 5. Grant Entitlement based on purchase type
    if ((normalizedItemType === 'SINGLE_PAPER' || normalizedItemType === 'SINGLE') && examId) {
      const paperExpiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 Year Access
      await supabaseAdmin.from('user_paper_purchases').upsert(
        [
          {
            user_email: verifiedEmail,
            exam_id: examId,
            payment_id: razorpay_payment_id,
            amount_paid: verifiedAmount,
            expires_at: paperExpiresAt,
          },
        ],
        { onConflict: 'payment_id' }
      );
    } else {
      let days = 30;
      let planName = 'PrepUnite Pro Monthly Pass';
      if (normalizedItemType === 'QUARTERLY') {
        days = 90;
        planName = 'PrepUnite Pro Quarterly Pass';
      } else if (normalizedItemType === 'YEARLY') {
        days = 365;
        planName = 'PrepUnite Master Yearly Pass';
      }

      const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
      await supabaseAdmin.from('user_subscriptions').upsert(
        [
          {
            user_email: verifiedEmail,
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
      message: 'Payment verified and access securely granted.',
    });
  } catch (error) {
    console.error('[api/verify-payment] Exception during verification:', error?.message || 'Unknown error');
    return res.status(500).json({ success: false, error: 'Payment verification server error.' });
  }
}
