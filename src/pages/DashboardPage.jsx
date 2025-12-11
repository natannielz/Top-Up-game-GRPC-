import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Skeleton } from '../components/Skeleton';
import { Copy, Check, User, Mail, Shield, Save, X, LogOut, Trash2, Trophy, Crown, Zap, FileText, Repeat, Download } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout, updateProfile, deleteAccount } = useAuth();
  const { transactions } = useData();
  const { success, info } = useToast();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    navigate('/login');
    return null;
  }

  const startEdit = () => {
    setEditForm({ name: user.name, email: user.email });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
    success("Profile updated successfully!");
  };

  const handleDelete = () => {
    deleteAccount();
    navigate('/');
    info("Account deleted successfully.");
  };

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    success("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Rank Logic (Mock)
  const currentPoints = user.points || 0;
  const nextRankThreshold = 5000;
  const progressPercent = Math.min((currentPoints / nextRankThreshold) * 100, 100);
  const rankParams = {
    'Bronze': { color: 'text-orange-700', border: 'border-orange-700/50', bg: 'bg-orange-700/20' },
    'Silver': { color: 'text-gray-300', border: 'border-gray-300/50', bg: 'bg-gray-300/20' },
    'Gold': { color: 'text-yellow-400', border: 'border-yellow-400/50', bg: 'bg-yellow-400/20' },
    'Diamond': { color: 'text-cyan-400', border: 'border-cyan-400/50', bg: 'bg-cyan-400/20' }
  };
  const userRankStyle = rankParams[user.rank] || rankParams['Bronze'];

  return (
    <MainLayout>
      <div className="relative min-h-screen pb-20">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-cyber-blue/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-[400px] bg-cyber-purple/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* --- LEFT COLUMN: PROFILE STATS (4 cols) --- */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card p-8 border border-white/10 relative overflow-hidden group">
                {/* Avatar Frame Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent opacity-50" />

                {isLoading ? (
                  <div className="flex flex-col items-center gap-4">
                    <Skeleton className="w-32 h-32 rounded-full" />
                    <Skeleton className="w-3/4 h-8" />
                    <Skeleton className="w-1/2 h-4" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className={`absolute inset-0 rounded-full blur-md opacity-40 animate-pulse ${userRankStyle.bg}`} />
                      <div className={`relative p-1 rounded-full border-2 ${userRankStyle.border}`}>
                        <img src={user.avatar} alt="Profile" className="w-32 h-32 rounded-full object-cover border-2 border-black" />
                      </div>
                      <div className="absolute -bottom-2 -right-2 bg-cyber-black text-cyber-gold p-2 rounded-full border border-cyber-gold/50 shadow-lg">
                        <Crown size={16} fill="currentColor" />
                      </div>
                    </div>

                    {!isEditing ? (
                      <>
                        <h2 className="text-2xl font-bold font-orbitron text-white mb-2 tracking-wide">{user.name}</h2>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${userRankStyle.bg} ${userRankStyle.color} border ${userRankStyle.border}`}>
                          <Shield size={12} fill="currentColor" /> {user.rank} Agent
                        </div>

                        {/* Rank Progress */}
                        <div className="w-full mb-8">
                          <div className="flex justify-between text-xs font-bold text-gray-400 mb-2 uppercase">
                            <span>Current XP</span>
                            <span>Next Rank</span>
                          </div>
                          <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-gradient-to-r from-cyber-blue to-cyber-cyan shadow-[0_0_10px_rgba(0,255,255,0.5)] transition-all duration-1000 ease-out"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-mono">
                            <span>{currentPoints} pts</span>
                            <span>{nextRankThreshold} pts</span>
                          </div>
                        </div>

                        <button onClick={startEdit} className="w-full btn-ghost text-sm py-2">
                          Edit Profile
                        </button>
                      </>
                    ) : (
                      <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-cyber-cyan ml-1">CODENAME</label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="input-futuristic w-full py-2"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-cyber-cyan ml-1">COMM LINK</label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="input-futuristic w-full py-2"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleSave} className="flex-1 btn-neon text-xs py-2">
                            <Save size={14} className="mr-1" /> SAVE
                          </button>
                          <button onClick={() => setIsEditing(false)} className="flex-1 btn-ghost text-xs py-2">
                            CANCEL
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Account Actions */}
              <div className="glass-card p-4 border border-white/10 space-y-3">
                <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors text-sm font-bold">
                  <LogOut size={16} /> Disconnect System
                </button>
                <button onClick={() => setShowDeleteModal(true)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors text-sm font-bold">
                  <Trash2 size={16} /> Self Destruct Protocol
                </button>
              </div>
            </div>

            {/* --- RIGHT COLUMN: TRANSACTION LOGS (8 cols) --- */}
            <div className="lg:col-span-8">
              <div className="glass-card min-h-full flex flex-col border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyber-green/10 rounded-lg text-cyber-green">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-orbitron font-bold text-white text-lg">MISSION LOGS</h3>
                      <p className="text-xs text-gray-500 font-mono">Recent Transactions</p>
                    </div>
                  </div>
                  {!isLoading && (
                    <div className="text-right">
                      <span className="text-2xl font-bold font-orbitron text-white">{transactions.length}</span>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Ops</p>
                    </div>
                  )}
                </div>

                <div className="flex-1 p-0">
                  {isLoading ? (
                    <div className="p-6 space-y-4">
                      {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
                    </div>
                  ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                      <Zap size={48} className="mb-4 opacity-20" />
                      <p>No operational data found.</p>
                      <button onClick={() => navigate('/games')} className="mt-4 text-cyber-cyan font-bold hover:underline">
                        INITIATE FIRST MISSION
                      </button>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {transactions.map(trx => (
                        <div key={trx.id} className="p-6 hover:bg-white/5 transition-colors group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                          {/* Icon/Status */}
                          <div className={`p-3 rounded-xl flex-shrink-0 ${trx.status === 'Success' ? 'bg-cyber-green/10 text-cyber-green' :
                              trx.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-red-500/10 text-red-500'
                            }`}>
                            {trx.status === 'Success' ? <Check size={20} /> : <FileText size={20} />}
                          </div>

                          {/* Details */}
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-white text-base truncate">{trx.game}</h4>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${trx.status === 'Success' ? 'border-cyber-green/30 text-cyber-green' :
                                  trx.status === 'Pending' ? 'border-amber-500/30 text-amber-500' : 'border-red-500/30 text-red-500'
                                }`}>
                                {trx.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">{trx.item}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] text-gray-600 bg-black/30 px-2 py-1 rounded font-mono">ID: {trx.id}</span>
                              <button onClick={() => copyToClipboard(trx.id)} className="text-gray-500 hover:text-white transition-colors">
                                <Copy size={12} />
                              </button>
                              {trx.status === 'Success' && (
                                <button className="flex items-center gap-1 text-[10px] font-bold text-cyber-cyan hover:text-white transition-colors ml-2">
                                  <Download size={10} /> INVOICE
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Price & Action */}
                          <div className="text-right flex-shrink-0 self-start sm:self-center">
                            <div className="text-lg font-bold font-orbitron text-white mb-2">
                              Rp {trx.amount.toLocaleString('id-ID')}
                            </div>
                            <button className="flex items-center gap-1 text-xs font-bold text-gray-500 hover:text-cyber-cyan transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/5 hover:border-cyber-cyan/30">
                              <Repeat size={12} /> RE-ORDER
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-cyber-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-cyber-dark border border-red-500/50 rounded-2xl p-8 max-w-md w-full text-center relative shadow-[0_0_50px_rgba(255,0,0,0.2)]">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 shadow-glow-red">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-bold font-orbitron text-white mb-2">INITIATE SELF DESTRUCT?</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Warning: This action is irreversible. All mission data, rank progress, and G-Points will be permanently erased.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors border border-white/10">ABORT</button>
                <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30">CONFIRM WIPE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
