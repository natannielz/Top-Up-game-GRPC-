import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <MainLayout>
      <div className="dashboard-container">
        {/* Profile Card */}
        <div className="profile-section">
          <div className="profile-card glass-panel">
            <img src={user.avatar} alt="Profile" className="profile-avatar" />
            <div className="profile-info">
              <h2>{user.name}</h2>
              <span className="rank-badge">{user.rank} Member</span>
              <p className="email">{user.email}</p>
            </div>
            <div className="loyalty-points">
              <span className="points-val">{user.points}</span>
              <span className="points-label">G-Points</span>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); }} className="logout-btn">Logout</button>
        </div>

        {/* Transaction History */}
        <div className="history-section glass-panel">
          <h3>Transaction History</h3>
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
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
