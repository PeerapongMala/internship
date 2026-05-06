import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';

import ImageIconArrow from '../../../assets/big-button.svg';
import { CVAAbstractComponent } from './cv-a-abstract';

interface CVABigButtonPayload {
  label: string;
  width?: number;
  height?: number;
  onClick?: (event: MouseEvent) => void;
}

export class CVABigButton extends CVAAbstractComponent {
  background: HTMLImageElement | null = null;
  label: string = 'null';

  constructor(payload: CVABigButtonPayload) {
    super();
    this.Start(payload);
  }

  Start = (payload: CVABigButtonPayload, props?: EngineThreeGameLoopPropsInterface) => {
    const multiplerScale = 2.25;
    const { label, width = 212, height = 40, onClick } = payload;

    this.background = new Image();
    this.background.src = ImageIconArrow;

    this.label = label;
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

    context2d.save();

    // draw background button
    if (this.background) {
      context2d.drawImage(this.background, posX, posY, this.width, this.height);
    }

    // label
    // set font style
    const fontSize = canvasScaler.mapping.widthCal(24);

    context2d.fillStyle = 'white';
    context2d.font = `bold ${fontSize}px Noto Sans Thai`;
    context2d.textAlign = 'center';
    context2d.textBaseline = 'middle';

    const centerLabelX = this.safePosX + (this.safeWidth * 0.8) / 2;
    const centerLabelY = this.safePosY + this.safeHeight / 2;
    context2d.fillText(this.label, centerLabelX, centerLabelY, this.safeWidth);

    context2d.restore();
  };
}
