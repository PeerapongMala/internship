import * as THREE from 'three';

class CollisionDetector {
    static boxCollision({ box1, box2 }) {
        // ตรวจสอบว่ามี box ทั้งสองอยู่หรือไม่ ถ้าไม่มีให้ส่ง error กลับ
        if (!box1 || !box2) {
            console.error("One of the boxes is undefined. Box1:", box1, "Box2:", box2);
            return false;
        }

        // ตรวจสอบว่ามีตำแหน่งของ box ทั้งสองถูกต้องหรือไม่ ถ้าไม่มีให้ส่ง error กลับ
        if (!box1.EntityObject.position || !box2.EntityObject.position) {
            console.error("One of the boxes' positions is undefined. Box1 Position:", box1.EntityObject.position, "Box2 Position:", box2.EntityObject.position);
            return false;
        }

        // ตรวจสอบว่ามีการใช้ bounding box สำหรับโมเดล 3D หรือไม่
        if (box1.EntityObject.boundingBox && box2.EntityObject.boundingBox) {
            // อัปเดต bounding box ของโมเดล 3D
            box1.EntityObject.boundingBox.setFromObject(box1.EntityObject);
            box2.EntityObject.boundingBox.setFromObject(box2.EntityObject);

            // ตรวจสอบการชนโดยใช้ bounding box
            const isColliding = box1.EntityObject.boundingBox.intersectsBox(box2.EntityObject.boundingBox);
            if (isColliding) {
                // หากชนกันจะส่ง true กลับ
                return isColliding;
            }
        }

        // การตรวจสอบการชนแบบพื้นฐาน (ใช้สำหรับกล่องแดง)
        const xCollision = box1.right >= box2.left && box1.left <= box2.right;
        const yCollision = box1.bottom <= box2.top && box1.top >= box2.bottom;
        const zCollision = box1.front >= box2.back && box1.back <= box2.front;

        if (xCollision && yCollision && zCollision) {
            // หากชนกันจะส่ง true กลับ
        }

        return xCollision && yCollision && zCollision; // ส่งผลลัพธ์การชนของกล่องแดงกลับ
    }
}

export { CollisionDetector };