import { createContext, useContext, useState, useEffect } from 'react';
import { games as initialGames } from '../data/games';
import { newsData as initialNews } from '../data/newsData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // --- STATE ---
  const [games, setGames] = useState(initialGames);
  const [news, setNews] = useState(initialNews);
  const [transactions, setTransactions] = useState([]);

  // --- INIT DUMMY DATA ---
  useEffect(() => {
    // Generate 20 Dummy Transactions if empty
    if (transactions.length === 0) {
      const dummyTransactions = Array.from({ length: 20 }, (_, i) => ({
        id: `TRX-${1000 + i}`,
        userId: `user-${(i % 10) + 1}`,
        username: `user${(i % 10) + 1}`,
        game: initialGames[i % initialGames.length]?.title || 'Unknown Game',
        item: '1000 Points',
        amount: 50000 + (i * 10000),
        status: i < 5 ? 'Pending' : (i % 3 === 0 ? 'Failed' : 'Success'),
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
      }));
      setTransactions(dummyTransactions);
    }
  }, []);

  // --- ACTIONS ---

  // 1. PRODUCTS (GAMES)
  const addGame = (newGame) => {
    setGames([...games, { ...newGame, id: Date.now() }]);
  };

  const updateGame = (id, updatedGame) => {
    setGames(games.map(g => g.id === id ? { ...g, ...updatedGame } : g));
  };

  const deleteGame = (id) => {
    setGames(games.filter(g => g.id !== id));
  };

  // 2. NEWS
  const addNews = (newItem) => {
    setNews([newItem, ...news]);
  };

  const deleteNews = (id) => {
    setNews(news.filter(n => n.id !== id));
  };

  // 3. TRANSACTIONS
  const addTransaction = (trx) => {
    setTransactions([trx, ...transactions]);
  };

  const updateTransactionStatus = (id, newStatus) => {
    setTransactions(transactions.map(t =>
      t.id === id ? { ...t, status: newStatus } : t
    ));
  };

  // --- STATS HELPER ---
  const getStats = () => {
    const totalIncome = transactions
      .filter(t => t.status === 'Success')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalTransactions = transactions.length;

    return { totalIncome, totalTransactions };
  };

  return (
    <DataContext.Provider value={{
      games, addGame, updateGame, deleteGame,
      news, addNews, deleteNews,
      transactions, addTransaction, updateTransactionStatus,
      getStats
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
