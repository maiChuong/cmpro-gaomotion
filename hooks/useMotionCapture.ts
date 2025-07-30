'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  MotionLandmarker,
  FilesetResolver,
  MotionLandmarkerResult,
  PoseLandmarker,
  FaceLandmarker,
  HandLandmarker,
  DrawingUtils,
} from '@mediapipe/tasks-vision';
import { CaptureType } from '@/components/MotionSelector';
import { InputSourceType } from '@/components/InputSelector';

export type MotionData = MotionLandmarkerResult;

interface useMotionCaptureProps {
  inputSource: InputSourceType;
  videoUrl?: string;
  captureType: CaptureType;
  onData: (data: MotionData) => void;
}

export const useMotionCapture = ({
  inputSource,
  videoUrl,
  captureType,
  onData,
}: useMotionCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionLandmarkerRef = useRef<MotionLandmarker | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const animationFrameIdRef = useRef<number | null>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMotionLandmarker = useCallback(async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      const landmarker = await MotionLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/motion_landmarker/motion_landmarker/float16/1/motion_landmarker.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      motionLandmarkerRef.current = landmarker;
      setError(null);
    } catch (e) {
      console.error('Failed to create MotionLandmarker:', e);
      setError('Failed to initialize motion capture model. Please try again.');
    }
  }, []);

  useEffect(() => {
    if (!motionLandmarkerRef.current) {
      createMotionLandmarker();
    }
  }, [createMotionLandmarker]);

  const stopCapture = useCallback(() => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCapture();
      motionLandmarkerRef.current?.close();
    };
  }, [stopCapture]);

  const predict = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const landmarker = motionLandmarkerRef.current;

    if (!video || !canvas || !landmarker || video.paused || video.ended) return;

    const currentTime = video.currentTime;
    if (currentTime > lastVideoTimeRef.current) {
      lastVideoTimeRef.current = currentTime;
      const results = landmarker.detectForVideo(video, Date.now());

      const canvasCtx = canvas.getContext('2d');
      if (canvasCtx && results) {
        const drawingUtils = new DrawingUtils(canvasCtx);
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        if (captureType === 'pose' || captureType === 'holistic') {
          results.poseLandmarks.forEach((landmarks) => {
            drawingUtils.drawConnectors(
              landmarks,
              PoseLandmarker.POSE_CONNECTIONS,
              { color: '#00FF00', lineWidth: 4 }
            );
            drawingUtils.drawLandmarks(
              landmarks,
              { color: '#FF0000', radius: 5 }
            );
          });
        }

        if (captureType === 'face' || captureType === 'holistic') {
          results.faceLandmarks.forEach((landmarks) => {
            drawingUtils.drawConnectors(
              landmarks,
              FaceLandmarker.FACE_LANDMARKS_TESSELATION,
              { color: '#C0C0C070', lineWidth: 1 }
            );
          });
        }

        if (captureType === 'hands' || captureType === 'holistic') {
          results.handLandmarks.forEach((landmarks) => {
            drawingUtils.drawConnectors(
              landmarks,
              HandLandmarker.HAND_CONNECTIONS,
              { color: '#00CCFF', lineWidth: 5 }
            );
            drawingUtils.drawLandmarks(
              landmarks,
              { color: '#FF0000', radius: 5 }
            );
          });
        }

        onData(results);
      }
    }

    animationFrameIdRef.current = requestAnimationFrame(predict);
  }, [captureType, onData]);

  const startCapture = useCallback(async () => {
    if (!motionLandmarkerRef.current) {
      setError('Motion capture is not ready. Please wait.');
      return;
    }
    if (isCameraOn) return;

    stopCapture();
    setIsProcessing(true);
    setError(null);

    try {
      const video = videoRef.current;
      if (!video) return;

      if (inputSource === 'webcam') {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: false,
        });
        video.srcObject = stream;
      } else if (inputSource === 'video' && videoUrl) {
        video.src = videoUrl;
        video.loop = true;
      } else {
        throw new Error('Invalid input source or missing video URL.');
      }

      video.onloadedmetadata = () => {
        video.play();
        setIsCameraOn(true);
        setIsProcessing(false);
        lastVideoTimeRef.current = -1;
        predict();
      };
    } catch (err) {
      console.error('Failed to start capture:', err);
      setError('Failed to access camera or video. Please check permissions and try again.');
      setIsProcessing(false);
    }
  }, [isCameraOn, stopCapture, inputSource, videoUrl, predict]);

  return {
    videoRef,
    canvasRef,
    isCameraOn,
    isProcessing,
    error,
    startCapture,
    stopCapture,
  };
};
