import * as THREE from 'three';

interface TextLabelSize {
  width: number;
  height: number;
}

interface TextLabelOptions {
  size?: TextLabelSize;
  color?: string;
  font?: string;
  transparent?: boolean;
  position: THREE.Vector3;
}

const DEFAULT_OPTIONS: Omit<TextLabelOptions, 'position'> = {
  size: { width: 5, height: 5 },
  color: 'black',
  font: '120px Inter',
  transparent: true,
};

export class TextLabelHandler {
  private scene: THREE.Scene;
  private labels: Map<THREE.Mesh, TextLabelOptions>;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.labels = new Map();
  }

  public createTextLabel(text: string, options: TextLabelOptions): THREE.Mesh {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const { size, color, font, transparent, position } = mergedOptions;

    // Create a canvas element to draw the text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Failed to get 2D context for text label');
    }

    canvas.width = size!.width;
    canvas.height = size!.height;
    context.font = font!;
    context.fillStyle = color!;
    context.fillText(text, size!.width, size!.height);

    // Create a texture from the canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Create a plane geometry and apply the texture
    const geometry = new THREE.PlaneGeometry(size!.width, size!.height);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: transparent,
    });
    const plane = new THREE.Mesh(geometry, material);

    // Position the plane in the scene
    plane.position.copy(position);
    this.scene.add(plane);

    // Store the label options for later updates
    this.labels.set(plane, mergedOptions);

    return plane;
  }

  public updateTextLabel(
    plane: THREE.Mesh,
    newText: string,
    options?: Partial<TextLabelOptions>,
  ): void {
    const storedOptions = this.labels.get(plane);
    if (!storedOptions) {
      console.error('Label not found in managed labels');
      return;
    }

    const mergedOptions = { ...storedOptions, ...options };
    const { color, font } = mergedOptions;

    const material = plane.material as THREE.MeshBasicMaterial;
    if (!material.map || !material.map.image) {
      console.error('Invalid material or texture on label');
      return;
    }

    // Update the canvas element with new text
    const context = material.map.image.getContext('2d');
    if (!context) {
      console.error('Failed to get 2D context from texture');
      return;
    }

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.font = font!;
    context.fillStyle = color!;
    context.fillText(newText, context.canvas.width, context.canvas.height);

    // Update the texture
    material.map.needsUpdate = true;

    // Update stored options
    this.labels.set(plane, mergedOptions);
  }

  public removeLabel(plane: THREE.Mesh): void {
    if (this.labels.has(plane)) {
      this.scene.remove(plane);
      this.labels.delete(plane);
      plane.geometry.dispose();
      (plane.material as THREE.MeshBasicMaterial).map?.dispose();
      (plane.material as THREE.MeshBasicMaterial).dispose();
    }
  }

  public removeAllLabels(): void {
    this.labels.forEach((_, plane) => {
      this.removeLabel(plane);
    });
    this.labels.clear();
  }

  public getLabelOptions(plane: THREE.Mesh): TextLabelOptions | undefined {
    return this.labels.get(plane);
  }
}
