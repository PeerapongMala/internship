import ArchitectureDomain from 'skillvir-architecture-helper/frontend/domain';
import HelperTanStackRouter from 'skillvir-architecture-helper/library/universal-helper/tanstack-router';

import DomainG01D00 from '@domain/g01/g01-d00/local/route';
import DomainG01D02 from '@domain/g01/g01-d02/local/route';
import DomainG01D03 from '@domain/g01/g01-d03/local/route';
import DomainG01D04 from '@domain/g01/g01-d04/local/route';
import DomainG02D01 from '@domain/g02/g02-d01/local/route';
import DomainG02D02 from '@domain/g02/g02-d02/local/route';
import DomainG02D03 from '@domain/g02/g02-d03/local/route';
import DomainG03D01 from '@domain/g03/g03-d01/local/route';
import DomainG03D02 from '@domain/g03/g03-d02/local/route';
import DomainG03D03 from '@domain/g03/g03-d03/local/route';
import DomainG03D04 from '@domain/g03/g03-d04/local/route';
import DomainG03D05 from '@domain/g03/g03-d05/local/route';
import DomainG03D06 from '@domain/g03/g03-d06/local/route';
import DomainG03D07 from '@domain/g03/g03-d07/local/route';
import DomainG03D08 from '@domain/g03/g03-d08/local/route';
import DomainG03D09 from '@domain/g03/g03-d09/local/route';
import DomainG03D10 from '@domain/g03/g03-d10/local/route';
import DomainG04D01 from '@domain/g04/g04-d01/local/route';
import DomainG04D02 from '@domain/g04/g04-d02/local/route';
import DomainG04D03 from '@domain/g04/g04-d03/local/route';
import WCARouteNotFound from '../component/web/atom/wc-a-route-not-found';
import WCTRouteTemplate from '../component/web/template/wc-t-route-template';

const { i18nList, sceneStateList, routeFuncList } = ArchitectureDomain.Route.GroupManager(
  [
    // G01
    { group: DomainG01D00, routePath: '/' },
    { group: DomainG01D02, routePath: '/' },
    { group: DomainG01D03, routePath: '/' },
    { group: DomainG01D04, routePath: '/' },
    // G02
    { group: DomainG02D01, routePath: '/' },
    { group: DomainG02D02, routePath: '/' },
    { group: DomainG02D03, routePath: '/' },
    // G03
    { group: DomainG03D01, routePath: '/' },
    { group: DomainG03D02, routePath: '/' },
    { group: DomainG03D03, routePath: '/' },
    { group: DomainG03D04, routePath: '/' },
    { group: DomainG03D05, routePath: '/' },
    { group: DomainG03D06, routePath: '/' },
    { group: DomainG03D07, routePath: '/' },
    { group: DomainG03D08, routePath: '/' },
    { group: DomainG03D09, routePath: '/' },
    { group: DomainG03D10, routePath: '/' },
    //G04
    { group: DomainG04D01, routePath: '/' },
    { group: DomainG04D02, routePath: '/' },
    { group: DomainG04D03, routePath: '/' },
  ],
);

// dupilcate path
// g03-d05-p01-shop g03-d02-p04-shop
// g03-d03-p01-redeem g03-d02-p02-redeem

//   // { domain: DomainG03D02, routePath: '/tutorial' },

//   // { domain: DomainG01D02, routePath: '/set-config' },

//   // { domain: DomainG01D01M01, routePath: '/splash-screen' },
//   // { domain: DomainG01D02M01, routePath: '/set-langauge' },
//   // { domain: DomainG01D02M02, routePath: '/set-fullscreen' },
//   // { domain: DomainG01D02M03, routePath: '/terms' },

// { domain: DomainG01D03, routePath: '/version-update' },

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
