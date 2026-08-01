import Razorpay from 'razorpay';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      // Fallback for local testing if credentials aren't set yet
      return res.status(200).json({
        orderId: `order_mock_${Date.now()}`,
        amount: (req.body.amount || 99) * 100,
        currency: req.body.currency || 'INR',
        isMock: true,
      });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const { amount, currency = 'INR', itemType, examId } = req.body;
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // convert ₹ to paise
      currency,
      receipt: `rcpt_${Date.now()}`,
      notes: { itemType, examId },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('[api/create-order] Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to create Razorpay order' });
  }
}
