import { HelperArchitectureDomainInterface } from 'skillvir-architecture-helper/frontend/domain';
import HelperTanStackRouter from 'skillvir-architecture-helper/library/universal-helper/tanstack-router';

import DomainJSX from '.';
import GameInitial from './gameloop';
import I18NInit from './i18n';

const DomainG03D08P02ArcadeLeaderboardRoute: HelperArchitectureDomainInterface['RouteInterface'] =
  {
    I18N: I18NInit,
    JSX: DomainJSX,
    Route: HelperTanStackRouter.JSX.Mapping({ JSX: DomainJSX }),
    GameInitial,
  };
export default DomainG03D08P02ArcadeLeaderboardRoute;
