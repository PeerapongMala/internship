import { Easing } from '@tweenjs/tween.js';
import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';
import { CanvasComponent } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';

export class CVATweenTest extends CanvasComponent<EngineThreeGameLoopPropsInterface> {
  timeCountIs = true;
  timeCountNum = 0;
  timeCountMaxNum = 4;
  timeCountPercentNum = 0;
  Start = (payload: any, props: EngineThreeGameLoopPropsInterface) => {
    this.timeCountIs = true;
    this.timeCountNum = 0;
    this.timeCountPercentNum = 0;
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
    if (!context2d || !canvasScaler) {
      return;
    }

    if (this.timeCountIs) {
      if (this.timeCountNum < this.timeCountMaxNum) {
        this.timeCountNum += props.deltaTime;
      } else {
        this.timeCountNum = this.timeCountMaxNum;
        this.timeCountIs = false;
      }
      this.timeCountPercentNum = this.timeCountNum / this.timeCountMaxNum;
    }

    const { deltaTime } = props;

    // Example: Draw a circle
    context2d.beginPath();
    canvasScaler.draw.fillRect({
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    });
    canvasScaler.draw.arc({
      x: 1440 / 2,
      y: 810 / 2,
      radius: 50 * (1 + 3 * Easing.Elastic.Out(this.timeCountPercentNum)),
      startAngle: 0,
      endAngle: 2 * Math.PI,
    });

    context2d.fillStyle = '#00ff33';
    context2d.fill();

    // 1
    // context2d.drawImage(imageSprite, 200, 200, 100, 100);

    // 2
    // canvasScaler.draw.drawImage(
    //   {
    //     image: imageSprite,
    //     x: 1440 + 20 + 100,
    //     y: 20,
    //     width: 100,
    //     height: 100,
    //   },
    //   false,
    // );
  };
}
