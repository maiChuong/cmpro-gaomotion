"use client";

import { useState, useEffect } from 'react';
import { PoseLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

interface UseMediaPipeResult {
  poseLandmarker: PoseLandmarker | undefined;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook to initialize and manage the MediaPipe PoseLandmarker instance.
 */
export const useMediaPipe = (): UseMediaPipeResult => {
  const [poseLandmarker, setPoseLandmarker] = useState<PoseLandmarker | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let landmarker: PoseLandmarker | undefined;

    const createPoseLandmarker = async () => {
      try {
        // Resolve the path to the WASM files. Using a CDN is the easiest way to get started.
        // For production, you might want to self-host these files.
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm'
        );

        // Create the PoseLandmarker instance with the desired options.
        landmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            // Using the 'full' model for better accuracy. 'lite' or 'heavy' are other options.
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task`,
            delegate: 'GPU',
          },
          // 'VIDEO' mode is essential for processing a continuous stream from a webcam.
          runningMode: 'VIDEO',
          numPoses: 1, // We are only tracking one person.
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        setPoseLandmarker(landmarker);
      } catch (e) {
        const err = e instanceof Error ? e : new Error('Failed to initialize PoseLandmarker');
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    createPoseLandmarker();

    // Cleanup function to close the landmarker when the hook is unmounted.
    return () => {
      landmarker?.close();
    };
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return { poseLandmarker, isLoading, error };
};