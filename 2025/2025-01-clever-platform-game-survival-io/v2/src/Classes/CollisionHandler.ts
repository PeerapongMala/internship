// import * as THREE from 'three';
// import type EntityHandler from './EntityHandler';

// class CollisionDetector {
//   static boxCollision({
//     box1,
//     box2,
//   }: {
//     box1: EntityHandler;
//     box2: EntityHandler;
//   }): boolean {
//     // basic guard
//     if (!box1 || !box2) {
//       // If called during teardown it's normal to have undefined entries; just return false
//       return false;
//     }

//     // If either entity represents a 3D model use Box3 intersection which is more accurate
//     try {
//       if (box1.is3DModel || box2.is3DModel) {
//         const a = new THREE.Box3().setFromObject(box1.EntityObject);
//         const b = new THREE.Box3().setFromObject(box2.EntityObject);
//         return a.intersectsBox(b);
//       }
//     } catch (err) {
//       // In case setFromObject fails for any reason, fall back to AABB from EntityHandler
//       // (don't rethrow - collision check should be tolerant)
//       // eslint-disable-next-line no-console
//       console.warn('Box3 collision check failed, falling back to AABB:', err);
//     }

//     // Fallback axis-aligned bounding box check using extents maintained by EntityHandler
//     const xCollision = box1.right >= box2.left && box1.left <= box2.right;
//     const yCollision = box1.bottom <= box2.top && box1.top >= box2.bottom;
//     const zCollision = box1.front >= box2.back && box1.back <= box2.front;

//     return xCollision && yCollision && zCollision;
//   }
// }

// export { CollisionDetector };

import * as THREE from 'three';

interface Vector3D {
  x: number;
  y: number;
  z: number;
}

interface CollisionBox {
  left: number;
  right: number;
  top: number;
  bottom: number;
  front: number;
  back: number;
  velocity: Vector3D;
}

interface CollisionParams {
  box1: CollisionBox;
  box2: CollisionBox;
}

export class CollisionDetector {
  static boxCollision({ box1, box2 }: CollisionParams): boolean {
    const xCollision: boolean = box1.right >= box2.left && box1.left <= box2.right;
    const yCollision: boolean =
      box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom;
    const zCollision: boolean = box1.front >= box2.back && box1.back <= box2.front;

    return xCollision && yCollision && zCollision;
  }

  static createCollisionBoxFromMesh(mesh: THREE.Object3D): CollisionBox {
    const boundingBox = new THREE.Box3().setFromObject(mesh);

    return {
      left: boundingBox.min.x,
      right: boundingBox.max.x,
      top: boundingBox.max.y,
      bottom: boundingBox.min.y,
      front: boundingBox.max.z,
      back: boundingBox.min.z,
      velocity: { x: 0, y: 0, z: 0 },
    };
  }

  static updateCollisionBox(mesh: THREE.Object3D, box: CollisionBox): void {
    const boundingBox = new THREE.Box3().setFromObject(mesh);

    box.left = boundingBox.min.x;
    box.right = boundingBox.max.x;
    box.top = boundingBox.max.y;
    box.bottom = boundingBox.min.y;
    box.front = boundingBox.max.z;
    box.back = boundingBox.min.z;
  }
}
