"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const MetaclassScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 0);

    // Camera rotation variables
    const cameraRotation = { yaw: 0, pitch: 0 };

    // GLTF Loader
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      "/model/swedish-royal/scene1.gltf",
      (gltf) => {
        console.log("Model loaded!", gltf);
        const model = gltf.scene;
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("An error happened while loading the model", error);
      }
    );

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 0);
    scene.add(directionalLight);

    const moveAreaBounds = {
      minX: -53,
      maxX: 72,
      minY: 0,
      maxY: 20,
      minZ: -43,
      maxZ: 41,
    };

    // Camera movement variables
    const stepDistance = 1;
    const runSpeedMultiplier = 2;
    const walkSpeedMultiplier = 0.7;
    let currentSpeed = stepDistance;
    let isWalking = false;
    let isRunning = false;

    // Jumping variables
    let isJumping = false;
    const jumpDuration = 60;
    let jumpTime = 0;
    const initialCameraHeight = 10;
    const squatHeight = 1;
    let targetHeight = initialCameraHeight;
    const jumpHeight = 10;

    // Squatting variables
    const squatSpeed = 0.1;
    let isSquatting = false;

    // Breathing animation variables
    let breathingTime = 0;
    const breathingAmplitude = 0.05;
    const breathingFrequency = 0.5;

    let breathingTime1 = 0;
    const breathingAmplitude1 = 0.12;

    // Shake parameters
    const shakeAmplitude = 0.05;
    const shakeFrequency = 2;
    let shakeDirection = 0;

    // Handle mouse and touch movement
    let isMouseDown = false;
    const onMouseDownPosition = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      isMouseDown = true;
      const clientX =
        "touches" in event ? event.touches[0].clientX : event.clientX;
      const clientY =
        "touches" in event ? event.touches[0].clientY : event.clientY;
      onMouseDownPosition.set(clientX, clientY);
    };

    const onPointerUp = () => {
      isMouseDown = false;
    };

    const onPointerMove = (event: MouseEvent | TouchEvent) => {
      if (isMouseDown) {
        const clientX =
          "touches" in event ? event.touches[0].clientX : event.clientX;
        const clientY =
          "touches" in event ? event.touches[0].clientY : event.clientY;
        const deltaX = clientX - onMouseDownPosition.x;
        const deltaY = clientY - onMouseDownPosition.y;

        cameraRotation.pitch -= deltaY * 0.002;
        cameraRotation.yaw -= deltaX * 0.002;

        cameraRotation.pitch = Math.max(
          -Math.PI / 2 + 0.1,
          Math.min(Math.PI / 2 - 0.1, cameraRotation.pitch)
        );
        cameraRotation.yaw = cameraRotation.yaw % (Math.PI * 2);

        const quaternion = new THREE.Quaternion();
        quaternion.setFromEuler(
          new THREE.Euler(cameraRotation.pitch, cameraRotation.yaw, 0, "YXZ")
        );
        camera.quaternion.copy(quaternion);

        onMouseDownPosition.set(clientX, clientY);
      }
    };

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // Movement logic
    const moveCamera = () => {
      const front = new THREE.Vector3();
      camera.getWorldDirection(front);
      front.y = 0;
      front.normalize();

      const newPosition = camera.position.clone();
      const shakeOffset =
        Math.sin(Date.now() * shakeFrequency) * shakeAmplitude;
      if (isWalking) {
        breathingTime1 += 0.1;
        newPosition.x += Math.sin(breathingTime1) * breathingAmplitude1;
        newPosition.z += Math.sin(breathingTime1 * 0.5) * breathingAmplitude1;
        newPosition.y += Math.sin(breathingTime1 * 2) * 0.1;
      }

      if (keysPressed["KeyA"] || keysPressed["ArrowLeft"]) {
        newPosition.add(
          new THREE.Vector3()
            .crossVectors(front, new THREE.Vector3(0, 1, 0))
            .normalize()
            .multiplyScalar(-currentSpeed)
        );
        isWalking = true;
        shakeDirection = -1;
      } else if (keysPressed["KeyD"] || keysPressed["ArrowRight"]) {
        newPosition.add(
          new THREE.Vector3()
            .crossVectors(front, new THREE.Vector3(0, 1, 0))
            .normalize()
            .multiplyScalar(currentSpeed)
        );
        isWalking = true;
        shakeDirection = 1;
      } else if (keysPressed["KeyS"] || keysPressed["ArrowDown"]) {
        newPosition.add(front.clone().negate().multiplyScalar(currentSpeed));
        isWalking = true;
      } else if (keysPressed["KeyW"] || keysPressed["ArrowUp"]) {
        newPosition.add(front.multiplyScalar(currentSpeed));
        isWalking = true;
      } else {
        isWalking = false;
        shakeDirection = 0;
      }

      if (isRunning) {
        currentSpeed = stepDistance * runSpeedMultiplier;
      } else {
        currentSpeed = stepDistance * walkSpeedMultiplier;
      }

      if (!isWalking) {
        breathingTime += 0.05;
        newPosition.y +=
          Math.sin(breathingTime * breathingFrequency) * breathingAmplitude;
      }

      if (isJumping) {
        const t = jumpTime / jumpDuration;
        const yOffset = -4 * (t * (t - 1)) * jumpHeight;
        newPosition.y = initialCameraHeight + yOffset;
        jumpTime++;

        if (jumpTime >= jumpDuration) {
          isJumping = false;
          jumpTime = 0;
        }
      } else {
        if (isSquatting) {
          targetHeight = squatHeight;
        } else {
          targetHeight = initialCameraHeight;
        }
        newPosition.y = THREE.MathUtils.lerp(
          newPosition.y,
          targetHeight,
          squatSpeed
        );
      }

      newPosition.x = Math.max(
        moveAreaBounds.minX,
        Math.min(moveAreaBounds.maxX, newPosition.x)
      );
      newPosition.y = Math.max(
        moveAreaBounds.minY,
        Math.min(moveAreaBounds.maxY, newPosition.y)
      );
      newPosition.z = Math.max(
        moveAreaBounds.minZ,
        Math.min(moveAreaBounds.maxZ, newPosition.z)
      );

      camera.position.copy(newPosition);
    };

    // Event listeners for keyboard actions
    const keysPressed: { [key: string]: boolean } = {};

    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      keysPressed[event.code] = true;

      if (event.code === "Space" && !isJumping) {
        isJumping = true;
        jumpTime = 0;
      }

      if (event.code === "ControlLeft" || event.code === "ControlRight") {
        isSquatting = true;
      }

      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        isRunning = true;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keysPressed[event.code] = false;

      if (event.code === "ControlLeft" || event.code === "ControlRight") {
        isSquatting = false;
      }

      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        isRunning = false;
      }
    };

    // Animation loop
    const animate = () => {
      moveCamera();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    // Add event listeners
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchstart", onPointerDown);
    window.addEventListener("touchend", onPointerUp);
    window.addEventListener("touchmove", onPointerMove);

    // Start the animation loop
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("touchmove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default MetaclassScene;
