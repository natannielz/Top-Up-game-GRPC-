import steamClient from '../api/steamClient';

// Comprehensive Game Database with Tiers
const GAME_DB = {
  // --- AAA TITLES ---
  '730': { name: 'Counter-Strike 2', tier: 'AAA' },
  '570': { name: 'Dota 2', tier: 'AAA' },
  '578080': { name: 'PUBG: BATTLEGROUNDS', tier: 'AAA' },
  '1172470': { name: 'Apex Legends', tier: 'AAA' },
  '271590': { name: 'Grand Theft Auto V', tier: 'AAA' },
  '1091500': { name: 'Cyberpunk 2077', tier: 'AAA' },
  '1245620': { name: 'Elden Ring', tier: 'AAA' },
  '3240220': { name: 'Black Myth: Wukong', tier: 'AAA' },
  '1085660': { name: 'Destiny 2', tier: 'AAA' },
  '230410': { name: 'Warframe', tier: 'AAA' },
  '359550': { name: 'Rainbow Six Siege', tier: 'AAA' },
  '1086940': { name: 'Baldur\'s Gate 3', tier: 'AAA' },
  '582010': { name: 'Monster Hunter: World', tier: 'AAA' },
  '1174180': { name: 'Red Dead Redemption 2', tier: 'AAA' },

  // --- AA / VIRAL HITS ---
  '553850': { name: 'Helldivers 2', tier: 'AA' },
  '1623730': { name: 'Palworld', tier: 'AA' },
  '381210': { name: 'Dead by Daylight', tier: 'AA' },
  '252490': { name: 'Rust', tier: 'AA' },
  '252950': { name: 'Rocket League', tier: 'AA' },
  '264710': { name: 'Subnautica', tier: 'AA' },
  '108600': { name: 'Project Zomboid', tier: 'AA' },
  '221100': { name: 'DayZ', tier: 'AA' },

  // --- INDIE GEMS ---
  '1145360': { name: 'Hades', tier: 'Indie' },
  '413150': { name: 'Stardew Valley', tier: 'Indie' },
  '367520': { name: 'Hollow Knight', tier: 'Indie' },
  '945360': { name: 'Among Us', tier: 'Indie' },
  '105600': { name: 'Terraria', tier: 'Indie' },
  '1966720': { name: 'Lethal Company', tier: 'Indie' },
  '739630': { name: 'Phasmophobia', tier: 'Indie' },
  '1794680': { name: 'Vampire Survivors', tier: 'Indie' },
  '427520': { name: 'Factorio', tier: 'Indie' },
  '294100': { name: 'RimWorld', tier: 'Indie' },
  '250900': { name: 'Isaac Rebirth', tier: 'Indie' },
  '632360': { name: 'Risk of Rain 2', tier: 'Indie' }
};

const POPULAR_GAME_IDS = Object.keys(GAME_DB);

// Helper to get RICH media for each specific game (Video, Art, Screenshots)
export const fetchGameMedia = async () => {
  try {
    // Only fetch media for the AAA and AA titles to save bandwidth (leave Indies to fallback)
    const priorityIds = Object.keys(GAME_DB).filter(id => GAME_DB[id].tier !== 'Indie');

    const mediaPromises = priorityIds.map(async (id) => {
      try {
        // Fetch Screenshots and Artworks in parallel
        const [screenRes, artRes] = await Promise.all([
          steamClient.get(`/media/screenshots/${id}`, { params: { limit: 4 } }).catch(() => ({ data: {} })),
          steamClient.get(`/media/artworks/${id}`, { params: { limit: 4 } }).catch(() => ({ data: {} }))
        ]);

        const screenshots = screenRes.data?.data?.screenshot || [];
        const artworks = artRes.data?.data?.artworks || [];

        // Combine and shuffle slightly
        const assets = [...artworks, ...screenshots];
        if (assets.length === 0) return null;

        return {
          id,
          assets: assets.filter(url => typeof url === 'string') // ensure valid URLs
        };
      } catch (e) {
        return null;
      }
    });

    const results = await Promise.all(mediaPromises);

    // Convert array to Map: { '730': ['url1', 'url2'], ... }
    const mediaMap = {};
    results.forEach(res => {
      if (res) {
        mediaMap[res.id] = res.assets;
      }
    });

    return mediaMap;

  } catch (error) {
    console.error("Failed to fetch game media:", error);
    return {};
  }
};

export const fetchGameNews = async (limit = 300, offset = 0) => {
  try {
    const perGameLimit = Math.max(2, Math.ceil(limit / POPULAR_GAME_IDS.length));

    // 1. Fetch General News from 'all'
    const newsPromises = POPULAR_GAME_IDS.map(async (id) => {
      try {
        const res = await steamClient.get(`/news/all/${id}`, { params: { limit: perGameLimit } });
        const items = res.data?.data?.news || [];
        return items.map(item => ({
          ...item,
          gameId: id,
          gameName: GAME_DB[id].name,
          tier: GAME_DB[id].tier,
          type: 'General'
        }));
      } catch (e) {
        return [];
      }
    });

    // 2. Fetch Official Announcements (simulated Broadcasts)
    const announcementIds = ['3240220', '730', '553850']; // Targeted ID subset
    const announcementPromises = announcementIds.map(async (id) => {
      try {
        const res = await steamClient.get(`/news/announcements/${id}`, { params: { limit: 5 } });
        const items = res.data?.data?.announcements || [];
        return items.map(item => ({
          ...item,
          gameId: id,
          gameName: GAME_DB[id].name,
          tier: GAME_DB[id].tier,
          type: 'Announcement'
        }));
      } catch (e) {
        return [];
      }
    });

    const results = await Promise.all([...newsPromises, ...announcementPromises]);
    const allRawItems = results.flat();

    // Dedup
    const seenIds = new Set();
    const uniqueNews = allRawItems.filter(item => {
      const id = item.gid || item.news_title;
      if (seenIds.has(id)) return false;
      seenIds.add(id);
      return true;
    });

    // Sort by date descending
    return uniqueNews.sort((a, b) => {
      const dateA = a.date ? new Date(a.date * 1000) : new Date(0);
      const dateB = b.date ? new Date(b.date * 1000) : new Date(0);
      return dateB - dateA;
    });

  } catch (error) {
    console.error("Failed to fetch game news:", error);
    return [];
  }
};
