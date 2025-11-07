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
      {/* 🌌 Babylon.js Fullscreen Background */}
      <BabylonViewer landmarks={landmarks} />

      {/* 🎛️ Floating Control Panel */}
      <div className="absolute bottom-[160px] right-4 z-30 bg-black/70 backdrop-blur-md p-4 rounded-lg border border-gray-700 w-[544px]">
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

      {/* 🎥 Webcam + Tracker Preview Side by Side */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-4">
        {/* Original Webcam */}
        <motion.div
          drag
          dragConstraints={{ top: 0, left: 0, right: 1000, bottom: 1000 }}
          className="w-64 h-36 border border-gray-700 rounded overflow-hidden shadow-lg cursor-move"
        >
          <Webcam mirrored audio={false} className="w-full h-full object-cover" />
        </motion.div>

        {/* Facial Tracker */}
        {viewMode !== '3d' && (
          <motion.div
            drag
            dragConstraints={{ top: 0, left: 0, right: 1000, bottom: 1000 }}
            className="w-64 h-36 border border-blue-600 rounded overflow-hidden shadow-lg cursor-move bg-black/60 backdrop-blur"
          >
            <WebcamFeed
              onLandmarks={setLandmarks}
              onVideoRef={(video) => (webcamRef.current = video)}
              showDots={showDots}
              showMesh={showMesh}
              showAxis={showAxis}
              showContours={showContours}
            />
          </motion.div>
        )}
      </div>

      {/* 🖼️ Cropped Face Centered */}
      {viewMode === 'crop' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <FaceCropCanvas video={webcamRef.current} landmarks={landmarks} />
        </div>
      )}
    </div>
  );
}
