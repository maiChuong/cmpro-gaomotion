'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { DrawingUtils } from '@mediapipe/drawing_utils';
import {
  createMotionLandmarker,
  MotionLandmarker,
} from '@/services/motion/capture';
import { CaptureType, InputSourceType } from '@/components/MotionSelector';
import {
  FaceLandmarker,
  HandLandmarker,
  PoseLandmarker,
  NormalizedLandmark,
} from '@mediapipe/tasks-vision';
// This will eventually hold the structured data from MediaPipe.
export type MotionData = any;
// TODO: Add DrawingUtils to visualize the landmarks on the canvas.

export interface UseMotionCaptureProps {
  captureType: CaptureType | null;
  inputSource: InputSourceType;
  videoUrl?: string;
  onData?: (data: MotionData) => void;
}

export const useMotionCapture = ({ captureType, onData }: UseMotionCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const drawingUtilsRef = useRef<DrawingUtils | null>(null);
  // A ref to hold the MediaPipe landmarker instance.
  const landmarkerRef = useRef<MotionLandmarker | null>(null);
  // A ref to hold the animation frame request ID.
  const animationFrameId = useRef<number | null>(null);

  /**
   * Stops the video stream and cleans up resources.
   */
  const stopCapture = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    setIsCameraOn(false);

    const video = videoRef.current;
    if (!video) return;

    // Stop webcam stream if it exists
    if (video.srcObject) {
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }

    // Reset video element for file source
    if (video.src) {
      video.pause();
      video.removeAttribute('src'); // More robust than video.src = ''
      video.load(); // Resets the video element
    }
  }, [videoRef]);

  /**
   * The main prediction loop.
   */
  const predictVideoFrame = useCallback(() => {
    const video = videoRef.current;
    const landmarker = landmarkerRef.current;
    const canvas = canvasRef.current;
    const drawingUtils = drawingUtilsRef.current;

    // Ensure everything is ready for prediction.
    if (!video || !landmarker || !canvas || !drawingUtils || video.paused || video.ended) {
      return;
    }

    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    // Use performance.now() for timestamping, as required by MediaPipe.
    const startTimeMs = performance.now();
    const results = landmarker.detectForVideo(video, startTimeMs);

    // Clear the canvas and draw the new results.
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    if (results && onData) {
      // Pass the raw data to the callback.
      onData(results);

      // Draw Pose landmarks
      if (results.landmarks && captureType === 'pose') {
        for (const landmarks of results.landmarks as NormalizedLandmark[][]) {
          drawingUtils.drawConnectors(landmarks, PoseLandmarker.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
          drawingUtils.drawLandmarks(landmarks, { color: '#FF0000', radius: 6 });
        }
      }
      // Draw Hand landmarks
      if (results.landmarks && captureType === 'hands') {
        for (const landmarks of results.landmarks as NormalizedLandmark[][]) {
          drawingUtils.drawConnectors(landmarks, HandLandmarker.HAND_CONNECTIONS, { color: '#00CCFF', lineWidth: 5 });
          drawingUtils.drawLandmarks(landmarks, { color: '#FF00FF', lineWidth: 2 });
        }
      }
      // Draw Face landmarks
      if (results.landmarks && captureType === 'face') {
        for (const landmarks of results.landmarks as NormalizedLandmark[][]) {
          drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_TESSELATION, { color: '#C0C0C070', lineWidth: 1 });
          drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE, { color: '#FF3030' });
          drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: '#FF3030' });
          drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYE, { color: '#30FF30' });
          drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW, { color: '#30FF30' });
          drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_FACE_OVAL, { color: '#E0E0E0' });
          drawingUtils.drawConnectors(landmarks, FaceLandmarker.FACE_LANDMARKS_LIPS, { color: '#E0E0E0' });
        }
      }
    }

    // Continue the loop.
    animationFrameId.current = requestAnimationFrame(predictVideoFrame);
  }, [videoRef, canvasRef, onData, captureType]);

  /**
   * Initializes the MediaPipe landmarker when the capture type changes.
   */
  useEffect(() => {
    if (!captureType) {
      if (isCameraOn) stopCapture();
      return;
    }

    const initialize = async () => {
      setError(null);
      setIsProcessing(true);
      try {
        const landmarker = await createMotionLandmarker(captureType);
        landmarkerRef.current = landmarker;
        // Initialize DrawingUtils
        const canvasCtx = canvasRef.current?.getContext('2d');
        if (canvasCtx) {
          drawingUtilsRef.current = new DrawingUtils(canvasCtx);
        }
      } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(`Failed to initialize MediaPipe: ${errorMessage}`);
      } finally {
        setIsProcessing(false);
      }
    };

    initialize();

    // Cleanup on component unmount or when captureType changes.
    return () => {
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
      stopCapture();
    };
  }, [captureType, stopCapture]);

  /**
   * Starts the camera feed. The prediction loop will be triggered
   * from here once the video is playing.
   */
  const startCapture = useCallback(async () => {
    if (!landmarkerRef.current) {
      setError('Landmarker is not initialized. Please wait or select a type.');
      return;
    }
    if (!videoRef.current) {
      setError('Video element is not available.');
      return;
    }

    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      // Set up canvas dimensions once video is ready.
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current && canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }
        setIsCameraOn(true);
        predictWebcam(); // Start the prediction loop
      };
    } catch (e) {
      setError('Could not access webcam. Please grant permission and try again.');
    }
  }, [predictWebcam]);

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