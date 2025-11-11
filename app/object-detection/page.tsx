'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export default function ObjectDetectionPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;
      if (!video || !canvas || !model) return;

      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      model.detect(video).then((predictions) => {
        const newLabels: string[] = [];

        predictions.forEach((pred) => {
          const [x, y, width, height] = pred.bbox;
          const label = pred.class;
          newLabels.push(label);

          ctx!.strokeStyle = 'lime';
          ctx!.lineWidth = 2;
          ctx!.strokeRect(x, y, width, height);
          ctx!.fillStyle = 'white';
          ctx!.font = '16px sans-serif';
          ctx!.fillText(label, x, y - 5);
        });

        setLabels(newLabels);
      });
    }, 200);

    return () => clearInterval(interval);
  }, [model]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Object Detection (TensorFlow.js)</h1>

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
