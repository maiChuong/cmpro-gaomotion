'use client';

import { useEffect, useRef } from 'react';
import {
  Engine,
  Scene,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  Mesh,
  StandardMaterial,
  Color3,
  VertexData,
  Texture,
  MeshBuilder,
  VertexBuffer,
} from '@babylonjs/core';
import '@babylonjs/loaders';
import { FACEMESH_TESSELATION } from './faceMeshTesselation3d';

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
    light.intensity = 1;

    // Background and ground
    scene.clearColor = new Color3(0.1, 0.4, 0.1).toColor4();
    MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);

    // Face mesh
    const mesh = new Mesh('faceMesh', scene);
    meshRef.current = mesh;

    // Create ground with texture
    const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);

    const groundMaterial = new StandardMaterial('groundMat', scene);
    groundMaterial.diffuseTexture = new Texture('/texture/platform.png', scene);
    groundMaterial.specularColor = new Color3(0, 0, 0); // remove shine
    ground.material = groundMaterial;
    

    const material = new StandardMaterial('faceMat', scene);
    material.diffuseColor = new Color3(0.8, 0.6, 0.5);
    // Optional texture support:
    // material.diffuseTexture = new Texture('/face_texture.png', scene);
    material.backFaceCulling = false;
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
    if (!landmarks || !meshRef.current) return;

    const scale = 2;
    const positions = landmarks.map((pt) =>
      new Vector3((pt.x - 0.5) * scale, -(pt.y - 0.5) * scale, -(pt.z ?? 0) * scale)
    );

    const flatPositions = positions.flatMap((v) => [v.x, v.y, v.z]);
    const indices = FACEMESH_TESSELATION.flatMap(([a, b, c]) => [a, b, c]);

    const normals: number[] = [];
    VertexData.ComputeNormals(flatPositions, indices, normals);

    const uvs = positions.map((v) => [v.x * 0.5 + 0.5, -v.y * 0.5 + 0.5]).flat();

    const mesh = meshRef.current;
    if (!mesh.geometry) {
      const vertexData = new VertexData();
      vertexData.positions = flatPositions;
      vertexData.indices = indices;
      vertexData.normals = normals;
      vertexData.uvs = uvs;
      vertexData.applyToMesh(mesh, true);
    } else {
      mesh.updateVerticesData(VertexBuffer.PositionKind, flatPositions);
      mesh.updateVerticesData(VertexBuffer.NormalKind, normals);
      mesh.updateVerticesData(VertexBuffer.UVKind, uvs);
    }
  }, [landmarks]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full absolute inset-0"
    />
  );
}
