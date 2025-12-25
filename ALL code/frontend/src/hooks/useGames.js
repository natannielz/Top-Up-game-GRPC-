import { useState, useEffect, useCallback } from 'react';
import { CatalogService } from '../services/CatalogService';

/**
 * Custom hook to fetch games with genre filtering
 * 
 * @param {string|null} genre - Genre filter (FPS, MOBA, RPG, Battle Royale, All, etc.)
 * @param {number} limit - Number of games to fetch
 * @returns {object} { games, loading, error, refetch, availableGenres }
 * 
 * Usage:
 * const { games, loading, availableGenres } = useGames('FPS', 12);
 */
export function useGames(genre = null, limit = 12) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableGenres, setAvailableGenres] = useState([]);

  const fetchGamesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Genre will be null for "All", or specific genre like "FPS"
      const filterGenre = genre === 'All' ? null : genre;

      const data = await CatalogService.getCatalog(filterGenre, limit);

      if (data.success) {
        setGames(data.games || []);
        // Local API doesn't return availableGenres in the same way, but we can adapt if needed
        setAvailableGenres([]);
      } else {
        throw new Error(data.error || 'Failed to fetch games');
      }

    } catch (err) {
      console.error('[useGames] Error fetching games:', err);
      setError(err.message || 'Failed to fetch games');
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [genre, limit]);

  useEffect(() => {
    fetchGamesData();
  }, [fetchGamesData]);

  const refetch = useCallback(() => {
    fetchGamesData();
  }, [fetchGamesData]);

  return {
    games,
    loading,
    error,
    refetch,
    availableGenres
  };
}

export default useGames;
