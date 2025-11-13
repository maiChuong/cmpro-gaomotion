'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

export default function ObjectDetectionPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('No snapshot captured yet.');

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

  const captureSnapshot = async () => {
    const canvas = canvasRef.current;
    if (!canvas || labels.length === 0) return;

    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageData);
    setDescription('Interpreting scene...');

    try {
      const prompt = `You are a visual scene interpreter. Based on these detected objects: ${Array.from(
        new Set(labels)
      ).join(', ')}, describe the likely context in a natural, human-readable paragraph.`;

      // @ts-ignore
      const result = await window.puter.ai.chat(prompt, { model: 'gpt-4o' });

      setDescription(result || 'No description returned.');
    } catch (err) {
      setDescription('Failed to interpret scene.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Object Detection (Snapshot + AI Description)</h1>

      <div className="relative w-full max-w-3xl aspect-video mb-4">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
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

      <button
        onClick={captureSnapshot}
        className="mb-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold"
      >
        Capture Snapshot
      </button>

      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-4 mb-6">
        {/* Detected Objects */}
        <div className="flex-1 bg-gray-900 border border-gray-700 rounded p-4">
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

        {/* Context Description */}
        <div className="flex-1 bg-gray-900 border border-gray-700 rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Context Description</h2>
          <p className="text-gray-300 whitespace-pre-line">{description}</p>
        </div>
      </div>

      {/* Captured Image */}
      {capturedImage && (
        <div className="w-full max-w-3xl bg-gray-800 border border-gray-700 rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Captured Snapshot</h2>
          <img src={capturedImage} alt="Captured snapshot" className="rounded w-full" />
        </div>
      )}
    </div>
  );
}
