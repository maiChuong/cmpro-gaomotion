'use client';

import { useState } from 'react';

export type InputSourceType = 'webcam' | 'video';

interface InputSelectorProps {
  currentSource: InputSourceType;
  onSourceSelect: (source: InputSourceType, url?: string) => void;
}

const InputSelector = ({ currentSource, onSourceSelect }: InputSelectorProps) => {
  const [videoUrl, setVideoUrl] = useState('');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setVideoUrl(newUrl);
    if (currentSource === 'video') {
      onSourceSelect('video', newUrl);
    }
  };

  const selectSource = (source: InputSourceType) => {
    if (source !== currentSource) {
      onSourceSelect(source, source === 'video' ? videoUrl : undefined);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
      <div className="flex items-center gap-4">
        <span className="font-semibold">Input Source:</span>
        <div className="flex gap-2">
          <button
            onClick={() => selectSource('webcam')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              currentSource === 'webcam'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            Webcam
          </button>
          <button
            onClick={() => selectSource('video')}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              currentSource === 'video'
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600'
            }`}
          >
            Video File
          </button>
        </div>
      </div>
      {currentSource === 'video' && (
        <div className="mt-3">
          <label htmlFor="video-url" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Video URL
          </label>
          <input
            id="video-url"
            type="text"
            value={videoUrl}
            onChange={handleUrlChange}
            placeholder="Enter video URL (e.g., .mp4)"
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default InputSelector;