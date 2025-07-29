'use client';

import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import {
  VideoProcessorService,
  CancellationError,
} from '@/services/motion/video-processor';
import {
  MediaPipeMode,
  FaceLandmarkerResult,
  PoseLandmarkerResult,
} from '@/services/motion/mediapipe';
import { exportMotionDataAsJson } from '@/lib/json-export';

type FrameData = FaceLandmarkerResult | PoseLandmarkerResult;

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [capturedFrames, setCapturedFrames] = useState<FrameData[]>([]);
  const [processingMode, setProcessingMode] =
    useState<MediaPipeMode>('full-body');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const processorRef = useRef<VideoProcessorService | null>(null);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      // Revoke previous object URL to prevent memory leaks
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
      const previewUrl = URL.createObjectURL(file);
      setVideoPreviewUrl(previewUrl);
      setCapturedFrames([]); // Reset previous results
      setProcessingProgress(0);
    } else if (file) {
      toast.error('Please select a valid video file (e.g., .mp4).');
      setVideoFile(null);
      setVideoPreviewUrl(null);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  }, []);

  const handleProcessVideo = async () => {
    if (!videoFile) return;

    setIsProcessing(true);
    setProcessingProgress(0);
    setCapturedFrames([]);

    processorRef.current = new VideoProcessorService();
    try {
      const frames = await processorRef.current.process(
        videoFile,
        processingMode,
        (progress) => {
          setProcessingProgress(progress.percentage);
        },
      );
      setCapturedFrames(frames);
      toast.success(`Processing complete! ${frames.length} frames captured.`);
    } catch (error: any) {
      if (error instanceof CancellationError) {
        toast.success('Processing cancelled.');
      } else {
        console.error('Video processing failed:', error);
        toast.error(`An error occurred during processing: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
      processorRef.current = null;
    }
  };

  const handleCancel = () => {
    if (processorRef.current) {
      processorRef.current.cancel();
    }
  };

  const handleClear = () => {
    if (isProcessing) return; // Should not be possible via UI, but a good safeguard
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setCapturedFrames([]);
    setProcessingProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Cleared video and results.');
  };

  const handleExport = () => {
    exportMotionDataAsJson(capturedFrames, processingMode, `${videoFile?.name}.json`);
  };

  return (
    <PageLayout>
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload & Process Video</h1>
          <Link href="/" className="text-sm text-blue-500 hover:underline">
            &larr; Back to Home
          </Link>
        </div>

        {!videoFile ? (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer
              ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600'}
              hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">MP4, MOV, or other video formats</p>
            </div>
            <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={onFileSelect} />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-full aspect-video bg-black rounded-md overflow-hidden">
              {videoPreviewUrl && <video src={videoPreviewUrl} className="w-full h-full" controls />}
            </div>
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              <p>File: {videoFile.name}</p>
            </div>
            {/* Processing Mode Selector */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Processing Mode
              </label>
              <div className="flex gap-4">
                <Button
                  onClick={() => setProcessingMode('facial')}
                  variant={processingMode === 'facial' ? 'primary' : 'outline'}
                  disabled={isProcessing}
                >
                  Facial
                </Button>
                <Button
                  onClick={() => setProcessingMode('full-body')}
                  variant={
                    processingMode === 'full-body' ? 'primary' : 'outline'
                  }
                  disabled={isProcessing}
                >
                  Full Body
                </Button>
              </div>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="mt-4 w-full">
            <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-2">
              Processing... {Math.round(processingProgress)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${processingProgress}%` }}></div>
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row justify-end items-center gap-4">
          {!isProcessing ? (
            <>
              <Button
                onClick={handleClear}
                variant="secondary"
                className="w-full sm:w-auto mr-auto"
                disabled={!videoFile}
              >
                Clear
              </Button>
              <Button
                onClick={handleProcessVideo}
                className="w-full sm:w-auto"
                disabled={!videoFile}
              >
                {capturedFrames.length > 0 ? 'Re-process Video' : 'Process Video'}
              </Button>
              <Button
                onClick={handleExport}
                variant="success"
                className="w-full sm:w-auto"
                disabled={capturedFrames.length === 0}
              >
                Export JSON
              </Button>
            </>
          ) : (
            <>
              <Button className="w-full sm:w-auto" disabled loading>
                Processing...
              </Button>
              <Button onClick={handleCancel} variant="danger" className="w-full sm:w-auto">
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}