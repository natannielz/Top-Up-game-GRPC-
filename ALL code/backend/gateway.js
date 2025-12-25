
import dotenv from 'dotenv';
import path from 'path';
console.log('[Gateway] CWD:', process.cwd());
const result = dotenv.config({ path: path.resolve(process.cwd(), '.env') });
console.log('[Gateway] Dotenv Result:', result.error ? result.error : 'Success');
console.log('[Gateway] API Key Loaded:', process.env.GAMESPOT_API_KEY ? 'YES' : 'NO');
console.log('[Gateway] Key Preview:', process.env.GAMESPOT_API_KEY ? process.env.GAMESPOT_API_KEY.substring(0, 5) : 'N/A');

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';

import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Controllers
import * as TransactionController from './controllers/TransactionController.js';
import * as NewsController from './controllers/NewsController.js';
import * as GamesController from './controllers/GamesController.js';

// Local CRUD Controllers for Admin
import * as LocalGamesController from './controllers/LocalGamesController.js';

import * as SystemController from './controllers/SystemController.js';

const app = express();
const PORT = 3002;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// gRPC Setup
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROTO_PATH = path.join(__dirname, 'chat.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
});
const chatProto = grpc.loadPackageDefinition(packageDefinition).chat;

// gRPC Client
const client = new chatProto.ChatService('127.0.0.1:50051', grpc.credentials.createInsecure());

console.log('[Gateway] Connected to gRPC Server at localhost:50051');

// --- ROUTES ---

// 1. Send Message (HTTP POST -> gRPC Unary)
app.post('/api/chat/send', (req, res) => {
  const { sender_id, sender_type, content, receiver_id } = req.body;

  const message = {
    id: Date.now().toString(),
    sender_id: String(sender_id),
    sender_type,
    content,
    timestamp: new Date().toISOString(),
    receiver_id: receiver_id ? String(receiver_id) : ''
  };

  client.SendMessage(message, (err, response) => {
    if (err) {
      console.error('[Gateway] SendMessage Error:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(response);
  });
});

// 2. Join Chat (HTTP GET SSE -> gRPC Stream)
app.get('/api/chat/join', (req, res) => {
  const { id, username, role } = req.query;

  // SSE Headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  const user = { id, username, role };
  console.log(`[Gateway] User joining via SSE: ${username}`);

  // Call gRPC Stream
  const stream = client.JoinChat(user);

  // Relay gRPC Data to SSE
  stream.on('data', (msg) => {
    // SSE Format: "data: <json>\n\n"
    res.write(`data: ${JSON.stringify(msg)}\n\n`);
  });

  stream.on('end', () => {
    console.log(`[Gateway] Stream ended for ${username}`);
    res.end();
  });

  stream.on('error', (err) => {
    console.error(`[Gateway] Stream error for ${username}:`, err);
    res.write(`event: error\ndata: ${JSON.stringify({ message: 'Upstream gRPC connection failed', details: err.message })}\n\n`);
    res.end();
  });

  // Client disconnects
  req.on('close', () => {
    console.log(`[Gateway] Client disconnected SSE: ${username}`);
    stream.cancel();
  });
});

// 3. Transaction API
// 3. Transaction API
app.post('/api/v1/transaction/create', LocalGamesController.createTransaction);

// 4. News API
app.get('/api/news', NewsController.getGameNews);



// 6. GameSpot API - Games
app.get('/api/gamespot/games', GamesController.getGamesByGenre);
app.get('/api/catalog', GamesController.getGamesByGenre); // Alias for User Requirement
app.get('/api/gamespot/games/search', GamesController.searchGames);
app.get('/api/catalog/game/:id', GamesController.getGameById); // Single Game Details





// --- NEW ADMIN CRUD ROUTES (Local DB) ---

// Game Management
app.get('/api/admin/games', LocalGamesController.getLocalGames);
app.post('/api/admin/games', LocalGamesController.createGame);
app.put('/api/admin/games/:id', LocalGamesController.updateGame);
app.delete('/api/admin/games/:id', LocalGamesController.deleteGame);

// Transaction Management (Fix for Admin)
app.get('/api/admin/transactions', LocalGamesController.getTransactions); // NEW: Fetch transactions
app.put('/api/admin/transactions/:id/status', LocalGamesController.updateTransactionStatus);



// System Status
app.get('/api/admin/status', SystemController.getSystemStatus);

// Debug Route
app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', routes: ['/api/admin/games'] });
});

app.listen(PORT, () => {
  console.log(`[Gateway] HTTP Proxy running at http://localhost:${PORT}`);
});
