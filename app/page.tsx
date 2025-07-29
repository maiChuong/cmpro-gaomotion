'use client';

import { useState, useRef, useEffect } from 'react';
import MotionSelector, { CaptureType } from '@/components/MotionSelector';
import TunnelPairer, { TunnelStatus } from '@/components/TunnelPairer';
import { useMotionCapture, MotionData } from '@/hooks/useMotionCapture';
import { downloadMotionDataAsJson } from '@/lib/json-export';
import RigMapper from '@/components/RigMapper';
import { mapMotionDataToRigPose } from '@/services/motion/mapper';
import { MotionTunnel } from '@/services/motion/export';
import CharacterViewer from '@/components/CharacterViewer';
import { RigPose } from '@/types/rig';
import InputSelector, { InputSourceType } from '@/components/InputSelector';

/**
 * A dedicated component for the live capture view.
 * This ensures that the useMotionCapture hook is not called conditionally.
 */
const CaptureView = ({
  captureType,
  onBack,
}: {
  captureType: CaptureType;
  onBack: () => void;
}) => {
  const motionTunnelRef = useRef<MotionTunnel | null>(null);

  // Use a ref to store the latest motion data to avoid re-renders on every frame.
  const motionDataRef = useRef<MotionData | null>(null);
  // Use state to track if any data has been captured at all, to enable/disable export buttons.
  const [hasCapturedData, setHasCapturedData] = useState(false);
  const [visualizedPose, setVisualizedPose] = useState<RigPose | null>(null);
  const [tPose, setTpose] = useState<RigPose | null>(null);
  const [debugMode, setDebugMode] = useState(false);
  const [inputSource, setInputSource] = useState<InputSourceType>('webcam');
  const [videoUrl, setVideoUrl] = useState<string | undefined>();

  const {
    videoRef,
    canvasRef,
    isCameraOn,
    isProcessing,
    error,
    startCapture,
    stopCapture,
  } = useMotionCapture({
    inputSource,
    videoUrl,
    captureType,
    onData: (data) => {
      // 1. Map the raw data to a rig pose
      const rigPose = mapMotionDataToRigPose(data, tPose);
      if (!rigPose) return;

      motionDataRef.current = rigPose; // Store the mapped pose for export/tunnel
      setVisualizedPose(rigPose); // Update state for visualization
      if (!hasCapturedData) setHasCapturedData(true);
      motionTunnelRef.current?.sendData(rigPose, captureType); // Send the mapped pose
    },
  });

  const [tunnelStatus, setTunnelStatus] = useState<TunnelStatus>('disconnected');
  const [tunnelError, setTunnelError] = useState<string | null>(null);

  const handleConnect = (url: string) => {
    if (!motionTunnelRef.current) {
      motionTunnelRef.current = new MotionTunnel();
    }

    setTunnelStatus('connecting');
    setTunnelError(null);

    motionTunnelRef.current.onOpen = () => setTunnelStatus('connected');
    motionTunnelRef.current.onClose = () => setTunnelStatus('disconnected');
    motionTunnelRef.current.onError = (message) => {
      setTunnelStatus('error');
      setTunnelError(message);
    };

    motionTunnelRef.current.connect(url);
  };

  const handleDisconnect = () => {
    motionTunnelRef.current?.disconnect();
  };

  // Effect to ensure the tunnel is disconnected on component unmount.
  useEffect(() => {
    return () => {
      motionTunnelRef.current?.disconnect();
    };
  }, []);

  const handleSourceChange = (sourceType: InputSourceType, url?: string) => {
    stopCapture();
    setInputSource(sourceType);
    setVideoUrl(url);
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 border rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/30 transition-colors"
        >
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold capitalize">{captureType} Capture</h1>
        <div className="w-24" /> {/* Spacer */}
      </div>

      <div className="w-full mb-4">
        <InputSelector
          currentSource={inputSource}
          onSourceSelect={(source) => handleSourceChange(source)}
        />
      </div>

      <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4 aspect-video">
        {/* 2D Video Feed */}
        <div className="relative w-full h-full bg-black rounded-lg overflow-hidden shadow-lg">
          <video ref={videoRef} className="w-full h-full" autoPlay playsInline />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
        {/* 3D Character Viewer */}
        <CharacterViewer pose={visualizedPose} onTposeReady={setTpose} debugMode={debugMode} />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        <button
          onClick={startCapture}
          disabled={isCameraOn || isProcessing}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 transition-colors"
        >
          {isProcessing ? 'Initializing...' : 'Start Capture'}
        </button>
        <button
          onClick={stopCapture}
          disabled={!isCameraOn}
          className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:bg-gray-400 transition-colors"
        >
          Stop Capture
        </button>
        <button
          onClick={() => {
            if (motionDataRef.current) {
              downloadMotionDataAsJson(motionDataRef.current, captureType);
            }
          }}
          disabled={!hasCapturedData}
          className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400 transition-colors"
          title="Download the last captured frame as a JSON file."
        >
          Export JSON
        </button>
        <label className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
            className="form-checkbox"
          />
          <span className="text-sm">Debug Mode</span>
        </label>
      </div>
      {error && <p className="mt-4 text-red-500">{error}</p>}

      <div className="mt-8 grid w-full grid-cols-1 gap-8 md:grid-cols-2">
        <TunnelPairer
          status={tunnelStatus}
          error={tunnelError}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />
        <RigMapper pose={visualizedPose} />
      </div>
    </div>
  );
};

export default function Home() {
  const [captureType, setCaptureType] = useState<CaptureType | null>(null);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      {!captureType ? (
        <MotionSelector onSelect={setCaptureType} />
      ) : (
        <CaptureView captureType={captureType} onBack={() => setCaptureType(null)} />
      )}
    </main>
  );
}
