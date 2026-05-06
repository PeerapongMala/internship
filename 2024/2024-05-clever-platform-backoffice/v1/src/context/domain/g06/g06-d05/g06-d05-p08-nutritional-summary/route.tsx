// import './index.module.css';

import { HelperArchitectureDomainInterface } from 'skillvir-architecture-helper/frontend/domain';
import HelperTanStackRouter from 'skillvir-architecture-helper/library/universal-helper/tanstack-router';
import { lazy } from 'react';
const DomainJSX = lazy(() => import('.'));
import GameInitial from './gameloop';
import I18NInit from './i18n';

const DomainG06D05P08Route: HelperArchitectureDomainInterface['RouteInterface'] = {
  I18N: I18NInit,
  JSX: DomainJSX,
  Route: HelperTanStackRouter.JSX.Mapping({ JSX: DomainJSX }),
  GameInitial,
};
export default DomainG06D05P08Route;
