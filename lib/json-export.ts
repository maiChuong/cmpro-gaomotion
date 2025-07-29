import {
  FaceLandmarkerResult,
  PoseLandmarkerResult,
} from '@mediapipe/tasks-vision';
import { MediaPipeMode } from '@/services/motion/mediapipe';
import toast from 'react-hot-toast';

/**
 * Defines the structure for the exported JSON file.
 */
interface MotionData {
  metadata: {
    source: string;
    version: string;
    captureMode: MediaPipeMode;
    frameCount: number;
    exportedAt: string; // ISO 8601 date string
  };
  frames: (FaceLandmarkerResult | PoseLandmarkerResult)[];
}

/**
 * Serializes motion capture data into a JSON file and triggers a download.
 *
 * @param { (FaceLandmarkerResult | PoseLandmarkerResult)[] } capturedFrames - An array of result objects from MediaPipe.
 * @param { MediaPipeMode } mode - The capture mode that was used ('facial' or 'full-body').
 * @param { string } [fileName='gaomotion-export.json'] - The desired name for the downloaded file.
 */
export function exportMotionDataAsJson(
  capturedFrames: (FaceLandmarkerResult | PoseLandmarkerResult)[],
  mode: MediaPipeMode,
  fileName: string = 'gaomotion-export.json',
) {
  if (!capturedFrames || capturedFrames.length === 0) {
    console.error('Export failed: No frames to export.');
    toast.error('Export failed: No motion data has been captured.');
    return;
  }

  const motionData: MotionData = {
    metadata: {
      source: 'GaoMotion',
      version: '1.0.0',
      captureMode: mode,
      frameCount: capturedFrames.length,
      exportedAt: new Date().toISOString(),
    },
    frames: capturedFrames,
  };

  const jsonString = JSON.stringify(motionData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}