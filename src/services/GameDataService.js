import steamClient from '../api/steamClient';

export const searchGames = async (query) => {
  try {
    const response = await steamClient.get('/search', { params: { sugg: query } });
    return response.data;
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
};

export const fetchGameDetails = async (id) => {
  try {
    const [details, videos, about, tags, screenshots, requirements, news] = await Promise.all([
      steamClient.get(`/gameinfo/single_game/${id}`).then(res => res.data).catch(() => ({})),
      steamClient.get(`/media/videos/${id}`, { params: { limit: 5, offset: 0 } }).then(res => res.data).catch(() => []),
      steamClient.get(`/gameinfo/about_game/${id}`).then(res => res.data).catch(() => ({})),
      steamClient.get(`/gameinfo/tags/${id}`).then(res => res.data).catch(() => []),
      steamClient.get(`/media/screenshots/${id}`, { params: { limit: 20, offset: 0 } }).then(res => res.data).catch(() => []),
      steamClient.get(`/gameinfo/requirements/${id}`).then(res => res.data).catch(() => ({})),
      steamClient.get(`/news/all/${id}`, { params: { limit: 10, offset: 0 } }).then(res => res.data).catch(() => [])
    ]);

    // Normalize Data
    return {
      ...details,
      videos: Array.isArray(videos) ? videos : [],
      about: about?.description || 'No description available.',
      tags: Array.isArray(tags) ? tags : [],
      screenshots: Array.isArray(screenshots) ? screenshots : [],
      requirements: requirements || {},
      news: Array.isArray(news) ? news : []
    };
  } catch (error) {
    console.error("Critical failure in GameDataService:", error);
    return null;
  }
};

