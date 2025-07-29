'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { useMediaPipe } from '@/hooks/useMediaPipe';
import { MediaPipeMode } from '@/services/motion/mediapipe';
import { exportMotionDataAsJson } from '@/lib/json-export';
import { useSettingsStore } from '@/store/settingsStore';

export default function CapturePage() {
  const [isCapturing, setIsCapturing] = useState(false); // Is MediaPipe processing?
  const [isCameraEnabled, setIsCameraEnabled] = useState(false); // Is webcam stream active?
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const { captureMode: trackingMode, setCaptureMode: setTrackingMode } = useSettingsStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    isLoading: isMediaPipeLoading, // General loading flag
    loadingState, // Specific loading state
    downloadProgress,
    error: mediaPipeError,
    frameCount,
    getCapturedFrames,
    clearCapturedFrames,
  } = useMediaPipe({
      videoRef,
      canvasRef,
      mode: trackingMode,
      isCapturing,
    });

  const stopWebcam = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraEnabled(false);
    }
  }, [videoRef]);

  const handleToggleCapture = async () => {
    setWebcamError(null);

    if (isCapturing) {
      // Stop capturing (pause)
      setIsCapturing(false);
    } else {
      // Start capturing
      if (!isCameraEnabled) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setIsCameraEnabled(true);
          }
        } catch (err: any) {
          console.error('Error accessing webcam: ', err);
          setWebcamError(err.message || 'Could not access webcam.');
          return;
        }
      }
      setIsCapturing(true);
    }
  };

  // Cleanup webcam on component unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, [stopWebcam]);

  const handleExport = () => {
    const frames = getCapturedFrames();
    exportMotionDataAsJson(frames, trackingMode);
  };

  const handleClearFrames = () => {
    if (frameCount > 0) {
      clearCapturedFrames();
      toast.success('Captured frames have been cleared.');
    }
  };

  return (
    <PageLayout>
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Live Capture</h1>
          <Link href="/" className="text-sm text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted></video>
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
          {/* Status Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black bg-opacity-50 pointer-events-none text-center p-4">
            {webcamError ? (
              <>
                <p className="text-lg font-semibold text-red-500">Webcam Error</p>
                <p className="text-sm">{webcamError}</p>
              </>
            ) : mediaPipeError ? (
              <>
                <p className="text-lg font-semibold text-red-500">Processing Error</p>
                <p className="text-sm">{mediaPipeError}</p>
              </>
            ) : isMediaPipeLoading ? (
              <>
                {loadingState === 'downloadingWasm' && <p>Downloading Engine...</p>}
                {loadingState === 'downloadingModel' && (
                  <div className="w-3/4 max-w-sm text-center">
                    <p className="mb-2">Downloading {trackingMode} Model...</p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-150"
                        style={{ width: `${Math.round(downloadProgress * 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs mt-1 opacity-80">{Math.round(downloadProgress * 100)}%</p>
                  </div>
                )}
              </>
            ) : isCapturing ? (
              <>
                <p className="text-2xl font-bold tracking-widest text-red-500">RECORDING</p>
                <p className="text-sm opacity-80">{frameCount} frames captured</p>
              </>
            ) : isCameraEnabled ? (
              <p className="text-lg font-semibold">Paused</p>
            ) : (
              <p className="text-lg font-semibold">Ready to capture</p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
          {/* Left: Tracking Mode */}
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mode:</span>
            <Button
              onClick={() => setTrackingMode('facial')}
              variant={trackingMode === 'facial' ? 'primary' : 'outline'}
              size="sm"
              disabled={isCapturing}
            >
              Facial
            </Button>
            <Button
              onClick={() => setTrackingMode('full-body')}
              variant={trackingMode === 'full-body' ? 'primary' : 'outline'}
              size="sm"
              disabled={isCapturing}
            >
              Full Body
            </Button>
          </div>

          {/* Center: Start/Stop */}
          <div className="flex justify-center w-full order-first sm:order-none">
            <Button
              onClick={handleToggleCapture}
              variant={isCapturing ? 'danger' : 'primary'}
              className="w-full max-w-xs"
              disabled={isMediaPipeLoading || !!webcamError}
              loading={isMediaPipeLoading}
            >
              {isCapturing ? 'Stop Capture' : 'Start Capture'}
            </Button>
          </div>

          {/* Right: Export */}
          <div className="flex justify-center sm:justify-end w-full gap-2">
            <Button
              onClick={handleClearFrames}
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={frameCount === 0 || isCapturing}
            >
              Clear Frames
            </Button>
            <Button
              onClick={handleExport}
              variant="success"
              className="w-full sm:w-auto"
              disabled={frameCount === 0 || isCapturing}
            >
              Export JSON
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}