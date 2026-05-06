import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasComponent } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';

import ImageBG from '../../../assets/bg-game.jpeg';

export class CVABG extends CanvasComponent<EngineThreeGameLoopPropsInterface> {
  imageBG: HTMLImageElement | null = null;

  Start = (payload: any, props: EngineThreeGameLoopPropsInterface) => {
    this.imageBG = new Image();
    this.imageBG.src = ImageBG;
  };

  Update = (
    {
      canvas,
      context2d,
    }: { canvas?: HTMLCanvasElement | null; context2d?: CanvasRenderingContext2D | null },
    props: EngineThreeGameLoopPropsInterface,
  ) => {
    if (!context2d || !this.imageBG) {
      return;
    }
    context2d.drawImage(this.imageBG, 0, 0, canvas?.width || 0, canvas?.height || 0);
  };
}
