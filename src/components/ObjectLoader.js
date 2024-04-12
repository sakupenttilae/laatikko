import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import kkk from "../objects/Laatikko.glb"


const ObjectLoader = ({ objectName, scene, setObjectRef }) => {

  const objectRef = useRef();

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      kkk,
      (object) => {

        // Calculate the bounding box of the object
        const boundingBox = new THREE.Box3().setFromObject(object.scene);

        // Calculate the center of the object
        const objectCenter = boundingBox.getCenter(new THREE.Vector3());

        // Calculate the offset needed to bring the object to the center of the screen
        const offsetX = -objectCenter.x;
        const offsetY = -objectCenter.y;
        const offsetZ = -objectCenter.z;

        object.scene.position.set(offsetX, offsetY, offsetZ);

        scene.current.add(object.scene);
        objectRef.current = object;
        setObjectRef(object.scene)
        
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

  return null;
};

export default ObjectLoader;
