import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const usePayment = (game) => {
  const { user } = useAuth();
  const { success, error, info } = useToast();

  const [formState, setFormState] = useState({
    userId: '',
    zoneId: '',
    nickname: null
  });

  const [selection, setSelection] = useState({
    item: null,
    payment: null
  });

  const [status, setStatus] = useState({
    isLoading: true,
    isValidating: false,
    isProcessing: false,
    isSuccess: false,
    trxId: null
  });

  const [steps, setSteps] = useState({
    1: false, // User Data
    2: false, // Item Selection
    3: false  // Payment
  });

  // Step Validator
  const updateStep = useCallback((step, isComplete) => {
    setSteps(prev => ({ ...prev, [step]: isComplete }));
  }, []);

  // ID Validation Logic
  const validateUser = async () => {
    if (!formState.userId) return;

    setStatus(prev => ({ ...prev, isValidating: true }));
    try {
      await new Promise(r => setTimeout(r, 1000)); // Mock API

      if (formState.userId.includes("99")) throw new Error("User Not Found");

      const mockName = `ProGamer${formState.userId.slice(-3)}`;
      setFormState(prev => ({ ...prev, nickname: mockName }));
      updateStep(1, true);
      info(`Verified: ${mockName}`);
    } catch (err) {
      setFormState(prev => ({ ...prev, nickname: null }));
      updateStep(1, false);
      error(err.message);
    } finally {
      setStatus(prev => ({ ...prev, isValidating: false }));
    }
  };

  // Auto-complete Step 1 for Game Keys (No ID needed)
  const initGameKey = useCallback(() => {
    if (game?.type === 'GAME') {
      updateStep(1, true);
    }
  }, [game, updateStep]);

  // Handle Payment Checkout
  const handleCheckout = async () => {
    // Final Validation
    if (!steps[1] || !steps[2] || !steps[3]) {
      error("Please complete all steps correctly.");
      return;
    }

    setStatus(prev => ({ ...prev, isProcessing: true }));

    try {
      // Determine Payload
      const payload = {
        userId: user?.id || 'guest',
        productType: game.type, // 'TOPUP' or 'GAME'
        productId: game.type === 'GAME' ? game.id : selection.item.id,
        paymentMethod: selection.payment.id,
        gameUserId: game.type === 'TOPUP' ? formState.userId : null,
        gameZoneId: game.type === 'TOPUP' ? formState.zoneId : null
      };

      console.log("Submitting Payload:", payload);

      // Call Backend API
      const response = await fetch('http://localhost:3001/api/v1/transaction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Transaction failed');
      }

      console.log('API Response:', data);

      setStatus(prev => ({
        ...prev,
        isSuccess: true,
        trxId: data.data?.transactionId || 'TRX-UNKNOWN'
      }));
      success("Order Placed Successfully! " + (data.message || ''));

      // If there is a payment URL (e.g. Midtrans), you might open it here
      if (data.data?.paymentUrl) {
        // window.open(data.data.paymentUrl, '_blank');
        console.log("Payment URL:", data.data.paymentUrl);
      }

    } catch (err) {
      console.error(err);
      error("Transaction Failed. Try again.");
    } finally {
      setStatus(prev => ({ ...prev, isProcessing: false }));
    }
  };

  return {
    formState,
    setFormState,
    selection,
    setSelection,
    status,
    setStatus,
    steps,
    updateStep,
    validateUser,
    initGameKey,
    handleCheckout
  };
};
