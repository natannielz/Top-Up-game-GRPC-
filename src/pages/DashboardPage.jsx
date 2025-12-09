import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Clock, LogOut, Settings } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import './DashboardPage.css';

const mockTransactions = [
  { id: 'TRX-9821', game: 'Mobile Legends', item: '500 Diamonds', amount: 9.99, status: 'Success', date: '2023-10-25' },
  { id: 'TRX-9820', game: 'Valorant', item: '1000 VP', amount: 9.99, status: 'Success', date: '2023-10-24' },
  { id: 'TRX-9819', game: 'Genshin Impact', item: 'Welkin Moon', amount: 4.99, status: 'Failed', date: '2023-10-20' },
];

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');

  if (!user) {
    navigate('/login');
    return null;
  }

  const renderContent = () => {
    switch(activeTab) {
      case 'history':
        return (
          <div className="glass-panel content-panel">
            <div className="panel-header">
              <h3>Transaction History</h3>
              <button className="filter-btn">Filter</button>
            </div>
            <div className="history-list">
              <div className="history-header">
                <span>ID</span>
                <span>Game</span>
                <span>Item</span>
                <span>Price</span>
                <span>Status</span>
              </div>
              {mockTransactions.map(trx => (
                <div key={trx.id} className="history-item">
                  <span className="trx-id">{trx.id}</span>
                  <span>{trx.game}</span>
                  <span>{trx.item}</span>
                  <span>${trx.amount}</span>
                  <span className={`status ${trx.status.toLowerCase()}`}>{trx.status}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="glass-panel content-panel">
             <h3>Account Settings</h3>
             <form className="settings-form">
                <div className="form-group">
                  <label>Display Name</label>
                  <input type="text" defaultValue={user.name} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" defaultValue={user.email} disabled />
                </div>
                <div className="form-group">
                   <label>Notifications</label>
                   <div className="checkbox-group">
                      <label><input type="checkbox" defaultChecked /> Email Notifications</label>
                      <label><input type="checkbox" defaultChecked /> SMS Notifications</label>
                   </div>
                </div>
                <button className="primary-btn">Save Changes</button>
             </form>
          </div>
        );
      case 'methods':
        return (
          <div className="glass-panel content-panel">
             <h3>Payment Methods</h3>
             <div className="payment-method-list">
                <div className="payment-method-item">
                   <div className="card-icon"><CreditCard size={24}/></div>
                   <div>
                     <p className="card-name">Visa ending in 4242</p>
                     <p className="card-exp">Expires 12/25</p>
                   </div>
                   <button className="remove-btn">Remove</button>
                </div>
                <button className="add-method-btn">+ Add New Method</button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
           <div className="profile-summary glass-panel">
             <img src={user.avatar} alt="Profile" className="profile-avatar" />
             <h2>{user.name}</h2>
             <span className="rank-badge">{user.rank} Member</span>
           </div>

           <div className="sidebar-nav glass-panel">
             <button
               className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
               onClick={() => setActiveTab('history')}
             >
               <Clock size={18} /> Transactions
             </button>
             <button
               className={`nav-btn ${activeTab === 'methods' ? 'active' : ''}`}
               onClick={() => setActiveTab('methods')}
             >
               <CreditCard size={18} /> Payment Methods
             </button>
             <button
               className={`nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
               onClick={() => setActiveTab('settings')}
             >
               <Settings size={18} /> Settings
             </button>
             <div className="divider"></div>
             <button onClick={() => { logout(); navigate('/'); }} className="nav-btn logout">
               <LogOut size={18} /> Logout
             </button>
           </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
