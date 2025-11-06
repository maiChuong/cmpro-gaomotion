'use client';

import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Holistic } from '@mediapipe/holistic';
import { drawConnectors } from '@mediapipe/drawing_utils';
import { FACEMESH_TESSELATION } from '@mediapipe/face_mesh';

type Props = {
  onLandmarks?: (landmarks: { x: number; y: number }[]) => void;
  onVideoRef?: (video: HTMLVideoElement) => void;
};

export default function WebcamFeed({ onLandmarks, onVideoRef }: Props) {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) =>
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

    holistic.onResults((results) => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext('2d')!;
      const video = webcamRef.current?.video!;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      if (results.faceLandmarks) {
        drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
          color: '#00FF00',
          lineWidth: 0.5,
        });

        if (onLandmarks) {
          onLandmarks(results.faceLandmarks);
        }
      }

      ctx.restore();
    });

    const startHolistic = async () => {
      const camera = await import('@mediapipe/camera_utils');
      const videoElement = webcamRef.current?.video!;
      if (onVideoRef) onVideoRef(videoElement);

      const cam = new camera.Camera(videoElement, {
        onFrame: async () => {
          await holistic.send({ image: videoElement });
        },
        width: 640,
        height: 480,
      });

      cam.start();
    };

    startHolistic();
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
