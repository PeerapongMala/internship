import ModelViewer from '@core-utils/3d/model-file-viewer';
import {
  SceneTemplateProps,
  SceneTemplate,
} from '@core-utils/scene/SceneTemplate';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { ScrollableModal } from '@core-utils/ui/scrollable-modal/ScrollableModal';
import { TimeManagerDemo } from '@core-utils/timer/time-manager-demo';
import { modelList } from '@/scenes/scene-gameplay/components/gameplay/components/fruit-entity';

const TempAppContent = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <ScrollableModal>
        <div className="flex flex-col gap-8">

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

          <ModelViewer src={modelList[0].modelPath} autoRotate />
          <ModelViewer src={modelList[1].modelPath} autoRotate />
          <ModelViewer src={modelList[2].modelPath} autoRotate />
          <ModelViewer src={modelList[3].modelPath} autoRotate />
          <ModelViewer src={modelList[4].modelPath} autoRotate />
          <ModelViewer
            src={PUBLIC_ASSETS_LOCATION.model.obstacle.bomb.obj}
            mtl={PUBLIC_ASSETS_LOCATION.model.obstacle.bomb.mtl}
            autoRotate
          />
          <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.obstacle.bomb.gltf} autoRotate />

          <TimeManagerDemo />
        </div>
      </ScrollableModal>
    </div>
  );
};

// Class that extends SceneTemplate and delegates rendering to the functional component
export class Workspace extends SceneTemplate {
  constructor(props: SceneTemplateProps) {
    super(props);
    // this.content = <TempAppContent />;
    this.sceneInitial();
  }

  renderScene = () => {
    return <TempAppContent />;
  };
}
