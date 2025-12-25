import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // --- STATE ---
  const [games, setGames] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // --- FETCH DATA ---
  const fetchData = async () => {
    try {
      // Fetch Local Games
      // Keeping this as is, assuming only transaction API is broken/missing
      const gamesRes = await axios.get('http://localhost:3002/api/admin/games');
      setGames(gamesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();

    // Fetch Transactions (Try API, else LocalStorage)
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:3002/api/admin/transactions');
        if (res.data && Array.isArray(res.data)) {
          setTransactions(res.data);
          localStorage.setItem('transactions', JSON.stringify(res.data)); // Sync to local
          return;
        }
      } catch (err) {
        console.warn("API Transaction fetch failed, using local storage:", err.message);
      }

      // Fallback
      const storedTrx = localStorage.getItem('transactions');
      if (storedTrx) {
        setTransactions(JSON.parse(storedTrx));
      }
    };

    fetchTransactions();

  }, []);

  // --- ACTIONS ---

  // 1. PRODUCTS (GAMES) - Keep API
  const addGame = async (newGame) => {
    try {
      const res = await axios.post('http://localhost:3002/api/admin/games', newGame);
      setGames([...games, res.data]);
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Error adding game:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const updateGame = async (id, updatedGame) => {
    try {
      const res = await axios.put(`http://localhost:3002/api/admin/games/${id}`, updatedGame);
      setGames(games.map(g => g._id === id ? res.data : g));
      return { success: true, data: res.data };
    } catch (error) {
      console.error('Error updating game:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  const deleteGame = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/admin/games/${id}`);
      setGames(games.filter(g => g._id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting game:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };


  // 3. TRANSACTIONS (API + Local Sync)
  const addTransaction = async (trx) => {
    try {
      // 1. Send to Backend
      console.log('[DataContext] Sending transaction to API:', trx);
      const res = await axios.post('http://localhost:3002/api/v1/transaction/create', trx);

      // 2. Update Local State (Optimistic or from Response)
      const savedTrx = res.data.transaction || trx;

      const newTrxList = [savedTrx, ...transactions];
      setTransactions(newTrxList);
      localStorage.setItem('transactions', JSON.stringify(newTrxList));

      return { success: true, data: savedTrx };
    } catch (error) {
      console.error('[DataContext] Failed to save transaction to API:', error);
      // Fallback: Save locally anyway
      const newTrxList = [trx, ...transactions];
      setTransactions(newTrxList);
      localStorage.setItem('transactions', JSON.stringify(newTrxList));
      return { success: false, error: error.message };
    }
  };

  const updateTransactionStatus = async (id, newStatus) => {
    try {
      // API Call
      await axios.put(`http://localhost:3002/api/admin/transactions/${id}/status`, { status: newStatus });

      // Update Local State & Storage
      const updatedList = transactions.map(t =>
        t.id === id ? { ...t, status: newStatus } : t
      );
      setTransactions(updatedList);
      localStorage.setItem('transactions', JSON.stringify(updatedList));
    } catch (error) {
      console.error("Failed to update status on server:", error);
      // Still update locally for UI responsiveness
      const updatedList = transactions.map(t =>
        t.id === id ? { ...t, status: newStatus } : t
      );
      setTransactions(updatedList);
      localStorage.setItem('transactions', JSON.stringify(updatedList));
    }
  };

  // --- STATS HELPER ---
  const getStats = () => {
    const totalIncome = transactions
      .filter(t => t.status === 'Success')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalTransactions = transactions.length;

    return { totalIncome, totalTransactions };
  };

  // --- HELPERS ---
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
