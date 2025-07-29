'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { useTunnelStore } from '@/store/tunnelStore';
import { useSettingsStore } from '@/store/settingsStore';
import { TunnelStatus } from '@/lib/tunnel-sync';
import { rigOptions } from '@/config/rigs';
import { CopyIcon } from '@/components/ui/CopyIcon';
import { CheckIcon } from '@/components/ui/CheckIcon';

export default function SettingsPage() {
  // Global state for tunnel configuration
  const { url, setUrl, status, connect, disconnect } = useTunnelStore();
  const { selectedRig, setSelectedRig } = useSettingsStore();
  const [isCopied, setIsCopied] = useState(false);

  const handleConnect = () => {
    if (status === 'connected') {
      disconnect();
    } else {
      connect();
    }
  };

  const handleCopy = () => {
    if (isCopied) return;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success('URL copied to clipboard!');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        toast.error('Failed to copy URL.');
        console.error('Failed to copy: ', err);
      });
  };

  const handleSaveSettings = () => {
    // All settings are now managed by Zustand and are saved on change.
    // This button can simply provide user feedback.
    toast.success('Settings have been saved automatically.');
  };

  return (
    <PageLayout>
      <div className="w-full max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <Link href="/" className="text-sm text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        {/* Tunnel Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Tunnel Configuration</h2>
          <div>
            <label htmlFor="tunnel-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tunnel URL
            </label>
            <div className="flex gap-2">
              <input
                id="tunnel-url"
                type="text"
                placeholder="ws://localhost:8765"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                disabled={status === 'connecting' || status === 'connected'}
              />
              <Button
                onClick={handleCopy}
                variant="outline"
                size="icon"
                title="Copy URL"
              >
                {isCopied ? <CheckIcon className="text-green-500" /> : <CopyIcon />}
              </Button>
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
          <div>
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status: </span>
            <span className={`text-sm font-bold ${
              status === 'connected' ? 'text-green-500' :
              status === 'connecting' ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {status}
            </span>
          </div>
        </div>

        {/* Rigify Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Rig Configuration</h2>
          <div>
            <label htmlFor="rig-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rigify Metarig Selection
            </label>
            <select
              id="rig-select"
              value={selectedRig}
              onChange={(e) => setSelectedRig(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {rigOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={handleSaveSettings}
            variant="success"
            className="w-full"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}