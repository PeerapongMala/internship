import * as THREE from 'three';

/**
 * Creates a texture with text rendered on a canvas
 * @param text - The text to render on the texture
 * @returns THREE.CanvasTexture with the rendered text
 */
export function createTextTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not get 2D context for canvas');
  }
  const size = 256; // Size of the canvas

  canvas.width = size;
  canvas.height = size;

  // Fill the canvas with a background color
  context.fillStyle = 'rgb(0, 128, 0, 0.5)';
  context.fillRect(0, 0, size, size);

  // Set text properties
  context.font = 'bold 128px Arial';
  context.fillStyle = 'black';
  context.textAlign = 'center' as CanvasTextAlign;
  context.textBaseline = 'middle' as CanvasTextBaseline;

  // Draw the text
  context.fillText(text, size / 2, size / 2);

  // Create texture
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
