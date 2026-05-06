import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { useDebugStore } from '../store/sceneGameplayDebugStore';
import { SceneManager } from '@core-utils/scene/scene-manager';
import { useState, useEffect } from 'react';

const DebugTools = () => {
  const debugStore = useDebugStore();
  // const sceneTemplateStore = useSceneTemplateStore();
  const sceneManager = SceneManager.getInstance();
  const currentScene = sceneManager.getCurrentScene();
  const [originalBackground, setOriginalBackground] = useState<string>('');
  const [isRefBackgroundEnabled, setIsRefBackgroundEnabled] = useState<boolean>(false);

  // Sync checkbox state with current background
  useEffect(() => {
    const currentBg = currentScene.getBackground();
    setIsRefBackgroundEnabled(
      currentBg === PUBLIC_ASSETS_LOCATION.image.ref.lastwarCameraAngle
    );
  }, [currentScene]);

  return (
    <>
      <label className="text-sm">
        Camera Position x:
        <input
          className="w-full rounded border px-2 py-1"
          value={`[${debugStore.cameraPosition
            .toArray()
            .map((v) => v.toFixed(2))
            .join(', ')}]`}
          readOnly
        />
      </label>

      <label className="flex items-center text-sm">
        Camera Zoom :
        <input
          type="checkbox"
          checked={debugStore.cameraZoomEnable}
          onChange={(e) => {
            debugStore.set('cameraZoomEnable', e.target.checked);
          }}
        />
      </label>

      <label className="flex items-center text-sm">
        Camera Rotate :
        <input
          type="checkbox"
          checked={debugStore.cameraRotateEnable}
          onChange={(e) => {
            debugStore.set('cameraRotateEnable', e.target.checked);
          }}
        />
      </label>

      <label className="flex items-center text-sm">
        Road :
        <input
          type="checkbox"
          checked={debugStore.roadEnable}
          onChange={(e) => {
            debugStore.set('roadEnable', e.target.checked);
          }}
        />
      </label>

      <label className="flex items-center text-sm">
        Enable ref Background :
        <input
          type="checkbox"
          checked={isRefBackgroundEnabled}
          onChange={(e) => {
            if (e.target.checked) {
              // เก็บ background เดิมก่อนเปลี่ยน
              const currentBg = currentScene.getBackground();
              setOriginalBackground(currentBg);

              // ตั้งค่า ref background
              const refBg = PUBLIC_ASSETS_LOCATION.image.ref.lastwarCameraAngle;
              currentScene.setBackground(refBg);
              setIsRefBackgroundEnabled(true);
            } else {
              // คืนค่า background เดิม
              currentScene.setBackground(originalBackground);
              setIsRefBackgroundEnabled(false);
            }
          }}
        />
      </label>

      <label className="flex items-center text-sm">
        Enable wireframe :
        <input
          type="checkbox"
          checked={debugStore.wireframeEnable}
          onChange={(e) => {
            debugStore.set('wireframeEnable', e.target.checked);
          }}
        />
      </label>
    </>
  );
};

export default DebugTools;
