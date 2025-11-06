'use client';

import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { FACEMESH_TESSELATION } from './faceMeshTesselation';
import { FACEMESH_CONTOURS } from './faceMeshContours';

type Props = {
  onLandmarks?: (landmarks: { x: number; y: number }[]) => void;
  onVideoRef?: (video: HTMLVideoElement) => void;
  showDots?: boolean;
  showMesh?: boolean;
  showAxis?: boolean;
  showContours?: boolean;
};

export default function WebcamFeed({
  onLandmarks,
  onVideoRef,
  showDots = true,
  showMesh = false,
  showAxis = false,
  showContours = false,
}: Props) {
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
          const points = results.faceLandmarks;

          // Dots
          if (showDots) {
            ctx.fillStyle = '#0d00ff';
            for (const pt of points) {
              const x = pt.x * canvas.width;
              const y = pt.y * canvas.height;
              ctx.beginPath();
              ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
              ctx.fill();
            }
          }

          // Mesh
          if (showMesh) {
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 0.5;
            for (const [i1, i2] of FACEMESH_TESSELATION) {
              const p1 = points[i1];
              const p2 = points[i2];
              ctx.beginPath();
              ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
              ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
              ctx.stroke();
            }
          }

          // Axis markers
          if (showAxis) {
            const nose = points[1];
            const leftEye = points[33];
            const rightEye = points[263];

            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(nose.x * canvas.width, nose.y * canvas.height, 3, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = 'green';
            ctx.beginPath();
            ctx.arc(leftEye.x * canvas.width, leftEye.y * canvas.height, 3, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(rightEye.x * canvas.width, rightEye.y * canvas.height, 3, 0, 2 * Math.PI);
            ctx.fill();
          }

          // Contours
          if (showContours) {
            ctx.strokeStyle = 'lime';
            ctx.lineWidth = 1.5;
            for (const [i1, i2] of FACEMESH_CONTOURS) {
              const p1 = points[i1];
              const p2 = points[i2];
              ctx.beginPath();
              ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
              ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
              ctx.stroke();
            }
          }

          if (onLandmarks) {
            onLandmarks(points);
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
  }, [onLandmarks, onVideoRef, showDots, showMesh, showAxis, showContours]);

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
