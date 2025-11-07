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

  const [showDots, setShowDots] = useState(true);
  const [showMesh, setShowMesh] = useState(true);
  const [showAxis, setShowAxis] = useState(true);
  const [showContours, setShowContours] = useState(false);

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* 🌌 Babylon.js Fullscreen Background */}
      <BabylonViewer landmarks={landmarks} />

      {/* 🖼️ Cropped Face Centered */}
      {viewMode === 'crop' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <FaceCropCanvas video={webcamRef.current} landmarks={landmarks} />
        </div>
      )}

      {/* 🎛️ Control Panel + Webcam + Tracker */}
      <div className="absolute bottom-4 right-4 z-30 flex items-end gap-4">
        {/* Control Panel */}
        <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-gray-700 w-64">
          <h2 className="text-lg font-semibold mb-3">Face Tracker</h2>
          <ControlPanel
            onModeChange={setViewMode}
            onStyleChange={({ showDots, showMesh, showAxis, showContours }) => {
              setShowDots(showDots);
              setShowMesh(showMesh);
              setShowAxis(showAxis);
              setShowContours(showContours);
            }}
          />
        </div>

        {/* Original Webcam (flipped vertically) */}
        <div className="w-64 h-36 border border-gray-700 rounded overflow-hidden shadow-lg">
          <Webcam
            mirrored={true}
            audio={false}
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        </div>


        {/* Facial Tracker */}
        {viewMode !== '3d' && (
          <div className="w-64 h-36 border border-blue-600 rounded overflow-hidden shadow-lg bg-black/60 backdrop-blur">
            <WebcamFeed
              onLandmarks={setLandmarks}
              onVideoRef={(video) => (webcamRef.current = video)}
              showDots={showDots}
              showMesh={showMesh}
              showAxis={showAxis}
              showContours={showContours}
            />
          </div>
        )}
      </div>
    </div>
  );
}
