'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function ObjectDetectionPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const initObjectron = async () => {
      const { Objectron } = await import('@mediapipe/objectron');
      const { Camera } = await import('@mediapipe/camera_utils');

      const objectron = new Objectron({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/objectron/${file}`,
      });

      objectron.setOptions({
        modelName: 'Cup', // Options: 'Cup', 'Chair', 'Shoe', 'Camera'
        maxNumObjects: 5,
        minDetectionConfidence: 0.5,
      });

      objectron.onResults((results: any) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const video = webcamRef.current?.video;
        if (!canvas || !ctx || !video) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const newLabels: string[] = [];

        results.detectedObjects?.forEach((obj: any) => {
          const box = obj.boundingBox;
          const label = obj.categoryName || 'Object';
          newLabels.push(label);

          ctx.strokeStyle = 'lime';
          ctx.lineWidth = 2;
          ctx.strokeRect(box.xCenter - box.width / 2, box.yCenter - box.height / 2, box.width, box.height);
          ctx.fillStyle = 'white';
          ctx.font = '16px sans-serif';
          ctx.fillText(label, box.xCenter - box.width / 2, box.yCenter - box.height / 2 - 5);
        });

        setLabels(newLabels);
        ctx.restore();
      });

      const videoElement = webcamRef.current?.video;
      if (!videoElement) return;

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await objectron.send({ image: videoElement });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    };

    initObjectron();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Object Detection (Objectron)</h1>

      <div className="relative w-full max-w-3xl aspect-video mb-6">
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full border border-gray-700 rounded"
        />
      </div>

      <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Detected Objects</h2>
        {labels.length > 0 ? (
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            {labels.map((label, idx) => (
              <li key={idx}>{label}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No objects detected yet.</p>
        )}
      </div>
    </div>
  );
}
