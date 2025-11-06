'use client';

import { useEffect, useRef } from 'react';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  MeshBuilder,
  Vector3,
  StandardMaterial,
  Color3,
  Mesh,
} from '@babylonjs/core';
import '@babylonjs/loaders';

type Props = {
  landmarks: { x: number; y: number }[] | null;
};

export default function BabylonViewer({ landmarks }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headRef = useRef<Mesh | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);

    // Camera
    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2.5, 2, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Light
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.9;

    // Head Mesh (placeholder sphere)
    const head = MeshBuilder.CreateSphere('head', { diameter: 1 }, scene);
    head.position.y = 0.5;
    headRef.current = head;

    const material = new StandardMaterial('headMat', scene);
    material.diffuseColor = new Color3(0.8, 0.6, 0.5);
    head.material = material;

    // Animation loop
    engine.runRenderLoop(() => {
      if (landmarks && landmarks.length > 0) {
        const leftEye = landmarks[33];   // Approximate left eye
        const rightEye = landmarks[263]; // Approximate right eye
        const noseTip = landmarks[1];    // Nose tip

        const dx = rightEye.x - leftEye.x;
        const dy = noseTip.y - 0.5;

        head.rotation.y = dx * 2; // Horizontal tilt
        head.rotation.x = dy * 2; // Vertical tilt
      } else {
        head.rotation.y += 0.005; // Idle rotation
      }

      scene.render();
    });

    window.addEventListener('resize', () => engine.resize());

    return () => {
      engine.dispose();
      window.removeEventListener('resize', () => engine.resize());
    };
  }, [landmarks]);

  return (
    <div className="mt-6 w-full max-w-3xl">
      <h3 className="text-white text-lg mb-2">3D Head Model</h3>
      <canvas ref={canvasRef} className="w-full h-[400px] border border-gray-700 rounded" />
    </div>
  );
}
