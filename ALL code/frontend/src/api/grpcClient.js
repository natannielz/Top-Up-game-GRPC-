// src/api/grpcClient.js

// REAL CLIENT connecting to Node.js Gateway (Bridge)
// Browser -> HTTP/SSE (Gateway) -> gRPC (Server)

const GATEWAY_URL = 'http://localhost:3002/api/chat';
const RECONNECT_INTERVAL = 3000; // 3 seconds
const MAX_RETRIES = 10;

class GrpcChatClient {
  constructor() {
    this.eventSource = null;
    this.listeners = [];
    this.statusListeners = [];
    this.connectionStatus = 'disconnected'; // 'connecting' | 'connected' | 'reconnecting' | 'error' | 'disconnected'
    this.retryCount = 0;
    this.reconnectTimer = null;
    this.currentUser = null;
  }

  // Get current connection status
  getStatus() {
    return this.connectionStatus;
  }

  // Subscribe to status changes
  onStatusChange(callback) {
    this.statusListeners.push(callback);
    // Immediately call with current status
    callback(this.connectionStatus);
    return () => {
      this.statusListeners = this.statusListeners.filter(cb => cb !== callback);
    };
  }

  // Update status and notify listeners
  setStatus(status) {
    this.connectionStatus = status;
    this.statusListeners.forEach(cb => cb(status));
  }

  // Join Chat via Server-Sent Events (SSE) with auto-reconnect
  joinChat(user) {
    this.currentUser = user;
    console.log('[Client] Connecting to Gateway as:', user.username);
    this.setStatus('connecting');

    this.connect(user);

    return {
      onMessage: (callback) => {
        this.listeners.push(callback);
      }
    };
  }

  // Internal connect method
  connect(user) {
    // Clear any existing reconnect timer
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Close existing connection if any
    if (this.eventSource) {
      this.eventSource.close();
    }

    // Construct Query String
    const params = new URLSearchParams({
      id: user.id || 'guest',
      username: user.username,
      role: user.role || 'USER'
    });

    try {
      // Connect SSE
      this.eventSource = new EventSource(`${GATEWAY_URL}/join?${params.toString()}`);

      // Handle successful connection
      this.eventSource.onopen = () => {
        console.log('[Client] SSE Connection established');
        this.setStatus('connected');
        this.retryCount = 0; // Reset retry count on successful connection
      };

      // Handle Incoming Messages
      this.eventSource.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          console.log('[Client] Received SSE Msg:', msg);
          this.listeners.forEach(cb => cb(msg));
        } catch (err) {
          console.error('[Client] Failed to parse SSE:', err);
        }
      };

      // Handle errors and auto-reconnect
      this.eventSource.onerror = (err) => {
        console.error('[Client] SSE Connection Error:', err);

        // Close the failed connection
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }

        // Check if we should retry
        if (this.retryCount < MAX_RETRIES) {
          this.retryCount++;
          this.setStatus('reconnecting');
          console.log(`[Client] Reconnecting in ${RECONNECT_INTERVAL / 1000}s... (Attempt ${this.retryCount}/${MAX_RETRIES})`);

          this.reconnectTimer = setTimeout(() => {
            if (this.currentUser) {
              this.connect(this.currentUser);
            }
          }, RECONNECT_INTERVAL);
        } else {
          console.error('[Client] Max retries reached. Connection failed.');
          this.setStatus('error');
        }
      };

    } catch (error) {
      console.error('[Client] Failed to create EventSource:', error);
      this.setStatus('error');
    }
  }

  // Manually trigger reconnect
  reconnect() {
    if (this.currentUser) {
      this.retryCount = 0;
      this.setStatus('connecting');
      this.connect(this.currentUser);
    }
  }

  // Disconnect
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.setStatus('disconnected');
    this.currentUser = null;
    this.listeners = []; // FIX: Clear listeners to prevent duplicates
  }

  // Send Message via HTTP POST with error handling
  async sendMessage(message) {
    console.log('[Client] Sending via Gateway:', message);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(`${GATEWAY_URL}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Gateway Error: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('[Client] Send timeout - server not responding');
        throw new Error('Connection timeout');
      }
      console.error('[Client] Send Failed:', error);
      throw error;
    }
  }
}

export const chatClient = new GrpcChatClient();
