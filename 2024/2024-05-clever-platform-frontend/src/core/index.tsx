import './css/index.css';

import ReactDOM from 'react-dom/client';
import { EngineThree } from 'skillvir-architecture-helper/library/game-core/engine/three';

import MainGameLoop from '../context/global/gameloop/index.ts';
import DomainGlobal from '../context/global/index.tsx';
import StoreGame from '../context/global/store/game/index.ts';
import StoreGlobal from '../context/global/store/global/index.ts';
import StoreGlobalPersist from '../context/global/store/global/persist.ts';
import { FixbugInit } from './fixbug/index.ts';
import { HelperStrictMode } from './helper/strict-mode.tsx';
import { MiddlewareInit } from './middleware/index.ts';

const engineThree = new EngineThree({
  gameLoop: MainGameLoop.GameLoop,
  context: {
    renderer: {
      // antialias: true, alpha: true
    },
  },
});
StoreGame.MethodGet().EngineThreeSet(engineThree);

FixbugInit();
MiddlewareInit({ i18nList: DomainGlobal.i18nList });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelperStrictMode>
    <DomainGlobal.JSX />
  </HelperStrictMode>,
);
