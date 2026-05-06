import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';

import ImageIconCalendar from '../../../assets/icon-calendar.svg';
import { CVAAbstractComponent } from './cv-a-abstract';

interface CVATextBoxPayload {
  label: string;
  withIcon?: boolean;
  width?: number;
  height?: number;
  onClick?: (event: MouseEvent) => void;
}

export class CVATextBox extends CVAAbstractComponent {
  label: string = '';
  icon: HTMLImageElement | null = null;

  constructor(payload: CVATextBoxPayload) {
    super();
    this.Start(payload);
  }

  Start = (payload: CVATextBoxPayload, props?: EngineThreeGameLoopPropsInterface) => {
    const multiplerScale = 2.25;
    const { label, withIcon = false, width = 120, height = 24, onClick } = payload;

    if (withIcon) {
      this.icon = new Image();
      if (withIcon === true) {
        this.icon.src = ImageIconCalendar;
      } else {
        this.icon.src = withIcon;
      }
    }

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

    // draw label
    if (this.label) {
      context2d.save();

      // estimated the label width
      // set font style
      const fontSize = canvasScaler.mapping.widthCal(14);
      context2d.fillStyle = 'black';
      context2d.font = `bold ${fontSize}px Noto Sans Thai`;
      context2d.textAlign = 'start';
      context2d.textBaseline = 'middle';
      const labelMeasure = context2d.measureText(this.label);

      // note: this should convert to safe area position
      this.safePosX = canvasScaler.mapping.safeZoneXCal(posX - labelMeasure.width);
      this.safePosY = canvasScaler.mapping.safeZoneYCal(posY);
      this.safeWidth = canvasScaler.mapping.widthCal(this.width);
      this.safeHeight = canvasScaler.mapping.heightCal(this.height);

      // draw label box
      context2d.save();
      // container
      context2d.fillStyle = 'rgba(255, 255, 255, 0.8)';
      context2d.lineWidth = 2;
      context2d.strokeStyle = 'white';
      context2d.setLineDash([4, 4]);
      context2d.roundRect(
        this.safePosX,
        this.safePosY,
        this.safeWidth,
        this.safeHeight,
        this.safeWidth,
      );
      context2d.fill();
      context2d.stroke();
      context2d.restore();

      // with icon
      if (this.icon) {
        context2d.save();
        context2d.drawImage(this.icon, this.safePosX + 4, this.safePosY + 4, 16, 16);
        context2d.restore();
      }
      // const centerLabelX = this.safePosX + (this.safeWidth * 0.8) / 2;
      const labelX = this.safePosX + 10 + (this.icon ? 16 : 0);
      const centerLabelY = this.safePosY + this.safeHeight / 2;
      context2d.fillText(this.label, labelX, centerLabelY, this.safeWidth);

      context2d.restore();
    }
  };
}
