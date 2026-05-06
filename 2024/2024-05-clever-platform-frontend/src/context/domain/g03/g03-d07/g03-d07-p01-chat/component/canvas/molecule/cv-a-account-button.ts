import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';
import { CanvasComponent } from 'skillvir-architecture-helper/library/game-core/helper/scene-manager';

import { CVACircularImage } from '../atom/cv-a-circular-image';

interface CVAAccountButtonPayload {
  avatar?: string;
  username?: string;
  width?: number;
  height?: number;
  onClick?: (event: MouseEvent) => void;
}

export class CVAAccountButton extends CanvasComponent<EngineThreeGameLoopPropsInterface> {
  avatar: HTMLImageElement | string | null = null;
  username: string = '';
  width: number = 120;
  height: number = 32;

  // position
  posX: number = 0;
  posY: number = 0;

  // safearea attributes
  safePosX: number = 0;
  safePosY: number = 0;
  safeWidth: number = 0;
  safeHeight: number = 0;

  avatarComponent: CVACircularImage = new CVACircularImage({});

  onClick?: (event: MouseEvent) => void;

  constructor(payload: CVAAccountButtonPayload) {
    super();
    this.Start(payload);
  }

  Start = (
    payload: CVAAccountButtonPayload,
    props?: EngineThreeGameLoopPropsInterface,
  ) => {
    const multiplerScale = 2.25; // from 640 upscale to 1440, so 1440 / 640 = 2.25

    const { avatar, username, width = 120, height = 32, onClick } = payload;
    if (avatar) {
      this.avatar = avatar;
      this.avatarComponent.Start({
        image: avatar,
        width: (height * 2) / 3,
        height: (height * 2) / 3,
      });
    }
    this.username = username ?? '';
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

    const multiplerScale = 2.25; // from 640 upscale to 1440, so 1440 / 640 = 2.25

    // update component state
    // note: this should convert to safe area position
    this.posX = posX;
    this.posY = posY;
    this.safePosX = canvasScaler.mapping.safeZoneXCal(posX);
    this.safePosY = canvasScaler.mapping.safeZoneYCal(posY);
    this.safeWidth = canvasScaler.mapping.widthCal(this.width);
    this.safeHeight = canvasScaler.mapping.heightCal(this.height);

    // draw area rect
    context2d.save();
    // container background
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
      10 * multiplerScale,
    );
    context2d.fill();
    context2d.stroke();
    context2d.restore();

    // set variables
    const paddingXFromContainer = 8;
    const paddingYFromContainer = 12;
    const gapX = paddingXFromContainer;

    let cursorPosX = posX + paddingXFromContainer;

    // draw avatar
    if (this.avatar && this.avatarComponent) {
      const posYAfterPadding = posY + paddingYFromContainer;
      this.avatarComponent.Update(
        {
          posX: cursorPosX,
          posY: posYAfterPadding,
          canvasScaler,
          canvas,
          context2d,
        },
        props,
      );
      cursorPosX += this.avatarComponent.width + gapX; // add another gap
    }

    if (this.username) {
      const centerPosY = this.safePosY + this.safeHeight / 2 + 2;
      // set font style
      context2d.save();

      const fontSize = canvasScaler.mapping.widthCal(21);

      context2d.fillStyle = 'black';
      context2d.font = `${fontSize}px Noto Sans Thai`; // Scale font size similarly
      context2d.textAlign = 'start';
      context2d.textBaseline = 'middle';

      // to-do: if name is too long, should set the text to ellpised,
      // but for now set max width for text
      context2d.fillText(
        this.username,
        canvasScaler.mapping.safeZoneXCal(cursorPosX),
        centerPosY, // 3 is magic number for adjust text to be in center
        this.safeWidth,
      );
      context2d.restore();
    }
    context2d.restore();
  };
}
