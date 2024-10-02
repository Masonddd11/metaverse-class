import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Canvas
const canvas = document.querySelector('canvas');

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
let cameraRotation = { yaw: 0, pitch: 0 };

// GLTF Loader
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  '/model/swedish-royal/scene1.gltf',
  (gltf) => {
    console.log('Model loaded!', gltf);
    const model = gltf.scene;
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error('An error happened while loading the model', error);
  }
);

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
const runSpeedMultiplier = 2; // Speed multiplier for running
const walkSpeedMultiplier = 0.7; // Speed multiplier for walking
let currentSpeed = stepDistance;
let isWalking = false;
let isRunning = false; // Track if the player is running

// Jumping variables
let isJumping = false;
let jumpDuration = 60; // Duration of the jump in frames
let jumpTime = 0; // Track time since jump started
const initialCameraHeight = 10 // Starting height of the camera
const squatHeight = 1; // Height when squatting
let targetHeight = initialCameraHeight; // Height to interpolate to
const jumpHeight = 10; // New variable to define how high the jump should be

// Squatting variables
let squatSpeed = 0.1; // Speed of the transition while squatting
let isSquatting = false; // Track if the player is squatting

// Breathing animation variables
let breathingTime = 0;
const breathingAmplitude = 0.05; // Reduced amplitude of the breathing effect
const breathingFrequency = 0.5; // Frequency of the breathing effect

let breathingTime1 = 0;
const breathingAmplitude1 = 0.12;
//const breathingFrequency1 = 2 * Math.pi;

// Shake parameters
const shakeAmplitude = 0.05; // Amplitude of the shake
const shakeFrequency = 2; // Frequency of the shake
let shakeDirection = 0; // Track left or right shake direction

// Handle mouse and touch movement
let isMouseDown = false;
const onMouseDownPosition = new THREE.Vector2();

const onPointerDown = (event) => {
  isMouseDown = true;
  onMouseDownPosition.set(
    event.clientX || event.touches[0].clientX,
    event.clientY || event.touches[0].clientY
  );
};

const onPointerUp = () => {
  isMouseDown = false;
};

const onPointerMove = (event) => {
  if (isMouseDown) {
    const clientX = event.clientX || event.touches[0].clientX;
    const clientY = event.clientY || event.touches[0].clientY;
    const deltaX = clientX - onMouseDownPosition.x;
    const deltaY = clientY - onMouseDownPosition.y;

    cameraRotation.pitch -= deltaY * 0.002;
    cameraRotation.yaw -= deltaX * 0.002;

    cameraRotation.pitch = Math.max(-Math.PI / 2 + 0.1,
      Math.min(Math.PI / 2 - 0.1, cameraRotation.pitch));
    cameraRotation.yaw = cameraRotation.yaw % (Math.PI * 2);

    const quaternion = new THREE.Quaternion();
    quaternion.setFromEuler(new THREE.Euler(cameraRotation.pitch, cameraRotation.yaw, 0, 'YXZ'));
    camera.quaternion.copy(quaternion);

    onMouseDownPosition.set(clientX, clientY);
  }
};

window.addEventListener('mousedown', onPointerDown);
window.addEventListener('mouseup', onPointerUp);
window.addEventListener('mousemove', onPointerMove);
window.addEventListener('touchstart', onPointerDown);
window.addEventListener('touchend', onPointerUp);
window.addEventListener('touchmove', onPointerMove);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// Handle window resize
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};
window.addEventListener('resize', onWindowResize);

// Movement logic
const moveCamera = () => {
  const front = new THREE.Vector3();
  camera.getWorldDirection(front);
  front.y = 0;
  front.normalize();

  const newPosition = camera.position.clone();
  const shakeOffset = Math.sin(Date.now() * shakeFrequency) * shakeAmplitude; // Calculate shake offset
  if (isWalking) {
    breathingTime1 += 0.1;

    // Calculate the horizontal figure-eight motion
    newPosition.x += Math.sin(breathingTime1) * breathingAmplitude1; // Left-right motion
    newPosition.z += Math.sin(breathingTime1 * 0.5) * breathingAmplitude1; // Up-down motion (slower for the eight shape)

    // Optional: You might want to vary the height (y-axis) to make it more dynamic
    newPosition.y += Math.sin(breathingTime1 * 2) * 0.1; // Smaller oscillation for the y-axis
  }


  // Movement based on keys pressed
  if (keysPressed['KeyA'] || keysPressed['ArrowLeft']) {
    newPosition.add(new THREE.Vector3().crossVectors(front, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(-currentSpeed));
    isWalking = true;
    shakeDirection = -1; // Set shake direction to left
  } else if (keysPressed['KeyD'] || keysPressed['ArrowRight']) {
    newPosition.add(new THREE.Vector3().crossVectors(front, new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(currentSpeed));
    isWalking = true;
    shakeDirection = 1; // Set shake direction to right
  } else if (keysPressed['KeyS'] || keysPressed['ArrowDown']) {
    newPosition.add(front.clone().negate().multiplyScalar(currentSpeed));
    isWalking = true;
  } else if (keysPressed['KeyW'] || keysPressed['ArrowUp']) {
    newPosition.add(front.multiplyScalar(currentSpeed));
    isWalking = true;
  } else {
    isWalking = false; // Stop moving if no movement keys are pressed
    shakeDirection = 0;
  }

  // Update current speed based on running state
  if (isRunning) {
    currentSpeed = stepDistance * runSpeedMultiplier; // Set speed for running
  } else {
    currentSpeed = stepDistance * walkSpeedMultiplier; // Set speed for walking
  }

  // Implement breathing effect when not moving
  if (!isWalking) {
    breathingTime += 0.05; // Adjust speed of the breathing motion
    newPosition.y += Math.sin(breathingTime * breathingFrequency) * breathingAmplitude; // Breathing motion
  }

  // Check if jumping
  if (isJumping) {
    const t = jumpTime / jumpDuration; // Normalized time (0 to 1)

    // Smooth parabola using quadratic easing
    const yOffset = -4 * (t * (t - 1)) * jumpHeight; // This creates a smooth upward motion followed by a downward motion

    newPosition.y = initialCameraHeight + yOffset; // Update Y position based on jump
    jumpTime++; // Increment jump time

    if (jumpTime >= jumpDuration) {
      isJumping = false; // Reset jumping status
      jumpTime = 0; // Reset jump time
    }
  } else {
    // Smooth transition for squat
    if (isSquatting) {
      targetHeight = squatHeight; // Set to squat height
    } else {
      targetHeight = initialCameraHeight; // Set back to initial height
    }

    newPosition.y = THREE.MathUtils.lerp(newPosition.y, targetHeight, squatSpeed); // Smooth transition to target height
  }

  // Clamp position within defined bounds
  newPosition.x = Math.max(moveAreaBounds.minX, Math.min(moveAreaBounds.maxX, newPosition.x));
  newPosition.y = Math.max(moveAreaBounds.minY, Math.min(moveAreaBounds.maxY, newPosition.y));
  newPosition.z = Math.max(moveAreaBounds.minZ, Math.min(moveAreaBounds.maxZ, newPosition.z));

  // Update camera position
  camera.position.copy(newPosition);
};

// Event listeners for keyboard actions
const keysPressed = {};

const onKeyDown = (event) => {
  event.preventDefault(); // Prevent default behavior
  keysPressed[event.code] = true; // Set key as pressed

  // Jumping logic when Space is pressed
  if (event.code === 'Space' && !isJumping) {
    isJumping = true; // Start jumping
    jumpTime = 0; // Reset jump time
  }

  // Squatting logic when Ctrl is pressed
  if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
    isSquatting = true; // Start squatting
  }

  // Running logic when Shift is pressed
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    isRunning = true; // Start running
  }
};

const onKeyUp = (event) => {
  keysPressed[event.code] = false; // Unset key

  // Stop squatting when the Ctrl key is released
  if (event.code === 'ControlLeft' || event.code === 'ControlRight') {
    isSquatting = false; // Stop squatting
  }

  // Stop running when the Shift key is released
  if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
    isRunning = false; // Stop running
  }
};

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);

// Animation loop
const animate = () => {
  moveCamera(); // Apply movement logic
  renderer.render(scene, camera); // Render the scene
  requestAnimationFrame(animate); // Loop the animation
};

animate(); // Start the animation loop.






