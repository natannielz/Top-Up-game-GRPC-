import Game from '../models/Game.js';
import Transaction from '../models/Transaction.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAMES_JSON = path.join(__dirname, '../data/games.json');
const TRANSACTIONS_JSON = path.join(__dirname, '../data/transactions.json');

// --- MIGRATION HELPER (Runs once if DB is empty) ---
const seedDataIfEmpty = async () => {
  try {
    const gameCount = await Game.countDocuments();
    if (gameCount === 0 && fs.existsSync(GAMES_JSON)) {
      console.log('[Migration] Seeding Games from JSON...');
      const games = JSON.parse(fs.readFileSync(GAMES_JSON, 'utf8'));
      if (games.length > 0) {
        // Map _id to id if necessary or let Mongoose handle it
        await Game.insertMany(games.map(g => ({ ...g, _id: undefined })));
      }
    }

    const txCount = await Transaction.countDocuments();
    if (txCount === 0 && fs.existsSync(TRANSACTIONS_JSON)) {
      console.log('[Migration] Seeding Transactions from JSON...');
      const txs = JSON.parse(fs.readFileSync(TRANSACTIONS_JSON, 'utf8'));
      if (txs.length > 0) {
        await Transaction.insertMany(txs.map(t => ({ ...t, _id: undefined })));
      }
    }
  } catch (error) {
    console.error('[Migration] Error seeding data:', error);
  }
};

// Start seeding process
seedDataIfEmpty();

// --- CONTROLLER FUNCTIONS ---

// Get all local games
export const getLocalGames = async (req, res) => {
  try {
    const games = await Game.find({ status: { $ne: 'Deleted' } }).lean();
    res.status(200).json(games);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all transactions
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new game
export const createGame = async (req, res) => {
  try {
    const newGame = new Game({
      ...req.body,
      status: 'Active'
    });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a game
export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGame = await Game.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete game
export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await Game.findByIdAndDelete(id);

    if (!deletedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update transaction status
export const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(`[Admin] Updating Transaction ${id} to ${status}`);

    const updatedTx = await Transaction.findOneAndUpdate(
      { id: id },
      { $set: { status: status, note: "Updated by admin" } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, id, status: updatedTx.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new transaction (User Purchase)
export const createTransaction = async (req, res) => {
  try {
    const { userId, game, item, amount, paymentMethod, username } = req.body;

    const trxId = `TRX-${Date.now()}`;
    const safeUsername = username || userId || 'Guest';
    const avatarUrl = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(safeUsername)}`;

    const newTransaction = new Transaction({
      id: trxId,
      userId: userId || 'guest',
      username: safeUsername,
      avatar: avatarUrl,
      game: game || 'Unknown Game',
      gameType: 'TOPUP',
      item: item || 'Unknown Item',
      amount: Number(amount) || 0,
      status: 'Success', // For production, this should probably be Pending until payment confirmed
      date: new Date().toISOString().split('T')[0],
      paymentMethod: paymentMethod || 'Unknown'
    });

    await newTransaction.save();
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

