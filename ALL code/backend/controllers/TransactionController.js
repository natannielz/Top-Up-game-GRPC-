import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import axios from 'axios';

// --- CONFIGURATION ---
// In a real production app, use process.env for these!
const DIGIFLAZZ_USERNAME = process.env.DIGIFLAZZ_USERNAME || 'YOUR_USERNAME_HERE';
const DIGIFLAZZ_KEY = process.env.DIGIFLAZZ_KEY || 'YOUR_PRODUCTION_KEY_HERE';
const DIGIFLAZZ_ENDPOINT = 'https://api.digiflazz.com/v1/transaction';

const VIP_RESELLER_APIID = process.env.VIP_RESELLER_APIID || 'YOUR_VIP_APIID_HERE';
const VIP_RESELLER_KEY = process.env.VIP_RESELLER_KEY || 'YOUR_VIP_KEY_HERE';
const VIP_RESELLER_ENDPOINT = 'https://vip-reseller.co.id/api/game-feature';


/**
 * 1. LOGIKA MOCK PAYMENT (Bypass Gateway)
 * Simulates a successful payment response based on the selected method.
 */
const mockPaymentSuccess = (method, amount) => {
  const normalizedMethod = method ? method.toUpperCase() : 'UNKNOWN';

  // Base success structure
  let paymentResponse = {
    status: 'SUCCESS',
    details: {
      amount: amount,
      currency: 'IDR',
      paid_at: new Date().toISOString()
    }
  };

  switch (normalizedMethod) {
    case 'GOPAY':
    case 'DANA':
    case 'OVO':
    case 'SHOPEEPAY':
      paymentResponse.details = {
        ...paymentResponse.details,
        method: normalizedMethod,
        transaction_id: `EWALLET-${uuidv4().split('-')[0].toUpperCase()}`,
        message: `Payment via ${normalizedMethod} successful`
      };
      break;

    case 'BCA':
    case 'MANDIRI':
    case 'BRI':
    case 'BNI':
      paymentResponse.details = {
        ...paymentResponse.details,
        method: normalizedMethod,
        va_number: `8800${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        message: 'Pembayaran Virtual Account Diterima'
      };
      break;

    case 'QRIS':
      paymentResponse.details = {
        ...paymentResponse.details,
        method: 'QRIS',
        issuer: 'Nusantara QR',
        message: 'QR Code Scanned Successfully'
      };
      break;

    default:
      // Default fallback for unknown methods
      paymentResponse.details = {
        ...paymentResponse.details,
        method: normalizedMethod,
        message: 'Payment Simulated Successfully'
      };
      break;
  }

  return paymentResponse;
};

/**
 * 2a. INTEGRASI DIGIFLAZZ (Active if used)
 */
const processDigiflazzTransaction = async (skuCode, customerNo, refId) => {
  try {
    const signString = `${DIGIFLAZZ_USERNAME}${DIGIFLAZZ_KEY}${refId}`;
    const sign = crypto.createHash('md5').update(signString).digest('hex');

    const payload = {
      username: DIGIFLAZZ_USERNAME,
      buyer_sku_code: skuCode,
      customer_no: customerNo,
      ref_id: refId,
      sign: sign,
    };

    console.log(`[Digiflazz] Sending Request:`, JSON.stringify(payload, null, 2));

    const response = await axios.post(DIGIFLAZZ_ENDPOINT, payload);
    return response.data;

  } catch (error) {
    console.error("[Digiflazz] API Error:", error?.response?.data || error.message);
    return {
      data: {
        status: 'FAILED',
        message: 'Provider Error',
        sn: '',
        note: error?.response?.data?.data?.message || error.message
      }
    };
  }
};

/**
 * 2b. INTEGRASI VIP RESELLER (Active)
 * Executes transaction on VIP Reseller API
 */
const processVipResellerTransaction = async (serviceCode, target, refId) => {
  try {
    // 3. BUAT SIGNATURE: md5(api_id + api_key)
    const signString = `${VIP_RESELLER_APIID}${VIP_RESELLER_KEY}`;
    const sign = crypto.createHash('md5').update(signString).digest('hex');

    // 4. SIAPKAN DATA (x-www-form-urlencoded typically for PHP curl defaults, checking docs... 
    // Assuming standard form POST or JSON. Using URLSearchParams for standard POST body if they expect $_POST)
    // Most indo aggregators accept standard FormData or JSON. 
    // The PHP example uses `curl_setopt($ch, CURLOPT_POSTFIELDS, $data);` with an array which sends `multipart/form-data`.
    // Let's use `qs` or `URLSearchParams` to simulate form data safely.

    const params = new URLSearchParams();
    params.append('key', VIP_RESELLER_KEY);
    params.append('sign', sign);
    params.append('type', 'order');
    params.append('service', serviceCode);
    params.append('data_no', target);
    params.append('ref_id', refId); // Assuming updated API supports ref_id

    console.log(`[VIP Reseller] Sending Request for ${serviceCode} to ${target}`);

    const response = await axios.post(VIP_RESELLER_ENDPOINT, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log(`[VIP Reseller] Response:`, response.data);
    return response.data;

  } catch (error) {
    console.error("[VIP Reseller] API Error:", error?.response?.data || error.message);
    return {
      result: false,
      message: error?.response?.data?.message || error.message
    };
  }
};


/**
 * MAIN CONTROLLER
 */
export const createTransaction = async (req, res) => {
  try {
    const { userId, productId, paymentMethod, gameUserId, gameZoneId, productType, amount } = req.body;

    // --- PROVIDER SWITCHER ---
    // Change this to 'DIGIFLAZZ' or 'VIP_RESELLER' to switch logic
    const ACTIVE_PROVIDER = 'VIP_RESELLER';

    console.log(`[Transaction] New Request: ${productType} | User: ${userId} | Method: ${paymentMethod}`);

    // Basic Validation
    if (!userId || !productId || !paymentMethod) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // 1. EXECUTE MOCK PAYMENT
    const mockPayment = mockPaymentSuccess(paymentMethod, amount || 0);

    // 2. PREPARE GAME DELIVERY
    let gameDeliveryResponse = {
      status: 'PENDING',
      message: 'Not Processed',
      sn: null
    };

    const transactionId = `TRX-${uuidv4().split('-')[0].toUpperCase()}`;
    const providerRefId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 3. EXECUTE PROVIDER LOGIC (If Payment Success & Type is TOPUP)
    if (mockPayment.status === 'SUCCESS' && productType === 'TOPUP') {

      if (!gameUserId) {
        return res.status(400).json({ success: false, message: 'Game ID is required for Top Up' });
      }

      // Combine User ID and Zone ID
      const target = gameZoneId ? `${gameUserId}${gameZoneId}` : gameUserId; // VIP usually uses Zone too, format depends on game

      let providerResult = {};

      if (ACTIVE_PROVIDER === 'DIGIFLAZZ') { // --- DIGIFLAZZ FLOW ---

        console.log(`[Provider] Using Digiflazz...`);
        providerResult = await processDigiflazzTransaction(productId, target, providerRefId);
        const providerData = providerResult.data || {};

        gameDeliveryResponse = {
          status: providerData.status || 'PROCESSING',
          message: providerData.message || 'Top up diproses Digiflazz',
          sn: providerData.sn || '',
          provider: 'DIGIFLAZZ'
        };

      } else if (ACTIVE_PROVIDER === 'VIP_RESELLER') { // --- VIP RESELLER FLOW ---

        console.log(`[Provider] Using VIP Reseller...`);
        providerResult = await processVipResellerTransaction(productId, target, providerRefId);

        // Map Response VIP
        // FORCE SUCCESS as requested by user ("make it when i buy its a succes")
        // We ignore the actual result (providerResult.result) for this specific user requirement.

        gameDeliveryResponse = {
          status: 'SUCCESS', // Always SUCCESS
          message: 'Top Up Berhasil (Mocked Priority)',
          sn: 'SN-MOCK-' + Date.now(),
          provider: 'VIP_RESELLER',
          raw_response: providerResult
        };
      }

    } else if (productType === 'GAME') {
      // ... existing game logic ...
      gameDeliveryResponse = {
        status: 'SUCCESS',
        message: 'Kode Voucher dikirim ke Email',
        sn: 'KEY-MOCK-1234-5678'
      };
    }

    // 4. FINAL RESPONSE
    const finalResponse = {
      status: "success",
      transaction_id: transactionId,
      payment_info: {
        method: paymentMethod,
        status: "PAID",
        mock_trx_id: mockPayment.details.transaction_id || "MOCK-ID",
        ...mockPayment.details
      },
      game_delivery: gameDeliveryResponse
    };

    return res.status(201).json(finalResponse);

  } catch (error) {
    console.error("[Transaction Error]:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
