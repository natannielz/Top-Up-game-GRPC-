import axios from 'axios';

// Move API credentials to backend
const API_URL = 'https://games-details.p.rapidapi.com/news/announcements/3240220';
const HOST = 'games-details.p.rapidapi.com';
const API_KEY = '4f986f64cemsh76b9539edccd3f4p1eba5fjsn2c9321c70d4e';

export const getGameNews = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    console.log(`[NewsController] Fetching news: limit=${limit}, offset=${offset}`);

    const response = await axios.get(API_URL, {
      params: { limit, offset },
      headers: {
        'x-rapidapi-host': HOST,
        'x-rapidapi-key': API_KEY
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("[NewsController] Fetch failed:", error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: "Failed to fetch news from external provider" });
    }
  }
};
