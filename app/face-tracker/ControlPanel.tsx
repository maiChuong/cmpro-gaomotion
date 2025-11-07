'use client';

import { useState } from 'react';

type ViewMode = 'webcam' | 'crop' | '3d';
type StyleMode = 'dots' | 'mesh+axis' | 'contours';

type Props = {
  onModeChange?: (mode: ViewMode) => void;
  onStyleChange?: (options: {
    showDots: boolean;
    showMesh: boolean;
    showAxis: boolean;
    showContours: boolean;
  }) => void;
};

export default function ControlPanel({ onModeChange, onStyleChange }: Props) {
  const [mode, setMode] = useState<ViewMode>('webcam');
  const [style, setStyle] = useState<StyleMode>('mesh+axis');

  const handleModeChange = (newMode: ViewMode) => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  const handleStyleChange = (newStyle: StyleMode) => {
    setStyle(newStyle);
    onStyleChange?.({
      showDots: newStyle === 'dots' || newStyle === 'mesh+axis',
      showMesh: newStyle === 'mesh+axis',
      showAxis: newStyle === 'mesh+axis',
      showContours: newStyle === 'contours',
    });
  };

  return (
    <div className="mt-6 flex flex-col gap-4 items-center justify-center text-white">
      {/* View Mode Buttons */}
      <div className="flex gap-4">
        {(['webcam', 'crop', '3d'] as ViewMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
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
          onChange={(e) => handleStyleChange(e.target.value as StyleMode)}
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
