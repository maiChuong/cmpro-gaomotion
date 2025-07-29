import { create } from 'zustand';
import { MediaPipeMode } from '@/services/motion/mediapipe';
import { persist } from 'zustand/middleware';

interface SettingsState {
  captureMode: MediaPipeMode;
  setCaptureMode: (mode: MediaPipeMode) => void;
  selectedRig: string;
  setSelectedRig: (rig: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      captureMode: 'full-body', // A sensible default
      selectedRig: 'human_metarig', // Default rig
      setCaptureMode: (mode) => set({ captureMode: mode }),
      setSelectedRig: (rig) => set({ selectedRig: rig }),
    }),
    { name: 'gaomotion-settings-storage' }, // localStorage key
  ),
);