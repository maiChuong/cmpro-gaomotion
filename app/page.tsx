'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [faceTrackerPath, setFaceTrackerPath] = useState('/face-tracker');
  const [objectDetectionPath, setObjectDetectionPath] = useState('/object-detection');

  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(
      window.navigator.userAgent
    );
    setFaceTrackerPath(isMobile ? '/face-tracker-mobile' : '/face-tracker');
    setObjectDetectionPath(isMobile ? '/object-detection-mobile' : '/object-detection');
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">
          Face Motion Capture Studio
        </h1>
        <p className="text-lg text-gray-400 mb-10 leading-relaxed">
          Realtime facial tracking and 3D rendering powered by MediaPipe and Babylon.js. Capture expressions, animate a 3D head, and explore pose and object detection — all in your browser.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={faceTrackerPath}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition shadow-md"
          >
            Launch Face Tracker
          </Link>
          <Link
            href={objectDetectionPath}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md text-white font-medium transition shadow-md"
          >
            Try Object Detection
          </Link>
        </div>
      </div>
    </main>
  );
}
