'use client';

import { useEffect, useRef } from 'react';

type Props = {
  video: HTMLVideoElement | null;
  landmarks: { x: number; y: number }[] | null;
};

export default function FaceCropCanvas({ video, landmarks }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!video || !landmarks || landmarks.length === 0) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw full video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Calculate bounding box from landmarks
    const xs = landmarks.map((pt) => pt.x * canvas.width);
    const ys = landmarks.map((pt) => pt.y * canvas.height);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    // Crop face region
    const faceImage = ctx.getImageData(minX, minY, width, height);

    // Clear canvas and draw cropped face
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = width;
    canvas.height = height;
    ctx.putImageData(faceImage, 0, 0);
  }, [video, landmarks]);

  return (
    <div className="mt-4">
      <h3 className="text-white text-lg mb-2">Cropped Face</h3>
      <canvas ref={canvasRef} className="border border-gray-600 rounded" />
    </div>
  );
}
