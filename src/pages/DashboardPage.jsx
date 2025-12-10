import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import './DashboardPage.css';

const mockTransactions = [
  { id: 'TRX-9821', game: 'Mobile Legends', item: '500 Diamonds', amount: 150000, status: 'Success', date: '2023-10-25' },
  { id: 'TRX-9820', game: 'Valorant', item: '1000 VP', amount: 120000, status: 'Success', date: '2023-10-24' },
  { id: 'TRX-9819', game: 'Genshin Impact', item: 'Welkin Moon', amount: 79000, status: 'Failed', date: '2023-10-20' },
];

const DashboardPage = () => {
  const { user, logout, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
  };

  const handleDelete = () => {
    deleteAccount();
    navigate('/');
  };

  return (
    <MainLayout>
      <div className="dashboard-container">
        {/* Profile Card */}
        <div className="profile-section">
          <div className="profile-card glass-panel">
            <img src={user.avatar} alt="Profile" className="profile-avatar" />

            <div className="profile-info">
              {isEditing ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="edit-input"
                  />
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="edit-input"
                  />
                  <div className="edit-actions">
                    <button onClick={handleSave} className="save-btn">Save</button>
                    <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2>{user.name}</h2>
                  <span className="rank-badge">{user.rank} Member</span>
                  <p className="email">{user.email}</p>
                  <button onClick={startEdit} className="edit-btn">Edit Profile</button>
                </>
              )}
            </div>

            <div className="loyalty-points">
              <span className="points-val">{user.points}</span>
              <span className="points-label">G-Points</span>
            </div>
          </div>

          <div className="account-actions">
            <button onClick={() => { logout(); navigate('/'); }} className="logout-btn">Logout</button>
            <button onClick={() => setShowDeleteModal(true)} className="delete-btn">Delete Account</button>
          </div>
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
                <span>Rp {trx.amount.toLocaleString('id-ID')}</span>
                <span className={`status ${trx.status.toLowerCase()}`}>{trx.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h3>Delete Account?</h3>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">Cancel</button>
              <button onClick={handleDelete} className="confirm-delete-btn">Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
