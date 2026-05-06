import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';

import { CVAAbstractComponent } from './cv-a-abstract';
import { CVAAbstractContainerComponent } from './cv-a-abstract-container';

export interface CVAContainerPayload {
  posX?: number;
  posY?: number;
  width?: number;
  height?: number;
  paddingX?: number;
  paddingY?: number;
  gap?: number;
  borderRadius?: number;
  children?: CVAAbstractComponent[];
  verticalRender?: boolean;
  onClick?: (event: MouseEvent) => void;
  name?: string;
}

export class CVAContainer extends CVAAbstractContainerComponent {
  name: string = '';

  constructor(payload: CVAContainerPayload) {
    super();
    this.Start(payload);
  }

  Start = (payload: CVAContainerPayload, props?: EngineThreeGameLoopPropsInterface) => {
    const multiplerScale = 2.25; // from 640 upscale to 1440, so 1440 / 640 = 2.25
    const {
      onClick,
      name,
      posX = 0,
      posY = 0,
      width = 100,
      height = 100,
      paddingX = 0,
      paddingY = 0,
      gap = 4,
      borderRadius = 10,
      verticalRender = false,
      children = [],
    } = payload;

    this.name = name ?? '';
    this.children = children;
    this.defaultPosX = posX * multiplerScale;
    this.defaultPosY = posY * multiplerScale;
    this.width = width * multiplerScale;
    this.height = height * multiplerScale;
    this.paddingX = paddingX * multiplerScale;
    this.paddingY = paddingY * multiplerScale;
    this.gap = gap * multiplerScale;
    this.borderRadius = borderRadius * multiplerScale;

    this.verticalRender = verticalRender;
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
      posX?: number;
      posY?: number;
      canvasScaler?: CanvasScaler | null;
      canvas?: HTMLCanvasElement | null;
      context2d?: CanvasRenderingContext2D | null;
    },
    props: EngineThreeGameLoopPropsInterface,
  ) => {
    if (!context2d || !canvasScaler) return;

    // update component state
    // note: this should convert to safe area position
    posX = posX ?? this.defaultPosX ?? 0;
    posY = posY ?? this.defaultPosY ?? 0;

    this.safePosX = canvasScaler.mapping.safeZoneXCal(posX);
    this.safePosY = canvasScaler.mapping.safeZoneYCal(posY);
    this.safeWidth = canvasScaler.mapping.widthCal(this.width);
    this.safeHeight = canvasScaler.mapping.heightCal(this.height);

    // draw area rect
    context2d.save();
    const areaFillLinearGrad = context2d.createLinearGradient(
      this.safePosX,
      this.safePosY,
      this.safePosX,
      this.safePosY + this.safeHeight,
    );
    areaFillLinearGrad.addColorStop(0, '#fff');
    areaFillLinearGrad.addColorStop(1, '#ffffffcd');
    // container
    context2d.fillStyle = areaFillLinearGrad;
    context2d.lineWidth = 2;
    context2d.strokeStyle = 'white';
    context2d.roundRect(
      this.safePosX,
      this.safePosY,
      this.safeWidth,
      this.safeHeight,
      this.borderRadius,
    );
    context2d.fill();
    context2d.stroke();
    context2d.restore();

    // set variables
    const paddingXFromContainer = canvasScaler.mapping.widthCal(this.paddingX);
    const paddingYFromContainer = canvasScaler.mapping.heightCal(this.paddingY);
    const gapBetween = this.verticalRender
      ? canvasScaler.mapping.heightCal(this.gap)
      : canvasScaler.mapping.widthCal(this.gap);

    // add padding from container
    posX += paddingXFromContainer;
    posY += paddingYFromContainer;
    // render each elements
    let cursorPosition = this.verticalRender ? posY : posX;
    context2d.save();
    this.children.map((element) => {
      if (this.verticalRender) {
        // vertical
        element.Update(
          { posX: posX, posY: cursorPosition, canvasScaler, canvas, context2d },
          props,
        );
        cursorPosition += element.height + gapBetween;
      } else {
        // horizontal
        element.Update(
          { posX: cursorPosition, posY: posY, canvasScaler, canvas, context2d },
          props,
        );
        cursorPosition += element.width + gapBetween;
      }
    });
    context2d.restore();
    // register events
    if (!this._isRegisterEvent) this.RegisterEvent({ canvas, canvasScaler, debug: true });
  };
}
