'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  MediaPipeService,
  MediaPipeMode,
  FaceLandmarkerResult,
  PoseLandmarkerResult,
  LoadingState,
  OnProgressCallback,
} from '@/services/motion/mediapipe';
import { useTunnelStore } from '@/store/tunnelStore';

interface UseMediaPipeProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  mode: MediaPipeMode;
  isCapturing: boolean;
}

/**
 * A custom hook to manage the MediaPipe service lifecycle.
 * It handles initialization, the prediction loop, and cleanup.
 *
 * @param {UseMediaPipeProps} props - The properties for the hook.
 * @returns An object containing:
 * - `isLoading`: A boolean indicating if MediaPipe is in any loading state.
 * - `loadingState`: The specific stage of the loading process.
 * - `downloadProgress`: The progress of the model download (0 to 1).
 * - `error`: Any error message during initialization.
 * - `frameCount`: The number of frames captured so far.
 * - `getCapturedFrames`: A function to retrieve the array of captured frames.
 * - `clearCapturedFrames`: A function to clear the captured frames.
 */
export function useMediaPipe({
  videoRef,
  canvasRef,
  mode,
  isCapturing,
}: UseMediaPipeProps) {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const mediaPipeServiceRef = useRef<MediaPipeService | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const capturedFramesRef = useRef<(FaceLandmarkerResult | PoseLandmarkerResult)[]>(
    [],
  );
  const [frameCount, setFrameCount] = useState(0);

  const clearCapturedFrames = useCallback(() => {
    capturedFramesRef.current = [];
    setFrameCount(0);
  }, []);

  const getCapturedFrames = useCallback(() => {
    return capturedFramesRef.current;
  }, []);

  // Main prediction loop
  const predictWebcam = useCallback(async () => {
    const video = videoRef.current;
    const service = mediaPipeServiceRef.current;

    if (video && service && isCapturing) {
      // Ensure the canvas dimensions match the video to prevent distortion
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const startTimeMs = performance.now();
      const results = service.predict(video, startTimeMs);

      service.clearCanvas();
      if (results) {
        service.drawResults(results);

        // Store frame for local export
        capturedFramesRef.current.push(results);
        setFrameCount(capturedFramesRef.current.length);

        // Send data via tunnel if connected.
        // We use getState() to get the latest state without causing re-renders in the hook.
        const { service: tunnelService, status: tunnelStatus } = useTunnelStore.getState();
        if (tunnelStatus === 'connected' && tunnelService) {
          tunnelService.sendData(results);
        }
      }

      // Continue the loop
      animationFrameId.current = requestAnimationFrame(predictWebcam);
    }
  }, [videoRef, canvasRef, isCapturing]);

  useEffect(() => {
    const initialize = async () => {
      if (!isCapturing || !canvasRef.current) {
        return;
      }

      try {
        setLoadingState('idle');
        setError(null);
        setDownloadProgress(0);
        clearCapturedFrames(); // Clear previous data on re-initialization

        const canvasCtx = canvasRef.current.getContext('2d');
        if (!canvasCtx) {
          throw new Error('Could not get canvas context');
        }

        const handleProgress: OnProgressCallback = (state, progress) => {
          setLoadingState(state);
          if (state === 'downloadingModel' && progress !== undefined) {
            setDownloadProgress(progress);
          }
        };

        const service = new MediaPipeService();
        await service.initialize(mode, canvasCtx, handleProgress);
        mediaPipeServiceRef.current = service;

        // Start the prediction loop
        animationFrameId.current = requestAnimationFrame(predictWebcam);
      } catch (e: any) {
        setError(e.message || 'Failed to initialize MediaPipe');
        setLoadingState('idle');
      }
    };

    initialize();

    // Cleanup function
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      mediaPipeServiceRef.current?.close();
      clearCapturedFrames();
    };
  }, [isCapturing, mode, canvasRef, predictWebcam, clearCapturedFrames]);

  return {
    isLoading: loadingState !== 'idle' && loadingState !== 'ready',
    loadingState,
    downloadProgress,
    error,
    frameCount,
    getCapturedFrames,
    clearCapturedFrames,
  };
}