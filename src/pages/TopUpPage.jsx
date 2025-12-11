import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Shield, Wallet, CreditCard, QrCode, Smartphone, Loader2, AlertCircle, Sparkles, Copy, ArrowLeft, ChevronDown, ChevronUp, User } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { games } from '../data/games';
import { Skeleton } from '../components/Skeleton';

// Mock Data
const denominations = [
  { id: 1, amount: '5', price: 1500, bonus: '0' },
  { id: 2, amount: '10', price: 2850, bonus: '0' },
  { id: 3, amount: '50', price: 14250, bonus: '5' },
  { id: 4, amount: '100', price: 28500, bonus: '10', popular: true },
  { id: 5, amount: '250', price: 71250, bonus: '25' },
  { id: 6, amount: '500', price: 142500, bonus: '50' },
  { id: 7, amount: '1000', price: 285000, bonus: '120' },
  { id: 8, amount: '2500', price: 712500, bonus: '300' },
];

const paymentCategories = [
  {
    id: 'ewallet',
    title: 'E-Wallet',
    methods: [
      { id: 'gopay', name: 'GoPay', icon: Wallet, fee: '2%' },
      { id: 'dana', name: 'DANA', icon: Smartphone, fee: '2%' },
      { id: 'ovo', name: 'OVO', icon: Wallet, fee: '2%' },
    ]
  },
  {
    id: 'qris',
    title: 'QRIS',
    methods: [
      { id: 'qris_all', name: 'QRIS All Payment', icon: QrCode, fee: '0.7%' },
    ]
  },
  {
    id: 'va',
    title: 'Virtual Account',
    methods: [
      { id: 'bca_va', name: 'BCA Virtual Account', icon: CreditCard, fee: 'Rp 4000' },
      { id: 'bri_va', name: 'BRI Virtual Account', icon: CreditCard, fee: 'Rp 4000' },
    ]
  },
];

const TopUpPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const { addTransaction } = useData();
  const { success, error, info } = useToast();

  const [isLoading, setIsLoading] = useState(true);

  // Game Data
  const game = games.find(g => g.id === gameId);
  const isGameSale = game?.type === 'GAME';

  // Form State
  const [userId, setUserId] = useState('');
  const [serverId, setServerId] = useState('');
  const [nickname, setNickname] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [selectedDenom, setSelectedDenom] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [expandedPaymentCategory, setExpandedPaymentCategory] = useState('ewallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [trxId, setTrxId] = useState('');
  const [purchasedKey, setPurchasedKey] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const validateNick = useCallback(async () => {
    if (isGameSale) return;
    setIsValidating(true);
    // Simulate API Call
    await new Promise(r => setTimeout(r, 1500));

    if (userId.includes("99")) {
      setNickname("❌ User Not Found");
      error("User ID not found!");
    } else {
      setNickname(`✅ ProGamer${userId.slice(-3)}`);
      info("User found: ProGamer" + userId.slice(-3));
    }
    setIsValidating(false);
  }, [userId, isGameSale, error, info]);

  // Removed auto-validation on typing to use the button instead as requested
  // except maybe keeping it for UX but user specifically asked for "Check ID" button.
  // I will keep the function but bind it to the button.

  const handlePay = () => {
    if (isGameSale) {
      if (!selectedPayment) return;
    } else {
      if (!userId || !selectedDenom || !selectedPayment) {
        error("Please fill in all required fields!");
        return;
      }
      if (userId.includes("99")) {
        error("Invalid User ID");
        return;
      }
    }

    setIsProcessing(true);

    setTimeout(() => {
      const mockTrxId = 'TRX-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setTrxId(mockTrxId);

      if (isGameSale) {
        const mockKey = game.licenseKeys ? game.licenseKeys[0] : 'XXXX-YYYY-ZZZZ-AAAA';
        setPurchasedKey(mockKey);
        addTransaction({
          id: mockTrxId,
          userId: 'guest',
          username: 'Guest User',
          game: game.title,
          item: 'Standard Edition',
          amount: game.price,
          status: 'Success',
          date: new Date().toISOString().split('T')[0],
          details: { licenseKey: mockKey }
        });
      } else {
        addTransaction({
          id: mockTrxId,
          userId: userId,
          username: nickname.replace('✅ ', ''),
          game: game.title,
          item: `${selectedDenom.amount} ${game.currency || 'Diamonds'}`,
          amount: selectedDenom.price,
          status: 'Success',
          date: new Date().toISOString().split('T')[0]
        });
      }

      setIsProcessing(false);
      setShowSuccess(true);
      success("Transaction Successful!");
    }, 2000);
  };

  const copyKey = () => {
    navigator.clipboard.writeText(purchasedKey);
    success("License key copied!");
  };

  const togglePaymentCategory = (id) => {
    setExpandedPaymentCategory(prev => prev === id ? null : id);
  }

  if (!game && !isLoading) return <div className="text-white text-center pt-20">Game not found</div>;

  if (showSuccess) {
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
                      <span className="text-white font-bold">{selectedDenom?.amount} Diamonds</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-gray-400">Total Paid</span>
                      <span className="text-cyber-gold font-bold text-lg">Rp {selectedDenom?.price?.toLocaleString()}</span>
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
                <button onClick={() => setShowSuccess(false)} className="flex-1 btn-neon text-sm">Buy Again</button>
              </div>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-cyber-black relative pb-20">

        {/* Cinematic Header */}
        <div className="relative h-[50vh] w-full overflow-hidden">
          {isLoading ? (
            <Skeleton className="absolute inset-0 bg-slate-800" />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-black/20 to-cyber-black z-10" />
              <img
                src={game.image}
                alt={game.title}
                className="absolute inset-0 w-full h-full object-cover object-top opacity-60"
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B0C15_100%)] opacity-80" />

              <div className="absolute bottom-0 left-0 w-full z-20 pb-12 px-4 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-end gap-8">
                  <motion.img
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    src={game.image}
                    className="w-32 h-32 lg:w-48 lg:h-48 rounded-2xl shadow-2xl border-4 border-cyber-dark lg:-mb-12 hidden md:block object-cover"
                  />
                  <div className="mb-4">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 mb-2">
                      <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md"><ArrowLeft size={20} /></button>
                      <span className="text-cyber-cyan font-bold tracking-widest text-sm uppercase badge-neon">{game.publisher}</span>
                    </motion.div>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-4xl lg:text-7xl font-orbitron font-black text-white glow-text"
                    >
                      {game.title}
                    </motion.h1>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-8 lg:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">

            {/* Vertical Connecting Line (Desktop Only) */}
            <div className="hidden lg:block absolute left-[3.25rem] top-8 bottom-0 w-0.5 bg-gradient-to-b from-cyber-cyan via-cyber-purple to-transparent opacity-30 z-0 content-layer"></div>

            {/* Main Content */}
            <div className="lg:col-span-8 space-y-12 relative z-10">

              {/* STEP 1: DATA */}
              <section className="relative group">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-cyber-dark border border-cyber-cyan/30 flex items-center justify-center text-xl font-bold font-orbitron text-cyber-cyan shadow-[0_0_20px_rgba(0,255,255,0.2)] group-hover:scale-110 transition-transform relative z-10">1</div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-orbitron font-bold text-white mb-6">User Data</h3>

                    {isGameSale ? (
                      <div className="glass-card p-6">
                        <p className="text-gray-300">{game.description}</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm text-gray-400 font-bold uppercase ml-1">User ID</label>
                          <div className="flex gap-3">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="w-full bg-cyber-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all outline-none"
                                placeholder="Enter ID"
                              />
                              <div className="absolute right-3 top-3.5 text-gray-500">
                                <User size={18} />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm text-gray-400 font-bold uppercase ml-1">Server ID</label>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={serverId}
                              onChange={(e) => setServerId(e.target.value)}
                              className="w-full bg-cyber-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-cyan focus:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all outline-none"
                              placeholder="Zone ID"
                            />
                            <button
                              onClick={validateNick}
                              disabled={isValidating || !userId}
                              className="bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan px-4 rounded-xl font-bold hover:bg-cyber-cyan hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {isValidating ? <Loader2 size={18} className="animate-spin" /> : 'Check ID'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Nickneame Display */}
                    <div className="mt-4 h-6">
                      {nickname && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${nickname.includes('❌') ? 'text-red-400' : 'text-emerald-400'}`}>
                            {nickname}
                          </span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* STEP 2: NOMINAL */}
              <section className="relative group">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-cyber-dark border border-cyber-purple/30 flex items-center justify-center text-xl font-bold font-orbitron text-cyber-purple shadow-[0_0_20px_rgba(188,19,254,0.2)] group-hover:scale-110 transition-transform relative z-10">2</div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-orbitron font-bold text-white mb-6">Select Nominal</h3>

                    {isGameSale ? (
                      <div className="bg-cyber-cyan/5 border border-cyber-cyan/50 p-6 rounded-2xl flex items-center justify-between">
                        <div>
                          <h4 className="text-xl font-bold text-white">Standard Edition</h4>
                          <p className="text-cyber-cyan">Rp {game.price.toLocaleString()}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-cyber-cyan flex items-center justify-center text-black">
                          <Check size={20} />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {denominations.map((denom) => (
                          <motion.div
                            key={denom.id}
                            whileHover={{ y: -5 }}
                            onClick={() => setSelectedDenom(denom)}
                            className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 p-4 min-h-[140px] flex flex-col justify-between
                                      ${selectedDenom?.id === denom.id
                                ? 'bg-cyber-cyan/10 border-cyber-cyan shadow-[0_0_30px_rgba(0,255,255,0.15)] ring-1 ring-cyber-cyan'
                                : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                              }
                                   `}
                          >
                            {selectedDenom?.id === denom.id && (
                              <div className="absolute top-0 right-0 p-2 text-cyber-cyan bg-cyber-cyan/10 rounded-bl-xl">
                                <Check size={16} />
                              </div>
                            )}

                            <div className="flex justify-between items-start">
                              <Sparkles size={20} className={selectedDenom?.id === denom.id ? 'text-cyber-cyan' : 'text-gray-500'} />
                              {denom.popular && <span className="text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-0.5 rounded-full">HOT</span>}
                            </div>

                            <div className="mt-2 text-center">
                              <span className="block text-2xl font-bold font-orbitron text-white">{denom.amount}</span>
                              <span className="text-xs text-gray-400 uppercase tracking-widest">{game.currency || 'DIAMOND'}</span>
                            </div>

                            <div className={`mt-3 text-center text-sm font-bold pt-3 border-t ${selectedDenom?.id === denom.id ? 'border-cyber-cyan/30 text-cyber-cyan' : 'border-white/10 text-gray-300'}`}>
                              Rp {denom.price.toLocaleString()}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* STEP 3: PAYMENT */}
              <section className="relative group">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-cyber-dark border border-pink-500/30 flex items-center justify-center text-xl font-bold font-orbitron text-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.2)] group-hover:scale-110 transition-transform relative z-10">3</div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-orbitron font-bold text-white mb-6">Payment</h3>

                    <div className="space-y-4">
                      {paymentCategories.map((category) => (
                        <div key={category.id} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5">
                          <button
                            onClick={() => togglePaymentCategory(category.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                          >
                            <span className="font-bold text-white">{category.title}</span>
                            {expandedPaymentCategory === category.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                          </button>

                          <AnimatePresence>
                            {expandedPaymentCategory === category.id && (
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                  {category.methods.map((method) => (
                                    <div
                                      key={method.id}
                                      onClick={() => setSelectedPayment(method)}
                                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                                                     ${selectedPayment?.id === method.id
                                          ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500 ring-1 ring-blue-500'
                                          : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-black/40'
                                        }
                                                  `}
                                    >
                                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                                        <method.icon size={20} className="text-black" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-white leading-tight">{method.name}</div>
                                        <div className="text-[10px] text-gray-400 mt-0.5">Fee: {method.fee}</div>
                                      </div>
                                      {selectedPayment?.id === method.id && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4 relative z-20">
              <div className="sticky top-24">
                <div className="glass-card-premium p-6 relative overflow-hidden">
                  {/* Background Glow */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyber-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyber-purple/10 rounded-full blur-3xl pointer-events-none"></div>

                  <h3 className="font-orbitron font-bold text-xl text-white mb-6 flex items-center gap-2">
                    <Wallet className="text-cyber-cyan" /> Order Summary
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Item</span>
                        <span className="font-bold text-white text-right">
                          {isGameSale ? 'Standard License' : (selectedDenom ? `${selectedDenom.amount} ${game.currency}` : '-')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">ID / Server</span>
                        <span className="font-bold text-white text-right truncate max-w-[150px]">
                          {userId || '-'} {serverId ? `(${serverId})` : ''}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Payment</span>
                        <span className="font-bold text-white text-right truncate max-w-[150px]">
                          {selectedPayment ? selectedPayment.name : '-'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between py-4 border-t border-white/10">
                      <span className="text-gray-400 text-sm">Total Payment</span>
                      <span className="text-2xl font-bold text-cyber-gold font-orbitron">
                        {isGameSale
                          ? `Rp ${game.price.toLocaleString()}`
                          : (selectedDenom ? `Rp ${selectedDenom.price.toLocaleString()}` : '-')
                        }
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handlePay}
                    disabled={isProcessing || (!isGameSale && (!userId || !selectedDenom)) || !selectedPayment || (nickname && nickname.includes('❌'))}
                    className="w-full py-4 rounded-xl font-bold text-black text-lg transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isProcessing ? '#4B5563' : 'linear-gradient(135deg, #00FFFF, #00BFFF)',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isProcessing ? <Loader2 className="animate-spin" /> : <Wallet />}
                      {isProcessing ? 'PROCESSING...' : 'PAY NOW'}
                    </span>
                    {!isProcessing && <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TopUpPage;
