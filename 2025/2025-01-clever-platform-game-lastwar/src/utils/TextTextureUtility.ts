import * as THREE from 'three';

interface TextureOptions {
  size?: number;
  font?: {
    normal: string;
    wall: string;
  };
  lineFontSizes?: number[]; // ขนาดฟอนต์สำหรับแต่ละบรรทัด [บรรทัดแรก, บรรทัดที่สอง, ...]
  strokeWidth?: number; // ความหนาของขอบตัวอักษร
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
  size: 1024, // เพิ่มความละเอียดจาก 512 → 1024 เพื่อความคมชัด
  font: {
    normal: 'bold 180px Arial',
    wall: 'bold 240px Arial',
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

  // Clear canvas with transparent background (no gradient)
  context.clearRect(0, 0, size, size);

  // Configure text rendering
  context.font = mergedOptions.font!.normal;
  context.fillStyle = mergedOptions.colors!.text;
  context.textAlign = 'center';
  context.textBaseline = 'middle';

  const textX = size / 2;
  const textY = size / 2;

  // Split text by newline for multi-line support
  const lines = text.split('\n');

  // Use provided lineFontSizes or parse from font string
  let baseFontSize: number;
  const fontSizeMatch = context.font.match(/(\d+)px/);
  baseFontSize = fontSizeMatch ? parseInt(fontSizeMatch[1]) : 80;

  // Get font size for each line
  const getLineFontSize = (lineIndex: number): number => {
    if (
      mergedOptions.lineFontSizes &&
      mergedOptions.lineFontSizes[lineIndex] !== undefined
    ) {
      return mergedOptions.lineFontSizes[lineIndex];
    }
    return baseFontSize;
  };

  // Calculate lineHeight based on the largest font size
  const maxFontSize = mergedOptions.lineFontSizes
    ? Math.max(...mergedOptions.lineFontSizes, baseFontSize)
    : baseFontSize;
  const lineHeight = maxFontSize * 1.6;

  // Calculate starting Y position to center all lines
  const totalHeight = lineHeight * (lines.length - 1); // Space between lines
  const startY = textY - totalHeight / 2;

  // Add shadow for better visibility
  context.shadowColor = 'rgba(0, 0, 0, 0.8)';
  context.shadowBlur = 15;
  context.shadowOffsetX = 4;
  context.shadowOffsetY = 4;

  // Draw stroke for each line
  const strokeWidth = mergedOptions.strokeWidth ?? 6;
  context.strokeStyle = mergedOptions.colors!.stroke;
  context.lineWidth = strokeWidth;

  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight;
    const lineFontSize = getLineFontSize(index);

    // Set font size for this line
    context.font = context.font.replace(/(\d+)px/, `${lineFontSize}px`);
    context.strokeText(line, textX, lineY);
  });

  // Reset shadow before drawing fill text
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;

  // Draw fill text for each line
  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight;
    const lineFontSize = getLineFontSize(index);

    // Set font size for this line
    context.font = context.font.replace(/(\d+)px/, `${lineFontSize}px`);
    context.fillText(line, textX, lineY);
  });

  // Create and return texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function updateTextTexture(
  texture: THREE.Texture,
  newText: string,
  options: TextureOptions = {},
): void {
  if (!(texture instanceof THREE.CanvasTexture)) {
    console.error('Texture must be a CanvasTexture to update');
    return;
  }

  const newTexture = createTextTexture(newText, options);
  texture.image = newTexture.image;
  texture.needsUpdate = true;
}
