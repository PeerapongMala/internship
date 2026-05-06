import * as THREE from 'three';
import { useEffect } from 'react';

interface GameplayTrailEffectProps {
  sceneRef: React.RefObject<THREE.Scene | null | undefined>;
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null | undefined>;
  mouseRef: React.RefObject<THREE.Vector2>;
  isMouseDown: React.RefObject<boolean>;
  trailPointsRef: React.RefObject<THREE.Vector3[]>;
  color: string;
  // Accepts a color value for the trail effect.
  // Examples:
  // 1. Hex string: "#ff80c0"
  // 2. Hex number: 0xff8000
  // 3. THREE.Color object: new THREE.Color(0x00ffff)
  // This color will be applied to both glow and core lines of the trail.
}

export const GameplayTrailEffect = ({
  sceneRef,
  cameraRef,
  mouseRef,
  isMouseDown,
  trailPointsRef,
  color,
}: GameplayTrailEffectProps) => {
  useEffect(() => {
    if (!sceneRef.current) return;
    const baseColor = new THREE.Color(color);
    // Layer 1: Main Trail (glow)
    const glowMaterial = new THREE.LineBasicMaterial({
      color: baseColor, //  สีชมพู
      transparent: true,
      opacity: 0.8,
      linewidth: 6,
    });

    // Layer 2: Core Trail (sharp)
    const coreMaterial = new THREE.LineBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 1,
      linewidth: 1.5,
    });

    const geometry = new THREE.BufferGeometry().setFromPoints([]);

    const glowLine = new THREE.Line(geometry.clone(), glowMaterial);
    const coreLine = new THREE.Line(geometry.clone(), coreMaterial);

    sceneRef.current.add(glowLine);
    sceneRef.current.add(coreLine);

    const updateTrail = () => {
      const points = trailPointsRef.current;
      if (!points) return;
      if (!isMouseDown.current) {
        const removeCount = Math.ceil(points.length / 10);
        if (points.length > 0) {
          points.splice(0, removeCount);
          updateTrailColors(glowLine, points);
          updateTrailColors(coreLine, points);
          glowLine.geometry.setFromPoints([...points]);
          coreLine.geometry.setFromPoints([...points]);
        }
      } else if (mouseRef.current && cameraRef.current) {
        const vector = new THREE.Vector3(mouseRef.current.x, mouseRef.current.y, 0.5);
        vector.unproject(cameraRef.current);

        if (points.length > 0) {
          const lastPoint = points[points.length - 1];
          const steps = 3;
          for (let i = 1; i <= steps; i++) {
            const t = i / (steps + 1);
            const interpolated = new THREE.Vector3().lerpVectors(lastPoint, vector, t);
            points.push(interpolated);
          }
        }

        points.push(vector);

        if (points.length > 8) points.shift();

        updateTrailColors(glowLine, points);
        updateTrailColors(coreLine, points);
        glowLine.geometry.setFromPoints([...points]);
        coreLine.geometry.setFromPoints([...points]);
      }

      requestAnimationFrame(updateTrail);
    };

    const updateTrailColors = (line: THREE.Line, points: THREE.Vector3[]) => {
      if (points.length === 0) return;

      const colors = [];
      const material = line.material as THREE.LineBasicMaterial;
      const lineBaseColor = new THREE.Color(material.color);

      for (let i = 0; i < points.length; i++) {
        const factor = i / Math.max(points.length - 1, 1);
        const color = lineBaseColor.clone().multiplyScalar(0.3 + factor * 0.7);
        colors.push(color.r, color.g, color.b);
      }

      (line.geometry as THREE.BufferGeometry).setAttribute(
        'color',
        new THREE.Float32BufferAttribute(colors, 3),
      );

      (line.material as THREE.Material).vertexColors = true;
    };

    updateTrail();

    return () => {
      sceneRef.current?.remove(glowLine);
      sceneRef.current?.remove(coreLine);
      glowLine.geometry.dispose();
      coreLine.geometry.dispose();
      glowMaterial.dispose();
      coreMaterial.dispose();
    };
  }, [sceneRef, cameraRef, mouseRef, isMouseDown, trailPointsRef]);

  return null;
};
