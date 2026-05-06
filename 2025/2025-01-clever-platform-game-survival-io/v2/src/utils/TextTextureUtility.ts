import * as THREE from 'three';

interface TextureOptions {
  size?: number;
  font?: {
    normal: string;
    wall: string;
  };
  colors?: {
    text: string;
    stroke: string;
    gradient: {
      normal: Array<{ stop: number; color: string }>;
      wall: Array<{ stop: number; color: string }>;
    };
  };
}

const DEFAULT_OPTIONS: TextureOptions = {
  size: 256,
  font: {
    normal: 'bold 32px Arial',
    wall: 'bold 48px Arial',
  },
  colors: {
    text: 'white',
    stroke: 'black',
    gradient: {
      normal: [
        { stop: 0, color: 'rgba(0, 0, 0, 0)' },
        { stop: 0.3, color: 'rgba(0, 0, 0, .1)' },
        { stop: 1, color: 'rgba(0, 128, 0, 0.5)' },
      ],
      wall: [
        { stop: 0, color: 'rgba(0, 0, 0, 0)' },
        { stop: 1, color: 'rgba(0, 0, 0, 0)' },
      ],
    },
  },
};

export function createTextTexture(
  text: string,
  isWall: boolean = false,
  options: TextureOptions = {},
): THREE.Texture {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  if (!context) {
    console.error('Failed to get 2D context for text texture');
    return new THREE.Texture();
  }

  const size = mergedOptions.size!;
  canvas.width = size;
  canvas.height = size;

  // Create and apply gradient
  const gradient = context.createLinearGradient(
    size / 4,
    size / 4,
    size / 4,
    (size * 3) / 4,
  );

  const gradientStops = isWall
    ? mergedOptions.colors!.gradient.wall
    : mergedOptions.colors!.gradient.normal;

  gradientStops.forEach(({ stop, color }) => {
    gradient.addColorStop(stop, color);
  });

  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  context.restore();

  // Configure text rendering
  context.font = isWall ? mergedOptions.font!.wall : mergedOptions.font!.normal;
  context.fillStyle = mergedOptions.colors!.text;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  const textX = size / 2 + 16;
  const textY = size / 2 + 16;

  if (isWall) {
    // Draw text with stroke for wall
    context.strokeStyle = mergedOptions.colors!.stroke;
    context.lineWidth = 2;
    context.strokeText(text, textX, textY);
  }

  // Draw the text
  context.fillText(text, textX, textY);

  // Create and return texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function updateTextTexture(
  texture: THREE.Texture,
  newText: string,
  isWall: boolean = false,
  options: TextureOptions = {},
): void {
  if (!(texture instanceof THREE.CanvasTexture)) {
    console.error('Texture must be a CanvasTexture to update');
    return;
  }

  const newTexture = createTextTexture(newText, isWall, options);
  texture.image = newTexture.image;
  texture.needsUpdate = true;
}
