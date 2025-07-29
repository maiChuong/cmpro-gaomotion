import { MotionData } from '@/hooks/useMotionCapture';
import { CaptureType } from '@/components/MotionSelector';

// Define a structured format for the exported data, including schema versioning.
export interface MotionDataPacket {
  schemaVersion: string;
  captureType: CaptureType;
  timestamp: string;
  data: MotionData;
}

const SCHEMA_VERSION = '1.0.0';

/**
 * Creates a structured data packet for export or transmission.
 */
export const createMotionDataPacket = (
  motionData: MotionData,
  captureType: CaptureType
): MotionDataPacket => ({
  schemaVersion: SCHEMA_VERSION,
  captureType: captureType,
  timestamp: new Date().toISOString(),
  data: motionData,
});

/**
 * Saves the captured motion data to a JSON file and triggers a browser download.
 *
 * @param motionData The raw motion data from MediaPipe.
 * @param captureType The type of capture that was performed.
 */
export const downloadMotionDataAsJson = (
  motionData: MotionData,
  captureType: CaptureType
): void => {
  const exportObject = createMotionDataPacket(motionData, captureType);
  const jsonString = JSON.stringify(exportObject, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `gaomotion_${captureType}_${new Date().getTime()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Saves the captured motion data to the browser's localStorage.
 */
export const saveMotionDataToLocalStorage = (
  motionData: MotionData,
  captureType: CaptureType,
  key: string = 'latestMotionData'
): void => {
  try {
    const exportObject = createMotionDataPacket(motionData, captureType);
    const jsonString = JSON.stringify(exportObject);
    localStorage.setItem(key, jsonString);
  } catch (error) {
    console.error('Failed to save motion data to localStorage:', error);
  }
};