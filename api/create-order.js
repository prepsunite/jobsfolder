import Razorpay from 'razorpay';

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
  MONTHLY: 169,
  MONTHLY_PASS: 169,
  QUARTERLY: 699,
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
    const { itemType = 'SINGLE_PAPER', examId, currency = 'INR', amount, userEmail } = req.body || {};

    // 1. Authoritative price resolution
    const normalizedItemType = itemType.toUpperCase();
    const serverExpectedPrice = PRICING_CATALOG[normalizedItemType];

    if (!serverExpectedPrice) {
      return res.status(400).json({ error: `Invalid itemType '${itemType}'. Allowed: ${Object.keys(PRICING_CATALOG).join(', ')}` });
    }

    // Require examId if purchasing a single paper
    if ((normalizedItemType === 'SINGLE_PAPER' || normalizedItemType === 'SINGLE') && !examId) {
      return res.status(400).json({ error: 'examId is required for single paper purchases.' });
    }

    // Client price tampering check
    if (typeof amount === 'number' && amount > 0 && amount !== serverExpectedPrice) {
      console.warn(`[api/create-order] Price mismatch attempt. Client requested ₹${amount} for ${normalizedItemType}, enforcing ₹${serverExpectedPrice}.`);
    }

    const finalAmountINR = serverExpectedPrice;

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error('[api/create-order] Payment gateway credentials not configured on server.');
      return res.status(500).json({ error: 'Payment gateway credentials not configured on server.' });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({
      amount: Math.round(finalAmountINR * 100), // convert ₹ to paise
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: {
        itemType: normalizedItemType,
        examId: examId || null,
        userEmail: userEmail ? String(userEmail).toLowerCase().trim() : null,
        expectedAmountINR: String(finalAmountINR),
      },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      itemType: normalizedItemType,
    });
  } catch (error) {
    console.error('[api/create-order] Error creating order:', error?.message || 'Unknown error');
    return res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
}
