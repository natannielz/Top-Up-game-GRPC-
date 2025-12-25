// Unified Server Entry Point
// Runs both the Express Gateway (API) and gRPC Server (Chat)

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('[Orchestrator] Starting GamerZone Backend Services...');

// 1. Start gRPC Server (Chat & Real-time)
const grpcProcess = spawn('node', [path.join(__dirname, 'index.js')], {
  stdio: 'inherit',
  shell: true
});

grpcProcess.on('error', (err) => {
  console.error('[Orchestrator] Failed to start gRPC Server:', err);
});

// 2. Start Express Gateway (HTTP API)
const gatewayProcess = spawn('node', [path.join(__dirname, 'gateway.js')], {
  stdio: 'inherit',
  shell: true
});

gatewayProcess.on('error', (err) => {
  console.error('[Orchestrator] Failed to start Gateway:', err);
});

// Handle Exit
process.on('SIGINT', () => {
  console.log('[Orchestrator] Stopping services...');
  grpcProcess.kill();
  gatewayProcess.kill();
  process.exit();
});
