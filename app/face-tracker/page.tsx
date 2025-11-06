'use client';

import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function FaceTracker() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [landmarker, setLandmarker] = useState(null);

  useEffect(() => {
    const loadLandmarker = async () => {
      const vision = await import('@mediapipe/tasks-vision');
      const filesetResolver = await vision.FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      const faceLandmarker = await vision.FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/face_landmarker.task',
        },
        outputFaceBlendshapes: true,
        runningMode: 'VIDEO',
        numFaces: 1,
      });

      setLandmarker(faceLandmarker);
    };

    loadLandmarker();
  }, []);

  useEffect(() => {
    let animationFrameId;

    const detect = async () => {
      if (
        landmarker &&
        webcamRef.current &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const results = await landmarker.detectForVideo(video, performance.now());

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        if (results.faceLandmarks) {
          for (const landmark of results.faceLandmarks[0]) {
            ctx.beginPath();
            ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 2, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(detect);
    };

    detect();
    return () => cancelAnimationFrame(animationFrameId);
  }, [landmarker]);

  return (
    <div>
      <Webcam ref={webcamRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} />
    </div>
  );
}
