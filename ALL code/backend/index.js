import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import * as paymentController from './controllers/paymentController.js';
import * as gameController from './controllers/gameController.js';
import * as notificationController from './controllers/notificationController.js';

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

// In-memory storage
const users = new Map(); // userId -> call (stream)
const admins = new Map(); // adminId -> call (stream)
const adminStatus = 'ONLINE'; // 'ONLINE' | 'OFFLINE'

console.log('[Server] Integration Controllers Loaded:', {
  payment: !!paymentController,
  game: !!gameController,
  notif: !!notificationController
});

// Smart Bot Logic
// Intelligent Bot Logic
import Fuse from 'fuse.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const knowledgeBase = require('./data/bot_knowledge.json');

const fuse = new Fuse(knowledgeBase, {
  keys: ['keywords'],
  threshold: 0.4, // Sensitivity for typo tolerance (0.0 = exact, 1.0 = match anything)
  distance: 100
});

function handleBotResponse(call, userMsg) {
  const lowerMsg = userMsg.content.toLowerCase();
  let replyText = "";

  // 1. Fuzzy Search in Knowledge Base
  const results = fuse.search(lowerMsg);

  if (results.length > 0) {
    replyText = results[0].item.answer;
  }
  // 2. Handle Specific Commands (Multi-step Logic placeholder)
  else if (lowerMsg.startsWith("cek trx")) {
    const trxId = lowerMsg.split(" ")[1];
    if (trxId) {
      replyText = `🔍 **Status Pesanan ${trxId}:**\n✅ SUCCESS\nItem: 100 Diamonds\nDate: Just now`;
    } else {
      replyText = "Mohon masukkan nomor transaksi. Contoh: **'Cek TRX 12345'**";
    }
  }
  // 3. Fallback
  else {
    replyText = "🤖 Maaf, saya kurang mengerti. Coba gunakan kata kunci seperti **'Cara Top Up'**, **'Refund'**, atau ketik **'Admin'** untuk bantuan manusia.";
  }

  const botMsg = {
    id: Date.now().toString(),
    sender_id: 'bot-001',
    sender_type: 'BOT',
    content: replyText,
    timestamp: new Date().toISOString()
  };

  call.write(botMsg);
  console.log(`[BOT REPLIED] to ${userMsg.sender_id}: ${replyText.substring(0, 30)}...`);
}

// RPC Implementations
function joinChat(call) {
  const user = call.request;
  console.log(`User joined: ${user.username} (${user.role})`);

  if (user.role === 'ADMIN') {
    admins.set(user.id, call);
  } else {
    users.set(user.id, call);
    call.write({
      id: Date.now().toString(),
      sender_id: 'system',
      sender_type: 'BOT',
      content: 'Connected to GamerZone Secure Chat.',
      timestamp: new Date().toISOString()
    });
  }

  call.on('end', () => {
    if (user.role === 'ADMIN') admins.delete(user.id);
    else users.delete(user.id);
    console.log(`User disconnected: ${user.username}`);
  });
}

function sendMessage(call, callback) {
  const msg = call.request;
  console.log(`Received message from ${msg.sender_type} (${msg.sender_id}): ${msg.content}`);
  console.log(`Receiver ID: ${msg.receiver_id || 'not specified'}`);

  if (msg.sender_type === 'USER') {
    // User sending to admin
    if (adminStatus === 'ONLINE' && admins.size > 0) {
      // Forward to all admins
      admins.forEach((adminCall) => {
        adminCall.write(msg);
      });
      console.log(`[Server] Message forwarded to ${admins.size} admin(s)`);

      // Set timeout for bot fallback if admin doesn't respond within 30 seconds
      setTimeout(() => {
        // Check if admin has replied (you could enhance this with actual tracking)
        // For now, just log that timeout occurred
        console.log(`[Server] Admin response timeout for user ${msg.sender_id}`);
      }, 30000);
    } else {
      // No admin online, trigger bot response
      const userCall = users.get(msg.sender_id);
      if (userCall) {
        handleBotResponse(userCall, msg);
      }
    }
  } else if (msg.sender_type === 'ADMIN') {
    // Admin sending to specific user
    const targetUserId = msg.receiver_id;

    if (targetUserId && users.has(targetUserId)) {
      // Send to specific user
      const userCall = users.get(targetUserId);
      userCall.write(msg);
      console.log(`[Server] Admin message sent to user ${targetUserId}`);
    } else if (targetUserId) {
      // User not connected, store message or notify admin
      console.log(`[Server] Target user ${targetUserId} not connected`);
    } else {
      // Broadcast to all users (fallback)
      users.forEach((userCall) => {
        userCall.write(msg);
      });
      console.log(`[Server] Admin message broadcast to ${users.size} user(s)`);
    }
  }

  callback(null, { success: true, message: 'Sent' });
}

function receiveMessage(_call) {
  // Stream already handled
}

function main() {
  const server = new grpc.Server();
  server.addService(chatProto.ChatService.service, {
    JoinChat: joinChat,
    SendMessage: sendMessage,
    ReceiveMessage: receiveMessage
  });

  // Changed to 127.0.0.1 to avoid binding errors on Windows
  const PORT = '127.0.0.1:50051';
  server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
      console.error(`Failed to bind to ${PORT}:`, err);
      process.exit(1);
    }
    console.log(`gRPC Server running at ${PORT}`);
    server.start();
  });
}

main();
