'use client';

import React from 'react';
import { RigPose } from '@/types/rig';

/**
 * A component to visualize the live rig pose data being generated.
 */
const RigMapper: React.FC<{ pose: RigPose | null }> = ({ pose }) => {
  return (
    <div className="p-6 border rounded-lg w-full max-w-md shadow-md bg-white dark:bg-neutral-900">
      <h2 className="text-xl font-semibold mb-4">Rig Mapper (Live Data)</h2>
      <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
        {pose ? (
          <pre className="text-xs bg-neutral-100 dark:bg-neutral-800 p-2 rounded-md overflow-x-auto max-h-64">
            <code>{JSON.stringify(pose, null, 2)}</code>
          </pre>
        ) : (
          <div className="text-center py-10">
            <p>Waiting for motion data...</p>
            <p className="text-xs text-neutral-500 mt-2">
              Start the camera to see live pose data here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RigMapper;