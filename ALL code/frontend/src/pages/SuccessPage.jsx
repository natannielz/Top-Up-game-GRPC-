import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Copy, Wallet, ArrowLeft } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useToast } from '../context/ToastContext';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { success: showToast } = useToast();
  const { trxId, game, selectedDenom, selectedPayment, purchasedKey, isGameSale, amount } = location.state || {};

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!location.state) {
      navigate('/games'); // Redirect if no state
      return;
    }
    setMounted(true);
    // Optional: Show toast again if needed, or rely on page content
  }, [location.state, navigate]);

  const copyKey = () => {
    navigator.clipboard.writeText(purchasedKey);
    showToast("License key copied!");
  };

  if (!mounted) return null;

  return (
    <MainLayout>
      <div className="min-h-screen py-20 px-4 flex items-center justify-center relative overflow-hidden">
        {/* Background Particles */}
        <div className="absolute inset-0 bg-cyber-black">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-cyan/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="glass-card-premium p-1 relative z-10 max-w-md w-full mx-auto"
        >
          <div className="bg-cyber-dark/90 rounded-2xl p-8 backdrop-blur-xl border border-white/5">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center border-4 border-cyber-dark shadow-2xl">
                <Check size={48} className="text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-orbitron font-bold text-white mb-2 text-center gradient-text">Payment Successful!</h2>
            <p className="text-gray-400 mb-8 text-center">Your transaction has been processed.</p>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-gray-400">Transaction ID</span>
                <span className="text-cyber-cyan font-mono text-sm">{trxId}</span>
              </div>

              {!isGameSale ? (
                <>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Item</span>
                    <span className="text-white font-bold">{selectedDenom?.amount} {game?.currency || 'Diamonds'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-gray-400">Total Paid</span>
                    <span className="text-cyber-gold font-bold text-lg">Rp {amount?.toLocaleString()}</span>
                  </div>
                </>
              ) : (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-2">License Key</p>
                  <div className="flex items-center gap-2">
                    <code className="text-cyber-cyan font-mono text-lg flex-1 truncate">{purchasedKey}</code>
                    <button onClick={copyKey} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Copy size={16} className="text-gray-400" /></button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => navigate('/dashboard')} className="flex-1 btn-ghost text-sm">History</button>
              <button onClick={() => navigate('/games')} className="flex-1 btn-neon text-sm">Buy Again</button>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default SuccessPage;
