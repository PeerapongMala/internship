// import { useState } from 'react';
import 'katex/dist/katex.min.css';
import './css/font.css';
import './css/index.css';

import React, { ReactNode } from 'react';
import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';

// import * as THREE from 'three';
import WCARenderMemoryInfo from '@component/web/atom/wc-a-render-memory-info';
import WCAUIAdmin from '@component/web/atom/wc-a-ui-admin';
import WCAUICanvas from '@component/web/atom/wc-a-ui-canvas';
import WCAUIParticle from '@component/web/atom/wc-a-ui-particle';
import CWOrientationHandler from '@component/web/molecule/cw-orientation-handler';
import StoreLessons from '@store/global/lessons';
import WCAUILoader from './component/web/atom/wc-a-ui-loader';
import WCTBackgroundUpload from './component/web/template/wc-t-background-upload';
import MainGameLoop from './gameloop';
import I18NInit from './i18n';
import ErudaMiddleware from './middleware/eruda/ErudaMiddleware';
import PreloadErrorMiddleware from './middleware/vite/PreloadErrorMiddleware';
import Route from './route';

// i18n
const i18nList: HelperI18NextInterface['I18NDomainInterface'][] = [
  I18NInit({ name: 'global' }),
  ...Route.i18nList,
];

const IS_DEV = import.meta.env.DEV;

MainGameLoop.SceneStateInit(Route.sceneStateList);

class JSX extends React.Component<any, any> {
  componentDidMount() {
    // Clean up stale download flags on app initialization
    StoreLessons.MethodGet().cleanupStaleDownloadFlags();
  }

  render(): ReactNode {
    return (
      <div className={`Prompt font-noto-sans-thai ${!IS_DEV ? 'select-none' : ''}`}>
        <ErudaMiddleware>
          <PreloadErrorMiddleware>
            <CWOrientationHandler />
            <WCTBackgroundUpload />
            <WCARenderMemoryInfo />
            <WCAUILoader>
              <WCAUIParticle>
                <WCAUICanvas>
                  <Route.JSX />
                  <WCAUIAdmin />
                </WCAUICanvas>
              </WCAUIParticle>
            </WCAUILoader>
          </PreloadErrorMiddleware>
        </ErudaMiddleware>
      </div>
    );
  }
}

const DomainGlobal = { JSX, i18nList };

export default DomainGlobal;
