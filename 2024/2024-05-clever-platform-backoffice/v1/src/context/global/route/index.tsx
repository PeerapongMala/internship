import ArchitectureDomain from 'skillvir-architecture-helper/frontend/domain';
import HelperTanStackRouter from 'skillvir-architecture-helper/library/universal-helper/tanstack-router';

import WCARouteNotFound from '../component/web/atom/wc-a-route-not-found';
import WCTRouteTemplate from '../component/web/template/wc-t-route-template';

//#region Implement local routing //
import DomainG01D000 from '@domain/g01/g01-d000/local/route';
import DomainG01D004 from '@domain/g00/g00-d04/local/route';
import DomainG00D001 from '@domain/g00/g00-d01/local/route';
import DomainG01D11 from '@domain/g01/g01-d11/local/route';

import DomainG00D00 from '@domain/g00/g00-d00/local/route';
import DomainG01D01 from '@domain/g01/g01-d01/local/route';
import DomainG01D02 from '@domain/g01/g01-d02/local/route';
import DomainG01D03 from '@domain/g01/g01-d03/local/route';
import DomainG01D04 from '@domain/g01/g01-d04/local/route';
import DomainG01D05 from '@domain/g01/g01-d05/local/route';
import DomainG01D06 from '@domain/g01/g01-d06/local/route';
import DomainG01D07 from '@domain/g01/g01-d07/local/route';
import DomainG01D08 from '@domain/g01/g01-d08/local/route';
import DomainG01D09 from '@domain/g01/g01-d09/local/route';
import DomainG01D10 from '@domain/g01/g01-d10/local/route';

import DomainG02D01 from '@domain/g02/g02-d01/local/route';
import DomainG02D02 from '@domain/g02/g02-d02/local/route';
import DomainG02D03 from '@domain/g02/g02-d03/local/route';
import DomainG02D04 from '@domain/g02/g02-d04/local/route';
import DomainG02D05 from '@domain/g02/g02-d05/local/route';
import DomainG02D06 from '@domain/g02/g02-d06/local/route';
import DomainG02D07 from '@domain/g02/g02-d07/local/route';
import DomainG02D08 from '@domain/g02/g02-d08/local/route';
import DomainG02D09 from '@domain/g02/g02-d09/local/route';

import DomainG03D02 from '@domain/g03/g03-d02/local/route';
import DomainG03D04 from '@domain/g03/g03-d04/local/route';
import DomainG03D05 from '@domain/g03/g03-d05/local/route';
import DomainG03D06 from '@domain/g03/g03-d06/local/route';
import DomainG03D07 from '@domain/g03/g03-d07/local/route';
import DomainG03D08 from '@domain/g03/g03-d08/local/route';
import DomainG03D09 from '@domain/g03/g03-d09/local/route';
import DomainG03D10 from '@domain/g03/g03-d10/local/route';
import DomainG03D11 from '@domain/g03/g03-d11/local/route';
import DomainG03D12 from '@domain/g03/g03-d12/local/route';
import DomainG03D13 from '@domain/g03/g03-d13/local/route';

import DomainG04D01 from '@domain/g04/g04-d01/local/route';
import DomainG04D02 from '@domain/g04/g04-d02/local/route';
import DomainG04D03 from '@domain/g04/g04-d03/local/route';
import DomainG04D04 from '@domain/g04/g04-d04/local/route';
import DomainG04D05 from '@domain/g04/g04-d05/local/route';
import DomainG04D06 from '@domain/g04/g04-d06/local/route';
import DomainG04D07 from '@domain/g04/g04-d07/local/route';
import DomainG04D08 from '@domain/g04/g04-d08/local/route';
import DomainG04D09 from '@domain/g04/g04-d09/local/route';

import DomainG05D01 from '@domain/g05/g05-d01/local/route';
import DomainG05D02 from '@domain/g05/g05-d02/local/route';
import DomainG05D03 from '@domain/g05/g05-d03/local/route';

import DomainG06D01 from '@domain/g06/g06-d01/local/route';
import DomainG06D03 from '@domain/g06/g06-d03/local/route';
import DomainG06D05 from '@domain/g06/g06-d05/local/route';
import DomainG03D03 from '@domain/g03/g03-d03/local/route';
import DomainG03D01 from '@domain/g03/g03-d01/local/route';
import DomainG06D06 from '@domain/g06/g06-d06/local/route';
import DomainG06D07 from '@domain/g06/g06-d07/local/route';
import DomainG05D00 from '@domain/g05/g05-d00/local/route';
import DomainG06D02 from '@domain/g06/g06-d02/local/route';
import DomainG03D06V2 from '@domain/g03/g03-d06-v2/local/route';
import DomainG03D07V2 from '@domain/g03/g03-d07-v2/local/route';
import { useEffect } from 'react';
import SubjectTeacherMiddleware from '@global/middleware/teacher/SubjectTeacherMiddleware';
import DomainG01D12 from '@domain/g01/g01-d12/local/route';

//#endregion  Implement local routing //

const XLayoutJSX: React.FC<any> = (props: { children: React.ReactNode }) => {
  useEffect(() => {
    console.log('Hello LayoutJSX');
  }, []);
  return <>{props.children}</>;
};

const { i18nList, routeFuncList, sceneStateList } = ArchitectureDomain.Route.MergeRawList(
  [
    ArchitectureDomain.Route.LayoutManagerWithGroup(
      {
        id: 'SubjectTeacherMiddleware',
        componentWithChildren: SubjectTeacherMiddleware,
      },
      [
        { group: DomainG03D01, routePath: '/teacher/dashboard' },
        { group: DomainG03D04, routePath: '/teacher/student' },
        { group: DomainG03D03, routePath: '/teacher/student-group' },
        { group: DomainG03D05, routePath: '/teacher/lesson' },
        { group: DomainG03D06V2, routePath: '/teacher/homework' },
        { group: DomainG03D07V2, routePath: '/teacher/reward' },
        { group: DomainG03D08, routePath: '/teacher/item' },
      ],
    ),
    ArchitectureDomain.Route.GroupManager([
      { group: DomainG01D000, routePath: '/iconpreview' },
      { group: DomainG01D004, routePath: '/components' },
      { group: DomainG00D001, routePath: '/' },
      { group: DomainG00D00, routePath: '/' },
      { group: DomainG01D01, routePath: '/admin/report' },
      { group: DomainG01D02, routePath: '/admin/affiliation' },
      { group: DomainG01D03, routePath: '/admin/translation' },
      { group: DomainG01D04, routePath: '/admin/school' },
      { group: DomainG01D05, routePath: '/admin/school/$schoolId/classroom' },
      { group: DomainG01D06, routePath: '/admin/school/$schoolId/subject-teacher' },
      { group: DomainG01D07, routePath: '/admin/user-account' },
      { group: DomainG01D08, routePath: '/admin/family' },
      { group: DomainG01D09, routePath: '/admin/report-permission' },
      { group: DomainG01D10, routePath: '/admin/how-to-use' },
      { group: DomainG01D11, routePath: '/admin/report-bug' },
      { group: DomainG01D12, routePath: '/admin/profile' },

      { group: DomainG02D01, routePath: '/content-creator/standard' },
      { group: DomainG02D02, routePath: '/content-creator/course' },
      { group: DomainG02D03, routePath: '/content-creator/lesson' },
      { group: DomainG02D04, routePath: '/content-creator/sublesson' },
      { group: DomainG02D05, routePath: '/content-creator/level' },
      { group: DomainG02D06, routePath: '/content-creator/translation' },
      { group: DomainG02D07, routePath: '/content-creator/profile' },
      { group: DomainG02D08, routePath: '/content-creator/how-to-use' },
      { group: DomainG02D09, routePath: '/content-creator/grade-template' },

      { group: DomainG03D02, routePath: '/teacher/grading' },
      // { group: DomainG03D06, routePath: '/teacher/homework' },
      // { group: DomainG03D07, routePath: '/teacher/reward' },
      { group: DomainG03D09, routePath: '/teacher/shop' },
      { group: DomainG03D10, routePath: '/teacher/announcement' },
      { group: DomainG03D11, routePath: '/teacher/chat' },
      { group: DomainG03D12, routePath: '/teacher/profile' },
      { group: DomainG03D13, routePath: '/teacher/how-to-use' },

      { group: DomainG04D01, routePath: '/gamemaster/announcement' },
      { group: DomainG04D02, routePath: '/gamemaster/item' },
      { group: DomainG04D03, routePath: '/gamemaster/shop' },
      { group: DomainG04D04, routePath: '/gamemaster/gamification' },
      { group: DomainG04D05, routePath: '/gamemaster/redeem' },
      { group: DomainG04D06, routePath: '/gamemaster/bug-report' },
      { group: DomainG04D07, routePath: '/gamemaster/profile' },
      { group: DomainG04D08, routePath: '/gamemaster/chat-config' },
      { group: DomainG04D09, routePath: '/gamemaster/how-to-use' },

      { group: DomainG05D00, routePath: 'line/connect' },
      { group: DomainG05D01, routePath: 'line/teacher' },
      { group: DomainG05D02, routePath: 'line/parent' },
      { group: DomainG05D03, routePath: 'line/student' },

      { group: DomainG06D01, routePath: '/grade-system' },
      { group: DomainG06D02, routePath: '/grade-system/evaluation' },
      { group: DomainG06D03, routePath: '/grade-system/data-entry' },
      {
        group: DomainG06D05,
        routePath: '/grade-system/evaluation/report/$evaluationFormId/phorpor5',
      },
      {
        group: DomainG06D06,
        routePath: '/grade-system/evaluation/report/$evaluationFormId/phorpor6',
      },
      { group: DomainG06D07, routePath: '/grade-system/setting' },
    ]),
  ],
);

// Route
export const helperTanStackRouterClass =
  new HelperTanStackRouter.HelperTanStackRouterClass({
    template: WCTRouteTemplate,
    templateNotFound: WCARouteNotFound,
    routeFuncList: routeFuncList,
    tanStackRouterDevtoolsIs: false,
  });

const Route = {
  JSX: () => <helperTanStackRouterClass.Router.ProviderJSX />,
  i18nList,
  sceneStateList,
};
export default Route;
