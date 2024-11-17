import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51PqPqkDO7zxNZCMgOY4tK4Rwpmsn3cKHPtCfgHIlUAgIZUCvavOgV1tWKsbdsgqDJJqlSEqNKw2PFU8ykcZwve2E00Og1L2F7Q');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { item_name, cost, market, value } = req.body;

    try {
      const marketString = encodeURIComponent(JSON.stringify(market));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // Add other payment methods if needed
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item_name,
              },
              unit_amount: cost, // Amount in cents (e.g., $20.00 = 2000)
            },
            quantity: value,
          },
        ],
        mode: 'payment', // Or 'subscription' for recurring payments
        success_url: `https://book-buddy-app.com/rewards?session_id={CHECKOUT_SESSION_ID}&market=${marketString}&value=${value}`,
        cancel_url: `https://book-buddy-app.com/rewards`,
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Verification failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
