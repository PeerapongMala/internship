import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import ModelViewer from '@core-utils/3d/model-file-viewer';
import {
  SceneTemplateProps,
  SceneTemplate,
} from '@core-utils/scene/SceneTemplate';
import { ScrollableModal } from '@core-utils/ui/scrollable-modal/ScrollableModal';

const TempAppContent = () => {
  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <ScrollableModal>
          {/* <div className="flex flex-col gap-8"> */}
          {/* <App /> */}

          {/* <RectTransformPoC /> */}
          {/* <RectTransform
              anchor={AnchorPosition.MiddleCenter}
              pivot={{ x: 0.5, y: 0.5 }}
              boxSize={{ width: 200, height: 100 }}
            >
              <div className="w-full h-full flex items-center justify-center bg-blue-200 rounded shadow-lg opacity-70">
                <span className="text-gray-800 font-semibold">RectTransform</span>
              </div>
            </RectTransform> */}

          {/* <ResponsiveScalerV2 scenarioSize={{ width: 1280, height: 720 }}>
              <ScoreModal />
              </ResponsiveScalerV2> */}
          {/* <ScoreModal /> */}

          {/* <CountdownModal seconds={3} /> */}

          <ModelViewer src="/character/set2/character1/level1.fbx" autoRotate autoFitCamera />
          <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.target.enemy} autoRotate autoFitCamera />
          <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.weapon.bullet} autoRotate autoFitCamera />
          <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.weapon.drone} autoRotate autoFitCamera />
          <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.weapon.laser} autoRotate autoFitCamera />
          <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.weapon.rocket} autoRotate autoFitCamera />
          <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.weapon.rowel} autoRotate autoFitCamera />
          {/* </div> */}
        </ScrollableModal>
      </div>
    </>
  );
};

// Class that extends SceneTemplate and delegates rendering to the functional component
export class Workspace extends SceneTemplate {
  constructor(props: SceneTemplateProps) {
    super(props);
    this.content = <TempAppContent />;
    this.sceneInitial();
  }
}
