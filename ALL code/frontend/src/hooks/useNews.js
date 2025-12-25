import { useState, useEffect, useCallback } from 'react';


/**
 * Custom hook to fetch latest news articles from GameSpot
 * 
 * @param {number} limit - Number of articles to fetch
 * @returns {object} { news, loading, error, refetch }
 * 
 * Usage:
 * const { news, loading, error, refetch } = useNews(5);
 */
export function useNews(limit = 5) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      setNews([]);

    } catch (err) {
      console.error('[useNews] Error fetching news:', err);
      setError(err.message || 'Failed to fetch news');
      setNews([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  const refetch = useCallback(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  return {
    news,
    loading,
    error,
    refetch
  };
}

export default useNews;
