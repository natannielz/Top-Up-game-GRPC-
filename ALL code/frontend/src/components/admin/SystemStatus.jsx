import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCw, Database, Server, Globe } from 'lucide-react';

const SystemStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3002/api/admin/status');
      setStatus(response.data);
    } catch (err) {
      setError('Failed to fetch system status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white text-lg">System Diagnostics</h3>
        <button
          onClick={checkStatus}
          disabled={loading}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="p-4 bg-red-500/20 text-red-100 rounded-lg">{error}</div>
      ) : !status ? (
        <div className="text-gray-400">Loading diagnostics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Database Status */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${status.database === 'Connected' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
              <Database size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold">MongoDB Status</div>
              <div className="text-lg font-bold text-white">{status.database}</div>
            </div>
          </div>

          {/* API Status */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${status.gameSpotAPI?.status === 'Online' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <Globe size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold">GameSpot API</div>
              <div className="text-lg font-bold text-white">{status.gameSpotAPI?.status || 'N/A'}</div>
              <div className="text-xs text-gray-500">{status.gameSpotAPI?.latency || 0}ms latency</div>
            </div>
          </div>

          {/* Server Uptime */}
          <div className="bg-white/5 p-4 rounded-lg border border-white/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-purple-500/20 text-purple-400">
              <Server size={24} />
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase font-semibold">Server Uptime</div>
              <div className="text-lg font-bold text-white">{Math.floor(status.serverUptime / 60)}m {Math.floor(status.serverUptime % 60)}s</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemStatus;
