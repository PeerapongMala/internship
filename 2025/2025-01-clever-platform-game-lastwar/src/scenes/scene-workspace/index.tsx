import { useState } from 'react';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import ModelViewer from '@core-utils/3d/model-file-viewer';
import {
  SceneTemplateProps,
  SceneTemplate,
} from '@core-utils/scene/SceneTemplate';
import { ScrollableModal } from '@core-utils/ui/scrollable-modal/ScrollableModal';
import { ModelAnimationTester } from '@core-utils/model-animation-tester/ModelAnimationTester';
import { PROJECT_MODELS } from '@/config/modelAnimationConfig';

type ViewMode = 'tester' | 'gallery';

const TempAppContent = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('tester');

  return (
    <div className="relative h-screen w-full">
      {/* Mode Selector */}
      <div className="absolute top-4 left-4 z-50 flex gap-2 pointer-events-auto">
        <button
          onClick={() => setViewMode('tester')}
          className={`rounded px-4 py-2 shadow-lg ${viewMode === 'tester'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300'
            }`}
        >
          Animation Tester
        </button>
        <button
          onClick={() => setViewMode('gallery')}
          className={`rounded px-4 py-2 shadow-lg ${viewMode === 'gallery'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300'
            }`}
        >
          Model Gallery
        </button>
      </div>

      {/* Content */}
      <div className="h-full w-full">
        {viewMode === 'tester' ? (
          <div className="h-full w-full pt-16 md:pt-0">
            <ModelAnimationTester models={PROJECT_MODELS} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center pt-16">
            <ScrollableModal>
              <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.character.model.default} autoRotate autoFitCamera />
              <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.character.animation.test} autoRotate autoFitCamera />
              <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Bear} autoRotate autoFitCamera />
              <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Deer} autoRotate autoFitCamera />
              <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Elephant} autoRotate autoFitCamera />
              <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Giraffe} autoRotate autoFitCamera />
              <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Hippo} autoRotate autoFitCamera />
              <ModelViewer src={PUBLIC_ASSETS_LOCATION.model.obstacle.animalModel.Zebra} autoRotate autoFitCamera />
            </ScrollableModal>
          </div>
        )}
      </div>
    </div>
  );
};

// Class that extends SceneTemplate and delegates rendering to the functional component
export class Workspace extends SceneTemplate {
  constructor(props: SceneTemplateProps) {
    super(props);
    this.sceneInitial();
  }

  renderScene = () => {
    return <TempAppContent />;
  };
}
