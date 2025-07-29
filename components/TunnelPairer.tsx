'use client';

import React, { useState } from 'react';

// Define the possible connection statuses for the tunnel
export type TunnelStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

interface TunnelPairerProps {
  status: TunnelStatus;
  error?: string | null;
  onConnect: (url: string) => void;
  onDisconnect: () => void;
}

const TunnelPairer: React.FC<TunnelPairerProps> = ({
  status,
  error,
  onConnect,
  onDisconnect,
}) => {
  const [url, setUrl] = useState('');

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onConnect(url.trim());
    }
  };

  return (
    <div className="p-6 border rounded-lg w-full max-w-md shadow-md bg-white dark:bg-neutral-900">
      <h2 className="text-xl font-semibold mb-4">Blender Tunnel Connection</h2>

      {isConnected ? (
        <div className="text-center">
          <p className="text-green-500 mb-4 font-medium">Status: Connected</p>
          <button
            onClick={onDisconnect}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label htmlFor="tunnel-url" className="block text-sm font-medium mb-1">
              Paste Tunnel URL
            </label>
            <input
              id="tunnel-url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="wss://your-tunnel-url.io"
              disabled={isConnecting}
              className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:ring-ring focus:ring-2 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isConnecting || !url.trim()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 transition-colors"
          >
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default TunnelPairer;