// Firework.tsx
import * as THREE from "three";

const createFirework = (
  sceneRef: THREE.Scene,
  PlacePosition: THREE.Vector3
) => {

  //const clock = new THREE.Clock();
  const gravity = 0.01;
  const splashamount = 8

  let currentGravityY = .22

  let explosionGroup = new THREE.Object3D()
  explosionGroup.position.set(PlacePosition.x, PlacePosition.y, PlacePosition.z)
  let cubeState = [];
  for (let index = 0; index < splashamount; index++) {
    
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ 
      transparent: true, 
      opacity: 1,
      color: new THREE.Color(0, 255, 0),
      side: THREE.DoubleSide
    });
    let plane = new THREE.Mesh(geometry, material);
    explosionGroup.add(plane)
    cubeState.push({
      currentVelocityY: .2,
      currentVelocityX: Math.random() * (index > splashamount/2 ? -.1 : .1),
      currentVelocityZ: Math.random() * (index > splashamount/2 ? -.1 : .1),
    })
  }
  sceneRef.add(explosionGroup)

  const animateExplosion = () => {

    currentGravityY -= gravity;
    const velocity = Math.min(
      0.5,
      Math.max(-1, currentGravityY - gravity)
    );
    explosionGroup.position.y = velocity

    for (let index = 0; index < splashamount; index++) {
      const element = explosionGroup.children[index];

        // Update cube's position based on velocity
        element.rotation.z += 0.05;
        element.rotation.x += 0.05;
        element.rotation.y += 0.05;
        
        element.position.y += explosionGroup.position.y;
        element.position.x += cubeState[index].currentVelocityX;
        element.position.z += cubeState[index].currentVelocityZ;

    }

    if (explosionGroup.position.y <= -35) {
      sceneRef.remove(explosionGroup);
      return;
    }

    requestAnimationFrame(animateExplosion);
  };

  animateExplosion();
};

export default createFirework;
