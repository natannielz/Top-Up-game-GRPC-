import axios from 'axios';

const API_BASE_URL = 'http://localhost:3002/api';

export const CatalogService = {
  /**
   * Fetch games from the catalog (Local Backend)
   * @param {string} genre - Optional genre filter (e.g., 'Action', 'FPS')
   * @param {number} limit - Number of items to fetch
   */
  async getCatalog(genre, limit = 20, type = null) {
    try {
      const params = { limit };
      if (genre && genre !== 'All' && genre !== 'ALL') {
        params.genre = genre;
      }
      if (type && type !== 'All' && type !== 'ALL') {
        params.type = type;
      }

      console.log(`[CatalogService] Fetching catalog: genre=${genre}, type=${type}, limit=${limit}`);
      const response = await axios.get(`${API_BASE_URL}/catalog`, { params });
      return response.data;
    } catch (error) {
      console.error('[CatalogService] Error fetching catalog:', error);
      return { games: [] };
    }
  },

  /**
   * Fetch single game details
   */
  async getGameDetails(id) {
    try {
      console.log(`[CatalogService] Fetching game details: ${id}`);
      const response = await axios.get(`${API_BASE_URL}/catalog/game/${id}`);

      // If success, response.data.game contains the game data
      if (response.data.success) {
        return response.data.game;
      }
      return null;
    } catch (error) {
      console.error('[CatalogService] Error fetching game details:', error);
      return null;
    }
  },

  /**
   * Fetch latest reviews
   * Note: Reviews system is currently disabled/local-only skeleton
   */
  async getReviews(limit = 20) {
    return { reviews: [] };
  },

  /**
   * Fetch Catalog AND Reviews, then merge the scores into the games.
   * This fulfills the requirement: "If a game in the catalog has a matching review, display a Score Badge"
   */
  async getGamesWithScores(genre, limit = 20) {
    try {
      // Parallel fetch for performance
      const [catalogData, reviewsData] = await Promise.all([
        this.getCatalog(genre, limit),
        this.getReviews(limit * 2) // Fetch more reviews to increase match chance
      ]);

      const games = catalogData.games || [];
      const reviews = reviewsData.reviews || [];

      // Create a map of Game Names -> Scores for O(1) lookup
      // GameSpot names usually match, but fuzzy matching might be needed in a real prod env.
      // Here we assume exact or close string match is enough for the prototype.
      const reviewMap = {};
      reviews.forEach(review => {
        if (review.gameName) {
          reviewMap[review.gameName.toLowerCase()] = review.score;
        }
        // Also map by ID if available (ideal)
        if (review.gameId) {
          reviewMap[review.gameId] = review.score;
        }
      });

      // Merge score into game objects
      const enrichedGames = games.map(game => {
        // Try strict ID match first, then name match
        const scoreById = reviewMap[game.id];
        const scoreByName = reviewMap[game.name.toLowerCase()];

        return {
          ...game,
          score: scoreById || scoreByName || null // null means no review found
        };
      });

      return {
        ...catalogData,
        games: enrichedGames
      };

    } catch (error) {
      console.error('[CatalogService] Error getting games with scores:', error);
      return { games: [] };
    }
  }
};
