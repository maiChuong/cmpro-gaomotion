import {
  MediaPipeService,
  MediaPipeMode,
  FaceLandmarkerResult,
  PoseLandmarkerResult,
} from './mediapipe';

type FrameData = FaceLandmarkerResult | PoseLandmarkerResult;
type ProgressCallback = (progress: {
  processedFrames: number;
  percentage: number;
}) => void;

/**
 * Custom error to indicate that the processing was intentionally cancelled by the user.
 */
export class CancellationError extends Error {
  constructor(message = 'Processing was cancelled by the user.') {
    super(message);
    this.name = 'CancellationError';
  }
}

/**
 * A service to process a video file frame-by-frame using MediaPipe.
 */
export class VideoProcessorService {
  private mediaPipeService: MediaPipeService | null = null;
  private videoElement: HTMLVideoElement;
  private canvasElement: HTMLCanvasElement;
  private isProcessing = false;

  constructor() {
    // Create hidden elements for offscreen processing
    this.videoElement = document.createElement('video');
    this.videoElement.muted = true;
    this.videoElement.playsInline = true;
    this.canvasElement = document.createElement('canvas');
  }

  /**
   * Processes a video file to extract motion data.
   * @param videoFile The video file to process.
   * @param mode The tracking mode ('facial' or 'full-body').
   * @param onProgress A callback to report processing progress.
   * @returns A promise that resolves with an array of captured frame data.
   */
  public async process(
    videoFile: File,
    mode: MediaPipeMode,
    onProgress: ProgressCallback,
  ): Promise<FrameData[]> {
    if (this.isProcessing) {
      throw new Error('Processing is already in progress.');
    }
    this.isProcessing = true;

    const capturedFrames: FrameData[] = [];
    let processedFrames = 0;

    try {
      // Initialize MediaPipe
      this.mediaPipeService = new MediaPipeService();
      const canvasCtx = this.canvasElement.getContext('2d');
      if (!canvasCtx) throw new Error('Could not get canvas context.');
      await this.mediaPipeService.initialize(mode, canvasCtx);

      // Load video
      this.videoElement.src = URL.createObjectURL(videoFile);
      await new Promise<void>((resolve) => {
        this.videoElement.onloadedmetadata = () => resolve();
      });

      this.canvasElement.width = this.videoElement.videoWidth;
      this.canvasElement.height = this.videoElement.videoHeight;

      return await new Promise<FrameData[]>((resolve, reject) => {
        const processFrame = (now: number, metadata: VideoFrameCallbackMetadata) => {
          if (this.videoElement.ended) {
            this.isProcessing = false;
            this.cleanup();
            resolve(capturedFrames);
            return;
          }

          // Check for cancellation on each frame
          if (!this.isProcessing) {
            this.cleanup();
            reject(new CancellationError());
            return;
          }

          const results = this.mediaPipeService?.predict(this.videoElement, now);
          if (results) {
            capturedFrames.push(results);
          }

          processedFrames++;
          const percentage = this.videoElement.duration
            ? (this.videoElement.currentTime / this.videoElement.duration) * 100
            : 0;
          onProgress({ processedFrames, percentage });

          // Seek to the next frame and request callback
          if (this.videoElement.seeking) return;
          this.videoElement.currentTime += 1 / 30; // Assuming 30fps, adjust if needed
        };

        this.videoElement.onseeked = () => {
          this.videoElement.requestVideoFrameCallback(processFrame);
        };

        // Start processing
        this.videoElement.requestVideoFrameCallback(processFrame);
      });
    } catch (error) {
      this.isProcessing = false;
      this.cleanup();
      throw error;
    }
  }

  /**
   * Signals the processing loop to stop.
   */
  public cancel(): void {
    if (this.isProcessing) {
      console.log('Video processing cancellation requested.');
      this.isProcessing = false;
    }
  }

  private cleanup(): void {
    this.mediaPipeService?.close();
    this.mediaPipeService = null;
    if (this.videoElement.src) {
      URL.revokeObjectURL(this.videoElement.src);
      this.videoElement.src = '';
    }
  }
}