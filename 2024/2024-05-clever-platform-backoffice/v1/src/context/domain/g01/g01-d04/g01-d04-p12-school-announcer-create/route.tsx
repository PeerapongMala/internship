import './index.css';

import { HelperArchitectureDomainInterface } from 'skillvir-architecture-helper/frontend/domain';
import HelperTanStackRouter from 'skillvir-architecture-helper/library/universal-helper/tanstack-router';

import { lazy } from 'react';
const DomainJSX = lazy(() => import('.'));
import GameInitial from './gameloop';
import I18NInit from './i18n';

const DomainG01D04P12Route: HelperArchitectureDomainInterface['RouteInterface'] = {
  I18N: I18NInit,
  JSX: DomainJSX,
  Route: HelperTanStackRouter.JSX.Mapping({ JSX: DomainJSX }),
  GameInitial,
};
export default DomainG01D04P12Route;
