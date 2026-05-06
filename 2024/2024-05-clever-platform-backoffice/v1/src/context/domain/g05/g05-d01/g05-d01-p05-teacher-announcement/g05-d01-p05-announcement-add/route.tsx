import './index.css';

import { lazy } from 'react';
import { HelperArchitectureDomainInterface } from 'skillvir-architecture-helper/frontend/domain';
import HelperTanStackRouter from 'skillvir-architecture-helper/library/universal-helper/tanstack-router';

import GameInitial from './gameloop/index.ts';
import I18NInit from './i18n/index.ts';

const DomainJSX = lazy(() => import('./index.tsx'));

const DomainG05D01P05P01Route: HelperArchitectureDomainInterface['RouteInterface'] = {
  I18N: I18NInit,
  JSX: DomainJSX,
  Route: HelperTanStackRouter.JSX.Mapping({ JSX: DomainJSX }),
  GameInitial,
};
export default DomainG05D01P05P01Route;
