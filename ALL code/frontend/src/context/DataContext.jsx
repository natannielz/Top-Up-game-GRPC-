import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // --- STATE ---
  const [games, setGames] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      const gamesRes = await api.get('/admin/games');
      setGames(gamesRes.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/admin/transactions');
      if (res.data && Array.isArray(res.data)) {
        setTransactions(res.data);
        return;
      }
    } catch (err) {
      console.warn("API Transaction fetch failed:", err.message);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTransactions();
  }, []);

  // --- ACTIONS ---

  const addGame = async (newGame) => {
    try {
      const res = await api.post('/admin/games', newGame);
      setGames([...games, res.data]);
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Error adding game:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const updateGame = async (id, updatedGame) => {
    try {
      const res = await api.put(`/admin/games/${id}`, updatedGame);
      setGames(games.map(g => g._id === id ? res.data : g));
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Error updating game:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const deleteGame = async (id) => {
    try {
      await api.delete(`/admin/games/${id}`);
      setGames(games.filter(g => g._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting game:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };


  const addTransaction = async (trx) => {
    try {
      console.log('[DataContext] Sending transaction to API:', trx);
      const res = await api.post('/v1/transaction/create', trx);
      const savedTrx = res.data.transaction || trx;
      setTransactions([savedTrx, ...transactions]);
      return { success: true, data: savedTrx };
    } catch (error) {
      console.error('[DataContext] Failed to save transaction to API:', error);
      // Fallback: update state anyway for UX, though it's better to show error
      setTransactions([trx, ...transactions]);
      return { success: false, error: error.message };
    }
  };

  const updateTransactionStatus = async (id, newStatus) => {
    try {
      await api.put(`/admin/transactions/${id}/status`, { status: newStatus });
      setTransactions(transactions.map(t =>
        t.id === id ? { ...t, status: newStatus } : t
      ));
    } catch (error) {
      console.error("Failed to update status on server:", error);
    }
  };

  const getStats = () => {
    const totalIncome = transactions
      .filter(t => t.status === 'Success')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalTransactions = transactions.length;

    return { totalIncome, totalTransactions };
  };

  const generateAvatar = (username) => {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(username || 'guest')}`;
  };

  return (
    <DataContext.Provider value={{
      games, addGame, updateGame, deleteGame, refreshGames: fetchData,
      transactions, addTransaction, updateTransactionStatus,
      getStats, generateAvatar
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
