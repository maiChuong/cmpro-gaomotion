'use client';

import { useEffect, useRef } from 'react';
import * as BABYLON from 'babylonjs';

export default function BabylonViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new BABYLON.Engine(canvas, true);
    const scene = new BABYLON.Scene(engine);

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
      'Camera',
      Math.PI / 2,
      Math.PI / 2.5,
      5,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    // Lights
    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.9;

    // Sample object (replace with head model or theme)
    const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 1 }, scene);
    sphere.position.y = 1;

    // Background color
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // Resize on window change
    window.addEventListener('resize', () => engine.resize());

    engine.runRenderLoop(() => {
      scene.render();
    });

    return () => {
      engine.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="babylon-canvas"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
