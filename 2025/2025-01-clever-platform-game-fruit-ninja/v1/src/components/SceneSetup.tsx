import * as THREE from 'three';

// Scene
export function initializeScene() {
  const newScene = new THREE.Scene();
  
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load('/public/3D_and_Picture/doodlejumpbg.png', (texture) => {
    newScene.background = texture;
  });

  return newScene;
}

// Camera
export function initializeCamera() {
  const newCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  newCamera.position.set(20, 2, 1);
  return newCamera;
}

// Renderer
export function initializeRenderer() {
  const newRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  newRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(newRenderer.domElement);
  return newRenderer;
}