import { useState, useEffect, useCallback } from 'react';


/**
 * Custom hook to fetch game reviews
 * 
 * @param {number} limit - Number of reviews to fetch
 * @param {number|string} gameId - Optional game ID to filter reviews
 * @returns {object} { reviews, loading, error, refetch }
 * 
 * Usage:
 * const { reviews, loading } = useReviews(10);
 * const { reviews, loading } = useReviews(5, 12345); // For specific game
 */
export function useReviews(limit = 10, gameId = null) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviewsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      setReviews([]);

    } catch (err) {
      console.error('[useReviews] Error fetching reviews:', err);
      setError(err.message || 'Failed to fetch reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [limit, gameId]);

  useEffect(() => {
    fetchReviewsData();
  }, [fetchReviewsData]);

  const refetch = useCallback(() => {
    fetchReviewsData();
  }, [fetchReviewsData]);

  return {
    reviews,
    loading,
    error,
    refetch
  };
}

export default useReviews;
