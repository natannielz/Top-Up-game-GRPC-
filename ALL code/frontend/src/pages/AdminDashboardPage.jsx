import { useState, useMemo, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';
import SystemStatus from '../components/admin/SystemStatus';
import AdminOverview from '../components/admin/AdminOverview';
import AdminTransactions from '../components/admin/AdminTransactions';
import {
  Users, LogOut, LayoutDashboard, ShoppingBag,
  CreditCard, Plus, Search, Trash2,
  Check, X, Shield, ChevronRight, ChevronLeft, Menu, Settings, MessageSquare, Send, Zap, Edit, Save
} from 'lucide-react';
import Avatar from '../components/common/Avatar';

const AdminDashboardPage = () => {
  const { user, logout, users, updateUserStatus, deleteUser, updateProfile } = useAuth();
  const {
    games, addGame, deleteGame, updateGame, refreshGames
  } = useData();

  const { sessions, sendMessage, adminStatus, setAdminStatus, markAsRead } = useChat();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  // sortConfig moved to AdminTransactions
  // quickViewItem moved to AdminTransactions

  // Debounce search query (For Users tab)
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

  // Pagination (For Users)
  const [usersPage, setUsersPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Form states (inline instead of modal)
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [editId, setEditId] = useState(null);

  // UPDATED: Game Form State matching Mongoose Schema
  const [newGameForm, setNewGameForm] = useState({
    title: '',
    description: '',
    genre: '',
    price: 0,
    image: '',
    platform: 'PC',
    gameType: 'TOPUP', // GAME or TOPUP
    topUpOptions: []
  });

  // UPDATED: News Form State matching Mongoose Schema
  const [newNewsForm, setNewNewsForm] = useState({
    title: '',
    content: '',
    category: 'Update',
    image: ''
  });

  // Temp state for adding new top-up options
  const [addOptionState, setAddOptionState] = useState({ label: '', value: '', price: '' });


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedChatUser, sessions]);


  // Users Filter
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

  const paginatedUsers = useMemo(() => {
    const start = (usersPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, usersPage]);

  const totalUserPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);


  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    if (profileForm.newPassword && profileForm.newPassword !== profileForm.confirmPassword) {
      setSettingsMsg("Passwords do not match!");
      return;
    }
    const updates = { email: profileForm.email };
    if (profileForm.newPassword) updates.password = profileForm.newPassword;
    updateProfile(updates);
    setSettingsMsg("Settings saved successfully!");
    setProfileForm(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedChatUser) return;
    sendMessage(user.id, chatInput, true, selectedChatUser);
    setChatInput('');
  };

  // UPDATED: Async handlers for CRUD
  const handleAddGame = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!newGameForm.title || !newGameForm.description || !newGameForm.image) {
      alert("Please fill in all required fields (Title, Description, Image URL)");
      return;
    }

    let result;
    if (editId) {
      result = await updateGame(editId, newGameForm);
    } else {
      result = await addGame(newGameForm);
    }

    if (result && result.success) {
      await refreshGames(); // Refresh list to ensure UI is in sync
      setIsAddingGame(false);
      setEditId(null);
      setNewGameForm({ title: '', description: '', genre: '', price: 0, image: '', platform: 'PC', gameType: 'TOPUP', topUpOptions: [] });
      alert(editId ? "Game updated successfully!" : "Game added successfully!");
    } else {
      alert(`Failed to save game: ${result?.error || 'Unknown error'}`);
    }
  };

  const handleEditGame = (game) => {
    setNewGameForm({
      title: game.title,
      description: game.description,
      genre: game.genre,
      price: game.price || 0,
      image: game.image,
      platform: game.platform || 'PC',
      gameType: game.gameType || 'TOPUP',
      topUpOptions: game.topUpOptions || []
    });
    setEditId(game._id || game.id);
    setIsAddingGame(true);
  };

  const handleAddNews = async (e) => {
    e.preventDefault();
    await addNews(newNewsForm);
    setIsAddingNews(false);
    setNewNewsForm({ title: '', content: '', category: 'Update', image: '' });
  };


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
                    <Avatar src={u.avatar} seed={u.username} size="sm" />
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
                    <Avatar src={chatUser?.avatar} seed={uid} size="md" />
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
        <button className="btn-primary text-sm" onClick={() => {
          setIsAddingGame(!isAddingGame);
          if (isAddingGame) {
            setEditId(null);
            setNewGameForm({ title: '', description: '', genre: '', price: 0, image: '', platform: 'PC', gameType: 'TOPUP', topUpOptions: [] });
          }
        }}>
          {isAddingGame ? <X size={16} /> : <Plus size={16} />}
          {isAddingGame ? (editId ? 'Cancel Edit' : 'Cancel') : 'Add Product'}
        </button>
      </div>

      {isAddingGame && (
        <form onSubmit={handleAddGame} className="p-4 bg-white/5 border-b border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" required placeholder="Title" className="admin-input" value={newGameForm.title} onChange={e => setNewGameForm({ ...newGameForm, title: e.target.value })} />

          <select className="admin-input" value={newGameForm.genre} onChange={e => setNewGameForm({ ...newGameForm, genre: e.target.value })}>
            <option value="">Select Genre</option>
            <option value="MOBA">MOBA</option>
            <option value="FPS">FPS</option>
            <option value="RPG">RPG</option>
            <option value="Action">Action</option>
            <option value="Strategy">Strategy</option>
            <option value="Card">Card Game</option>
            <option value="Battle Royale">Battle Royale</option>
          </select>

          <select className="admin-input" value={newGameForm.gameType} onChange={e => setNewGameForm({ ...newGameForm, gameType: e.target.value })}>
            <option value="TOPUP">Top-Up (Currency)</option>
            <option value="GAME">Game Purchase</option>
          </select>

          {/* Dynamic Price / Options Input */}
          {newGameForm.gameType === 'GAME' ? (
            <input type="number" placeholder="Price (Rp)" className="admin-input" value={newGameForm.price} onChange={e => setNewGameForm({ ...newGameForm, price: Number(e.target.value) })} />
          ) : (
            <div className="md:col-span-2 bg-black/20 p-3 rounded border border-white/5">
              <label className="text-sm text-gray-400 block mb-2">Top-Up Options</label>

              {/* List of added options */}
              <div className="space-y-2 mb-3">
                {newGameForm.topUpOptions?.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/5 p-2 rounded">
                    <span className="flex-1 text-sm text-white">{opt.label}</span>
                    <span className="text-xs text-gray-500">{opt.value}</span>
                    <span className="text-sm font-mono text-cyan-400">Rp {opt.price.toLocaleString()}</span>
                    <button type="button" onClick={() => {
                      const newOpts = newGameForm.topUpOptions.filter((_, i) => i !== idx);
                      setNewGameForm({ ...newGameForm, topUpOptions: newOpts });
                    }} className="text-red-400 hover:text-red-300"><X size={14} /></button>
                  </div>
                ))}
                {(!newGameForm.topUpOptions || newGameForm.topUpOptions.length === 0) && <p className="text-xs text-gray-600 italic">No options added yet.</p>}
              </div>

              {/* Add new option inputs */}
              {/* Add new option inputs */}
              {/* Add new option inputs */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Label (e.g. 100 Diamonds)"
                  className="admin-input flex-1 text-xs"
                  value={addOptionState.label}
                  onChange={(e) => setAddOptionState({ ...addOptionState, label: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Value (e.g. 100_diam)"
                  className="admin-input w-32 text-xs"
                  value={addOptionState.value}
                  onChange={(e) => setAddOptionState({ ...addOptionState, value: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price"
                  className="admin-input w-24 text-xs"
                  value={addOptionState.price}
                  onChange={(e) => setAddOptionState({ ...addOptionState, price: e.target.value })}
                />
                <button type="button" onClick={() => {
                  if (addOptionState.label && addOptionState.value && addOptionState.price) {
                    setNewGameForm({
                      ...newGameForm,
                      topUpOptions: [...(newGameForm.topUpOptions || []), { ...addOptionState, price: Number(addOptionState.price) }]
                    });
                    setAddOptionState({ label: '', value: '', price: '' });
                  }
                }} className="btn-secondary text-xs"><Plus size={14} /> Add</button>
              </div>
            </div>
          )}

          <input type="text" placeholder="Image URL" className="admin-input" value={newGameForm.image} onChange={e => setNewGameForm({ ...newGameForm, image: e.target.value })} />
          <textarea placeholder="Description" className="admin-input md:col-span-2" rows={2} value={newGameForm.description} onChange={e => setNewGameForm({ ...newGameForm, description: e.target.value })} />
          <button type="submit" className="btn-primary md:col-span-2">{editId ? 'Update Game' : 'Add Game'}</button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr><th>Image</th><th>Title</th><th>Genre</th><th>Price</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game._id || game.id}>
                <td><img src={game.image} alt={game.title} className="w-10 h-10 object-cover rounded" /></td>
                <td className="font-medium text-white">{game.title}</td>
                <td><span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">{game.genre}</span></td>
                <td className="text-gray-400">
                  {game.gameType === 'TOPUP' ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-cyan-400 border border-cyan-400/30 px-2 py-0.5 rounded inline-block w-fit">
                        {game.topUpOptions && game.topUpOptions.length > 0 ? `${game.topUpOptions.length} Variants` : 'No Variants'}
                      </span>
                      {game.topUpOptions && game.topUpOptions.length > 0 && (
                        <span className="text-[10px] text-gray-500">
                          {game.topUpOptions[0].label} ({game.topUpOptions[0].price.toLocaleString()}) ...
                        </span>
                      )}
                    </div>
                  ) : (
                    `Rp ${game.price?.toLocaleString()}`
                  )}
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn-icon text-cyan-400" onClick={() => handleEditGame(game)}><Edit size={14} /></button>
                    <button className="btn-icon text-red-400" onClick={() => deleteGame(game._id || game.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

            { id: 'status', icon: Zap, label: 'System Status' },
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
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'transactions' && <AdminTransactions />}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'chat' && renderChat()}
          {activeTab === 'products' && renderProducts()}

          {activeTab === 'status' && <SystemStatus />}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
