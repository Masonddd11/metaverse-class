"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const MetaversePage: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const surfaceGeometry = new THREE.PlaneGeometry(20, 20);
    const surfaceMaterial = new THREE.MeshPhongMaterial({ color: 0x999999 });
    const surface = new THREE.Mesh(surfaceGeometry, surfaceMaterial);
    surface.rotation.x = -Math.PI / 2;
    scene.add(surface);

    // Add walls
    const wallHeight = 10; // Increased wall height
    const wallGeometry = new THREE.BoxGeometry(20, wallHeight, 0.1);
    const wallMaterial = new THREE.MeshPhongMaterial({ color: 0x8888ff });

    const wallNorth = new THREE.Mesh(wallGeometry, wallMaterial);
    wallNorth.position.set(0, wallHeight / 2, -10);
    scene.add(wallNorth);

    const wallSouth = new THREE.Mesh(wallGeometry, wallMaterial);
    wallSouth.position.set(0, wallHeight / 2, 10);
    scene.add(wallSouth);

    const wallEast = new THREE.Mesh(wallGeometry, wallMaterial);
    wallEast.rotation.y = Math.PI / 2;
    wallEast.position.set(10, wallHeight / 2, 0);
    scene.add(wallEast);

    const wallWest = new THREE.Mesh(wallGeometry, wallMaterial);
    wallWest.rotation.y = Math.PI / 2;
    wallWest.position.set(-10, wallHeight / 2, 0);
    scene.add(wallWest);

    // Character
    const characterGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const characterMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
    const character = new THREE.Mesh(characterGeometry, characterMaterial);
    character.position.y = 0.5;
    scene.add(character);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Camera setup
    camera.position.set(0, 3, 5);
    const cameraOffset = new THREE.Vector3(0, 2, 5);

    const moveSpeed = 0.1;
    const rotationSpeed = 0.05;
    const keysPressed: { [key: string]: boolean } = {};
    let mouseX = 0;

    window.addEventListener("keydown", (event) => {
      keysPressed[event.key.toLowerCase()] = true;
    });

    window.addEventListener("keyup", (event) => {
      keysPressed[event.key.toLowerCase()] = false;
    });

    window.addEventListener("mousemove", (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    });

    // Collision detection function
    const checkCollision = (newPosition: THREE.Vector3) => {
      const wallDistance = 9.75;

      return (
        newPosition.x > -wallDistance &&
        newPosition.x < wallDistance &&
        newPosition.z > -wallDistance &&
        newPosition.z < wallDistance
      );
    };

    const animate = () => {
      requestAnimationFrame(animate);

      character.rotation.y += mouseX * rotationSpeed;

      const direction = new THREE.Vector3();
      if (keysPressed["w"]) direction.z -= 1;
      if (keysPressed["s"]) direction.z += 1;
      if (keysPressed["a"]) direction.x -= 1;
      if (keysPressed["d"]) direction.x += 1;

      direction.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        character.rotation.y
      );
      direction.normalize().multiplyScalar(moveSpeed);

      const newPosition = character.position.clone().add(direction);

      if (checkCollision(newPosition)) {
        character.position.copy(newPosition);
      }

      const idealOffset = cameraOffset
        .clone()
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), character.rotation.y);
      const idealLookat = character.position
        .clone()
        .add(new THREE.Vector3(0, 1, 0));

      const t = 0.1;
      camera.position.lerp(character.position.clone().add(idealOffset), t);
      camera.lookAt(idealLookat);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", () => {});
      window.removeEventListener("keyup", () => {});
      window.removeEventListener("mousemove", () => {});
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default MetaversePage;
