import { useState, useEffect, useCallback } from 'react';
import { CatalogService } from '../services/CatalogService';

/**
 * Custom hook to fetch game details and reviews
 * 
 * @param {number|string} gameId - GameSpot game ID
 * @returns {object} { game, reviews, loading, error, refetch }
 * 
 * Usage:
 * const { game, reviews, loading } = useGameDetails(12345);
 */
export function useGameDetails(gameId) {
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGameData = useCallback(async () => {
    if (!gameId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Game Details (Local)
      const gameData = await CatalogService.getGameDetails(gameId);

      if (gameData) {
        setGame({
          ...gameData,
          averageScore: null,
          reviewCount: 0
        });
      } else {
        setError('Game not found');
        setGame(null);
      }

      setReviews([]);

    } catch (err) {
      console.error('[useGameDetails] Error fetching game details:', err);
      setError(err.message || 'Failed to fetch game details');
      setGame(null);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    fetchGameData();
  }, [fetchGameData]);

  const refetch = useCallback(() => {
    fetchGameData();
  }, [fetchGameData]);

  return {
    game,
    reviews,
    loading,
    error,
    refetch
  };
}

/**
 * Calculate average review score
 */
function calculateAverageScore(reviews) {
  if (!reviews || reviews.length === 0) return null;

  const scores = reviews
    .map(r => r.score)
    .filter(s => s !== null && s !== undefined && s !== 'N/A');

  if (scores.length === 0) return null;

  const average = scores.reduce((sum, score) => sum + parseFloat(score), 0) / scores.length;
  return average.toFixed(1);
}

export default useGameDetails;
