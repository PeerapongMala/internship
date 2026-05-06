import * as THREE from 'three';

export function InstallGameLighting(scene: THREE.Scene) {
  // Create lighting
  const Backlight = new THREE.DirectionalLight(0xffffff, 3);
  Backlight.position.x = -0.3;
  Backlight.position.z = -0.3;
  Backlight.position.y = 0.1;
  Backlight.castShadow = false;

  // Create lighting
  const Backlight2 = new THREE.DirectionalLight(0xffffff, 3);
  Backlight2.position.x = 0.3;
  Backlight2.position.z = -0.3;
  Backlight2.position.y = 0.1;
  Backlight2.castShadow = false;

  // Keylight
  const Keylight = new THREE.DirectionalLight(0xffffff, 1.5);
  Keylight.position.x = 0;
  Keylight.position.z = 1;
  Keylight.position.y = 0.2;

  Keylight.castShadow = true;

  Keylight.shadow.mapSize.width = 2048;
  Keylight.shadow.mapSize.height = 2048;

  Keylight.shadow.camera.near = 0.5;
  Keylight.shadow.camera.far = 50;
  Keylight.shadow.camera.left = -50;
  Keylight.shadow.camera.right = 50;
  Keylight.shadow.camera.top = 50;
  Keylight.shadow.camera.bottom = -50;

  scene.add(Keylight);
  scene.add(Backlight);
  scene.add(Backlight2);

  //scene.add(Filllight);
  //Filllight.lookAt(new THREE.Vector3(0, 0, -15));
  Keylight.lookAt(new THREE.Vector3(0, 0, -15));
  Backlight.lookAt(new THREE.Vector3(0, 0, -15));
  Backlight2.lookAt(new THREE.Vector3(0, 0, -15));

  // Fill light
  scene.add(new THREE.AmbientLight(0xffffff, 2));
}
