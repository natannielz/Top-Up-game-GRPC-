import steamClient from './src/api/steamClient.js';
import fs from 'fs';

const testCategories = async () => {
  try {
    const gameId = '3240220';
    const response = await steamClient.get(`/news/all/${gameId}`, { params: { limit: 5 } });
    const items = response.data?.data?.news || [];

    if (items.length > 0) {
      console.log("Checking keys of first item for categorization features:");
      console.log(Object.keys(items[0]));

      items.forEach((item, i) => {
        console.log(`\n--- Item ${i} ---`);
        console.log("Title:", item.news_title || item.title);
        console.log("Feed Label:", item.feed_label || item.feedlabel || item.label || "N/A");
        console.log("Author:", item.author || "N/A");
        console.log("Tags:", item.tags || "N/A");
      });
    }
  } catch (e) {
    console.error(e);
  }
};

testCategories();
