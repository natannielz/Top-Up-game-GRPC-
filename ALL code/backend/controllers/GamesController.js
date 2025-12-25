import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const GAMES_FILE = path.join(__dirname, '../data/games.json');

const readData = () => {
  try {
    if (!fs.existsSync(GAMES_FILE)) return [];
    const data = fs.readFileSync(GAMES_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error("Error reading games.json:", err);
    return [];
  }
};

/**
 * Games Controller
 * Handles game catalog requests - Reading from SHARED JSON (Source of Truth)
 */

/**
 * GET /api/games?genre=Action&limit=12&offset=0
 */
export const getGamesByGenre = async (req, res) => {
  try {
    const { genre, limit = 12, offset = 0, type } = req.query;
    console.log(`[GamesController] Fetching games (JSON): genre=${genre || 'all'}, type=${type || 'all'}`);

    let allGames = readData();

    // Filters
    let filtered = allGames.filter(g => g.status !== 'Deleted'); // Exclude deleted

    if (genre && genre !== 'All' && genre !== 'all') {
      filtered = filtered.filter(g => g.genre && g.genre.toLowerCase() === genre.toLowerCase());
    }

    if (type && type !== 'All' && type !== 'all') {
      filtered = filtered.filter(g => g.gameType === type.toUpperCase());
    }

    const totalGames = filtered.length;

    // Pagination
    const start = parseInt(offset);
    const end = start + parseInt(limit);
    const pagedGames = filtered.slice(start, end);

    const mappedGames = pagedGames.map(g => ({
      id: g.id || g._id,
      name: g.title,
      image: g.image || 'https://via.placeholder.com/300x400?text=No+Image',
      description: g.description,
      url: `/game/${g.id || g._id}`,
      genres: [g.genre],
      releaseDate: g.createdAt,
      platforms: [{ name: g.platform || 'PC' }],
      isLocal: true,
      price: g.price,
      score: null,
      gameType: g.gameType || 'TOPUP',
      topUpOptions: g.topUpOptions || []
    }));

    res.status(200).json({
      success: true,
      total: totalGames,
      count: mappedGames.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      genre: genre || 'all',
      games: mappedGames
    });

  } catch (error) {
    console.error('[GamesController] Error:', error.message);
    res.status(500).json({ success: false, error: error.message, games: [] });
  }
};

/**
 * GET /api/games/search?q=cyberpunk&limit=10
 */
export const searchGames = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
    }

    const allGames = readData();
    const filtered = allGames.filter(g =>
      (g.title && g.title.toLowerCase().includes(q.toLowerCase())) &&
      g.status !== 'Deleted'
    ).slice(0, parseInt(limit));

    const games = filtered.map(g => ({
      id: g.id || g._id,
      name: g.title,
      image: g.image,
      description: g.description,
      url: `/game/${g.id || g._id}`
    }));

    res.status(200).json({
      success: true,
      query: q,
      count: games.length,
      games
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * GET /api/catalog/game/:id
 */
export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const allGames = readData();
    const game = allGames.find(g => (g.id === id || g._id === id) && g.status !== 'Deleted');

    if (!game) {
      return res.status(404).json({ success: false, error: 'Game not found' });
    }

    const gameData = {
      id: game.id || game._id,
      title: game.title,
      name: game.title,
      image: game.image,
      description: game.description,
      genres: [game.genre],
      publisher: 'GamerZone Exclusive',
      releaseDate: game.createdAt,
      score: null,
      price: game.price,
      isLocal: true,
      deck: game.description,
      summary: game.description,
      topUpOptions: game.topUpOptions
    };

    res.json({ success: true, game: gameData });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
