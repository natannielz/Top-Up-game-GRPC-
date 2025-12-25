// Import dependencies
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Wallet, Loader2, Sparkles, ArrowLeft, User, AlertCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Skeleton } from '../components/Skeleton';
import PaymentSection from '../components/PaymentSection';
import { validateUser } from '../services/TransactionController';

// Fallback Mock Data - Ensure unique IDs for proper selection
const defaultDenominations = [
  { id: 'ML_5', label: '5', amount: '5', price: 1500, bonus: '0' },
  { id: 'ML_10', label: '10', amount: '10', price: 2850, bonus: '0' },
  { id: 'ML_100', label: '100', amount: '100', price: 28500, bonus: '10', popular: true },
];

const TopUpPage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    addTransaction,
    generateAvatar // Use the centralized helper
  } = useData();
  const { success, error, info } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [fetchedGame, setFetchedGame] = useState(null);

  // Game Data Strategy: Prioritize Fetched Data (Fresh) > State (Navigation) > null
  const stateGame = location.state?.game;
  const game = fetchedGame || stateGame;

  const isGameSale = game?.type === 'GAME';

  // Form State
  const [userId, setUserId] = useState(location.state?.userId || '');
  const [serverId, setServerId] = useState(location.state?.zoneId || '');
  const [nickname, setNickname] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  // Selection Logic - Use ID for mutual exclusivity
  const [selectedItemId, setSelectedItemId] = useState(location.state?.selectedPrice?.id || null);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [, setTrxId] = useState('');

  useEffect(() => {
    const loadGame = async () => {
      // Always fetch fresh data to ensure custom options are up-to-date
      if (!gameId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3002/api/catalog/game/${gameId}`);
        if (res.data && res.data.success) {
          setFetchedGame(res.data.game);
        } else {
          // Fallback or error handling
          if (!stateGame) error("Failed to load game details");
        }
      } catch (err) {
        console.error("Failed to load game:", err);
        // Only show error if we have NO data at all
        if (!stateGame) error("Failed to load game details");
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, [gameId, stateGame, error]);

  const handleValidateNick = useCallback(async () => {
    if (isGameSale || !userId) return;
    setIsValidating(true);
    setNickname('');

    try {
      const result = await validateUser(userId, serverId);
      setNickname(`✅ ${result.username}`);
      info(`User found: ${result.username}`);
    } catch (err) {
      setNickname("❌ User Not Found");
      error(err.message);
    } finally {
      setIsValidating(false);
    }
  }, [userId, serverId, isGameSale, error, info]);

  // Derive selected denomination object from ID
  const topUpOptions = useMemo(() => {
    const rawOpts = game?.topUpOptions && game.topUpOptions.length > 0 ? game.topUpOptions : defaultDenominations;
    return rawOpts.map((opt, index) => ({
      ...opt,
      id: opt.id || `opt-${index}` // Ensure consistent ID generation
    }));
  }, [game]);

  const selectedDenom = topUpOptions.find(opt => opt.id === selectedItemId) || null;

  const handlePay = async () => {
    // Validation
    if (isGameSale) {
      if (!selectedPayment) {
        error("Please select a payment method.");
        return;
      }
    } else {
      if (!userId || !selectedItemId || !selectedPayment) {
        error("Please fill in all required fields!");
        return;
      }
      if (!selectedDenom) {
        error("Invalid Item Selected");
        return;
      }
      if (nickname.includes('❌')) {
        error("Invalid User ID. Please check again.");
        return;
      }
    }

    setIsProcessing(true);

    // Payload matching backend expectation
    const payload = {
      userId: isGameSale ? 'guest' : userId,
      username: isGameSale ? 'Guest' : (nickname.replace('✅ ', '') || userId), // Fallback if nickname not validated
      game: game.title,
      item: isGameSale ? 'Standard License' : (selectedDenom.label || `${selectedDenom.amount} ${game.currency || 'Credits'}`), // Robust item name
      amount: isGameSale ? Number(game.price) : Number(selectedDenom.price),
      paymentMethod: selectedPayment.name,
      gameType: isGameSale ? 'GAME' : 'TOPUP'
    };

    // Inventory Check
    if (isGameSale) {
      const currentStock = game.stock !== undefined ? game.stock : 999;
      if (currentStock <= 0) {
        error("⚠️ Out of Stock! This game is currently unavailable.");
        setIsProcessing(false);
        return;
      }
    }

    try {
      // REQUIREMENT: Simulate Processing for 2 Seconds
      await new Promise(resolve => setTimeout(resolve, 2000));

      // --- LOCAL TRANSACTION LOGIC (No External API) ---
      const newTrxId = `TRX-${Date.now()}`;
      const safeUsername = isGameSale ? 'Guest' : (nickname.replace('✅ ', '') || userId);
      const avatarUrl = generateAvatar(safeUsername);

      const newTransaction = {
        id: newTrxId,
        userId: userId || 'guest',
        username: safeUsername,
        avatar: avatarUrl, // Client-side generation
        game: game.title,
        gameType: isGameSale ? 'GAME' : 'TOPUP',
        item: payload.item,
        amount: Number(payload.amount),
        status: 'Success',
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        paymentMethod: selectedPayment.name,
        details: isGameSale ? { licenseKey: game.licenseKeys?.[0] || 'XXXX-MOCK-KEY' } : null
      };

      // Save to Local DataContext (Syncs with API)
      await addTransaction(newTransaction);
      setTrxId(newTrxId);

      // --- COUNTER API INTEGRATION ---
      // Fire-and-forget increment
      fetch('https://api.counterapi.dev/v1/gamerzone_official/topup-counter/up')
        .then(res => res.json())
        .then(data => console.log('CounterAPI Increment:', data))
        .catch(err => console.error('CounterAPI Error:', err));

      // Navigate to Success
      navigate('/success', {
        state: {
          trxId: newTrxId,
          game: {
            id: game.id,
            title: game.title,
            image: game.image,
            publisher: game.publisher,
            currency: game.currency
          },
          selectedDenom: isGameSale ? null : selectedDenom,
          amount: payload.amount,
          purchasedKey: isGameSale ? (game.licenseKeys?.[0] || 'XXXX-YYYY-ZZ') : null,
          isGameSale: isGameSale,
          date: new Date().toISOString().split('T')[0]
        }
      });

      success("Transaction Successful!");

    } catch (err) {
      error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };


  if (!isLoading && !game) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-cyber-black flex items-center justify-center text-white">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
            <p className="text-gray-400 mb-6">The game you are looking for does not exist.</p>
            <button onClick={() => navigate('/')} className="px-6 py-2 bg-cyber-cyan text-black font-bold rounded-lg hover:bg-cyan-400">
              Go Home
            </button>
          </div>
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
                      <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-md" translate="no"><ArrowLeft size={20} /></button>
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
              {isLoading ? (
                <Skeleton className="h-64 w-full bg-slate-800 rounded-2xl" />
              ) : (
                <>

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
                                  <div className="absolute right-3 top-3.5 text-gray-500" translate="no">
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
                                  onClick={handleValidateNick}
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
                            {topUpOptions.map((denom, index) => {
                              // Ensure we have a reliable ID. If API doesn't provide one, use index as fallback (less ideal)
                              const itemId = denom.id || `opt-${index}`;
                              const isSelected = selectedItemId === itemId;

                              return (
                                <motion.div
                                  key={itemId}
                                  whileHover={{ y: -5 }}
                                  onClick={() => setSelectedItemId(itemId)}
                                  className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 p-4 min-h-[140px] flex flex-col justify-between
                                        ${isSelected
                                      ? 'bg-cyber-cyan/10 border-cyber-cyan shadow-[0_0_30px_rgba(0,255,255,0.15)] ring-1 ring-cyber-cyan'
                                      : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                                    }
                                     `}
                                >
                                  {isSelected && (
                                    <div className="absolute top-0 right-0 p-2 text-cyber-cyan bg-cyber-cyan/10 rounded-bl-xl" translate="no">
                                      <Check size={16} />
                                    </div>
                                  )}

                                  <div className="flex justify-between items-start">
                                    <div translate="no"><Sparkles size={20} className={isSelected ? 'text-cyber-cyan' : 'text-gray-500'} /></div>
                                    {denom.popular && <span className="text-[10px] font-bold bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-0.5 rounded-full">HOT</span>}
                                  </div>

                                  <div className="mt-2 text-center">
                                    <span className="block text-2xl font-bold font-orbitron text-white">{denom.label || denom.amount}</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-widest">{game.currency || 'DIAMOND'}</span>
                                  </div>

                                  <div className={`mt-3 text-center text-sm font-bold pt-3 border-t ${isSelected ? 'border-cyber-cyan/30 text-cyber-cyan' : 'border-white/10 text-gray-300'}`}>
                                    Rp {(parseInt(denom.price) || 0).toLocaleString()}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* STEP 3: PAYMENT COMPONENTS */}
                  <PaymentSection
                    selectedPayment={selectedPayment}
                    onSelect={setSelectedPayment}
                  />

                </>
              )}
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

                  {/* Stock Indicator for Game Sales */}
                  {isGameSale && game?.stock !== undefined && game.stock < 10 && (
                    <div className="mb-4 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center gap-2" translate="no">
                      <AlertCircle size={16} className="text-orange-400" />
                      <span className="text-orange-400 text-xs font-bold" translate="yes">
                        {game.stock === 0 ? 'OUT OF STOCK' : `Only ${game.stock} left in stock!`}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4 mb-6">
                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Total Item</span>
                        <span className="font-bold text-white text-right">
                          {isGameSale ? 'Standard License' : (selectedDenom ? (selectedDenom.label || `${selectedDenom.amount} ${game.currency || ''}`) : '-')}
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
                    disabled={isProcessing || (!isGameSale && (!userId || !selectedItemId)) || !selectedPayment || (nickname && nickname.includes('❌'))}
                    className="w-full py-4 rounded-xl font-bold text-black text-lg transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: isProcessing ? '#4B5563' : 'linear-gradient(135deg, #00FFFF, #00BFFF)',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2" translate="no">
                      {isProcessing ? <Loader2 className="animate-spin" /> : <Wallet />}
                      <span translate="yes">{isProcessing ? 'Processing Payment...' : 'Pay Now'}</span>
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
