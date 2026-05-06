import './index.module.css';

import { HelperArchitectureDomainInterface } from 'skillvir-architecture-helper/frontend/domain';
import HelperTanStackRouter from 'skillvir-architecture-helper/library/universal-helper/tanstack-router';

import DomainJSX from '.';
import GameInitial from './gameloop';
import I18NInit from './i18n';
// import QuizDemo from './quiz-demo';
import Quiz from './question';

const DomainG04D03P01GameplayQuizRoute2: HelperArchitectureDomainInterface['RouteInterface'] =
  {
    I18N: I18NInit,
    JSX: DomainJSX,
    Route: HelperTanStackRouter.JSX.Mapping({
      JSX: Quiz,
      routePathSub: '/quiz',
    }),
    GameInitial,
  };
export default DomainG04D03P01GameplayQuizRoute2;
