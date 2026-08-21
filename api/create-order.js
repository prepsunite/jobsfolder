import Razorpay from 'razorpay';

export default async function handler(req, res) {
  // Set anti-caching & security headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'INR', itemType, examId } = req.body || {};

    // Strict validation: Require explicit positive amount from frontend
    if (typeof amount !== 'number' || amount <= 0 || isNaN(amount)) {
      return res.status(400).json({ error: 'Valid positive order amount is required.' });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.error('[api/create-order] Payment gateway credentials not configured on server.');
      return res.status(500).json({ error: 'Payment gateway credentials not configured on server.' });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert ₹ to paise
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: { itemType: itemType || 'SINGLE_PAPER', examId: examId || null },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    // Safe production logging: log only safe message to prevent leaking sensitive structures
    console.error('[api/create-order] Error creating order:', error?.message || 'Unknown error');
    return res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
}
