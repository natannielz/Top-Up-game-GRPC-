// server/controllers/paymentController.js

export const createTransaction = (orderId, amount) => {
  // MOCK: Generate a fake Snap Token or Payment URL
  console.log(`[Payment] Creating transaction for Order ${orderId}, Amount: ${amount}`);

  return {
    token: `SNAP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/${orderId}`
  };
};

export const handleCallback = (req, res) => {
  // MOCK: Handle Webhook from Payment Gateway
  const data = req.body;

  console.log('[Payment] Received Callback:', data);
  res.status(200).json({ status: 'OK' });
};
