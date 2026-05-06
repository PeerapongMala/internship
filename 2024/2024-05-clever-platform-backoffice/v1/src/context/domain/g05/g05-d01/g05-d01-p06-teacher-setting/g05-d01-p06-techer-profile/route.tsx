import { HelperArchitectureDomainInterface } from 'skillvir-architecture-helper/frontend/domain';
import HelperTanStackRouter from 'skillvir-architecture-helper/library/universal-helper/tanstack-router';
import { lazy } from 'react';
import I18NInit from './i18n';

const DomainJSX = lazy(() => import('.'));

const DomainG05D01P06P04Route: HelperArchitectureDomainInterface['RouteInterface'] = {
  I18N: I18NInit,
  JSX: DomainJSX,
  Route: HelperTanStackRouter.JSX.Mapping({ JSX: DomainJSX }),
  GameInitial: null,
};

export default DomainG05D01P06P04Route;
