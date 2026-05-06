// import { useState } from 'react';
import './css/font.css';
import './css/index.css';

import React, { useEffect } from 'react';
import { ReactNode } from 'react';
import { HelperI18NextInterface } from 'skillvir-architecture-helper/library/universal-helper/i18next';
import StoreGlobal from './store/global';

// import * as THREE from 'three';
import WCAUILoader from './component/web/atom/wc-a-ui-loader';
import MainGameLoop from './gameloop';
import I18NInit from './i18n';
import Route from './route';
import PreloadErrorMiddleware from './middleware/vite/PreloadErrorMiddleware';

// i18n
const i18nList: HelperI18NextInterface['I18NDomainInterface'][] = [
  I18NInit({ name: 'global' }),
  ...Route.i18nList,
];

// MainGameLoop.SceneStateInit(Route.sceneStateList);

class JSX extends React.Component<any, any> {
  render(): ReactNode {
    // useEffect(() => {
    //   StoreGlobal.MethodGet().TemplateSet(true);
    //   StoreGlobal.MethodGet().BannerSet(true);
    // }, []);
    return (
      <div className="font-hx-b text-20px">
        <PreloadErrorMiddleware>
          <WCAUILoader>
            <Route.JSX />
          </WCAUILoader>
        </PreloadErrorMiddleware>
      </div>
    );
  }
}

const DomainGlobal = { JSX, i18nList };

export default DomainGlobal;
