import mongoose from 'mongoose';

const transactionSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    avatar: { type: String },
    game: { type: String, required: true },
    gameType: { type: String, default: 'TOPUP' },
    item: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    },
    date: { type: String }, // YYYY-MM-DD
    timestamp: { type: Date, default: Date.now },
    paymentMethod: { type: String },
    note: { type: String }
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
