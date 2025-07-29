'use client';

import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RigPose } from '@/types/rig';

interface CharacterModelProps {
  pose: RigPose | null;
  onTposeReady: (tPose: RigPose) => void;
  debugMode?: boolean;
}

export const CharacterModel: React.FC<CharacterModelProps> = ({ pose, onTposeReady, debugMode = false }) => {
  // Load the GLB model from the public directory
  const { scene } = useGLTF('/models/metarig.glb');
  const tPoseCaptured = useRef(false);
  const boneAxesHelpers = useRef<Record<string, THREE.AxesHelper>>({});

  // Capture the initial T-Pose of the model once it's loaded.
  useEffect(() => {
    if (scene && !tPoseCaptured.current) {
      const tPose: RigPose = {};
      scene.traverse((object) => {
        if (object instanceof THREE.Bone) {
          // Store the initial rotation of each bone
          tPose[object.name] = {
            rotation: object.quaternion.toArray() as [number, number, number, number],
          };
        }
      });
      onTposeReady(tPose);
      tPoseCaptured.current = true;
    }
  }, [scene, onTposeReady]);
  
  // On every frame, apply the pose data to the bones
  useFrame(() => {
    if (pose) {
      // Traverse the scene to find all bones
      scene.traverse((object) => {
        if (object instanceof THREE.Bone) {
          // Check if the current bone has a corresponding entry in the pose data
          const bonePose = pose[object.name];
          if (bonePose) {
            const { rotation } = bonePose;
            // Apply the rotation.
            object.quaternion.fromArray(rotation);

            // Add or remove debug axes
            if (debugMode) {
              if (!boneAxesHelpers.current[object.name]) {
                const helper = new THREE.AxesHelper(0.2); // 20cm axes
                boneAxesHelpers.current[object.name] = helper;
                object.add(helper);
              }
            } else if (boneAxesHelpers.current[object.name]) {
              object.remove(boneAxesHelpers.current[object.name]);
              delete boneAxesHelpers.current[object.name];
            }
          }
        }
      });
    }
  });

  // The primitive object is a way to render a pre-existing Three.js object
  return <primitive object={scene} />;
};

// Preload the model so it's ready when the component mounts for a better user experience.
useGLTF.preload('/models/metarig.glb');