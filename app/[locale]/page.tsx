// app/[locale]/page.tsx
'use client';

import React from 'react';
// import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { useTunnelStore } from '@/store/tunnelStore';
import { useSettingsStore } from '@/store/settingsStore';
import { PageLayout } from '@/components/layout/PageLayout';

export default function HomePage() {
  // const t = useTranslations('HomePage');
  const { captureMode, setCaptureMode } = useSettingsStore();
  // Sync with global store for tunnel URL
  const { url, setUrl, status, connect, disconnect } = useTunnelStore();

  const handleConnect = () => {
    if (status === 'connected') {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Gao<span className="text-primary">Motion</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            High-quality facial and full-body motion capture, right in your browser.
            <br />
            Live-sync with Blender or process existing video files.
          </p>
        </div>

        {/* Interactive Control Panel */}
        <div className="w-full max-w-lg p-8 space-y-6 border rounded-lg shadow-lg bg-background">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                1. Choose Capture Mode
              </label>
              <div className="flex gap-4">
                <Button
                  onClick={() => setCaptureMode('facial')}
                  variant={captureMode === 'facial' ? 'primary' : 'outline'}
                  className="w-full"
                >
                  Facial
                </Button>
                <Button
                  onClick={() => setCaptureMode('full-body')}
                  variant={captureMode === 'full-body' ? 'primary' : 'outline'}
                  className="w-full"
                >
                  Full Body
                </Button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="tunnel-url"
                  className="block text-sm font-medium text-muted-foreground"
                >
                  2. Input Tunnel URL (for Live Sync)
                </label>
                <div className="flex items-center gap-1.5" title={`Tunnel status: ${status}`}>
                  <span
                    className={`h-2.5 w-2.5 rounded-full transition-colors ${
                      status === 'connected' ? 'bg-success' :
                      status === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                      status === 'error' ? 'bg-destructive' :
                      'bg-muted-foreground'
                    }`}
                  ></span>
                  <span className="text-xs text-muted-foreground capitalize">{status}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  id="tunnel-url"
                  type="text"
                  placeholder="ws://localhost:8765 (optional)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-grow px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-ring bg-background"
                  disabled={status === 'connecting' || status === 'connected'}
                />
                <Button
                  onClick={handleConnect}
                  variant={status === 'connected' ? 'danger' : 'primary'}
                  className="w-28"
                  disabled={status === 'connecting'}
                >
                  {status === 'connecting' ? 'Connecting...' : status === 'connected' ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button href="/upload" variant="secondary" className="w-full">
              Upload Video
            </Button>
            <Button href="/capture" variant="primary" className="w-full">
              Start Live Capture
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
