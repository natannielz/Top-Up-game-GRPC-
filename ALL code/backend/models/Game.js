import mongoose from 'mongoose';

const gameSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: { type: String, required: true }, // e.g., 'FPS', 'MOBA'
  price: { type: Number, default: 0 }, // Base price (for GAME), 0 for TOPUP
  image: { type: String, required: true },
  originalId: { type: String }, // To map to GameSpot ID if needed
  platform: { type: String, default: 'PC' },
  gameType: {
    type: String,
    enum: ['GAME', 'TOPUP'],
    default: 'TOPUP',
    required: true
  }, // GAME = Purchase, TOPUP = In-game Currency
  // New field for Top-Up variants
  topUpOptions: [{
    label: { type: String, required: true }, // e.g. "100 Diamonds"
    value: { type: String, required: true }, // e.g. "100_diam"
    price: { type: Number, required: true }  // e.g. 15000
  }],
  status: { type: String, default: 'Active' }, // Active, Maintenance
}, {
  timestamps: true
});

const Game = mongoose.model('Game', gameSchema);

export default Game;
