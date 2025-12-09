import cyberCover from '../assets/games/cyber_battle_cover_1765272102687.png';
import fantasyCover from '../assets/games/fantasy_quest_cover_1765272175879.png';
import speedCover from '../assets/games/speed_racer_cover_1765272144559.png';

// Note: Ensure the filenames match exactly what was generated.
// I'll use a dynamic import approach or just assume names based on the generation output if possible, 
// but since I can't see the exact timestamp in the CodeContent generation time easily without checking, 
// I will list the directory first to get exact names if I want to be 100% sure. 
// BUT, I can see the filenames in the previous tool outputs.
// cyber_battle_cover_1765272102687.png
// speed_racer_cover_1765272144559.png
// fantasy_quest_cover_1765272175879.png

export const games = [
  {
    id: 'cyber-battle',
    title: 'Cyber Battle',
    publisher: 'Neon Studios',
    image: cyberCover,
    category: 'RPG',
    popular: true,
  },
  {
    id: 'fantasy-quest',
    title: 'Fantasy Quest',
    publisher: 'Mystic Games',
    image: fantasyCover,
    category: 'MMORPG',
    popular: true,
  },
  {
    id: 'speed-racer',
    title: 'Speed Racer',
    publisher: 'Turbo Arts',
    image: speedCover,
    category: 'Racing',
    popular: false,
  },
  {
    id: 'mobile-legends',
    title: 'Mobile Legends',
    publisher: 'Moonton',
    image: 'https://placehold.co/300x400/1e1e1e/FFF?text=Mobile+Legends', // Fallback for real game
    category: 'MOBA',
    popular: true,
  }
];
