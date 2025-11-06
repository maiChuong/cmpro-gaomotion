'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white">
      <h1 className="text-4xl font-bold mb-4">Face Motion Capture Studio</h1>
      <p className="text-lg mb-6 text-gray-400 max-w-xl text-center">
        Realtime facial tracking and 3D rendering using MediaPipe and Babylon.js. Capture your expressions, animate a 3D head, and explore pose and hand landmarks.
      </p>
      <Link
        href="/face-tracker"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold transition"
      >
        Launch Face Tracker
      </Link>
    </main>
  );
}
