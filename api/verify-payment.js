import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const PRICING_CATALOG = {
  // Pro Tier (5 Mock Exams / cycle)
  PRO: 129,
  PRO_1M: 129,
  PRO_MONTHLY: 129,
  PRO_6M: 649,
  PRO_1Y: 1299,
  PRO_YEARLY: 1299,

  // Ultra Tier (Unlimited Mock Exams)
  ULTRA: 169,
  ULTRA_1M: 169,
  ULTRA_MONTHLY: 169,
  ULTRA_6M: 899,
  ULTRA_1Y: 1799,
  ULTRA_YEARLY: 1799,

  // Single Company Exam Pass (1-Month / 30 Days Access)
  SINGLE_PAPER: 59,
  SINGLE: 59,

  // Legacy mappings for backward compatibility
  PLUS: 129,
  PLUS_MONTHLY: 129,
  MONTHLY: 129,
  MONTHLY_PASS: 129,
  QUARTERLY: 649,
  YEARLY: 1799,
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
    } = req.body || {};

    if (!razorpay_signature || !razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment signature, payment ID, or order metadata.',
      });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      console.error('[api/verify-payment] RAZORPAY_KEY_SECRET configuration missing on server.');
      return res.status(500).json({ success: false, error: 'Payment gateway configuration missing on server.' });
    }

    // 1. Mandatory HMAC SHA-256 Verification with constant-time equality
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

    // 3. Authenticate user strictly from JWT token (Prevents unauthenticated body email tampering)
    let verifiedEmail = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);
        if (user?.email && !authErr) {
          verifiedEmail = user.email.toLowerCase().trim();
        }
      } catch (authErr) {
        console.warn('[api/verify-payment] JWT verification warning:', authErr?.message);
      }
    }

    if (!verifiedEmail) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. An active login session is required to verify payments.',
      });
    }

    // 4. Authoritative entitlement fulfillment via RPC [P0-01]
    // The RPC locks the pre-order ledger row and grants access strictly from payment_orders.item_type
    const { data: rpcResult, error: rpcError } = await supabaseAdmin.rpc('fulfill_payment_order', {
      p_order_id: razorpay_order_id,
      p_payment_id: razorpay_payment_id,
      p_user_email: verifiedEmail,
    });

    if (!rpcError && rpcResult?.success) {
      return res.status(200).json({
        success: true,
        isUnlocked: true,
        message: 'Payment verified and access securely granted.',
        details: rpcResult,
      });
    }

    // If RPC failed for a business/security reason (e.g. order not found, ownership mismatch)
    if (rpcError && !rpcError.message.includes('function public.fulfill_payment_order') && !rpcError.message.includes('does not exist')) {
      console.warn('[api/verify-payment] fulfill_payment_order RPC rejected:', rpcError.message);
      return res.status(400).json({
        success: false,
        error: rpcError.message || 'Payment fulfillment failed verification rules.',
      });
    }

    // Fallback: in case RPC is not yet deployed, query payment_orders directly
    // CRITICAL: NEVER trust req.body.itemType! Only trust server payment_orders ledger!
    const { data: orderRecord, error: orderFetchError } = await supabaseAdmin
      .from('payment_orders')
      .select('*')
      .eq('order_id', razorpay_order_id)
      .maybeSingle();

    if (orderFetchError || !orderRecord) {
      console.error('[api/verify-payment] Pre-order record not found in ledger:', razorpay_order_id);
      return res.status(400).json({
        success: false,
        error: 'Payment order record not found in authoritative ledger.',
      });
    }

    if (orderRecord.user_email.toLowerCase().trim() !== verifiedEmail) {
      console.error('[api/verify-payment] Order user mismatch:', orderRecord.user_email, verifiedEmail);
      return res.status(403).json({
        success: false,
        error: 'Order ownership verification failed.',
      });
    }

    const authoritativeItemType = orderRecord.item_type.toUpperCase().trim();
    const authoritativeAmount = orderRecord.amount_inr;
    const authoritativeExamId = orderRecord.exam_id;

    // Log Transaction (Idempotent by payment_id)
    await supabaseAdmin.from('transactions').upsert(
      [
        {
          user_email: verifiedEmail,
          payment_id: razorpay_payment_id,
          order_id: razorpay_order_id,
          amount: authoritativeAmount,
          currency: 'INR',
          status: 'SUCCESS',
          item_type: authoritativeItemType,
          exam_id: authoritativeExamId || null,
        },
      ],
      { onConflict: 'payment_id' }
    );

    // Update payment_orders status
    await supabaseAdmin
      .from('payment_orders')
      .update({ status: 'PAID', payment_id: razorpay_payment_id, updated_at: new Date().toISOString() })
      .eq('order_id', razorpay_order_id);

    // Grant Entitlement based strictly on ledger's authoritativeItemType
    if (authoritativeItemType === 'SINGLE_PAPER' || authoritativeItemType === 'SINGLE') {
      const paperExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await supabaseAdmin.from('user_paper_purchases').upsert(
        [
          {
            user_email: verifiedEmail,
            exam_id: authoritativeExamId,
            payment_id: razorpay_payment_id,
            amount_paid: authoritativeAmount,
            expires_at: paperExpiresAt,
          },
        ],
        { onConflict: 'payment_id' }
      );
    } else {
      let days = 30;
      let planName = 'PrepUnite Pro (5 Mock Exams/mo)';

      if (authoritativeItemType.startsWith('ULTRA')) {
        if (authoritativeItemType.includes('6M')) {
          days = 180;
          planName = 'PrepUnite Ultra 6-Month Pass (Unlimited)';
        } else if (authoritativeItemType.includes('1Y') || authoritativeItemType.includes('YEARLY')) {
          days = 365;
          planName = 'PrepUnite Ultra 1-Year Pass (Unlimited)';
        } else {
          days = 30;
          planName = 'PrepUnite Ultra (Unlimited)';
        }
      } else if (authoritativeItemType.startsWith('PRO')) {
        if (authoritativeItemType.includes('6M')) {
          days = 180;
          planName = 'PrepUnite Pro 6-Month Pass (5 Mock Exams/mo)';
        } else if (authoritativeItemType.includes('1Y') || authoritativeItemType.includes('YEARLY')) {
          days = 365;
          planName = 'PrepUnite Pro 1-Year Pass (5 Mock Exams/mo)';
        } else {
          days = 30;
          planName = 'PrepUnite Pro (5 Mock Exams/mo)';
        }
      } else if (authoritativeItemType === 'QUARTERLY') {
        days = 90;
        planName = 'PrepUnite Pro Quarterly Pass';
      } else if (authoritativeItemType === 'YEARLY') {
        days = 365;
        planName = 'PrepUnite Ultra 1-Year Pass (Unlimited)';
      }

      // Atomic extension [P1-02]: Check existing active subscription to prevent truncation
      let baseTime = Date.now();
      const { data: existingSub } = await supabaseAdmin
        .from('user_subscriptions')
        .select('expires_at')
        .eq('user_email', verifiedEmail)
        .eq('status', 'ACTIVE')
        .gt('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingSub?.expires_at) {
        const existingExpMs = new Date(existingSub.expires_at).getTime();
        if (existingExpMs > baseTime) {
          baseTime = existingExpMs;
        }
      }

      const expiresAt = new Date(baseTime + days * 24 * 60 * 60 * 1000).toISOString();
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
