'use client';

import { useRef, useState } from 'react';
import WebcamFeed from './WebcamFeed';
import FaceCropCanvas from './FaceCropCanvas';
import BabylonViewer from './BabylonViewer';
import ControlPanel from './ControlPanel';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';

export default function FaceTrackerPage() {
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const [landmarks, setLandmarks] = useState<{ x: number; y: number }[] | null>(null);
  const [viewMode, setViewMode] = useState<'webcam' | 'crop' | '3d'>('webcam');

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      {/* Babylon.js background */}
      {viewMode === 'webcam' && (
        <div className="absolute inset-0 z-0">
          <BabylonViewer landmarks={landmarks} />
        </div>
      )}

      {/* Foreground UI */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-6 px-4 h-full">
        <h2 className="text-2xl font-bold mb-4">Face Tracker</h2>

        {/* Control Panel */}
        <ControlPanel onModeChange={(mode) => setViewMode(mode)} />

        {/* Conditional Views */}
        <div className="mt-6 w-full max-w-3xl relative">
          {viewMode === 'webcam' && (
            <WebcamFeed
              onLandmarks={(lm) => setLandmarks(lm)}
              onVideoRef={(video) => (webcamRef.current = video)}
            />
          )}

          {viewMode === 'crop' && (
            <>
              <FaceCropCanvas video={webcamRef.current} landmarks={landmarks} />

              {/* Floating Webcam Preview */}
              <motion.div
                drag
                dragConstraints={{ top: 0, left: 0, right: 300, bottom: 500 }}
                className="absolute top-4 right-4 w-40 h-28 border border-gray-600 rounded overflow-hidden shadow-lg cursor-move z-20"
              >
                <Webcam
                  mirrored
                  audio={false}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </>
          )}

          {viewMode === '3d' && <BabylonViewer landmarks={landmarks} />}
        </div>
      </div>
    </div>
  );
}
