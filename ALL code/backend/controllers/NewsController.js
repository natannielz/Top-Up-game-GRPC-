import axios from 'axios';

// Get API Key from environment or fallback
const API_KEY = process.env.GAMESPOT_API_KEY || "da420df4699bec490dd10d0668e976924edfb8e4";
const API_URL = "https://www.gamespot.com/api/articles/";

export const getGameNews = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    if (!API_KEY) {
      console.warn('[NewsController] GAMESPOT_API_KEY is missing');
      return res.status(500).json({ error: "Configuration Error: Missing API Key" });
    }

    console.log(`[NewsController] Fetching GameSpot news: limit=${limit}, offset=${offset}`);

    // GameSpot API Parameters
    const params = {
      api_key: API_KEY,
      format: 'json',
      sort: 'publish_date:desc',
      limit: limit,
      offset: offset,
      // Optional: Filter fields to reduce payload size if needed
      // field_list: 'id,title,deck,image,site_detail_url,publish_date,authors'
    };

    // User-Agent is often required by public APIs
    const headers = {
      'User-Agent': 'University Project/1.0'
    };

    const response = await axios.get(API_URL, { params, headers });

    if (response.status === 200 && response.data.results) {
      const apiResults = response.data.results;

      // Map GameSpot Format to App Format
      const results = apiResults.map(article => ({
        id: article.id ? article.id.toString() : Date.now().toString(),
        title: article.title,
        description: article.deck || (article.body ? article.body.substring(0, 150) + '...' : ''),
        image: article.image?.original || article.image?.screen_tiny || '', // High res or fallback
        url: article.site_detail_url || '#',
        publishDate: article.publish_date, // "2023-10-27 15:00:00"
        categories: ['General'], // GameSpot doesn't always send clean categories in this list
        author: article.authors,
        isLocal: false
      }));

      const total = response.data.number_of_total_results || results.length;

      console.log(`[NewsController] Fetched ${results.length} articles`);

      res.status(200).json({
        results,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } else {
      throw new Error(`External API Error: ${response.status}`);
    }

  } catch (error) {
    console.error("[NewsController] Fetch failed:", error.message);
    // Return empty array on failure so UI doesn't crash
    res.status(500).json({
      error: "Failed to fetch news from GameSpot",
      details: error.message
    });
  }
};
