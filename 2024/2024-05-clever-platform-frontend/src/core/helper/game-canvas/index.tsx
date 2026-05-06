import {
  EngineThree,
  JSXEngineThree,
} from 'skillvir-architecture-helper/library/game-core/engine/three';

import StoreGame from '../../../context/global/store/game';
import CanvasPlugin from '../canvas-plugin';

const GameCanvas = (props: {
  // enableIs?: Isean;
  engineThree?: EngineThree | null;
  children?: React.ReactNode;
}) => {
  const { gameCanvasEnableIs } = StoreGame.StateGet(['gameCanvasEnableIs']);
  // if (!props.enableIs) {
  //   return <></>;
  // }
  if (!gameCanvasEnableIs) {
    return <>{props.children}</>;
  }

  return (
    <div className="flex-1 relative">
      <CanvasPlugin
        className="absolute h-full w-full"
        setUI={StoreGame.MethodGet().UIBGSet}
      />
      <JSXEngineThree
        className="absolute h-full w-full"
        engineThree={props.engineThree}
      />
      <CanvasPlugin
        className="absolute h-full w-full"
        setUI={StoreGame.MethodGet().UISet}
      />
      <>{props.children}</>
      {/* <div className="absolute h-full w-full">{props.children}</div> */}
    </div>
  );
};

export default GameCanvas;
