import { v4 as uuidv4 } from 'uuid';

// Mock Database for Game Keys (In a real app, use MongoDB/Postgres)
const GAME_KEY_INVENTORY = {
  'elden-ring': ['ER-KEY-111', 'ER-KEY-222'],
  'gta-5': ['GTA-KEY-888', 'GTA-KEY-999'],
  'cyberpunk': ['CP-KEY-001', 'CP-KEY-002']
};

// Payment Controller Logic
export const createTransaction = async (req, res) => {
  try {
    const { userId, productId, paymentMethod, gameUserId, gameZoneId, productType } = req.body;

    console.log(`[Transaction] New Request: ${productType} | User: ${userId} | Method: ${paymentMethod}`);

    // Basic Validation
    if (!userId || !productId || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const transactionId = `TRX-${uuidv4().split('-')[0].toUpperCase()}`;
    let paymentStatus = 'PENDING';
    let responseData = {};

    switch (productType) {
      // CASE 1: TOP UP (Mobile Legends, PUBG, etc.)
      case 'TOPUP':
        if (!gameUserId) {
          return res.status(400).json({ success: false, message: 'Game ID is required for Top Up' });
        }

        // Simulate Aggregator Call (e.g., Digiflazz, Apigames)
        // const aggregatorResponse = await Aggregator.topUp({ ... });
        console.log(`[Aggregator] Pinging provider for ${productId} to Account ${gameUserId}`);

        // Mock successful initiation
        responseData = {
          service: 'Instant Top Up',
          target: `${gameUserId} ${gameZoneId ? `(${gameZoneId})` : ''}`,
          executionTime: 'Immediate'
        };
        break;

      // CASE 2: GAME KEY (Elden Ring, etc.)
      case 'GAME':
        const availableKeys = GAME_KEY_INVENTORY[productId] || [];

        if (availableKeys.length === 0) {
          return res.status(400).json({ success: false, message: 'Out of Stock' });
        }

        // Reserve Key (In real app: Database Transaction with Lock)
        // const reservedKey = await Inventory.reserve(productId);
        const reservedKey = availableKeys[0]; // Mock reservation

        console.log(`[Inventory] Key reserved: ${reservedKey}`);

        responseData = {
          service: 'Game Key Purchase',
          deliveryMethod: 'Email',
          securityParams: 'Encrypted'
        };
        paymentStatus = 'WAITING_PAYMENT';
        break;

      default:
        return res.status(400).json({ success: false, message: 'Invalid Product Type' });
    }

    // Generate Payment URL (Midtrans/Xendit Mock)
    const paymentUrl = `https://payment-gateway.mock/pay/${transactionId}`;

    return res.status(201).json({
      success: true,
      message: 'Transaction Created',
      data: {
        transactionId,
        status: paymentStatus,
        paymentUrl,
        ...responseData
      }
    });

  } catch (error) {
    console.error("[Transaction Error]:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
