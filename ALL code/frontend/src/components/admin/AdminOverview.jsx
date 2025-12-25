import React, { useState, useEffect } from 'react';
import { CreditCard, ShoppingBag, Users } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const AdminOverview = () => {
  const { transactions, getStats } = useData();
  const { users } = useAuth();
  const stats = getStats();

  const [externalStats, setExternalStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/gamerzone_official/topup-counter/')
      .then(res => {
        if (res.status === 404) return { count: 0 };
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        if (data && typeof data.count === 'number') {
          setExternalStats(data.count);
        }
      })
      .catch(err => console.warn("AdminStats: Using local fallback"))
      .finally(() => setLoadingStats(false));
  }, []);

  // Sort transactions by most recent for the activity feed
  const recentActivity = [...transactions].sort((a, b) =>
    new Date(b.timestamp || b.date) - new Date(a.timestamp || a.date)
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center" translate="no">
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
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center" translate="no">
              <ShoppingBag className="text-blue-400" size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold">Total Orders</div>
              <div className="text-xl font-bold text-white">
                {loadingStats ? (
                  <span className="text-sm text-gray-400 animate-pulse">Loading...</span>
                ) : (
                  (externalStats !== null ? externalStats : stats.totalTransactions).toLocaleString('id-ID')
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center" translate="no">
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
              {recentActivity.map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-xs text-cyan-400">{t.id}</td>
                  <td>{t.username}</td>
                  <td className="text-gray-400">{t.game}</td>
                  <td><span className={`status-badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                </tr>
              ))}
              {recentActivity.length === 0 && (
                <tr><td colSpan="4" className="text-center text-gray-500 py-4">No recent activity</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
