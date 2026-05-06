import * as THREE from 'three';

class TextLabelHandler {
    constructor(scene) {
        this.scene = scene;
    }

    createTextLabel(text, position, size = { width: 5, height: 5 }, color = 'black', font = 'Bold 50px Arial') {
        // Create a canvas element to draw the text
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 512;
        context.font = font;
        context.fillStyle = color;
        context.fillText(text, 50, 100);

        // Create a texture from the canvas
        const texture = new THREE.CanvasTexture(canvas);

        // Create a plane geometry and apply the texture
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const plane = new THREE.Mesh(geometry, material);

        // Position the plane in the scene
        plane.position.set(position.x, position.y, position.z);
        this.scene.add(plane);

        return plane;
    }

    updateTextLabel(plane, newText, color = 'white', font = 'Bold 50px Arial') {
        // Update the canvas element with new text
        const context = plane.material.map.image.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.font = font;
        context.fillStyle = color;
        context.fillText(newText, 50, 100);

        // Update the texture
        plane.material.map.needsUpdate = true;
    }
}

export {TextLabelHandler};