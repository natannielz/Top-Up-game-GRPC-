import mlbbImg from '../assets/games/mlbb.png';
import pubgmImg from '../assets/games/pubgm.png';
import codmImg from '../assets/games/codm.png';
import genshinImg from '../assets/games/genshin.png';
import freefireImg from '../assets/games/freefire.png';

// In a real app, these would be URLs or imported assets
const eldenRingImg = "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop";
const gta5Img = "https://images.unsplash.com/photo-1588609072979-4a004b5f884a?q=80&w=2669&auto=format&fit=crop";
const gowImg = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=2047&auto=format&fit=crop";
const ff16Img = "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop";

export const games = [
  // --- TYPE A: TOP-UP SERVICES ---
  {
    id: 'mlbb',
    type: 'TOPUP',
    title: 'Mobile Legends: Bang Bang',
    publisher: 'Moonton',
    price: 3000,
    image: mlbbImg,
    category: 'MOBA',
    rating: 4.8,
    currency: 'Diamonds',
    denominations: [], // Loaded dynamically in typical app, but implied here
  },
  {
    id: 'pubgm',
    type: 'TOPUP',
    title: 'PUBG Mobile',
    publisher: 'Tencent Games',
    price: 15000,
    image: pubgmImg,
    category: 'Battle Royale',
    rating: 4.6,
    currency: 'UC'
  },
  {
    id: 'codm',
    type: 'TOPUP',
    title: 'Call of Duty: Mobile',
    publisher: 'Activision',
    price: 12000,
    image: codmImg,
    category: 'FPS',
    rating: 4.7,
    currency: 'CP'
  },
  {
    id: 'genshin',
    type: 'TOPUP',
    title: 'Genshin Impact',
    publisher: 'HoYoverse',
    price: 16000,
    image: genshinImg,
    category: 'RPG',
    rating: 4.9,
    currency: 'Crystals'
  },
  {
    id: 'ff',
    type: 'TOPUP',
    title: 'Free Fire',
    publisher: 'Garena',
    price: 5000,
    image: freefireImg,
    category: 'Battle Royale',
    rating: 4.5,
    currency: 'Diamonds'
  },

  // --- TYPE B: GAME SALES (License Keys) ---
  {
    id: 'elden-ring',
    type: 'GAME',
    title: 'Elden Ring',
    publisher: 'Bandai Namco',
    price: 599000,
    originalPrice: 799000,
    image: eldenRingImg,
    category: 'RPG',
    rating: 4.9,
    description: 'THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.',
    systemReqs: {
      os: 'Windows 10',
      cpu: 'Intel Core i5-8400',
      gpu: 'NVIDIA GeForce GTX 1060 3GB',
      storage: '60 GB'
    },
    gallery: [eldenRingImg],
    licenseKeys: ['ER-XXXX-YYYY-ZZZZ', 'ER-AAAA-BBBB-CCCC'] // Mock Inventory
  },
  {
    id: 'gow-ragnarok',
    type: 'GAME',
    title: 'God of War Ragnarök',
    publisher: 'Sony Interactive',
    price: 879000,
    originalPrice: 1029000,
    image: gowImg,
    category: 'Action',
    rating: 5.0,
    description: 'Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world.',
    systemReqs: {
      os: 'Windows 10 64-bit',
      cpu: 'Intel i5-4670k',
      gpu: 'NVIDIA GTX 1060 (6GB)',
      storage: '190 GB'
    },
    gallery: [gowImg],
    licenseKeys: ['GOW-1111-2222-3333']
  },
  {
    id: 'gta-5',
    type: 'GAME',
    title: 'Grand Theft Auto V',
    publisher: 'Rockstar Games',
    price: 250000,
    originalPrice: 590000,
    image: gta5Img,
    category: 'Action',
    rating: 4.8,
    description: 'When a young street hustler, a retired bank robber and a terrifying psychopath find themselves entangled with some of the most frightening and deranged elements of the criminal underworld.',
    systemReqs: {
      os: 'Windows 10 64 Bit',
      cpu: 'Intel Core i5 3470',
      gpu: 'NVIDIA GTX 660 2GB',
      storage: '72 GB'
    },
    gallery: [gta5Img],
    licenseKeys: ['GTA-5555-6666-7777']
  },
  {
    id: 'ff16',
    type: 'GAME',
    title: 'Final Fantasy XVI',
    publisher: 'Square Enix',
    price: 729000,
    originalPrice: null,
    image: ff16Img,
    category: 'RPG',
    rating: 4.7,
    description: 'An epic dark fantasy action RPG where the fates of the land are decided by the Eikons and the Dominants who wield them.',
    systemReqs: {
      os: 'Windows 11',
      cpu: 'AMD Ryzen 5 1600',
      gpu: 'AMD Radeon RX 5700 XT',
      storage: '90 GB'
    },
    gallery: [ff16Img],
    licenseKeys: ['FF16-8888-9999-0000']
  }
];

