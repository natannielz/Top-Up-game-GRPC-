import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths to JSON files
const GAMES_FILE = path.join(__dirname, '../data/games.json');
const TRANSACTIONS_FILE = path.join(__dirname, '../data/transactions.json');

// --- HELPER FUNCTIONS ---

const readData = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      // Create empty file if not exists
      fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
};

// --- CONTROLLER FUNCTIONS ---

// Get all local games
export const getLocalGames = async (req, res) => {
  try {
    const games = readData(GAMES_FILE);
    // Filter out deleted games if you want soft delete logic, or just return all active
    const activeGames = games.filter(g => g.status !== 'Deleted');
    res.status(200).json(activeGames);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = readData(TRANSACTIONS_FILE);
    // Sort by date desc (newest first)
    transactions.sort((a, b) => new Date(b.date || b.updatedAt) - new Date(a.date || a.updatedAt));
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new game
export const createGame = async (req, res) => {
  try {
    const games = readData(GAMES_FILE);

    // Create new game object with ID
    const newId = `game-${Date.now()}`;
    const newGame = {
      ...req.body,
      id: newId,
      _id: newId, // Maintain compatibility with frontend checking _id
      status: 'Active',
      createdAt: new Date().toISOString()
    };

    games.push(newGame);
    writeData(GAMES_FILE, games);

    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a game
export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const games = readData(GAMES_FILE);

    // Find index (check both id and _id)
    const index = games.findIndex(g => g.id === id || g._id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Update fields
    const updatedGame = {
      ...games[index],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    games[index] = updatedGame;
    writeData(GAMES_FILE, games);

    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete game
export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    let games = readData(GAMES_FILE);

    // Filter out the game to hard delete, OR set status to Deleted for soft delete
    // Let's do hard delete for simplicity in JSON file to keep it clean, 
    // OR soft delete to match previous logic. Let's do Hard Delete for file cleanup.
    const newGames = games.filter(g => g.id !== id && g._id !== id);

    if (newGames.length === games.length) {
      return res.status(404).json({ message: 'Game not found' });
    }

    writeData(GAMES_FILE, newGames);
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update transaction status (and persist it)
export const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`[Admin] Updating Transaction ${id} to ${status}`);

    const transactions = readData(TRANSACTIONS_FILE);
    const index = transactions.findIndex(t => t.id === id);

    let updatedTx;
    if (index !== -1) {
      // Update existing
      transactions[index].status = status;
      transactions[index].updatedAt = new Date().toISOString();
      updatedTx = transactions[index];
    } else {
      // If mock transaction from frontend doesn't exist in file yet, create it
      updatedTx = {
        id,
        status,
        updatedAt: new Date().toISOString(),
        note: "Auto-created from status update"
      };
      transactions.push(updatedTx);
    }

    writeData(TRANSACTIONS_FILE, transactions);

    res.status(200).json({ success: true, id, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new transaction (User Purchase)
export const createTransaction = async (req, res) => {
  try {
    const { userId, game, item, amount, paymentMethod, username } = req.body;

    // Generate distinct ID
    const trxId = `TRX-${Date.now()}`;

    // Generate Consistent Avatar (DiceBear Pixel Art)
    const safeUsername = username || userId || 'Guest';
    const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(safeUsername)}`;

    const newTransaction = {
      id: trxId,
      userId: userId || 'guest',
      username: safeUsername,
      avatar: avatarUrl, // Persist avatar
      game: game || 'Unknown Game',
      gameType: 'TOPUP', // Default
      item: item || 'Unknown Item',
      amount: Number(amount) || 0,
      status: 'Success', // User requested automatic success
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      timestamp: new Date().toISOString(),
      paymentMethod: paymentMethod || 'Unknown'
    };

    const transactions = readData(TRANSACTIONS_FILE);
    transactions.push(newTransaction);
    writeData(TRANSACTIONS_FILE, transactions);

    console.log(`[Transaction] Created ${trxId} for ${safeUsername}`);

    res.status(201).json({
      success: true,
      trxId,
      message: 'Transaction created successfully'
    });

  } catch (error) {
    console.error('[Transaction] Create Error:', error);
    res.status(500).json({ message: error.message });
  }
};
