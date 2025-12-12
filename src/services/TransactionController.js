
import { supabase } from '../lib/supabaseClient';

export const processPayment = async (payload) => {
  console.log("Processing Payment Payload:", payload);

  // 1. Map Frontend Payload to Backend Expected Schema
  const backendPayload = {
    userId: 'Guest-Web', // The 'buyer' in database
    gameUserId: payload.userId, // The 'target' game account
    gameZoneId: payload.serverId,
    productId: payload.itemId,
    productType: payload.productType || 'TOPUP',
    paymentMethod: payload.paymentMethod,
    amount: payload.amount
  };

  try {
    // 2. Call the Real Backend API
    const response = await fetch('http://localhost:3001/api/v1/transaction/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Transaction failed on server');
    }

    // 3. Check Provider Delivery Status
    if (data.game_delivery?.status === 'FAILED') {
      throw new Error(data.game_delivery.message || 'Top Up Failed at Provider');
    }

    // 4. Save to Supabase (Record Keeping)
    const { error: sbError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: backendPayload.userId,
          game_user_id: backendPayload.gameUserId,
          game_zone_id: backendPayload.gameZoneId,
          product_id: backendPayload.productId,
          amount: backendPayload.amount,
          payment_method: backendPayload.paymentMethod,
          status: 'success', // Since we passed the checks above
          // provider_sn: data.game_delivery?.sn // Optional: if you add this column later
        }
      ]);

    if (sbError) {
      console.error("Supabase Log Error:", sbError);
      // We don't throw here strictly, because the transaction *did* happen.
      // But we log it.
    } else {
      console.log("Transaction saved to Supabase successfully.");
    }

    // 5. Map Backend Response to Frontend Expectation
    return {
      status: 'success',
      trxId: data.transaction_id,
      message: data.game_delivery?.message || 'Transaction successfully processed.',
      data: data
    };

  } catch (err) {
    console.error("API Error:", err);
    throw new Error(err.message || "Network Error");
  }
};

export const validateUser = async (userId, zoneId) => {
  // Keep Mock Validation for now as Backend doesn't have this yet
  await new Promise(resolve => setTimeout(resolve, 800));

  if (userId.includes("99")) {
    throw new Error("User ID not found");
  }

  return {
    isValid: true,
    username: `ProGamer${userId.slice(-3)}`
  };
};
