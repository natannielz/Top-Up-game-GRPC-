
// Simulated DB Models (in a real app, import from db folder)
const transactions = [];
const gameKeys = [
  { id: 'k1', gameId: 'g-valorant-pc', code: 'VAL-100-XYZ-ABC', status: 'AVAILABLE' },
  { id: 'k2', gameId: 'g-steam-wallet', code: 'STM-50-QWE-RTY', status: 'AVAILABLE' },
  { id: 'k3', gameId: 'g-pubg-mobile', code: 'PBG-UC-123-456', status: 'AVAILABLE' }
];

// Constants
const AGGREGATOR_TIMEOUT = 5000; // 5 seconds timeout
const MAX_RETRIES = 2;

// Mock API Call to Aggregator (Pipeline A) with timeout handling
const callAggregatorAPI = async (userId, zoneId, sku, retryCount = 0) => {
  return new Promise((resolve, reject) => {
    // Simulate random failures for testing (10% chance)
    const willFail = Math.random() < 0.1;

    const timeout = setTimeout(() => {
      reject(new Error('AGGREGATOR_TIMEOUT'));
    }, AGGREGATOR_TIMEOUT);

    setTimeout(() => {
      clearTimeout(timeout);

      if (willFail && retryCount < MAX_RETRIES) {
        reject(new Error('AGGREGATOR_ERROR'));
      } else {
        console.log(`[Aggregator] Sending ${sku} to User ${userId} (${zoneId})...`);
        resolve({ success: true, trxId: 'AGG-' + Date.now() });
      }
    }, 1000 + Math.random() * 2000); // Simulate 1-3s response time
  });
};

// Mock Email Service (Pipeline B)
const sendKeyEmail = async (email, key) => {
  console.log(`[Email] Sending Game Key ${key} to ${email}...`);
  return true;
};

export const processTransaction = async (req, res) => {
  const { type, userId, zoneId, gameId, sku, paymentMethod, email } = req.body;

  console.log(`[Transaction] Processing ${type} request for ${gameId}...`);

  try {
    // 1. PAYMENT GATEWAY STAGE (Mock)
    // In real world: Create Midtrans Token here -> User Pays -> Webhook calls this or next function.
    // We simulate instantaneous 'PAID' status.
    const transactionId = 'TRX-' + Date.now();
    const paymentStatus = 'PAID';

    if (paymentStatus !== 'PAID') {
      throw new Error("Payment Failed");
    }

    let finalStatus = 'PROCESSING';
    let resultData = {};
    let requiresManualProcessing = false;

    // 2. DUAL PIPELINE LOGIC
    if (type === 'AUTO_TOPUP') {
      // --- PIPELINE A: DIRECT TOP UP ---
      console.log('[Pipeline A] Executing Auto Top-Up...');

      let retryCount = 0;
      let aggregatorSuccess = false;

      while (retryCount <= MAX_RETRIES && !aggregatorSuccess) {
        try {
          const aggregatorResponse = await callAggregatorAPI(userId, zoneId, sku, retryCount);

          if (aggregatorResponse.success) {
            aggregatorSuccess = true;
            finalStatus = 'SUCCESS';
            resultData = {
              msg: "Top Up Berhasil",
              aggregatorRef: aggregatorResponse.trxId
            };
          }
        } catch (error) {
          retryCount++;
          console.error(`[Pipeline A] Attempt ${retryCount} failed:`, error.message);

          if (retryCount > MAX_RETRIES) {
            // Fallback to manual processing
            console.log('[Pipeline A] All retries failed. Falling back to manual processing.');
            finalStatus = 'PENDING_MANUAL';
            requiresManualProcessing = true;
            resultData = {
              msg: "Transaksi diproses manual (1x24 jam) karena gangguan server game.",
              errorCode: error.message,
              willBeProcessedBy: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            };
          }
        }
      }

    } else if (type === 'GAME_KEY') {
      // --- PIPELINE B: INVENTORY SYSTEM ---
      console.log('[Pipeline B] Fetching Game Key...');

      const availableKeyIndex = gameKeys.findIndex(k => k.gameId === gameId && k.status === 'AVAILABLE');

      if (availableKeyIndex !== -1) {
        // Lock and Sell
        const keyItem = gameKeys[availableKeyIndex];
        gameKeys[availableKeyIndex].status = 'SOLD';

        try {
          await sendKeyEmail(email, keyItem.code);
          finalStatus = 'SUCCESS';
          resultData = {
            msg: "Kode Voucher Terkirim",
            redeemCode: keyItem.code
          };
        } catch (emailError) {
          // Key sold but email failed - still success but need to display key
          finalStatus = 'SUCCESS';
          resultData = {
            msg: "Kode Voucher Ready (Email gagal terkirim)",
            redeemCode: keyItem.code,
            note: "Simpan kode ini karena email tidak terkirim."
          };
        }
      } else {
        finalStatus = 'PENDING_RESTOCK';
        resultData = {
          msg: "Stok Habis - Dana akan di-refund otomatis dalam 1x24 jam",
          refundEstimate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
      }

    } else {
      throw new Error("Unknown Transaction Type");
    }

    // 3. FINALIZE & RESPONSE
    const record = {
      id: transactionId,
      type,
      gameId,
      paymentMethod,
      total: 100000, // Mock amount
      status: finalStatus,
      requiresManualProcessing,
      createdAt: new Date(),
      details: resultData
    };
    transactions.push(record);

    res.json({
      success: finalStatus === 'SUCCESS',
      transaction: record,
      message: requiresManualProcessing
        ? "Transaksi akan diproses manual dalam 1x24 jam karena gangguan server game."
        : undefined
    });

  } catch (error) {
    console.error('[Transaction Error]', error);

    // Create failed transaction record for audit
    const failedRecord = {
      id: 'TRX-FAILED-' + Date.now(),
      type,
      gameId,
      paymentMethod,
      total: 0,
      status: 'FAILED',
      createdAt: new Date(),
      details: { error: error.message }
    };
    transactions.push(failedRecord);

    res.status(500).json({
      success: false,
      error: error.message,
      userMessage: "Terjadi kesalahan sistem. Silakan coba lagi atau hubungi support.",
      transactionId: failedRecord.id
    });
  }
};

export const getHistory = (req, res) => {
  // Mock history
  res.json(transactions);
};
