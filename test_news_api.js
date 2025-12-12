import axios from 'axios';

const BASE_URL = 'https://games-details.p.rapidapi.com';
const API_KEY = '4f986f64cemsh76b9539edccd3f4p1eba5fjsn2c9321c70d4e';
const HOST = 'games-details.p.rapidapi.com';

const testApi = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/news/all/3240220`, {
      params: { limit: 3 },
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': HOST
      }
    });

    const json = response.data;
    console.log("Root keys:", Object.keys(json));

    // Check if it's wrapped
    const newsArray = json.data?.news || json.news || json;

    if (Array.isArray(newsArray)) {
      console.log(`\nFound ${newsArray.length} items.`);
      const first = newsArray[0];
      console.log("First Item Keys:", Object.keys(first));
      console.log("Title:", first.title);
      console.log("Contents Preview:", first.contents ? first.contents.substring(0, 50) + "..." : "NONE");
    } else {
      console.log("Still could not find array. Structure:", JSON.stringify(json, null, 2).substring(0, 500));
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
};

testApi();
