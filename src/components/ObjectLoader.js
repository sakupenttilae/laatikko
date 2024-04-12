import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import sss from "../objects/Laatikko.glb";

const ObjectLoader = ({ objectName, scene, setObjectRef }) => {
  const objectRef = useRef();

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      sss,
      (object) => {
        const boundingBox = new THREE.Box3().setFromObject(object.scene);
        const objectCenter = boundingBox.getCenter(new THREE.Vector3());
        const offsetX = -objectCenter.x;
        const offsetY = -objectCenter.y;
        const offsetZ = -objectCenter.z;

        object.scene.position.set(offsetX, offsetY, offsetZ);
        scene.current.add(object.scene);
        objectRef.current = object;
        setObjectRef(object.scene);
      },
      undefined,
      (error) => {
        console.error('An error occurred while loading the GLTF model:', error);
      }
    );

    return () => {
      if (objectRef.current) {
        objectRef.current.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      }
    };
  }, [objectName]);

  return null; // Render loader if still loading
};

export default ObjectLoader;
