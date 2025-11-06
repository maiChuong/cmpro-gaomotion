'use client';

import { useState } from 'react';

type Props = {
  onModeChange?: (mode: 'webcam' | 'crop' | '3d') => void;
};

export default function ControlPanel({ onModeChange }: Props) {
  const [mode, setMode] = useState<'webcam' | 'crop' | '3d'>('webcam');

  const handleChange = (newMode: 'webcam' | 'crop' | '3d') => {
    setMode(newMode);
    if (onModeChange) {
      onModeChange(newMode);
    }
  };

  return (
    <div className="mt-6 flex gap-4 items-center justify-center text-white">
      <button
        onClick={() => handleChange('webcam')}
        className={`px-4 py-2 rounded ${
          mode === 'webcam' ? 'bg-blue-600' : 'bg-gray-700'
        } hover:bg-blue-700 transition`}
      >
        Webcam View
      </button>
      <button
        onClick={() => handleChange('crop')}
        className={`px-4 py-2 rounded ${
          mode === 'crop' ? 'bg-blue-600' : 'bg-gray-700'
        } hover:bg-blue-700 transition`}
      >
        Cropped Face
      </button>
      <button
        onClick={() => handleChange('3d')}
        className={`px-4 py-2 rounded ${
          mode === '3d' ? 'bg-blue-600' : 'bg-gray-700'
        } hover:bg-blue-700 transition`}
      >
        3D Model
      </button>
    </div>
  );
}
