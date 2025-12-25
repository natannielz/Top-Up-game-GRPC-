import React, { useState, useMemo } from 'react';
import { Search, Download, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Check, X } from 'lucide-react';
import { useData } from '../../context/DataContext';

const AdminTransactions = () => {
  const { transactions, updateTransactionStatus, generateAvatar } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' }); // Default sort by date desc

  const ITEMS_PER_PAGE = 10;

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredTransactions = useMemo(() => {
    let data = [...transactions];

    // Sort logic
    if (sortConfig.key) {
      data.sort((a, b) => {
        // Handle potentially missing dates by falling back to 0
        const valA = a[sortConfig.key] || (sortConfig.key === 'date' ? 0 : '');
        const valB = b[sortConfig.key] || (sortConfig.key === 'date' ? 0 : '');

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Filter logic
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(t =>
        (t.username && t.username.toLowerCase().includes(q)) ||
        (t.game && t.game.toLowerCase().includes(q)) ||
        (t.id && t.id.toLowerCase().includes(q))
      );
    }

    return data;
  }, [transactions, searchQuery, sortConfig]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTransactions, currentPage]);

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = Object.keys(filteredTransactions[0]);
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="admin-card">
      <div className="p-4 border-b border-white/10 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-white">Transactions</h3>
          <button onClick={exportToCSV} className="btn-secondary text-xs">
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
              <th onClick={() => handleSort('id')} className="cursor-pointer hover:text-cyan-400">ID <span translate="no"><ArrowUpDown size={12} className="inline" /></span></th>
              <th onClick={() => handleSort('username')} className="cursor-pointer hover:text-cyan-400">User <span translate="no"><ArrowUpDown size={12} className="inline" /></span></th>
              <th onClick={() => handleSort('amount')} className="cursor-pointer hover:text-cyan-400">Amount <span translate="no"><ArrowUpDown size={12} className="inline" /></span></th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.map(t => {
              // DiceBear API generation as requested
              const avatarUrl = generateAvatar(t.username);

              return (
                <tr key={t.id}>
                  <td className="font-mono text-xs text-cyan-400">{t.id}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <img
                        src={avatarUrl}
                        alt={t.username}
                        className="w-8 h-8 rounded-full bg-slate-700 border border-white/10"
                      />
                      <span>{t.username}</span>
                    </div>
                  </td>
                  <td className="font-semibold">Rp {t.amount.toLocaleString()}</td>
                  <td><span className={`status-badge status-${t.status.toLowerCase()}`}>{t.status}</span></td>
                  <td>
                    <div className="flex gap-1" translate="no">
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
              );
            })}
            {paginatedTransactions.length === 0 && (
              <tr><td colSpan="5" className="text-center text-gray-500 py-4">No transactions found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="p-4 border-t border-white/10 flex justify-between items-center text-sm">
          <span className="text-gray-400">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="btn-secondary disabled:opacity-30"><ChevronLeft size={16} /></button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="btn-secondary disabled:opacity-30"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      {/* Quick View Drawer */}
      {quickViewItem && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setQuickViewItem(null)} />
          <div className="fixed top-0 right-0 h-full w-96 bg-gray-900 z-[70] shadow-xl border-l border-white/10 slide-in-right">
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

export default AdminTransactions;
