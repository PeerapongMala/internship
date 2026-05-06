import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasComponent } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';

export abstract class CVAAbstractComponent extends CanvasComponent<EngineThreeGameLoopPropsInterface> {
  Update(
    arg0: {
      posX: number;
      posY: number;
      canvasScaler: any;
      canvas: HTMLCanvasElement | null | undefined;
      context2d: CanvasRenderingContext2D;
    },
    props: EngineThreeGameLoopPropsInterface,
  ) {
    throw new Error('Method not implemented.');
  }
  // real position
  posX: number = 0;
  posY: number = 0;
  width: number = 0;
  height: number = 0;

  // safearea attributes
  safePosX: number = 0;
  safePosY: number = 0;
  safeWidth: number = 0;
  safeHeight: number = 0;

  onClick?: (event: MouseEvent) => void;
}
