'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { CharacterModel } from './CharacterModel';
import { RigPose } from '@/types/rig';

/**
 * A 3D viewer component to display the character model and its animated pose.
 * This component uses react-three-fiber to render a Three.js scene.
 */
const CharacterViewer: React.FC<{
  pose: RigPose | null;
  onTposeReady: (tPose: RigPose) => void;
  debugMode?: boolean;
}> = ({ pose, onTposeReady, debugMode = false }) => {
  return (
    <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 rounded-lg">
      <Canvas camera={{ position: [0, 1, 2.5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        {debugMode && <axesHelper args={[1]} />} {/* World axes */}
        <Suspense fallback={null}>
          <CharacterModel pose={pose} onTposeReady={onTposeReady} debugMode={debugMode} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default CharacterViewer;
