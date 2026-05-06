import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';

import { CVAAbstractComponent } from './cv-a-abstract';

export abstract class CVAAbstractContainerComponent extends CVAAbstractComponent {
  // real position
  posX: number = 0;
  posY: number = 0;
  defaultPosX: number = 0;
  defaultPosY: number = 0;
  width: number = 0;
  height: number = 0;

  // safearea attributes
  safePosX: number = 0;
  safePosY: number = 0;
  safeWidth: number = 0;
  safeHeight: number = 0;

  // container attributes
  paddingX: number = 0;
  paddingY: number = 0;
  borderRadius: number = 0;

  children: CVAAbstractComponent[] = [];
  verticalRender: boolean = false;
  gap: number = 0;

  // state
  _isRegisterEvent: boolean = false;

  RegisterEvent = ({
    canvasScaler,
    canvas,
    debug = false,
  }: {
    canvasScaler?: CanvasScaler | null;
    canvas?: HTMLCanvasElement | null;
    // context2d?: CanvasRenderingContext2D | null;
    debug?: boolean;
  }) => {
    if (canvas && canvasScaler && !this._isRegisterEvent) {
      if (debug) {
        this.children.forEach((element) => {
          console.log({
            element,
            x: element.safePosX,
            y: element.safePosY,
            width: element.safeWidth,
            height: element.safeHeight,
          });
        });
      }
      canvas.addEventListener('click', (event) => {
        // canvas client dimension
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/clientWidth
        const canvasClientWidth = canvas.clientWidth;
        const canvasClientHeight = canvas.clientHeight;

        // must remove margin from canvas and centering the safearea canvas
        const marginCanvasX = (canvas.width - canvasClientWidth) / 2;
        const marginCanvasY = (canvas.height - canvasClientHeight) / 2;
        // margin safezone
        const marginSafezoneX = canvasScaler.mapping.safeZoneXCal(0);
        const marginSafezoneY = canvasScaler.mapping.safeZoneYCal(0);

        // click position
        // note: this position should be related with safearea
        const x = event.clientX - marginCanvasX;
        const y = event.clientY - marginCanvasY;

        if (debug) console.log({ x, y });

        // check if we click on safearea
        const isSafeareaClickX =
          x >= marginSafezoneX && x <= canvasClientWidth - marginSafezoneX;
        const isSafeareaClickY =
          y >= marginSafezoneY && y <= canvasClientHeight - marginSafezoneY;
        if (!isSafeareaClickX || !isSafeareaClickY) return;

        this.children.forEach((element) => {
          if (element?.onClick && this.isIntersect(element, { x, y })) {
            element.onClick(event);
          }
        });
      });
      this._isRegisterEvent = true;
    }
  };

  isIntersect(element: CVAAbstractComponent, point: { x: number; y: number }) {
    const { x, y } = point;
    return (
      x >= element.safePosX &&
      x <= element.safePosX + element.safeWidth &&
      y >= element.safePosY &&
      y <= element.safePosY + element.safeHeight
    );
  }
}
