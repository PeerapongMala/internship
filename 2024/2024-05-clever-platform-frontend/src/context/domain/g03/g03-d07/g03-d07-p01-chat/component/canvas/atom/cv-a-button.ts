import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';

import { CVAAbstractComponent } from './cv-a-abstract';

interface CVAButtonPayload {
  icon: string;
  width?: number;
  height?: number;
  onClick?: (event: MouseEvent) => void;
}

export class CVAButton extends CVAAbstractComponent {
  icon: HTMLImageElement | null = null;

  constructor(payload: CVAButtonPayload) {
    super();
    this.Start(payload);
  }

  Start = (payload: CVAButtonPayload, props?: EngineThreeGameLoopPropsInterface) => {
    const multiplerScale = 2.25;
    const { icon, width = 32, height = 32, onClick } = payload;
    if (icon) {
      this.icon = new Image();
      this.icon.src = icon;
    }
    this.width = width * multiplerScale;
    this.height = height * multiplerScale;
    this.onClick = onClick;
  };

  Update = (
    {
      posX,
      posY,
      canvasScaler,
      canvas,
      context2d,
    }: {
      posX: number;
      posY: number;
      canvasScaler?: CanvasScaler | null;
      canvas?: HTMLCanvasElement | null;
      context2d?: CanvasRenderingContext2D | null;
    },
    props: EngineThreeGameLoopPropsInterface,
  ) => {
    if (!context2d || !canvasScaler) return;

    // update component state
    this.posX = posX;
    this.posY = posY;
    // note: this should convert to safe area position
    this.safePosX = canvasScaler.mapping.safeZoneXCal(posX);
    this.safePosY = canvasScaler.mapping.safeZoneYCal(posY);
    this.safeWidth = canvasScaler.mapping.widthCal(this.width);
    this.safeHeight = canvasScaler.mapping.heightCal(this.height);

    // draw icon
    if (this.icon) {
      context2d.save();
      // shadow effect
      context2d.shadowColor = '#00000026'; // black alpha 15%
      context2d.shadowOffsetX = 0;
      context2d.shadowOffsetY = 4;
      context2d.shadowBlur = 8;
      context2d.drawImage(this.icon, posX, posY, this.width, this.height);
      context2d.restore();
    }
  };
}
