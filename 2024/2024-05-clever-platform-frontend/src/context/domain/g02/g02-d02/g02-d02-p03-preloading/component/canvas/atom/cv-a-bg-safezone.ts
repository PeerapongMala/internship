import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';
import { CanvasComponent } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';

// import ImageBG from '../../assets/bg-game.jpeg';

export class CVABGSafeZone extends CanvasComponent<EngineThreeGameLoopPropsInterface> {
  // imageBG: HTMLImageElement | null = null;

  Start = (payload: any, props: EngineThreeGameLoopPropsInterface) => {
    // this.imageBG = new Image();
    // this.imageBG.src = ImageBG;
  };

  Update = (
    {
      canvasScaler,
      canvas,
      context2d,
    }: {
      canvasScaler?: CanvasScaler | null;
      canvas?: HTMLCanvasElement | null;
      context2d?: CanvasRenderingContext2D | null;
    },
    props: EngineThreeGameLoopPropsInterface,
  ) => {
    if (!context2d) {
      return;
    }
    // context2d.drawImage(this.imageBG, 0, 0, canvas?.width || 0, canvas?.height || 0);

    context2d.fillStyle = 'rgba(255, 255, 255, 0)';
    // ui.context2d.fillRect(0, 0, ui.canvas?.width || 0, ui.canvas?.height || 0);
    canvasScaler?.draw.fillRect({
      x: 0,
      y: 0,
      width: 1440,
      height: 810,
    });
  };
}
