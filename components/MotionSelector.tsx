'use client';

import React from 'react';

// Define the types for capture modes
export type CaptureType = 'face' | 'pose' | 'hands';

interface MotionSelectorProps {
  onSelect: (type: CaptureType) => void;
}

const MotionSelector: React.FC<MotionSelectorProps> = ({ onSelect }) => {
  const captureOptions: { type: CaptureType; label: string; description: string }[] = [
    {
      type: 'face',
      label: 'Face Capture',
      description: 'Track facial landmarks for expressions.',
    },
    {
      type: 'pose',
      label: 'Body Pose Capture',
      description: 'Track full-body pose for character animation.',
    },
    {
      type: 'hands',
      label: 'Hand Pose Capture',
      description: 'Track detailed hand and finger movements.',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl font-bold">Choose Capture Type</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {captureOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            className="p-6 border rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/30 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2">{option.label}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MotionSelector;