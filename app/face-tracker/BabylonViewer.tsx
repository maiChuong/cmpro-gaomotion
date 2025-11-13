'use client';

import { useEffect, useRef, useState } from 'react';
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
import { FACEMESH_SIMPLIFIED } from './faceMeshSimplified';
import { NEUTRAL_FACE_MESH } from './neutralFaceMesh';
import { generateUVLayoutImage } from './generateUVLayout';

type Props = {
  landmarks: { x: number; y: number; z?: number }[] | null;
};

const textureOptions = [
  { label: 'None', value: '' },
  { label: 'Painted UV 01', value: 'painteduv01.png' },
  { label: 'Painted UV 02', value: 'painteduv02.png' },
  { label: 'Painted UV 03', value: 'painteduv03.png' },
];

export default function BabylonViewer({ landmarks }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const materialRef = useRef<StandardMaterial | null>(null);
  const [selectedTexture, setSelectedTexture] = useState<string>('');
  const [showTools, setShowTools] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new Engine(canvas, true);
    const scene = new Scene(engine);
    engineRef.current = engine;
    sceneRef.current = scene;

    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2.5, 6, new Vector3(0, 1.5, 0), scene);
    camera.attachControl(canvas, true);

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    light.intensity = 1;

    scene.clearColor = new Color3(0.1, 0.4, 0.1).toColor4();

    const ground = MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene);
    const groundMaterial = new StandardMaterial('groundMat', scene);
    groundMaterial.diffuseTexture = new Texture('/texture/platform-pro.png', scene);
    groundMaterial.specularColor = new Color3(0, 0, 0);
    ground.material = groundMaterial;

    const mesh = new Mesh('faceMesh', scene);
    meshRef.current = mesh;

    const material = new StandardMaterial('faceMat', scene);
    material.diffuseColor = new Color3(0.8, 0.6, 0.5);
    material.backFaceCulling = false;
    mesh.material = material;
    materialRef.current = material;

    mesh.position.y = 1.5;

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

    const scale = 4;
    const positions = landmarks.map((pt) =>
      new Vector3((pt.x - 0.5) * scale, -(pt.y - 0.5) * scale, -(pt.z ?? 0) * scale)
    );

    const flatPositions = positions.flatMap((v) => [v.x, v.y, v.z]);
    const indices = FACEMESH_SIMPLIFIED.flatMap(([a, b, c]) => [a, b, c]);

    const normals: number[] = [];
    VertexData.ComputeNormals(flatPositions, indices, normals);

    const uvs = landmarks.map((pt) => [pt.x, pt.y]).flat();

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

  useEffect(() => {
    if (!sceneRef.current || !materialRef.current) return;

    if (!selectedTexture) {
      materialRef.current.diffuseTexture = null;
      return;
    }

    const texture = new Texture(`/facepng/${selectedTexture}`, sceneRef.current, false, false);
    materialRef.current.diffuseTexture = texture;
  }, [selectedTexture]);

  const downloadLiveUVLayout = () => {
    if (!landmarks) return;

    const uvLandmarks = landmarks.map((pt) => ({ x: pt.x, y: pt.y }));
    const dataUrl = generateUVLayoutImage(uvLandmarks, FACEMESH_SIMPLIFIED);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'live-uv-layout.png';
    link.click();
  };

  const downloadNeutralUVLayout = () => {
    const dataUrl = generateUVLayoutImage(NEUTRAL_FACE_MESH, FACEMESH_SIMPLIFIED);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'neutral-uv-layout.png';
    link.click();
  };

  const handleTextureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !sceneRef.current || !materialRef.current) return;

    const url = URL.createObjectURL(file);
    const texture = new Texture(url, sceneRef.current, false, false);
    materialRef.current.diffuseTexture = texture;
    setSelectedTexture('');
  };

  return (
    <>
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />

      <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
        <button
          onClick={() => setShowTools((prev) => !prev)}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold shadow"
        >
          {showTools ? 'Hide UV Tools' : 'Show UV Tools'}
        </button>

        {showTools && (
          <div className="mt-2 bg-black/70 p-3 rounded shadow-md flex flex-col gap-2">
            <button
              onClick={downloadLiveUVLayout}
              className="px-3 py-2 bg-white text-black rounded text-sm font-medium"
            >
              Download Live UV Layout
            </button>

            <button
              onClick={downloadNeutralUVLayout}
              className="px-3 py-2 bg-white text-black rounded text-sm font-medium"
            >
              Download Neutral UV Layout
            </button>

            <label className="px-3 py-2 bg-white text-black rounded text-sm font-medium cursor-pointer">
              Upload Painted UV
              <input
                type="file"
                accept="image/*"
                onChange={handleTextureUpload}
                className="hidden"
              />
            </label>

            <select
              value={selectedTexture}
              onChange={(e) => setSelectedTexture(e.target.value)}
              className="px-2 py-1 rounded text-sm bg-white text-black"
            >
              {textureOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </>
  );
}
