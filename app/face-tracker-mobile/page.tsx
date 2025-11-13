'use client';

import { useRef, useState } from 'react';
import WebcamFeed from '../face-tracker/WebcamFeed';
import FaceCropCanvas from '../face-tracker/FaceCropCanvas';
import BabylonViewer from '../face-tracker/BabylonViewer';
import ControlPanel from '../face-tracker/ControlPanel';
import Webcam from 'react-webcam';

export default function FaceTrackerMobilePage() {
  const webcamRef = useRef<HTMLVideoElement | null>(null);
  const [landmarks, setLandmarks] = useState<{ x: number; y: number }[] | null>(null);
  const [viewMode, setViewMode] = useState<'webcam' | 'crop' | '3d'>('webcam');
  const [showDots, setShowDots] = useState(true);
  const [showMesh, setShowMesh] = useState(true);
  const [showAxis, setShowAxis] = useState(false);
  const [showContours, setShowContours] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col items-center justify-start px-4 py-6">
      {/* 🌌 Babylon.js Background */}
      <BabylonViewer landmarks={landmarks} />

      {/* 🖼️ Cropped Face Overlay */}
      {viewMode === 'crop' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <FaceCropCanvas video={webcamRef.current} landmarks={landmarks} />
        </div>
      )}

      {/* 🎛️ Controls */}
      <div className="z-30 w-full max-w-md bg-black/70 backdrop-blur-md rounded-lg border border-gray-700 p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3 text-center">Face Tracker</h2>
        <ControlPanel
          onModeChange={setViewMode}
          onStyleChange={({ showDots, showMesh, showAxis, showContours }) => {
            setShowDots(showDots);
            setShowMesh(showMesh);
            setShowAxis(showAxis);
            setShowContours(showContours);
          }}
        />
        <button
          onClick={toggleCamera}
          className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
        >
          Switch Camera ({facingMode === 'user' ? 'Front' : 'Back'})
        </button>
      </div>

      {/* 📷 Webcam Feed */}
      <div className="relative w-full max-w-md aspect-video border border-gray-700 rounded overflow-hidden shadow-lg mb-4">
        <Webcam
          audio={false}
          mirrored={facingMode === 'user'}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode }}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 🧠 Facial Tracker */}
      {viewMode !== '3d' && (
        <div className="relative w-full max-w-md aspect-video border border-blue-600 rounded overflow-hidden shadow-lg bg-black/60 backdrop-blur">
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
  );
}
