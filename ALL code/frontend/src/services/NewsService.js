import axios from 'axios';

// Backend API Configuration
const API_BASE_URL = 'http://localhost:3002/api';

// Helper to get game media (keeping the existing media fetching logic)
export const fetchGameMedia = async () => {
  // Return empty for now since we're switching to GameSpot which provides images in the API
  // You can keep this for supplementary media if needed
  return {};
};

/**
 * Fetch game news from the backend GameSpot API
 */
export const fetchGameNews = async (limit = 50, offset = 0) => {
  try {
    console.log(`[NewsService] Fetching news from backend: limit=${limit}, offset=${offset}`);

    const response = await axios.get(`${API_BASE_URL}/news`, {
      params: {
        limit,
        offset
      }
    });

    console.log(`[NewsService] Received ${response.data.results?.length || 0} articles`);

    // Map Backend data to match the frontend's expected structure
    const newsData = response.data.results || [];

    return newsData.map((article, index) => {
      // Extract category for classification
      let signalCategory = 'LORE & NARRATIVE';
      const gameCategory = article.categories?.[0] || '';
      const text = (article.title + article.description).toLowerCase();

      if (text.match(/patch|update|fix|v\d+\.|hotfix|changelog|notes/)) {
        signalCategory = 'PATCH NOTES';
      } else if (text.match(/esport|major|tournament|cup|prize|qualifier|final|champ/)) {
        signalCategory = 'ESPORTS';
      }

      return {
        id: article.id,
        news_title: article.title,
        title: article.title,
        summary: article.description || 'No description available',
        content: `<p>${article.description || 'No content available'}</p>`,
        date: article.publishDate ? new Date(article.publishDate).getTime() / 1000 : Date.now() / 1000,
        category: signalCategory,
        gameName: gameCategory || 'Gaming News',
        tier: 'News',
        image: article.image || 'https://images.unsplash.com/photo-1614726365723-49cfa080998a?q=80&w=2670&auto=format&fit=crop',
        gameId: article.id,
        type: 'Article',
        isExternal: false,
        url: article.url
      };
    });

  } catch (error) {
    console.error("[NewsService] Failed to fetch news from backend:", error);
    return [];
  }
};
