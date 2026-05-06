import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';

import { CVAAbstractComponent } from './cv-a-abstract';

interface CVACircularImagePayload {
  image?: string;
  width?: number;
  height?: number;
  onClick?: (event: MouseEvent) => void;
}

export class CVACircularImage extends CVAAbstractComponent {
  image: HTMLImageElement | null = null;

  constructor(payload: CVACircularImagePayload) {
    super();
    this.Start(payload);
  }

  Start = (
    payload: CVACircularImagePayload,
    props?: EngineThreeGameLoopPropsInterface,
  ) => {
    const multiplerScale = 2.25; // from 640 upscale to 1440, so 1440 / 640 = 2.25

    const { image, width = 32, height = 32, onClick } = payload;
    if (image) {
      this.image = new Image();
      this.image.src = image;
    }
    this.width = width * multiplerScale;
    this.height = height * multiplerScale;
    this.onClick = onClick;
  };

  /*
   * Update Renderer
   * - posX: number - position x of this top-left component
   * - posY: number - position y of this top-left component
   * - isSafeareaPositionUnit: boolean - flag for tag posX and posY is safezone position units
   */
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
    if (!context2d || !canvasScaler || !this.image) return;

    // update component state
    // note: this should convert to safe area position
    this.safePosX = canvasScaler.mapping.safeZoneXCal(posX);
    this.safePosY = canvasScaler.mapping.safeZoneYCal(posY);
    this.safeWidth = canvasScaler.mapping.widthCal(this.width);
    this.safeHeight = canvasScaler.mapping.heightCal(this.height);

    context2d.save();
    // shadow effect
    context2d.shadowColor = '#00000026'; // black alpha 15%
    context2d.shadowOffsetX = 0;
    context2d.shadowOffsetY = 4;
    context2d.shadowBlur = 8;

    // draw a circle to clip an image image
    context2d.beginPath();
    const radius = canvasScaler.mapping.widthCal(this.width / 2);
    context2d.arc(
      this.safePosX + this.safeWidth / 2,
      this.safePosY + this.safeHeight / 2,
      radius,
      0,
      2 * Math.PI,
    );
    context2d.closePath();
    // clip image
    context2d.clip();
    context2d.drawImage(this.image, posX, posY, this.width, this.height);
    context2d.restore();
  };
}
