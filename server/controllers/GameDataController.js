import axios from 'axios';

const BASE_URL = 'https://games-details.p.rapidapi.com';
const HOST = 'games-details.p.rapidapi.com';
const API_KEY = '4f986f64cemsh76b9539edccd3f4p1eba5fjsn2c9321c70d4e';

const fetchFromApi = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      params,
      headers: {
        'x-rapidapi-host': HOST,
        'x-rapidapi-key': API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error(`[GameDataController] Error fetching ${endpoint}:`, error.message);
    throw error;
  }
};

export const searchGames = async (req, res) => {
  try {
    const { query } = req.query;
    const data = await fetchFromApi('/search', { sugg: query });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};

export const getGameDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromApi(`/gameinfo/single_game/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game details' });
  }
};

export const getGameVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromApi(`/media/videos/${id}`, { limit: 5, offset: 0 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

export const getGameDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromApi(`/gameinfo/about_game/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch description' });
  }
};

export const getGameTags = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromApi(`/gameinfo/tags/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

export const getGameScreenshots = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromApi(`/media/screenshots/${id}`, { limit: 20, offset: 0 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch screenshots' });
  }
};

export const getGameRequirements = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromApi(`/gameinfo/requirements/${id}`);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requirements' });
  }
};

export const getGameNews = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetchFromApi(`/news/all/${id}`, { limit: 10, offset: 0 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};
