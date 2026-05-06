import { HelperArchitectureDomainInterface } from 'skillvir-architecture-helper/frontend/domain';
import HelperTanStackRouter from 'skillvir-architecture-helper/library/universal-helper/tanstack-router';
import { lazy } from 'react';
import GameInitial from './gameloop';
import I18NInit from './i18n';

const DomainJSX = lazy(() => import('.'));

const DomainG06D06P08Route: HelperArchitectureDomainInterface['RouteInterface'] = {
  I18N: I18NInit,
  JSX: DomainJSX,
  Route: HelperTanStackRouter.JSX.Mapping({ JSX: DomainJSX }),
  GameInitial,
};
export default DomainG06D06P08Route;
