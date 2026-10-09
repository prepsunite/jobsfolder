import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

// Server-side authoritative pricing catalog (INR)
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

export default async function handler(req, res) {
  // Anti-caching headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { itemType = 'SINGLE_PAPER', examId, currency = 'INR', amount } = req.body || {};

    // 1. Enforce strict currency invariant [P1-04]
    const normalizedCurrency = String(currency).toUpperCase().trim();
    if (normalizedCurrency !== 'INR') {
      return res.status(400).json({ error: 'Invalid currency. Only INR transactions are accepted.' });
    }

    // 2. Initialize Supabase Admin Client
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[api/create-order] Supabase service role credentials not configured.');
      return res.status(500).json({ error: 'Database service configuration missing on server.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 3. Authenticate user strictly via Supabase JWT Bearer token [P1-04]
    let verifiedEmail = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
        if (user?.email && !userError) {
          verifiedEmail = user.email.toLowerCase().trim();
        }
      } catch (authErr) {
        console.warn('[api/create-order] JWT authentication warning:', authErr?.message);
      }
    }

    if (!verifiedEmail) {
      return res.status(401).json({
        error: 'Authentication required. Please sign in to create a payment order.',
      });
    }

    // 4. Authoritative price resolution
    const normalizedItemType = itemType.toUpperCase().trim();
    const serverExpectedPrice = PRICING_CATALOG[normalizedItemType];

    if (!serverExpectedPrice) {
      return res.status(400).json({
        error: `Invalid itemType '${itemType}'. Allowed: ${Object.keys(PRICING_CATALOG).join(', ')}`,
      });
    }

    // Require examId if purchasing a single paper
    if ((normalizedItemType === 'SINGLE_PAPER' || normalizedItemType === 'SINGLE') && !examId) {
      return res.status(400).json({ error: 'examId is required for single paper purchases.' });
    }

    // Client price tampering check log
    if (typeof amount === 'number' && amount > 0 && amount !== serverExpectedPrice) {
      console.warn(`[api/create-order] Price mismatch attempt. Client requested ₹${amount} for ${normalizedItemType}, enforcing ₹${serverExpectedPrice}.`);
    }

    const finalAmountINR = serverExpectedPrice;
    const amountPaise = Math.round(finalAmountINR * 100);

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error('[api/create-order] Payment gateway credentials not configured on server.');
      return res.status(500).json({ error: 'Payment gateway credentials not configured on server.' });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    // 5. Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        itemType: normalizedItemType,
        examId: examId || null,
        userEmail: verifiedEmail,
        expectedAmountINR: String(finalAmountINR),
      },
    });

    // 6. Record pre-order in server-side ledger [P0-02]
    const { error: ledgerError } = await supabaseAdmin.from('payment_orders').insert([
      {
        order_id: order.id,
        user_email: verifiedEmail,
        item_type: normalizedItemType,
        amount_paise: amountPaise,
        amount_inr: finalAmountINR,
        currency: 'INR',
        exam_id: examId || null,
        status: 'CREATED',
      },
    ]);

    if (ledgerError) {
      console.error('[api/create-order] Failed to record pre-order ledger:', ledgerError.message);
      // Fail closed to prevent untracked orders
      return res.status(500).json({ error: 'Failed to record pre-order in payment ledger.' });
    }

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      itemType: normalizedItemType,
    });
  } catch (error) {
    console.error('[api/create-order] Error creating order:', error?.message || 'Unknown error');
    return res.status(500).json({ error: 'Failed to create payment order' });
  }
}
