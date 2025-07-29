'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import Link from 'next/link';

// Mock hook for demonstration purposes
type Status = 'disconnected' | 'connecting' | 'connected' | 'error';
const useConnection = () => {
  const [status, setStatus] = useState<Status>('disconnected');
  const connect = () => {
    setStatus('connecting');
    setTimeout(() => setStatus('connected'), 2000);
  };
  const disconnect = () => setStatus('disconnected');
  return { status, connect, disconnect };
};

export default function HomePage() {
  const t = useTranslations('HomePage');
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('8080');
  const { status, connect, disconnect } = useConnection();

  const handleConnect = () => {
    if (status === 'connected') {
      disconnect();
    } else {
      connect();
    }
  };

  return (
    <PageLayout>
      <div className="w-full max-w-2xl p-6 mx-auto bg-card rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-muted-foreground mb-6">{t('subtitle')}</p>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="host">{t('hostLabel')}</Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="e.g., localhost"
                disabled={status === 'connecting' || status === 'connected'}
              />
            </div>
            <div className="w-full sm:w-32">
              <Label htmlFor="port">{t('portLabel')}</Label>
              <Input
                id="port"
                type="number"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="e.g., 8080"
                disabled={status === 'connecting' || status === 'connected'}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              onClick={handleConnect}
              disabled={status === 'connecting'}
              loading={status === 'connecting'}
              variant={status === 'connected' ? 'destructive' : 'primary'}
            >
              {status === 'connecting'
                ? 'Connecting...'
                : status === 'connected'
                ? 'Disconnect'
                : 'Connect to Blender'}
            </Button>

            <div
              className="flex items-center gap-1.5"
              title={`Tunnel status: ${status}`}
            >
              <span
                className={`h-3 w-3 rounded-full transition-colors ${
                  status === 'connected'
                    ? 'bg-success'
                    : status === 'connecting'
                    ? 'bg-yellow-500 animate-pulse'
                    : status === 'error'
                    ? 'bg-destructive'
                    : 'bg-muted-foreground'
                }`}
              />
              <span className="text-sm font-medium capitalize text-muted-foreground">
                {status}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">{t('capturePrompt')}</p>
          <Button asChild variant="link" className="text-lg">
            <Link href="/capture">{t('captureLink')}</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
