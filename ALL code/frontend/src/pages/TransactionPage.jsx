import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, User, ArrowLeft, Loader2, Key, ShoppingCart, Info } from 'lucide-react';

import MainLayout from '../layouts/MainLayout';
import { Skeleton } from '../components/Skeleton';
import PaymentSection from '../components/PaymentSection';
import { useData } from '../context/DataContext';
import { usePayment } from '../hooks/usePayment';

// Components
const StepIndicator = ({ number, isActive, isComplete, title, children }) => (
  <div className={`relative pl-12 pb-12 last:pb-0 group ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
    {/* Vertical Line */}
    <div className={`absolute left-[1.35rem] top-12 bottom-0 w-0.5 transition-colors duration-500
      ${isComplete ? 'bg-cyber-cyan shadow-[0_0_10px_#00ffff]' : 'bg-white/10'}`}></div>

    {/* Circle Indicator */}
    <div className={`absolute left-0 top-0 w-11 h-11 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all duration-300 z-10
      ${isComplete ? 'bg-cyber-cyan border-cyber-cyan text-black scale-110 shadow-[0_0_20px_#00ffff]'
        : isActive ? 'bg-cyber-black border-cyber-cyan text-cyber-cyan scale-110 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
          : 'bg-cyber-black border-white/20 text-gray-500'}`}>
      {isComplete ? <Check size={20} /> : number}
    </div>

    {/* Content */}
    <div className="transition-all duration-300">
      <h3 className={`text-xl font-orbitron font-bold mb-6 flex items-center gap-3 ${isActive ? 'text-white' : 'text-gray-400'}`}>
        {title}
        {isComplete && <span className="text-xs font-sans bg-cyber-cyan/10 text-cyber-cyan px-2 py-0.5 rounded border border-cyber-cyan/30">COMPLETED</span>}
      </h3>
      <div className={`transition-all duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-80'}`}>
        {children}
      </div>
    </div>
  </div>
);

const TransactionPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { games } = useData();

  // Find game from dynamic data (handle type mismatch if IDs are numbers vs strings)
  const game = games.find(g => g._id === gameId || g.id === gameId);
  const isTopUp = game?.gameType === 'TOPUP' || game?.type === 'TOPUP';

  // Use Custom Hook
  const {
    formState, setFormState,
    selection, setSelection,
    status, setStatus,
    steps, updateStep,
    validateUser, initGameKey, handleCheckout
  } = usePayment(game);

  // Initialize
  useEffect(() => {
    if (game) {
      initGameKey();
      setTimeout(() => setStatus(prev => ({ ...prev, isLoading: false })), 600);
    }
  }, [game, initGameKey, setStatus]);

  // Dynamic Denominations from DB
  const denominations = game?.topUpOptions?.length > 0 ? game.topUpOptions : [
    // Fallback if no options defined but type is TopUp
    { id: 1, value: '100_diam', label: '100 Diamonds', price: 10000 },
    { id: 2, value: '500_diam', label: '500 Diamonds', price: 50000 },
  ];

  if (!game) return <div className="text-white pt-20 text-center">Game Not Found</div>;

  // Render Success Screen
  if (status.isSuccess) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="glass-card-premium p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-orbitron font-bold text-white mb-2">Order Successful!</h2>
            <p className="text-gray-400 mb-6">Trx ID: <span className="text-cyber-cyan font-mono">{status.trxId}</span></p>
            <button onClick={() => navigate('/dashboard')} className="btn-neon w-full">Go to Dashboard</button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-cyber-black pb-20 overflow-x-hidden">

        {/* Cinematic Hero */}
        <div className="relative h-[40vh] lg:h-[50vh]">
          {status.isLoading ? (
            <Skeleton className="w-full h-full bg-slate-900" />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-black/40 to-cyber-black z-10" />
              <img src={game.image} alt={game.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="absolute bottom-0 left-0 w-full z-20 pb-12 container mx-auto px-4">
                <div className="flex items-end gap-6">
                  <motion.img
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    src={game.image} className="w-40 h-40 rounded-2xl border-4 border-cyber-dark shadow-2xl hidden md:block object-cover"
                  />
                  <div>
                    <button onClick={() => navigate('/games')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
                      <ArrowLeft size={16} /> Back to Games
                    </button>
                    <h1 className="text-4xl md:text-6xl font-black font-orbitron text-white glitch-text mb-2">
                      {game.title}
                    </h1>
                    <div className="flex items-center gap-3">
                      <span className="badge-neon">{game.publisher}</span>
                      <span className="text-cyber-cyan font-bold tracking-widest text-sm uppercase">{game.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-12">

          {/* Left Column: Vertical Stepper */}
          <div className="flex-1">

            {/* STEP 1: ACCOUNT DATA */}
            <StepIndicator
              number="1"
              title={isTopUp ? "Account Data" : "Authentication"}
              isActive={true}
              isComplete={steps[1]}
            >
              {isTopUp ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl bg-white/5 p-6 rounded-2xl border border-white/5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">User ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formState.userId}
                        onChange={(e) => {
                          setFormState(p => ({ ...p, userId: e.target.value }));
                          updateStep(1, false); // Reset completion on edit
                          setFormState(p => ({ ...p, nickname: null }));
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-cyan outline-none font-mono transition-all"
                        placeholder="12345678"
                      />
                      <User size={18} className="absolute right-3 top-3.5 text-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Zone ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formState.zoneId}
                        onChange={(e) => setFormState(p => ({ ...p, zoneId: e.target.value }))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-cyan outline-none font-mono"
                        placeholder="(1234)"
                      />
                      <button
                        onClick={validateUser}
                        disabled={!formState.userId || status.isValidating}
                        className="bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan px-4 rounded-xl font-bold hover:bg-cyber-cyan hover:text-black transition-all disabled:opacity-50"
                      >
                        {status.isValidating ? <Loader2 className="animate-spin" /> : 'Check'}
                      </button>
                    </div>
                  </div>
                  {/* Nickname Result */}
                  {formState.nickname && (
                    <div className="col-span-full mt-2 flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                      <Check size={16} className="text-emerald-500" />
                      <span className="text-emerald-400 font-bold">{formState.nickname}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-cyber-cyan/5 border border-cyber-cyan/20 p-6 rounded-2xl flex items-start gap-4">
                  <div className="p-3 bg-cyber-cyan/10 rounded-lg text-cyber-cyan">
                    <Key size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Instant Delivery</h4>
                    <p className="text-sm text-gray-400">License key will be sent instantly to your account email after payment.</p>
                  </div>
                </div>
              )}
            </StepIndicator>

            {/* STEP 2: PRODUCT SELECTION */}
            <StepIndicator
              number="2"
              title={isTopUp ? "Select Nominal" : "Product Details"}
              isActive={steps[1] || !isTopUp}
              isComplete={steps[2]}
            >
              {isTopUp ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {denominations.map(denom => (
                    <button
                      key={denom.id}
                      onClick={() => {
                        setSelection(prev => ({ ...prev, item: denom }));
                        updateStep(2, true);
                      }}
                      className={`relative p-4 rounded-xl border text-left transition-all duration-300 hover:-translate-y-1
                                        ${selection.item?.value === denom.value
                          ? 'bg-gradient-to-br from-cyber-cyan/20 to-blue-600/20 border-cyber-cyan shadow-[0_0_15px_rgba(0,255,255,0.2)]'
                          : 'bg-white/5 border-white/5 hover:border-white/20'
                        }`}
                    >
                      <div className="text-xl font-bold font-orbitron text-white mb-1">{denom.label || denom.amount}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{denom.value || game.currency}</div>
                      <div className={`text-sm font-bold ${selection.item?.value === denom.value ? 'text-cyber-cyan' : 'text-gray-300'}`}>
                        Rp {denom.price.toLocaleString()}
                      </div>
                      {selection.item?.value === denom.value && <Check size={16} className="absolute top-3 right-3 text-cyber-cyan" />}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setSelection(prev => ({ ...prev, item: game }));
                    updateStep(2, true);
                  }}
                  className={`w-full max-w-md p-6 rounded-xl border text-left flex items-center justify-between transition-all
                                ${selection.item?.id === game.id
                      ? 'bg-cyber-cyan/10 border-cyber-cyan ring-1 ring-cyber-cyan'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                >
                  <div>
                    <h4 className="text-lg font-bold text-white">Standard Edition Key</h4>
                    <p className="text-gray-400 text-sm">Valid for PC (Steam)</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-cyber-cyan">Rp {game.price.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 line-through">Rp {(game.price * 1.2).toLocaleString()}</div>
                  </div>
                </button>
              )}
            </StepIndicator>

            {/* STEP 3: PAYMENT METHOD */}
            <StepIndicator
              number="3"
              title="Payment Method"
              isActive={steps[2]}
              isComplete={steps[3]}
            >
              <PaymentSection
                selectedPayment={selection.payment}
                onSelect={(method) => {
                  setSelection(prev => ({ ...prev, payment: method }));
                  updateStep(3, true);
                }}
              />
            </StepIndicator>

          </div>

          {/* Right Column: Sticky Summary */}
          <div className="w-full lg:w-96 relative z-10">
            <div className="sticky top-24">
              <div className="glass-card-premium p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-cyan/5 to-purple-500/5 transition-opacity opacity-50"></div>

                <h3 className="text-xl font-orbitron font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                  <ShoppingCart className="text-cyber-cyan" /> Summary
                </h3>

                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Product</span>
                    <span className="text-white font-bold max-w-[150px] truncate">{game.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Item</span>
                    <span className="text-white font-bold">
                      {selection.item ? (isTopUp ? (selection.item.label || selection.item.amount) : 'Standard Key') : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Account</span>
                    <span className="text-white font-bold max-w-[150px] truncate">
                      {isTopUp ? (formState.nickname || formState.userId || '-') : 'My Account'}
                    </span>
                  </div>
                  <div className="w-full h-px bg-white/10 my-4"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-gray-400">Total</span>
                    <span className="text-2xl font-black font-orbitron text-cyber-gold">
                      Rp {(selection.item?.price || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={status.isProcessing || !steps[1] || !steps[2] || !steps[3]}
                  className="w-full mt-6 py-4 rounded-xl font-bold text-black text-lg transition-all duration-300 relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed
                                bg-gradient-to-r from-cyber-cyan via-blue-400 to-purple-500 hover:shadow-[0_0_20px_rgba(0,255,255,0.4)]"
                >
                  {status.isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" /> Processing...
                    </div>
                  ) : 'Purchase Now'}
                </button>

                {/* Validation Hint */}
                {(!steps[1] || !steps[2] || !steps[3]) && (
                  <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500 justify-center">
                    <Info size={12} />
                    <span>Complete all steps to proceed</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default TransactionPage;
