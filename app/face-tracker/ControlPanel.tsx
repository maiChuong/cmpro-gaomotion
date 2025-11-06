'use client';

import { useState } from 'react';

type Props = {
  onModeChange?: (mode: 'webcam' | 'crop' | '3d') => void;
  onStyleChange?: (options: { showMesh: boolean; showAxis: boolean }) => void;
};

export default function ControlPanel({ onModeChange, onStyleChange }: Props) {
  const [mode, setMode] = useState<'webcam' | 'crop' | '3d'>('webcam');
  const [showMesh, setShowMesh] = useState(true);
  const [showAxis, setShowAxis] = useState(true);

  const handleChange = (newMode: 'webcam' | 'crop' | '3d') => {
    setMode(newMode);
    if (onModeChange) onModeChange(newMode);
  };

  const toggleMesh = () => {
    const updated = !showMesh;
    setShowMesh(updated);
    if (onStyleChange) onStyleChange({ showMesh: updated, showAxis });
  };

  const toggleAxis = () => {
    const updated = !showAxis;
    setShowAxis(updated);
    if (onStyleChange) onStyleChange({ showMesh, showAxis: updated });
  };

  return (
    <div className="mt-6 flex flex-col gap-4 items-center justify-center text-white">
      <div className="flex gap-4">
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

      <div className="flex gap-4">
        <button
          onClick={toggleMesh}
          className={`px-3 py-1 rounded ${
            showMesh ? 'bg-green-600' : 'bg-gray-700'
          } hover:bg-green-700 transition`}
        >
          Mesh {showMesh ? '✓' : ''}
        </button>
        <button
          onClick={toggleAxis}
          className={`px-3 py-1 rounded ${
            showAxis ? 'bg-purple-600' : 'bg-gray-700'
          } hover:bg-purple-700 transition`}
        >
          Axis {showAxis ? '✓' : ''}
        </button>
      </div>
    </div>
  );
}
