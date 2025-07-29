import { create } from 'zustand';
import { TunnelSyncService, TunnelStatus } from '@/lib/tunnel-sync';
import { persist } from 'zustand/middleware';

interface TunnelState {
  service: TunnelSyncService | null;
  status: TunnelStatus;
  url: string;
  setUrl: (url: string) => void;
  connect: () => void;
  disconnect: () => void;
}

export const useTunnelStore = create<TunnelState>()(
  persist(
    (set, get) => ({
      service: null,
      status: 'disconnected',
      url: 'ws://localhost:8765',
      setUrl: (url: string) => set({ url }),
      connect: () => {
        const { service, url } = get();
        // If service exists, it might be in a reconnect loop. Just call connect.
        if (service) {
          service.connect();
          return;
        }

        try {
          const newService = new TunnelSyncService(url, (status) => {
            set({ status });
          });
          set({ service: newService });
          newService.connect();
        } catch (error: any) {
          console.error('Failed to initialize tunnel service:', error);
          set({ status: 'error' });
        }
      },
      disconnect: () => {
        get().service?.disconnect();
        set({ service: null, status: 'disconnected' });
      },
    }),
    { name: 'gaomotion-tunnel-storage', partialize: (state) => ({ url: state.url }) },
  ),
);
