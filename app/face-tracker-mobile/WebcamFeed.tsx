'use client';

import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { FACEMESH_TESSELATION } from './faceMeshTesselation';
import { FACEMESH_CONTOURS } from './faceMeshContours';

type Props = {
  onLandmarks?: (landmarks: { x: number; y: number; z?: number }[]) => void;
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
  const cameraRef = useRef<any>(null); // store Camera instance for cleanup

  useEffect(() => {
    const initFaceMesh = async () => {
      const { FaceMesh } = await import('@mediapipe/face_mesh');
      const { Camera } = await import('@mediapipe/camera_utils');

      const faceMesh = new FaceMesh({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const video = webcamRef.current?.video;
        if (!canvas || !ctx || !video || !video.videoWidth || !video.videoHeight) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const points = results.multiFaceLandmarks?.[0];
        if (points?.length) {
          if (showDots) {
            ctx.fillStyle = '#0d00ff';
            points.forEach((pt) => {
              const x = pt.x * canvas.width;
              const y = pt.y * canvas.height;
              ctx.beginPath();
              ctx.arc(x, y, 1.5, 0, 2 * Math.PI);
              ctx.fill();
            });
          }

          if (showMesh) {
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 0.5;
            FACEMESH_TESSELATION.forEach(([i1, i2]) => {
              const p1 = points[i1];
              const p2 = points[i2];
              ctx.beginPath();
              ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
              ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
              ctx.stroke();
            });
          }

          if (showAxis) {
            const drawMarker = (pt: any, color: string) => {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 3, 0, 2 * Math.PI);
              ctx.fill();
            };
            drawMarker(points[1], 'red');     // nose
            drawMarker(points[33], 'green');  // left eye
            drawMarker(points[263], 'blue');  // right eye
          }

          if (showContours) {
            ctx.strokeStyle = 'lime';
            ctx.lineWidth = 1.5;
            FACEMESH_CONTOURS.forEach(([i1, i2]) => {
              const p1 = points[i1];
              const p2 = points[i2];
              ctx.beginPath();
              ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
              ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
              ctx.stroke();
            });
          }

          onLandmarks?.(points);
        }

        ctx.restore();
      });

      const waitForVideo = () =>
        new Promise<HTMLVideoElement>((resolve) => {
          const check = () => {
            const video = webcamRef.current?.video;
            if (video && video.readyState >= 2) {
              resolve(video);
            } else {
              requestAnimationFrame(check);
            }
          };
          check();
        });

      const videoElement = await waitForVideo();
      if (onVideoRef) onVideoRef(videoElement);

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await faceMesh.send({ image: videoElement });
        },
        width: 640,
        height: 480,
      });

      camera.start();
      cameraRef.current = camera;
    };

    initFaceMesh();

    return () => {
      cameraRef.current?.stop();
    };
  }, [onLandmarks, onVideoRef, showDots, showMesh, showAxis, showContours]);

  return (
    <div className="relative w-full max-w-3xl">
      <Webcam
        ref={webcamRef}
        mirrored={false}
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
