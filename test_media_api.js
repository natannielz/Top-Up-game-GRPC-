import steamClient from './src/api/steamClient.js';
import fs from 'fs';

// Mock the axios instance since steamClient is in src and uses relative imports? 
// No, I can probably just import it if I run with node and type module.
// Assuming package.json has "type": "module".

const testMedia = async () => {
  try {
    const gameId = '730'; // Testing the user's example ID first
    console.log(`Testing media for ID: ${gameId}`);

    const [screenRes, artRes, vidRes] = await Promise.all([
      steamClient.get(`/media/screenshots/${gameId}`, { params: { limit: 5 } }).catch(e => ({ error: e.message })),
      steamClient.get(`/media/artworks/${gameId}`, { params: { limit: 5 } }).catch(e => ({ error: e.message })),
      steamClient.get(`/media/videos/${gameId}`, { params: { limit: 5 } }).catch(e => ({ error: e.message }))
    ]);

    const log = {
      screenshots: screenRes.data || screenRes.error,
      artworks: artRes.data || artRes.error,
      videos: vidRes.data || vidRes.error
    };

    console.log("Screenshots Keys:", Object.keys(log.screenshots));
    if (log.screenshots.data) console.log("Screenshots Data Keys:", Object.keys(log.screenshots.data));

    fs.writeFileSync('media_dump.json', JSON.stringify(log, null, 2));

  } catch (err) {
    console.error("Critical Error:", err);
  }
};

testMedia();
