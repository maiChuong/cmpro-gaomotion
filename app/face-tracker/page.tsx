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

  const [showDots, setShowDots] = useState(true);
  const [showMesh, setShowMesh] = useState(true);
  const [showAxis, setShowAxis] = useState(true);
  const [showContours, setShowContours] = useState(false);

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden">
      {/* Babylon.js background */}
      <BabylonViewer landmarks={landmarks} />

      {/* Floating webcam preview */}
      <motion.div
        drag
        dragConstraints={{ top: 0, left: 0, right: 1000, bottom: 1000 }}
        className="absolute bottom-4 right-4 w-80 h-44 border border-gray-700 rounded overflow-hidden shadow-lg z-20 cursor-move"
      >
        <Webcam mirrored audio={false} className="w-full h-full object-cover" />
      </motion.div>

      {/* Floating control panel */}
      <div className="absolute top-6 left-6 z-30 bg-black bg-opacity-70 p-4 rounded-lg border border-gray-700 max-w-md">
        <h2 className="text-xl font-bold mb-4">Face Tracker</h2>
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

      {/* Conditional overlays */}
      {viewMode === 'webcam' && (
        <div className="absolute inset-0 z-10 pointer-events-none">
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

      {viewMode === 'crop' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <FaceCropCanvas video={webcamRef.current} landmarks={landmarks} />
        </div>
      )}
    </div>
  );
}
