'use client';

import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';

type Props = {
  onLandmarks?: (landmarks: { x: number; y: number }[]) => void;
  onVideoRef?: (video: HTMLVideoElement) => void;
};

export default function WebcamFeed({ onLandmarks, onVideoRef }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const initHolistic = async () => {
      const mpHolistic = await import('@mediapipe/holistic');
      const mpCamera = await import('@mediapipe/camera_utils');

      const holistic = new mpHolistic.Holistic({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
      });

      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      holistic.onResults((results: any) => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const video = webcamRef.current?.video!;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (results.faceLandmarks) {
          ctx.fillStyle = '#0d00ff';
          for (const pt of results.faceLandmarks) {
            const x = pt.x * canvas.width;
            const y = pt.y * canvas.height;
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
            ctx.fill();
          }

          if (onLandmarks) {
            onLandmarks(results.faceLandmarks);
          }
        }

        ctx.restore();
      });

      const videoElement = webcamRef.current?.video!;
      if (onVideoRef) onVideoRef(videoElement);

      const camera = new mpCamera.Camera(videoElement, {
        onFrame: async () => {
          await holistic.send({ image: videoElement });
        },
        width: 640,
        height: 480,
      });

      camera.start();
    };

    initHolistic();
  }, [onLandmarks, onVideoRef]);

  return (
    <div className="relative w-full max-w-3xl">
      <Webcam
        ref={webcamRef}
        mirrored
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 'auto',
          opacity: 0,
        }}
      />
      <canvas
        ref={canvasRef}
        className="border border-gray-700 rounded w-full"
      />
    </div>
  );
}
