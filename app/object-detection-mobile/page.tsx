'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function ObjectDetectionMobilePage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('No snapshot captured yet.');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    const loadModel = async () => {
      const cocoSsd = await import('@tensorflow-models/coco-ssd');
      await import('@tensorflow/tfjs');
      const model = await cocoSsd.load();

      const interval = setInterval(() => {
        const video = webcamRef.current?.video;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

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
            ctx!.font = '14px sans-serif';
            ctx!.fillText(label, x, y - 4);
          });

          setLabels(newLabels);
        });
      }, 300);

      return () => clearInterval(interval);
    };

    loadModel();
  }, []);

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

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Object Detection (Mobile)</h1>

      <div className="relative w-full max-w-md aspect-video mb-4">
        <Webcam
          ref={webcamRef}
          audio={false}
          mirrored={facingMode === 'user'}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode }}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-0"
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full border border-gray-700 rounded"
        />
      </div>

      <div className="flex gap-4 mb-6 w-full max-w-md">
        <button
          onClick={captureSnapshot}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
        >
          Capture Screenshot
        </button>
        <button
          onClick={toggleCamera}
          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-800 rounded text-white font-medium"
        >
          Switch Camera
        </button>
      </div>

      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Detected Objects</h2>
        {labels.length > 0 ? (
          <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
            {labels.map((label, idx) => (
              <li key={idx}>{label}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No objects detected yet.</p>
        )}
      </div>

      <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Context Description</h2>
        <p className="text-gray-300 text-sm whitespace-pre-line">{description}</p>
      </div>

      {capturedImage && (
        <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Captured Snapshot</h2>
          <img src={capturedImage} alt="Captured snapshot" className="rounded w-full" />
        </div>
      )}
    </div>
  );
}
