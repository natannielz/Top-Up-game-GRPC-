import axios from 'axios';
import fs from 'fs';

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
    let output = "ROOT KEYS: " + Object.keys(json).join(', ') + "\n";

    // Check structure
    const newsArray = json.data?.news || json.news || json;

    if (Array.isArray(newsArray)) {
      output += `ARRAY FOUND. Length: ${newsArray.length}\n`;
      const first = newsArray[0];
      output += "ITEM KEYS: " + Object.keys(first).join(', ') + "\n";
      output += "TITLE: " + (first.title || first.news_title || "N/A") + "\n";
    } else {
      output += "NO ARRAY FOUND.\n";
      output += JSON.stringify(json, null, 2);
    }

    fs.writeFileSync('api_dump.txt', output);

  } catch (error) {
    fs.writeFileSync('api_dump.txt', "ERROR: " + error.message);
  }
};

testApi();
