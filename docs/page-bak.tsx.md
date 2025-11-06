'use client';

import { useRef, useState } from 'react';
import WebcamFeed from './WebcamFeed';
import FaceCropCanvas from './FaceCropCanvas';
import BabylonViewer from './BabylonViewer';
import ControlPanel from './ControlPanel';
import Webcam from 'react-webcam';

export default function FaceTrackerPage() {
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const [landmarks, setLandmarks] = useState<{ x: number; y: number }[] | null>(null);
  const [viewMode, setViewMode] = useState<'webcam' | 'crop' | '3d'>('webcam');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
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
            <div className="absolute top-4 right-4 w-40 h-28 border border-gray-600 rounded overflow-hidden shadow-lg">
              <Webcam
                mirrored
                audio={false}
                className="w-full h-full object-cover"
              />
            </div>
          </>
        )}

        {viewMode === '3d' && <BabylonViewer landmarks={landmarks} />}
      </div>
    </div>
  );
}
