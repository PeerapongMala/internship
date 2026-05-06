import './index.css';

import { HelperArchitectureDomainInterface } from 'skillvir-architecture-helper/frontend/domain';
import HelperTanStackRouter from 'skillvir-architecture-helper/library/universal-helper/tanstack-router';

import { lazy } from 'react';
import I18NInit from './i18n';
const DomainJSX = lazy(() => import('.'));
import GameInitial from './gameloop';

const DomainG05D02P04P02Route: HelperArchitectureDomainInterface['RouteInterface'] = {
  I18N: I18NInit,
  JSX: DomainJSX,
  Route: HelperTanStackRouter.JSX.Mapping({ JSX: DomainJSX }),
  GameInitial,
};
export default DomainG05D02P04P02Route;
