import React from 'react';

/**
 * Defines the types of motion capture available.
 * - 'pose': Captures body pose only.
 * - 'face': Captures facial landmarks only.
 * - 'hands': Captures hand landmarks only.
 * - 'holistic': Captures all landmarks (pose, face, and hands).
 */
export type CaptureType = 'pose' | 'face' | 'hands' | 'holistic';

/**
 * Props for the MotionSelector component.
 */
interface MotionSelectorProps {
  /**
   * A callback function that is invoked when a capture type is selected.
   * @param type The selected capture type.
   */
  onSelect: (type: CaptureType) => void;
}

const captureOptions: { type: CaptureType; title: string; description: string }[] = [
  {
    type: 'holistic',
    title: 'Holistic Capture',
    description: 'Capture full body, face, and hand motion simultaneously.',
  },
  {
    type: 'pose',
    title: 'Pose Capture',
    description: 'Capture body pose landmarks only.',
  },
  {
    type: 'face',
    title: 'Face Capture',
    description: 'Capture facial expression landmarks.',
  },
  {
    type: 'hands',
    title: 'Hands Capture',
    description: 'Capture individual hand and finger tracking.',
  },
];

/**
 * A component that presents the user with different motion capture options
 * and allows them to select one to begin the capture process.
 */
const MotionSelector: React.FC<MotionSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-2xl text-center">
      <h1 className="text-4xl font-bold mb-2">Motion Capture</h1>
      <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">Select a capture type to begin.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {captureOptions.map((option) => (<button key={option.type} onClick={() => onSelect(option.type)} className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-800/30 transition-all duration-200 ease-in-out transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-2">{option.title}</h2>
            <p className="text-neutral-500 dark:text-neutral-400">{option.description}</p>
          </button>))}
      </div>
    </div>);
};

export default MotionSelector;

