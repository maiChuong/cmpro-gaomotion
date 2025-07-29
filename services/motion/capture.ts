import {
  FaceLandmarker,
  PoseLandmarker,
  HandLandmarker,
  FilesetResolver,
} from '@mediapipe/tasks-vision';
import { CaptureType } from '@/components/MotionSelector';

// A union type for the possible landmarker instances
export type MotionLandmarker = FaceLandmarker | PoseLandmarker | HandLandmarker;

// Base path for the MediaPipe models hosted by Google
const BASE_MODEL_PATH = 'https://storage.googleapis.com/mediapipe-models/';

/**
 * Creates and initializes a MediaPipe Landmarker based on the capture type.
 * This function handles loading the appropriate model and configuring it for
 * video-based motion capture.
 *
 * @param captureType The type of motion to capture ('face', 'pose', 'hands').
 * @returns A promise that resolves to the initialized landmarker instance.
 */
export const createMotionLandmarker = async (
  captureType: CaptureType
): Promise<MotionLandmarker> => {
  const vision = await FilesetResolver.forVisionTasks(
    // Path to the WASM files for the vision tasks
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
  );

  switch (captureType) {
    case 'face':
      return await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `${BASE_MODEL_PATH}face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: 'GPU',
        },
        outputFaceBlendshapes: true, // Required for expression tracking
        runningMode: 'VIDEO',
        numFaces: 1, // Track a single face
      });
    case 'pose':
      return await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `${BASE_MODEL_PATH}pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numPoses: 1, // Track a single person
      });
    case 'hands':
      return await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `${BASE_MODEL_PATH}hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 2, // Track both hands
      });
    default:
      // This should never be reached if CaptureType is used correctly
      throw new Error(`Unsupported capture type: ${captureType}`);
  }
};