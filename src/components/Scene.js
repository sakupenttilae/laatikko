import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import ObjectLoader from './ObjectLoader';

let widMulti = 1;
let heiMulti = 1;

const Scene = () => {
  
  const sceneRef = useRef();
  const canvasRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();
  const objectRef = useRef();
  const lastScrollDeltaRef = useRef(0);
  
  
  const directionalLightRef = useRef()
  const [lastScrollDelta, setLastScrollDelta] = useState(-1);
  const [useScrollRotation, setUseScrollRotation] = useState(false);
  const [useOrbitControls, setUseOrbitControls] = useState(false);
  const [useZoom, setUseZoom] = useState(false);
  
  // Callback function to set objectRef
  const setObjectRef = (object) => {
    objectRef.current = object;
  };

  //ensure scene is set only once
  useEffect(() => {

    // Scene setup
    const scene = new THREE.Scene();
    canvasRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight , 0.1, 2000);
    cameraRef.current = camera;

    const light = new THREE.AmbientLight( 0x404040, 5 ); // soft white light
    scene.add( light );

    // Directional light setup
    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLightRef.current = directionalLight;
    //add light
    scene.add(directionalLightRef.current);

    // Set light position in world space
    directionalLightRef.current.position.set(20, 10, 10);

    const helper = new THREE.DirectionalLightHelper( directionalLightRef.current, 5, "yellow" );
    scene.add( helper );


    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Set alpha to true for transparent background
    renderer.setClearColor(0xffffff); // Set background color to white
    renderer.setSize(window.innerWidth *widMulti, window.innerHeight *heiMulti);
    rendererRef.current = renderer;

    // Orbit controls setup
    const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enabled = true;
    controlsRef.current = controls;


    return () => {
      // Clean up resources
      controls.dispose();
      renderer.dispose();

    };

  }, [])

  useEffect(() => {

    cameraRef.current.position.set(0, 0, 5);

    // Append renderer to the DOM
    sceneRef.current.appendChild(rendererRef.current.domElement);

    const handleResize = () => {
      const width = window.innerWidth *widMulti;
      const height = window.innerHeight *heiMulti;

      cameraRef.current.aspect = width / height;

      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    // Listen for window resize
    window.addEventListener('resize', handleResize);

    let previousTime = 0;
    // Rotation setup
    const animate = (currentTime) => {
      requestAnimationFrame(animate);

      // Calculate delta time
      const deltaTime = (currentTime - previousTime) * 0.001; // Convert milliseconds to seconds
      previousTime = currentTime;

      controlsRef.current.update();
      rendererRef.current.render(canvasRef.current, cameraRef.current);

      if (objectRef.current) {
        // Spin the bottle with a constant speed based on delta time and the last scroll delta
        const rotationSpeed = 0.3 * lastScrollDeltaRef.current * deltaTime;
        objectRef.current.rotation.y += rotationSpeed;
      }
    };

    //call animate for "first" time, then animation loop begins
    animate();

    // Clean-up
    return () => {
      window.removeEventListener('resize', handleResize);
      if (objectRef.current) {
        canvasRef.current.remove(objectRef.current);
      }
    };
  }, []);

    //start spinning the bottle instantly
    useEffect(() => {
      updateLastScrollDelta(lastScrollDelta);
    }, [lastScrollDelta]);

    // Function to update lastScrollDeltaRef
    const updateLastScrollDelta = (delta) => {
      lastScrollDeltaRef.current = delta;
    };

    const handleMouseWheel = (event) => {
      // Prevent default scrolling behavior
      event.preventDefault();
    
      // Determine scroll direction
      const scrollDirection = event.deltaY > 0 ? 1 : -1;
  
      // Update rotation of the bottle object based on scroll
      if (objectRef.current) {
        const delta = event.deltaY > 0 ? 0.01 : -0.01; // Set rotation direction based on scroll direction
        objectRef.current.rotation.y += delta; // Rotate along the y-axis
        updateLastScrollDelta(scrollDirection); // Update the last scroll delta
      }
  
    };

    useEffect(() => {
      if (useScrollRotation) {
        window.addEventListener('wheel', handleMouseWheel);
      }
      return () => {
        window.removeEventListener('wheel', handleMouseWheel);
      };
    }, [useScrollRotation]);

    useEffect(() => {
      if (useOrbitControls && controlsRef.current) {
        controlsRef.current.enabled = true;
        controlsRef.current.enableZoom = useZoom;
      } else if (controlsRef.current) {

        controlsRef.current.enabled = false;
      }
    }, [useOrbitControls, useZoom]);

  return (
    <>
      <div ref={sceneRef} />
    
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        <button onClick={() => setUseScrollRotation(!useScrollRotation)}>
          {useScrollRotation ? 'Disable Scroll Rotation' : 'Enable Scroll Rotation'}
        </button>
      </div>
      <div style={{ position: 'absolute', top: 30, left: 10 }}>
        <button onClick={() => setUseOrbitControls(!useOrbitControls)}>
          {useOrbitControls ? 'Disable Orbit Controls' : 'Enable Orbit Controls'}
        </button>
      </div>
      {useOrbitControls && (
        <div style={{ position: 'absolute', top: 50, left: 10 }}>
          <button onClick={() => setUseZoom(!useZoom)}>
            {useZoom ? 'Disable Zoom' : 'Enable Zoom'}
          </button>
        </div>
      )}
      <ObjectLoader scene={canvasRef} setObjectRef={setObjectRef} />
      
    </>
  ) 
};

export default Scene;
