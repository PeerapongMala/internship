import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';
import { CanvasComponent } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';

import ImageBG from '../../../assets/mock/RedFrame.png';
// import ImageBG from '../../assets/bg-game.jpeg';

export class CVABGSafeZone extends CanvasComponent<EngineThreeGameLoopPropsInterface> {
  imageBG: HTMLImageElement | null = null;

  // imageBG: CanvasImageSource | null = null;

  Start = (payload: any, props: EngineThreeGameLoopPropsInterface) => {
    this.imageBG = new Image();
    this.imageBG.src = ImageBG;
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

    if (!canvasScaler) {
      return;
    }

    if (!this.imageBG || !this.imageBG.naturalHeight || !this.imageBG.naturalWidth) {
      return;
    }

    // context2d.fillStyle = 'rgba(255, 255, 255, 0.6)';
    // canvasScaler?.draw.fillRect({
    //   x: 0,
    //   y: 0,
    //   width: 1440,
    //   height: 810,
    // });

    const scalerWidth = canvasScaler.mapping.widthCal(1280);
    const scalerHeight = canvasScaler.mapping.heightCal(720);
    const scalerX = ((canvas?.width || 0) - scalerWidth) / 2;
    const scalerY = ((canvas?.height || 0) - scalerHeight) / 2;

    context2d.strokeStyle = 'rgba(255, 0, 0, 1)';
    context2d.strokeRect(scalerX, scalerY, scalerWidth, scalerHeight);

    // canvasScaler?.draw.drawImage({image: this.imageBG, x: 0, y: 0, width: 1440, height: 810}, true);
    context2d.drawImage(this.imageBG, scalerX, scalerY, scalerWidth, scalerHeight);
  };
}
