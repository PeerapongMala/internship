import * as THREE from 'three'


export function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const size = 256; // Size of the canvas

    canvas.width = size;
    canvas.height = size;

    // Fill the canvas with a background color
    context.fillStyle = 'rgb(0, 128, 0, 0.5)';
    context.fillRect(0, 0, size, size);

    // Set text properties
    context.font = 'bold 128px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    // Draw the text
    context.fillText(text, size / 2, size / 2);

    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}
