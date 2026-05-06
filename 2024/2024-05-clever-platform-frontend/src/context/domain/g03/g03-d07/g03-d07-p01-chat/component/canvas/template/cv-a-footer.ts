import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';

import ButtonChat from '../../../assets/button-chat.png';
import { CVAAbstractContainerComponent } from '../atom/cv-a-abstract-container';
import { CVAButton } from '../atom/cv-a-button';
import { CVATextBox } from '../atom/cv-a-textbox';

interface CVAFooterPayload {
  notification: {
    label: string;
  };
}

export class CVAFooter extends CVAAbstractContainerComponent {
  // scale from design
  // from 640x360 upscale to 1440x810, so 1440 / 640 = 2.25
  _multiplerScale = 2.25;

  // layout variables
  paddingX = 16 * this._multiplerScale;
  paddingY = 8 * this._multiplerScale;
  gapBetweenX = 16 * this._multiplerScale;

  // container variables
  rectPostionX = 267 * this._multiplerScale; // should be start position at 45% of width
  rectPostionY = 420 * this._multiplerScale; // should be always on top
  rectWidth = 349 * this._multiplerScale;
  rectHeight = 40 * this._multiplerScale + 2 * this.paddingY; // fixed size

  Start = (payload: CVAFooterPayload, props: EngineThreeGameLoopPropsInterface) => {
    this.children = [
      new CVATextBox({
        label: payload?.notification?.label ?? '-',
        withIcon: true,
      }),
      new CVAButton({
        icon: ButtonChat,
        width: 48,
        height: 48,
        onClick: () => {
          console.log('chat clicked!');
        },
      }),
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

    // update container position
    // 16 * 2.25 is padding from screen
    this.rectPostionX = canvasScaler.scenarioSize.width - this.rectWidth - 16 * 2.25;
    this.rectPostionY = canvasScaler.scenarioSize.height - this.rectHeight - 16 * 2.25;

    // fill with background for debugging
    context2d.fillStyle = 'blue';
    canvasScaler.draw.fillRect(
      {
        x: this.rectPostionX,
        y: this.rectPostionY,
        width: this.rectWidth,
        height: this.rectHeight,
      },
      true,
    );
    context2d.restore();

    // render each elements
    // cursor position x should start at the end of this layout
    let cursorPosX = this.rectPostionX + this.rectWidth - this.paddingX;
    const bottomRectY = this.rectPostionY + this.rectHeight;
    // render from last to first
    for (let i = this.children.length - 1; i >= 0; i--) {
      const element = this.children[i];
      // render the element
      context2d.save();
      cursorPosX -= element.width;
      element.Update(
        {
          posX: cursorPosX,
          posY: bottomRectY - element.height,
          canvasScaler,
          canvas,
          context2d,
        },
        props,
      );
      cursorPosX -= this.gapBetweenX;
      context2d.restore();
    }

    if (!this._isRegisterEvent) this.RegisterEvent({ canvas, canvasScaler, debug: true });
  };
}
