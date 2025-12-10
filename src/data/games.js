import mlbbImg from '../assets/games/mlbb.png';
import pubgmImg from '../assets/games/pubgm.png';
import codmImg from '../assets/games/codm.png';
import genshinImg from '../assets/games/genshin.png';
import freefireImg from '../assets/games/freefire.png';

export const games = [
  {
    id: 1,
    title: 'Mobile Legends: Bang Bang',
    publisher: 'Moonton',
    price: 3000,
    image: mlbbImg,
    category: 'MOBA',
    rating: 4.8,
    currency: 'Diamonds'
  },
  {
    id: 2,
    title: 'PUBG Mobile',
    publisher: 'Tencent Games',
    price: 15000,
    image: pubgmImg,
    category: 'Battle Royale',
    rating: 4.6,
    currency: 'UC'
  },
  {
    id: 3,
    title: 'Call of Duty: Mobile',
    publisher: 'Activision',
    price: 12000,
    image: codmImg,
    category: 'FPS',
    rating: 4.7,
    currency: 'CP'
  },
  {
    id: 4,
    title: 'Genshin Impact',
    publisher: 'HoYoverse',
    price: 16000,
    image: genshinImg,
    category: 'RPG',
    rating: 4.9,
    currency: 'Crystals'
  },
  {
    id: 5,
    title: 'Free Fire',
    publisher: 'Garena',
    price: 5000,
    image: freefireImg,
    category: 'Battle Royale',
    rating: 4.5,
    currency: 'Diamonds'
  }
];
