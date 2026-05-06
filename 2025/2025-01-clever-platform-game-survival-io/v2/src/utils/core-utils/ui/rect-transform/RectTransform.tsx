import React from 'react';
import { Anchor, Pivot } from './type';

const anchorClassMap: Record<Anchor, string> = {
  [Anchor.TopLeft]: 'top-0 left-0',
  [Anchor.TopCenter]: 'top-0 left-1/2 -translate-x-1/2',
  [Anchor.TopRight]: 'top-0 right-0',
  [Anchor.TopStretch]: 'top-0 left-0 right-0',

  [Anchor.MiddleLeft]: 'top-1/2 left-0 -translate-y-1/2',
  [Anchor.MiddleCenter]: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  [Anchor.MiddleRight]: 'top-1/2 right-0 -translate-y-1/2',
  [Anchor.MiddleStretch]: 'top-1/2 left-0 right-0 -translate-y-1/2',

  [Anchor.BottomLeft]: 'bottom-0 left-0',
  [Anchor.BottomCenter]: 'bottom-0 left-1/2 -translate-x-1/2',
  [Anchor.BottomRight]: 'bottom-0 right-0',
  [Anchor.BottomStretch]: 'bottom-0 left-0 right-0',

  [Anchor.LeftStretch]: 'top-0 bottom-0 left-0',
  [Anchor.CenterStretch]: 'top-0 bottom-0 left-1/2 -translate-x-1/2',
  [Anchor.RightStretch]: 'top-0 bottom-0 right-0',
  [Anchor.Stretch]: 'inset-0',
};

export const RectTransform: React.FC<{
  anchor?: Anchor;
  pivot?: Pivot | { x: number; y: number };
  boxSize?: { width: number | string; height: number | string };
  position?: { x: number; y: number };
  rotation?: number;
  scale?: { x: number; y: number };
  showPivot?: boolean;
  children?: React.ReactNode;
}> = ({
  anchor = Anchor.MiddleCenter,
  pivot = Pivot.MiddleCenter,
  boxSize = { width: '100%', height: '100%' },
  position = { x: 0, y: 0 },
  rotation = 0,
  scale = { x: 1, y: 1 },
  showPivot = false,
  children,
}) => {
  const pivotMap: Record<string, { x: number; y: number }> = {
    [Pivot.TopLeft]: { x: 0, y: 0 },
    [Pivot.TopCenter]: { x: 0.5, y: 0 },
    [Pivot.TopRight]: { x: 1, y: 0 },
    [Pivot.MiddleLeft]: { x: 0, y: 0.5 },
    [Pivot.MiddleCenter]: { x: 0.5, y: 0.5 },
    [Pivot.MiddleRight]: { x: 1, y: 0.5 },
    [Pivot.BottomLeft]: { x: 0, y: 1 },
    [Pivot.BottomCenter]: { x: 0.5, y: 1 },
    [Pivot.BottomRight]: { x: 1, y: 1 },
  };

  const pivotCoords =
    typeof pivot === 'string' ? (pivotMap[pivot] ?? { x: 0.5, y: 0.5 }) : pivot;
  const isStretch = anchor === Anchor.Stretch;
  const isHorizontalStretch = [
    Anchor.TopStretch,
    Anchor.MiddleStretch,
    Anchor.BottomStretch,
  ].includes(anchor);
  const isVerticalStretch = [
    Anchor.LeftStretch,
    Anchor.CenterStretch,
    Anchor.RightStretch,
  ].includes(anchor);

  // const width = isStretch || isHorizontalStretch ?
  //   "100%"
  //   : `${boxSize.width}px`;
  // const height = isStretch || isVerticalStretch ?
  //   "100%"
  //   : `${boxSize.height}px`;

  const width =
    isStretch || isHorizontalStretch
      ? '100%'
      : typeof boxSize.width === 'string'
        ? `${boxSize.width}`
        : `${boxSize.width}px`;
  const height =
    isStretch || isVerticalStretch
      ? '100%'
      : typeof boxSize.height === 'string'
        ? `${boxSize.height}`
        : `${boxSize.height}px`;

  /// for testing ///
  // const width = 150;
  // const height = 44.92;

  // const width = "150px";
  // const height = "44.92px";

  // const width = "100%";
  // const height = "100%";

  // const offsetX = -boxSize.width * pivotCoords.x;
  // const offsetY = -boxSize.height * pivotCoords.x;

  const offsetX = isStretch || isHorizontalStretch ? 0 : -boxSize.width * pivotCoords.x;
  const offsetY = isStretch || isVerticalStretch ? 0 : -boxSize.height * pivotCoords.y;

  // const offsetX = isStretch || isHorizontalStretch || typeof boxSize.width === "string" ? 0 : -boxSize.width * pivotCoords.x;
  // const offsetY = isStretch || isVerticalStretch || typeof boxSize.height === "string" ? 0 : -boxSize.height * pivotCoords.y;

  return (
    <div>
      <div className={`absolute ${anchorClassMap[anchor]}`}>
        <div
          className="absolute content-center items-center justify-center object-center text-center"
          style={{
            width: width,
            height: height,
            transform: `translate(${offsetX + position.x}px, ${
              offsetY + position.y
            }px) rotate(${rotation}deg) scale(${scale.x}, ${scale.y})`,
            transformOrigin: `${pivotCoords.x * 100}% ${pivotCoords.y * 100}%`,
          }}
        >
          {children}
          {showPivot && (
            <>
              <div
                className="absolute h-2 w-2 rounded-full bg-black"
                style={{
                  left: `${pivotCoords.x * 100}%`,
                  top: `${pivotCoords.y * 100}%`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              />
              <p className="absolute">
                {width} x {height}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
