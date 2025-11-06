'use client';

import { useState } from 'react';

type Props = {
  onModeChange?: (mode: 'webcam' | 'crop' | '3d') => void;
  onStyleChange?: (options: {
    showDots: boolean;
    showMesh: boolean;
    showAxis: boolean;
    showContours: boolean;
  }) => void;
};

export default function ControlPanel({ onModeChange, onStyleChange }: Props) {
  const [mode, setMode] = useState<'webcam' | 'crop' | '3d'>('webcam');
  const [style, setStyle] = useState<'dots' | 'mesh+axis' | 'contours'>('mesh+axis');

  const handleModeChange = (newMode: 'webcam' | 'crop' | '3d') => {
    setMode(newMode);
    if (onModeChange) onModeChange(newMode);
  };

  const handleStyleChange = (newStyle: 'dots' | 'mesh+axis' | 'contours') => {
    setStyle(newStyle);
    if (onStyleChange) {
      onStyleChange({
        showDots: newStyle === 'dots' || newStyle === 'mesh+axis',
        showMesh: newStyle === 'mesh+axis',
        showAxis: newStyle === 'mesh+axis',
        showContours: newStyle === 'contours',
      });
    }
  };

  return (
    <div className="mt-6 flex flex-col gap-4 items-center justify-center text-white">
      {/* Mode Buttons */}
      <div className="flex gap-4">
        {['webcam', 'crop', '3d'].map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m as any)}
            className={`px-4 py-2 rounded ${
              mode === m ? 'bg-blue-600' : 'bg-gray-700'
            } hover:bg-blue-700 transition`}
          >
            {m === 'webcam' ? 'Webcam View' : m === 'crop' ? 'Cropped Face' : '3D Model'}
          </button>
        ))}
      </div>

      {/* Style Dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="styleSelect" className="text-sm">Style:</label>
        <select
          id="styleSelect"
          value={style}
          onChange={(e) => handleStyleChange(e.target.value as any)}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          <option value="dots">Dots only</option>
          <option value="mesh+axis">Mesh + Axis</option>
          <option value="contours">Contours</option>
        </select>
      </div>
    </div>
  );
}
