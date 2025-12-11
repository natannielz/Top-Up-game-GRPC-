
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import * as TransactionController from './controllers/TransactionController.js';

const app = express();
const PORT = 3001;

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
const client = new chatProto.ChatService('localhost:50051', grpc.credentials.createInsecure());

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

  console.log('[Gateway] Sending message:', { from: sender_id, to: receiver_id, type: sender_type });

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
    res.end();
  });

  // Client disconnects
  req.on('close', () => {
    console.log(`[Gateway] Client disconnected SSE: ${username}`);
    stream.cancel();
  });
});

// 3. Transaction API (Dual Pipeline)
app.post('/api/transaction/pay', TransactionController.processTransaction);
app.get('/api/transaction/history', TransactionController.getHistory);

app.listen(PORT, () => {
  console.log(`[Gateway] HTTP Proxy running at http://localhost:${PORT}`);
});
