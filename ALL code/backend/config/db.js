import mongoose from 'mongoose';

import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async (retries = 5) => {
  while (retries > 0) {
    try {
      // Replace with your local MongoDB URI or Atlas URI
      const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gamerzone';
      console.log(`[MongoDB] Connecting to: ${uri}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000 // Fail quickly if server is down so we can retry
      });

      console.log(`[MongoDB] Connected: ${conn.connection.host}`);
      console.log(`[MongoDB] Database: ${conn.connection.name}`);
      return; // Success
    } catch (error) {
      retries -= 1;
      console.error(`[MongoDB] Connection Failed: ${error.message}`);

      if (retries === 0) {
        console.warn('[MongoDB] Local connection failed. Starting In-Memory Fallback...');
        try {
          const mongod = await MongoMemoryServer.create();
          const uri = mongod.getUri();
          await mongoose.connect(uri);
          console.log(`[MongoDB] Connected to In-Memory Database: ${uri}`);
          console.warn('[MongoDB] WARNING: Data is not persistent!');
          return;
        } catch (memErr) {
          console.error('[MongoDB] In-Memory Fallback failed:', memErr);
          process.exit(1);
        }
      } else {
        console.log(`[MongoDB] Retrying connection in 2 seconds... (${retries} attempts left)`);
        await new Promise(res => setTimeout(res, 2000));
      }
    }
  }
};

let nativeConn = null;

export const getNativeConnection = async () => {
  if (nativeConn) return nativeConn;

  const uri = 'mongodb://127.0.0.1:27017/gamerzone';
  console.log(`[MongoDB] Creating Native Connection to: ${uri} (Mongoose: ${mongoose.version})`);

  const conn = await mongoose.createConnection(uri).asPromise();
  nativeConn = conn;

  conn.on('close', () => { nativeConn = null; });

  console.log(`[MongoDB] Native Connection Established: ${conn.host}`);

  // MAGIC FIX: Briefly connect to secondary DB to stabilize the driver?
  try {
    const magicUri = 'mongodb://127.0.0.1:27017/topup-game';
    const magicConn = await mongoose.createConnection(magicUri).asPromise();
    await magicConn.close();
    console.log('[MongoDB] Magic Fix Applied');
  } catch (e) {
    console.warn('[MongoDB] Magic Fix Warning:', e.message);
  }

  return conn;
};

export default connectDB;
