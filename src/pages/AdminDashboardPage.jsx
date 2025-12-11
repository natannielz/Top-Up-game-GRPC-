import { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import {
  Users, LogOut, LayoutDashboard, ShoppingBag,
  CreditCard, FileText, Plus, Search, Trash2,
  Check, X, Shield, Eye, ArrowUpDown, ChevronRight, ChevronLeft, Menu, Settings, Key, Mail, User, Save, MessageSquare, Send, RefreshCw, Download
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { user, logout, users, updateUserStatus, deleteUser, updateUserProfile } = useAuth();
  const {
    games, addGame, deleteGame,
    news, addNews, deleteNews,
    transactions, updateTransactionStatus, getStats
  } = useData();

  const { sessions, sendMessage, adminStatus, setAdminStatus, markAsRead } = useChat();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [quickViewItem, setQuickViewItem] = useState(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Chat State
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  // Settings State
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    newPassword: '',
    confirmPassword: ''
  });
  const [settingsMsg, setSettingsMsg] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPage, setUsersPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Form states (inline instead of modal)
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newGameForm, setNewGameForm] = useState({ title: '', category: '', publisher: '', image: '', type: 'TOPUP' });
  const [newNewsForm, setNewNewsForm] = useState({ title: '', summary: '', body: '', category: 'Update', image: '' });

  const stats = getStats();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChatUser, sessions]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredTransactions = useMemo(() => {
    let data = [...transactions];
    if (debouncedSearchQuery) {
      data = data.filter(t =>
        t.username.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        t.game.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [transactions, debouncedSearchQuery, sortConfig]);

  const filteredUsers = useMemo(() => {
    let data = [...users];
    if (debouncedSearchQuery) {
      data = data.filter(u =>
        u.username.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }
    return data;
  }, [users, debouncedSearchQuery]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const paginatedUsers = useMemo(() => {
    const start = (usersPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, usersPage]);

  const totalTransactionPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
  const totalUserPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const exportToCSV = (data, filename) => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setSettingsMsg("Passwords do not match!");
      return;
    }
    const updates = { email: profileForm.email };
    if (profileForm.newPassword) updates.password = profileForm.newPassword;
    updateUserProfile(user.id, updates);
    setSettingsMsg("Settings saved successfully!");
    setProfileForm(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedChatUser) return;
    sendMessage(user.id, chatInput, true, selectedChatUser);
    setChatInput('');
  };

  const handleAddGame = (e) => {
    e.preventDefault();
    addGame({ ...newGameForm });
    setIsAddingGame(false);
    setNewGameForm({ title: '', category: '', publisher: '', image: '', type: 'TOPUP' });
  };

  const handleAddNews = (e) => {
    e.preventDefault();
    addNews({ ...newNewsForm });
    setIsAddingNews(false);
    setNewNewsForm({ title: '', summary: '', body: '', category: 'Update', image: '' });
  };

  // --- RENDER SECTIONS ---

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CreditCard className="text-emerald-400" size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold">Total Income</div>
              <div className="text-xl font-bold text-white">Rp {stats.totalIncome.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <ShoppingBag className="text-blue-400" size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold">Total Orders</div>
              <div className="text-xl font-bold text-white">{stats.totalTransactions}</div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Users className="text-amber-400" size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold">Active Users</div>
              <div className="text-xl font-bold text-white">{users.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <div className="p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Game</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 5).map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-xs text-cyan-400">{t.id}</td>
                  <td>{t.username}</td>
                  <td className="text-gray-400">{t.game}</td>
                  <td><span className={`status-badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="admin-card">
      <div className="p-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">Transactions</h3>
          <button onClick={() => exportToCSV(filteredTransactions, 'transactions')} className="btn-secondary text-xs">
            <Download size={14} /> Export
          </button>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="admin-input pl-9 w-64"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="cursor-pointer hover:text-cyan-400">ID <ArrowUpDown size={12} className="inline" /></th>
              <th onClick={() => handleSort('username')} className="cursor-pointer hover:text-cyan-400">User <ArrowUpDown size={12} className="inline" /></th>
              <th onClick={() => handleSort('amount')} className="cursor-pointer hover:text-cyan-400">Amount <ArrowUpDown size={12} className="inline" /></th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map(t => (
              <tr key={t.id}>
                <td className="font-mono text-xs text-cyan-400">{t.id}</td>
                <td>{t.username}</td>
                <td className="font-semibold">Rp {t.amount.toLocaleString()}</td>
                <td><span className={`status-badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn-icon" onClick={() => setQuickViewItem(t)} title="View"><Eye size={14} /></button>
                    {t.status === 'Pending' && (
                      <>
                        <button className="btn-icon text-emerald-400" onClick={() => updateTransactionStatus(t.id, 'Success')}><Check size={14} /></button>
                        <button className="btn-icon text-red-400" onClick={() => updateTransactionStatus(t.id, 'Failed')}><X size={14} /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalTransactionPages > 1 && (
        <div className="p-4 border-t border-white/10 flex justify-between items-center text-sm">
          <span className="text-gray-400">Page {currentPage} of {totalTransactionPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary disabled:opacity-30"><ChevronLeft size={16} /></button>
            <button onClick={() => setCurrentPage(p => Math.min(totalTransactionPages, p + 1))} disabled={currentPage === totalTransactionPages} className="btn-secondary disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className="admin-card">
      <div className="p-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4">
        <h3 className="font-semibold text-white">User Management</h3>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search users..."
            className="admin-input pl-9 w-64"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setUsersPage(1); }}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr><th>User</th><th>Role</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {paginatedUsers.map(u => (
              <tr key={u.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                    <div>
                      <div className="font-medium text-white">{u.username}</div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="text-gray-400">{u.role}</td>
                <td><span className={`status-badge status-${(u.status || 'active').toLowerCase()}`}>{u.status || 'Active'}</span></td>
                <td>
                  <div className="flex gap-1">
                    {u.status === 'Pending' && <button className="btn-icon text-emerald-400" onClick={() => updateUserStatus(u.id, 'Active')}><Check size={14} /></button>}
                    {u.status !== 'Banned' && u.role !== 'ADMIN' && <button className="btn-icon text-red-400" onClick={() => updateUserStatus(u.id, 'Banned')}><X size={14} /></button>}
                    {u.status === 'Banned' && <button className="btn-icon text-amber-400" onClick={() => updateUserStatus(u.id, 'Active')}><Shield size={14} /></button>}
                    {u.role !== 'ADMIN' && <button className="btn-icon text-gray-400" onClick={() => deleteUser(u.id)}><Trash2 size={14} /></button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalUserPages > 1 && (
        <div className="p-4 border-t border-white/10 flex justify-between items-center text-sm">
          <span className="text-gray-400">Page {usersPage} of {totalUserPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setUsersPage(p => Math.max(1, p - 1))} disabled={usersPage === 1} className="btn-secondary disabled:opacity-30"><ChevronLeft size={16} /></button>
            <button onClick={() => setUsersPage(p => Math.min(totalUserPages, p + 1))} disabled={usersPage === totalUserPages} className="btn-secondary disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );

  const renderChat = () => (
    <div className="admin-card flex h-[600px] overflow-hidden">
      {/* Chat List */}
      <div className="w-1/3 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="font-semibold text-white text-sm">Messages</h3>
          <button
            className={`w-3 h-3 rounded-full ${adminStatus === 'Online' ? 'bg-emerald-400' : 'bg-red-400'}`}
            onClick={() => setAdminStatus(adminStatus === 'Online' ? 'Offline' : 'Online')}
            title={`Status: ${adminStatus}`}
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {Object.entries(sessions)
            .sort(([, a], [, b]) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(([uid, session]) => {
              const chatUser = users.find(u => u.id.toString() === uid);
              const isSelected = selectedChatUser === uid;
              return (
                <div
                  key={uid}
                  className={`p-3 cursor-pointer border-b border-white/5 ${isSelected ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400' : 'hover:bg-white/5'}`}
                  onClick={() => { setSelectedChatUser(uid); markAsRead(uid); }}
                >
                  <div className="flex items-center gap-3">
                    <img src={chatUser?.avatar || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <span className={`font-medium text-sm ${isSelected ? 'text-cyan-400' : 'text-white'}`}>{chatUser?.username || `User ${uid}`}</span>
                        {session.unread > 0 && <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">{session.unread}</span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{session.messages[session.messages.length - 1]?.text || 'No messages'}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-900/50">
        {selectedChatUser ? (
          <>
            <div className="p-4 border-b border-white/10 flex items-center gap-3">
              <div className="w-2 h-8 bg-cyan-400 rounded-full" />
              <div>
                <h3 className="font-semibold text-white">{users.find(u => u.id.toString() === selectedChatUser)?.username || 'Unknown'}</h3>
                <span className="text-xs text-gray-400">Active conversation</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {sessions[selectedChatUser]?.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg text-sm ${msg.sender === 'ADMIN' ? 'bg-cyan-500/20 text-cyan-100' :
                      msg.sender === 'BOT' ? 'bg-purple-500/20 text-purple-100' :
                        'bg-white/10 text-gray-200'
                    }`}>
                    {msg.sender === 'BOT' && <div className="text-xs text-purple-400 mb-1 flex items-center gap-1"><Shield size={10} /> Bot</div>}
                    <p>{msg.text}</p>
                    <span className="text-xs opacity-50 mt-1 block">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <form className="p-4 border-t border-white/10 flex gap-2" onSubmit={handleSendChat}>
              <input
                type="text"
                placeholder="Type a message..."
                className="admin-input flex-1"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button type="submit" className="btn-primary"><Send size={16} /></button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare size={48} className="mb-4 opacity-30" />
            <p>Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="admin-card">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-semibold text-white">Products / Games</h3>
        <button className="btn-primary text-sm" onClick={() => setIsAddingGame(!isAddingGame)}>
          {isAddingGame ? <X size={16} /> : <Plus size={16} />}
          {isAddingGame ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {/* Inline Form */}
      {isAddingGame && (
        <form onSubmit={handleAddGame} className="p-4 bg-white/5 border-b border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" required placeholder="Title" className="admin-input" value={newGameForm.title} onChange={e => setNewGameForm({ ...newGameForm, title: e.target.value })} />
          <select className="admin-input" value={newGameForm.category} onChange={e => setNewGameForm({ ...newGameForm, category: e.target.value })}>
            <option value="">Category</option>
            <option value="MOBA">MOBA</option>
            <option value="FPS">FPS</option>
            <option value="RPG">RPG</option>
          </select>
          <input type="text" placeholder="Image URL" className="admin-input" value={newGameForm.image} onChange={e => setNewGameForm({ ...newGameForm, image: e.target.value })} />
          <button type="submit" className="btn-primary">Add</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Title</th><th>Type</th><th>Category</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game.id}>
                <td><img src={game.image} alt={game.title} className="w-10 h-10 object-cover rounded" /></td>
                <td className="font-medium text-white">{game.title}</td>
                <td><span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">{game.type || 'TOPUP'}</span></td>
                <td className="text-gray-400">{game.category}</td>
                <td><button className="btn-icon text-red-400" onClick={() => deleteGame(game.id)}><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNews = () => (
    <div className="admin-card">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <h3 className="font-semibold text-white">News / Announcements</h3>
        <button className="btn-primary text-sm" onClick={() => setIsAddingNews(!isAddingNews)}>
          {isAddingNews ? <X size={16} /> : <Plus size={16} />}
          {isAddingNews ? 'Cancel' : 'Add Article'}
        </button>
      </div>

      {isAddingNews && (
        <form onSubmit={handleAddNews} className="p-4 bg-white/5 border-b border-white/10 space-y-3">
          <input type="text" required placeholder="Headline" className="admin-input w-full" value={newNewsForm.title} onChange={e => setNewNewsForm({ ...newNewsForm, title: e.target.value })} />
          <textarea placeholder="Content" rows={3} className="admin-input w-full" value={newNewsForm.body} onChange={e => setNewNewsForm({ ...newNewsForm, body: e.target.value, summary: e.target.value.substring(0, 100) })} />
          <div className="flex gap-4">
            <select className="admin-input" value={newNewsForm.category} onChange={e => setNewNewsForm({ ...newNewsForm, category: e.target.value })}>
              <option value="Update">Update</option>
              <option value="Event">Event</option>
              <option value="Esports">Esports</option>
            </select>
            <input type="text" placeholder="Image URL" className="admin-input flex-1" value={newNewsForm.image} onChange={e => setNewNewsForm({ ...newNewsForm, image: e.target.value })} />
            <button type="submit" className="btn-primary">Publish</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {news.map(item => (
          <div key={item.id} className="bg-white/5 rounded-lg overflow-hidden border border-white/10">
            <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
            <div className="p-4">
              <span className="text-xs text-cyan-400 uppercase">{item.category}</span>
              <h4 className="font-semibold text-white mt-1 line-clamp-1">{item.title}</h4>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.summary}</p>
              <button className="text-red-400 text-xs mt-3 flex items-center gap-1 hover:text-red-300" onClick={() => deleteNews(item.id)}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="admin-card p-6">
      <h3 className="font-semibold text-white text-lg mb-6">Settings</h3>
      <form className="max-w-xl space-y-4" onSubmit={handleSettingsSubmit}>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Username</label>
          <input type="text" disabled value={profileForm.username} className="admin-input w-full bg-white/5 cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="admin-input w-full" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">New Password</label>
            <input type="password" placeholder="Leave blank to keep" value={profileForm.newPassword} onChange={e => setProfileForm({ ...profileForm, newPassword: e.target.value })} className="admin-input w-full" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
            <input type="password" value={profileForm.confirmPassword} onChange={e => setProfileForm({ ...profileForm, confirmPassword: e.target.value })} className="admin-input w-full" />
          </div>
        </div>
        {settingsMsg && <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded text-sm">{settingsMsg}</div>}
        <button type="submit" className="btn-primary"><Save size={16} /> Save Changes</button>
      </form>
    </div>
  );

  if (!user || user.role !== 'ADMIN') return <div className="min-h-screen flex items-center justify-center text-white">Access Denied</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gray-900 border-r border-white/10 z-50 flex flex-col transition-all duration-200 ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/10">
          <Shield size={24} className="text-cyan-400" />
          {isSidebarOpen && <span className="font-bold text-white">Admin Panel</span>}
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
            { id: 'users', icon: Users, label: 'Users' },
            { id: 'chat', icon: MessageSquare, label: 'Messages' },
            { id: 'products', icon: ShoppingBag, label: 'Products' },
            { id: 'transactions', icon: CreditCard, label: 'Transactions' },
            { id: 'news', icon: FileText, label: 'News' },
            { id: 'settings', icon: Settings, label: 'Settings' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === item.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              title={!isSidebarOpen ? item.label : ''}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-white/10">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="w-full p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            {isSidebarOpen ? <Menu size={20} /> : <ChevronRight size={20} />}
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-200 ${isSidebarOpen ? 'ml-64' : 'ml-16'} p-6`}>
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-white capitalize">{activeTab}</h1>
          <p className="text-sm text-gray-500">Manage your platform</p>
        </header>

        <div className="min-h-[calc(100vh-140px)]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'transactions' && renderTransactions()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'chat' && renderChat()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'news' && renderNews()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>

      {/* Quick View Drawer - Simple slide-in */}
      {quickViewItem && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setQuickViewItem(null)} />
          <div className="fixed top-0 right-0 h-full w-96 bg-gray-900 z-50 shadow-xl border-l border-white/10">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-semibold text-white">Transaction Details</h3>
              <button onClick={() => setQuickViewItem(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-4 space-y-4">
              <div><label className="text-xs text-gray-500 uppercase">ID</label><div className="font-mono text-cyan-400">{quickViewItem.id}</div></div>
              <div><label className="text-xs text-gray-500 uppercase">User</label><div className="text-white">{quickViewItem.username}</div></div>
              <div><label className="text-xs text-gray-500 uppercase">Item</label><div className="text-white">{quickViewItem.game} - {quickViewItem.item}</div></div>
              <div><label className="text-xs text-gray-500 uppercase">Amount</label><div className="text-2xl font-bold text-white">Rp {quickViewItem.amount.toLocaleString()}</div></div>
              <div><label className="text-xs text-gray-500 uppercase">Date</label><div className="text-gray-400">{quickViewItem.date}</div></div>
              <div className="pt-2"><span className={`status-badge status-${quickViewItem.status.toLowerCase()}`}>{quickViewItem.status}</span></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboardPage;
