'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function ObjectDetectionPage() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<any>(null);

  useEffect(() => {
    const initDetector = async () => {
      const vision = await import('@mediapipe/tasks-vision');
      const { ObjectDetector, FilesetResolver } = vision;

      const fileset = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const detector = await ObjectDetector.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/object_detector/lite/float16/1/object_detector.task',
        },
        scoreThreshold: 0.5,
      });

      setDetector(detector);
    };

    initDetector();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = webcamRef.current?.video;
      const canvas = canvasRef.current;
      if (!video || !canvas || !detector) return;

      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      detector.detect(video).then((results: any) => {
        results.detections.forEach((det: any) => {
          const box = det.boundingBox;
          ctx!.strokeStyle = 'red';
          ctx!.lineWidth = 2;
          ctx!.strokeRect(box.originX, box.originY, box.width, box.height);
          ctx!.fillStyle = 'white';
          ctx!.fillText(det.categories[0].categoryName, box.originX, box.originY - 5);
        });
      });
    }, 100);

    return () => clearInterval(interval);
  }, [detector]);

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-4">
      <Webcam
        ref={webcamRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'auto', opacity: 0 }}
      />
      <canvas ref={canvasRef} className="border border-gray-700 rounded w-full" />
    </div>
  );
}
