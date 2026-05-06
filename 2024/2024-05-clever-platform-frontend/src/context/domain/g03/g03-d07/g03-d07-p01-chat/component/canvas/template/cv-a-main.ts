import { EngineThreeGameLoopPropsInterface } from 'skillvir-architecture-helper/library/game-core/engine/three';
import { CanvasScaler } from 'skillvir-architecture-helper/library/game-core/helper/canvas-scaler';

import { CVAAbstractContainerComponent } from '../atom/cv-a-abstract-container';
import { CVABigButton } from '../atom/cv-a-big-button';
import { CVACircularImage } from '../atom/cv-a-circular-image';
import { CVAContainer } from '../atom/cv-a-container';
interface CVAMainPanelPayload {}

export class CVAMainPanel extends CVAAbstractContainerComponent {
  Start = (payload: CVAMainPanelPayload, props: EngineThreeGameLoopPropsInterface) => {
    this.children = [
      new CVAContainer({
        posX: 396,
        posY: 92,
        width: 220,
        height: 172,
        paddingX: 4,
        paddingY: 4,
        gap: 8,
        borderRadius: 16,
        verticalRender: true,
        children: [
          new CVACircularImage({
            image:
              'https://media.istockphoto.com/id/182344013/photo/sheep.jpg?s=612x612&w=0&k=20&c=YsRS7CkPMfhBdUttuenXXxcISRZ5nr1jVRgWh6DNWN8=',
            width: 64,
            height: 64,
            onClick: () => {
              console.log('sheep clicked!');
            },
          }),
          new CVABigButton({
            label: 'บทเรียนทั้งหมด',
            width: 212,
            height: 40,
            onClick: () => {
              console.log('lecture clicked!');
            },
          }),
          new CVABigButton({
            label: 'การบ้านทั้งหมด',
            width: 212,
            height: 40,
            onClick: () => {
              console.log('homework clicked!');
            },
          }),
        ],
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

    // render each elements
    this.children.forEach((element) => {
      element.Update(
        {
          posX: 0,
          posY: 0,
          canvasScaler,
          canvas,
          context2d,
        },
        props,
      );
    });

    if (!this._isRegisterEvent)
      this.RegisterEvent({ canvas, canvasScaler, debug: false });

    context2d.restore();
  };
}
