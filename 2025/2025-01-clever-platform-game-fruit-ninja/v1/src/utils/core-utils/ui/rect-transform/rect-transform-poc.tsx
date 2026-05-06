import { useState } from "react";
import { RectTransform } from "./rect-transform";
import { Anchor, Pivot } from "./type";

export const RectTransformPoC: React.FC = () => {
  const [selectedAnchor, setSelectedAnchor] = useState<Anchor>(Anchor.MiddleCenter);
  const [pivot, setPivot] = useState<Pivot | { x: number; y: number }>(Pivot.MiddleCenter);
  const [boxSize, setBoxSize] = useState<{ width: number | string; height: number | string }>({ width: 200, height: 100 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState({ x: 1, y: 1 });

  const pivotOptions = [
    [Pivot.TopLeft, Pivot.TopCenter, Pivot.TopRight],
    [Pivot.MiddleLeft, Pivot.MiddleCenter, Pivot.MiddleRight],
    [Pivot.BottomLeft, Pivot.BottomCenter, Pivot.BottomRight],
  ];

  const anchorGrid = [
    [Anchor.TopLeft, Anchor.TopCenter, Anchor.TopRight, Anchor.TopStretch],
    [Anchor.MiddleLeft, Anchor.MiddleCenter, Anchor.MiddleRight, Anchor.MiddleStretch],
    [Anchor.BottomLeft, Anchor.BottomCenter, Anchor.BottomRight, Anchor.BottomStretch],
    [Anchor.LeftStretch, Anchor.CenterStretch, Anchor.RightStretch, Anchor.Stretch],
  ];

  const getAnchorButtonStyle = (pos: Anchor) => {
    const isSelected = selectedAnchor === pos;
    const base = isSelected ? "ring-2 ring-offset-1 ring-blue-600" : "";

    if ([Anchor.TopStretch, Anchor.MiddleStretch, Anchor.BottomStretch].includes(pos)) {
      return `${base} bg-yellow-400 text-black`;
    }
    if ([Anchor.LeftStretch, Anchor.CenterStretch, Anchor.RightStretch].includes(pos)) {
      return `${base} bg-red-400 text-white`;
    }
    if (pos === Anchor.Stretch) {
      return `${base} bg-teal-600 text-white`;
    }
    return isSelected ? "bg-blue-500 text-white" : "bg-white text-black";
  };

  const isWidthAdjustable = ![Anchor.LeftStretch, Anchor.CenterStretch, Anchor.RightStretch, Anchor.Stretch].includes(selectedAnchor);
  const isHeightAdjustable = ![Anchor.TopStretch, Anchor.MiddleStretch, Anchor.BottomStretch, Anchor.Stretch].includes(selectedAnchor);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100 overflow-hidden">
      <div className="p-4 bg-white shadow z-30">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="font-medium text-sm text-gray-700">
              Select Anchor:
            </label>
            <div className="grid grid-cols-4 gap-2 mt-1">
              {anchorGrid.flat().map((pos) => (
                <button
                  key={pos}
                  className={`px-2 py-1 border rounded text-xs ${getAnchorButtonStyle(
                    pos
                  )}`}
                  onClick={() => setSelectedAnchor(pos as Anchor)}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium text-sm text-gray-700">
              Pivot (transform-origin):
            </label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {pivotOptions.flat().map((p) => (
                <button
                  key={p}
                  className={`px-2 py-1 border rounded text-xs ${pivot === p
                      ? "bg-purple-500 text-white"
                      : "bg-white text-black"
                    }`}
                  onClick={() => setPivot(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-sm text-gray-700">
                Width:
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="string"
                value={boxSize.width}
                disabled={!isWidthAdjustable}
                onChange={(e) =>
                  setBoxSize((prev) => ({
                    ...prev,
                    width: parseFloat(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <label className="font-medium text-sm text-gray-700">
                Height:
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="string"
                value={boxSize.height}
                disabled={!isHeightAdjustable}
                onChange={(e) =>
                  setBoxSize((prev) => ({
                    ...prev,
                    height: parseFloat(e.target.value),
                  }))
                }
              />
            </div>

            <div>
              <label className="font-medium text-sm text-gray-700">
                Position X:
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="number"
                value={position.x}
                onChange={(e) =>
                  setPosition({ ...position, x: parseFloat(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="font-medium text-sm text-gray-700">
                Position Y:
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="number"
                value={position.y}
                onChange={(e) =>
                  setPosition({ ...position, y: parseFloat(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="font-medium text-sm text-gray-700">
                Scale X:
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="number"
                step="0.1"
                value={scale.x}
                onChange={(e) =>
                  setScale({ ...scale, x: parseFloat(e.target.value) })
                }
              />
            </div>
            <div>
              <label className="font-medium text-sm text-gray-700">
                Scale Y:
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="number"
                step="0.1"
                value={scale.y}
                onChange={(e) =>
                  setScale({ ...scale, y: parseFloat(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="font-medium text-sm text-gray-700">
                Rotation (deg):
              </label>
              <input
                className="border rounded px-2 py-1 w-full"
                type="number"
                value={rotation}
                onChange={(e) => setRotation(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative bg-gray-200">
        <div
          className="absolute inset-10 border border-dashed border-gray-500 bg-white"
          id="anchor-parent"
        >
          <div className="absolute inset-0 z-0">
            <RectTransform
              anchor={selectedAnchor}
              pivot={pivot}
              boxSize={{ width: boxSize.width, height: boxSize.height }}
              position={position}
              rotation={rotation}
              scale={scale}
              showPivot={true}
            >
              <div className="w-full h-full flex items-center justify-center bg-blue-200 rounded shadow-lg opacity-70">
                <span className="text-gray-800 font-semibold">
                  RectTransform
                </span>
              </div>
            </RectTransform>
          </div>
        </div>
      </div>
    </div>
  );
};
