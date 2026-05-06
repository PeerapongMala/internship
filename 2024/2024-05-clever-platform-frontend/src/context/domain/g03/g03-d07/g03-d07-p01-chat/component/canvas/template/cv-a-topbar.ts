import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';

import ButtonGift from '../../../assets/button-gift.svg';
import ButtonNews from '../../../assets/button-news.svg';
import ButtonSetting from '../../../assets/button-settings.svg';
import ButtonSignout from '../../../assets/button-signout.svg';
import ButtonTeach from '../../../assets/button-teach.svg';
import { CVAAbstractContainerComponent } from '../atom/cv-a-abstract-container';
import { CVAButton } from '../atom/cv-a-button';
import { CVAAccountButton } from '../molecule/cv-a-account-button';

interface CVATopbarPayload {
  account: {
    avatar: string;
    username: string;
  };
}

export class CVATopbar extends CVAAbstractContainerComponent {
  // scale from design
  // from 640x360 upscale to 1440x810, so 1440 / 640 = 2.25
  _multiplerScale = 2.25;

  // layout variables
  paddingX = 16 * this._multiplerScale;
  paddingY = 8 * this._multiplerScale;
  gapBetweenX = 4 * this._multiplerScale;

  // container variables
  rectPostionX = (640 - 352) * this._multiplerScale; // should be start position at 45% of width
  rectPostionY = 0; // should be always on top
  rectSizeX = 352 * this._multiplerScale;
  rectSizeY = 32 * this._multiplerScale + 2 * this.paddingY; // fixed size

  Start = (payload: CVATopbarPayload, props: EngineThreeGameLoopPropsInterface) => {
    this.children = [
      new CVAAccountButton({
        ...payload.account,
        onClick: () => {
          console.log('profile clicked!');
        },
      }),
      new CVAButton({
        icon: ButtonNews,
        onClick: () => {
          console.log('news clicked!');
        },
      }),
      new CVAButton({
        icon: ButtonGift,
        onClick: () => {
          console.log('gift clicked!');
        },
      }),
      new CVAButton({
        icon: ButtonTeach,
        onClick: () => {
          console.log('teach clicked!');
        },
      }),
      new CVAButton({
        icon: ButtonSetting,
        onClick: () => {
          console.log('settings clicked!');
        },
      }),
      new CVAButton({
        icon: ButtonSignout,
        onClick: () => {
          console.log('signout clicked!');
        },
      }),
      // new CVACircularImage({
      //   image:
      //     'https://media.istockphoto.com/id/182344013/photo/sheep.jpg?s=612x612&w=0&k=20&c=YsRS7CkPMfhBdUttuenXXxcISRZ5nr1jVRgWh6DNWN8=',
      //   width: 32,
      //   height: 32,
      //   onClick: () => {
      //     console.log('sheep clicked!');
      //   },
      // }),
    ];
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
    if (!context2d || !canvasScaler) return;

    context2d.save();
    // fill with background for debugging
    context2d.fillStyle = 'blue';
    canvasScaler.draw.fillRect(
      {
        x: this.rectPostionX,
        y: this.rectPostionY,
        width: this.rectSizeX,
        height: this.rectSizeY,
      },
      true,
    );
    context2d.restore();

    // render each elements
    // cursor position x should start at the end of this layout
    let cursorPosX = this.rectPostionX + this.rectSizeX - this.paddingX;
    const posY = this.rectPostionY + this.paddingY;

    context2d.save();
    // render from last to first
    for (let i = this.children.length - 1; i >= 0; i--) {
      const element = this.children[i];
      cursorPosX = cursorPosX - element.width - this.gapBetweenX;
      element.Update({ posX: cursorPosX, posY, canvasScaler, canvas, context2d }, props);
    }
    context2d.restore();

    if (!this._isRegisterEvent) this.RegisterEvent({ canvas, canvasScaler });
  };
}
