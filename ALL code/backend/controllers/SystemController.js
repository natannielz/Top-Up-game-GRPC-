import mongoose from 'mongoose';

// System Diagnostics
export const getSystemStatus = async (req, res) => {
  try {
    // 1. Database Status
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';

    // 2. Server Uptime
    const uptime = process.uptime();

    res.status(200).json({
      database: dbStatus,
      serverUptime: uptime,
      gameSpotAPI: {
        status: process.env.GAMESPOT_API_KEY ? 'Online' : 'Offline',
        latency: 0 // Mock latency for now
      },
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
