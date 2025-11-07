'use client';

import { useEffect, useRef } from 'react';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  Mesh,
  MeshBuilder,
  StandardMaterial,
  Color3,
  VertexData,
  VertexBuffer,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import { FACEMESH_TESSELATION } from './faceMeshTesselation';

type Props = {
  landmarks: { x: number; y: number; z?: number }[] | null;
};

export default function BabylonViewer({ landmarks }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const meshRef = useRef<Mesh | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    engineRef.current = engine;
    sceneRef.current = scene;

    // Camera
    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2.5, 3, Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Lighting
    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.9;

    // Initial empty mesh
    const mesh = new Mesh('faceMesh', scene);
    meshRef.current = mesh;

    const material = new StandardMaterial('wireMat', scene);
    material.diffuseColor = new Color3(0.2, 0.8, 1);
    material.wireframe = true;
    mesh.material = material;

    engine.runRenderLoop(() => {
      scene.render();
    });

    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, []);

  useEffect(() => {
    if (!landmarks || !sceneRef.current || !meshRef.current) return;

    const scale = 2;
    const positions = landmarks.map((pt) =>
      new Vector3((pt.x - 0.5) * scale, -(pt.y - 0.5) * scale, -(pt.z ?? 0) * scale)
    );

    const vertexData = new VertexData();
    vertexData.positions = positions.flatMap((v) => [v.x, v.y, v.z]);
    vertexData.indices = FACEMESH_TESSELATION.flatMap(([a, b]) => [a, b]);

    vertexData.applyToMesh(meshRef.current, true);
  }, [landmarks]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0"
    />
  );
}
