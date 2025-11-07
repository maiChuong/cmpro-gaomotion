'use client';

import { useEffect, useRef } from 'react';

type Props = {
  video: HTMLVideoElement | null;
  landmarks: { x: number; y: number }[] | null;
};

export default function FaceCropCanvas({ video, landmarks }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!video || !landmarks?.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { videoWidth: vw, videoHeight: vh } = video;
    canvas.width = vw;
    canvas.height = vh;

    // Draw full video frame
    ctx.drawImage(video, 0, 0, vw, vh);

    // Calculate bounding box
    const xs = landmarks.map((pt) => pt.x * vw);
    const ys = landmarks.map((pt) => pt.y * vh);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    // Crop and redraw face region
    const faceImage = ctx.getImageData(minX, minY, width, height);
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
