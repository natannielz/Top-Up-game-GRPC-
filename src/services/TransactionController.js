// Simulate a backend API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const processPayment = async (payload) => {
  // Validate payload
  if (!payload.userId && payload.userId !== 'guest') throw new Error('User ID is required');
  if (!payload.gameId) throw new Error('Game ID is required');
  if (!payload.itemId) throw new Error('Item ID is required');
  if (!payload.paymentMethod) throw new Error('Payment Method is required');

  console.log("Processing Payment Payload:", payload);

  // Simulate Network Request
  await delay(2000);

  // Mock Success/Fail Logic (90% success rate)
  const isSuccess = Math.random() < 0.9;

  if (isSuccess) {
    return {
      status: 'success',
      trxId: 'TRX-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      message: 'Transaction successfully processed.',
      data: payload
    };
  } else {
    throw new Error('Transaction failed. Payment gateway rejected the request.');
  }
};

export const validateUser = async (userId, zoneId) => {
  await delay(1000); // Simulate API check

  if (userId.includes("99")) {
    throw new Error("User ID not found");
  }

  return {
    isValid: true,
    username: `ProGamer${userId.slice(-3)}`
  };
};
