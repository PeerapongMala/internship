// import StoreGlobal from '@store/global';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
// import { ReactSortable } from 'react-sortablejs';

const scenarioSizeDefault = { width: 1440, height: 810 };

// Create a context for the scale factor
const ScaleContext = createContext<number>(1);

// Export hook to use the scale factor in child components
export const useScale = () => useContext(ScaleContext);

const ResponsiveScalerV2 = (props: {
  scenarioSize?: { width: number; height: number };
  className?: string;
  deBugVisibleIs?: boolean;
  deBugCursorIs?: boolean;
  onScaleChange?: (scale: number) => void;
  onCursorPositionChange?: ({ x, y }: { x: number; y: number }) => void;
  children?: React.ReactNode;
}) => {
  const { className } = props;
  let { scenarioSize } = props;
  if (!scenarioSize) {
    scenarioSize = {
      width: scenarioSizeDefault.width,
      height: scenarioSizeDefault.height,
    };
  }
  const [containerDimensions, setContainerDimensions] = useState({
    width: scenarioSize.width,
    height: scenarioSize.height,
  });
  const [scale, setScale] = useState(1);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isPointerActive, setIsPointerActive] = useState(false);
  const [isDragging] = useState(false);
  const bodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (!bodyRef.current) return;

      const bodyWidth = bodyRef.current.offsetWidth;
      const bodyHeight = bodyRef.current.offsetHeight;

      const bodyAspectRatio = bodyWidth / bodyHeight;
      const baseAspectRatio = scenarioSize.width / scenarioSize.height;

      let containerWidth, containerHeight, newScale;

      if (bodyAspectRatio > baseAspectRatio) {
        // Wider than 16:9 (landscape)
        containerHeight = scenarioSize.height;
        containerWidth = containerHeight * bodyAspectRatio;
        newScale = bodyHeight / scenarioSize.height;
      } else {
        // Taller than 16:9 (portrait)
        containerWidth = scenarioSize.width;
        containerHeight = containerWidth / bodyAspectRatio;
        newScale = bodyWidth / scenarioSize.width;
      }

      setContainerDimensions({
        width: containerWidth,
        height: containerHeight,
      });
      // StoreGlobal.MethodGet().scaleSet(newScale);
      setScale(newScale);
      props.onScaleChange?.(newScale);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) return; // Don't track cursor during drag
    const rect = bodyRef.current?.getBoundingClientRect();
    if (rect) {
      // StoreGlobal.MethodGet().cursorPositionSet({
      //   x: e.clientX - rect.left,
      //   y: e.clientY - rect.top,
      // });
      props.onCursorPositionChange?.({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setCursorPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isDragging) return; // Don't activate custom cursor during drag
    setIsPointerActive(true);
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    setIsPointerActive(false);
  };

  const handlePointerLeave = () => {
    setIsPointerActive(false);
  };

  const containerStyle: React.CSSProperties = {
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: `translate(-50%, -50%) scale(${scale})`,
    transformOrigin: 'center center',
    // backgroundColor: 'rgba(1, 1, 0, 0.3)',
  };

  const debugStyle: React.CSSProperties = {
    top: '10px',
    right: '10px',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    fontSize: '12px',
    zIndex: 1000,
  };

  const cursorStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${cursorPosition.x}px`,
    top: `${cursorPosition.y}px`,
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue color with transparency
    border: '2px solid rgba(59, 130, 246, 0.8)',
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    transition: 'opacity 0.2s ease-in-out, transform 0.1s ease-out',
    opacity: isPointerActive ? 1 : 0,
    zIndex: 1000,
    boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)',
  };

  const bodyClassName = 'relative';

  return (
    <>
      <div
        className={className ? className + ' ' + bodyClassName : bodyClassName}
        ref={bodyRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        {/* Custom cursor circle */}
        {props.deBugCursorIs && (
          <div
            style={{
              ...cursorStyle,
              opacity: isPointerActive && !isDragging ? 1 : 0,
            }}
          />
        )}

        <div style={containerStyle}>
          {props.deBugVisibleIs && (
            <div style={debugStyle}>
              <p>RealSize:</p>
              <p>Width: {bodyRef?.current?.offsetWidth.toFixed(2)}px</p>
              <p>Height: {bodyRef?.current?.offsetHeight.toFixed(2)}px</p>
              <p>Rescaler:</p>
              <p>Width: {containerDimensions.width.toFixed(2)}px</p>
              <p>Height: {containerDimensions.height.toFixed(2)}px</p>
              <p>scenarioSize:</p>
              <p>Width: {scenarioSize.width}px</p>
              <p>Height: {scenarioSize.height}px</p>
              <p>Scale: {scale.toFixed(3)}</p>
            </div>
          )}
          {props.children}

          {/* <TempReactSortable
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            /> */}
        </div>
      </div>
    </>
  );
};

// const TempReactSortable = ({
//   isDragging,
//   setIsDragging
// }: {
//   isDragging: boolean;
//   setIsDragging: (dragging: boolean) => void;
// }) => {
//   interface ItemType {
//     id: number;
//     name: string;
//   }
//   const [state, setState] = useState<ItemType[]>([
//     { id: 1, name: "shrek" },
//     { id: 2, name: "fiona" },
//   ]);
//   return (
//     <ReactSortable
//       list={state}
//       setList={setState}
//       onStart={() => setIsDragging(true)}
//       onEnd={() => setIsDragging(false)}
//       animation={200}
//       group={{
//         name: 'shared',
//         pull: 'clone',
//         put: false,
//       }}
//     >
//       {state.map((item) => (
//         <div
//           key={item.id}
//           style={{
//             padding: '10px',
//             margin: '5px',
//             backgroundColor: 'rgba(0, 100, 200, 0.3)',
//             border: '1px solid rgba(0, 100, 200, 0.3)',
//             cursor: isDragging ? 'grabbing' : 'grab',
//             userSelect: 'none',
//           }}
//         >
//           {item.name}
//         </div>
//       ))}
//     </ReactSortable>
//   )
// }

export default ResponsiveScalerV2;
