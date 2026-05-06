import DomainG00D01 from '@domain/g00/g00-d01/local/route';
import DomainG00D02 from '@domain/g00/g00-d02/local/route';

import DomainG01D01 from '@domain/g01/g01-d01/local/route';
import DomainG01D02 from '@domain/g01/g01-d02/local/route';
import DomainG01D03 from '@domain/g01/g01-d03/local/route';
import DomainG01D04 from '@domain/g01/g01-d04/local/route';
import DomainG01D05 from '@domain/g01/g01-d05/local/route';
import DomainG01D06 from '@domain/g01/g01-d06/local/route';
import DomainG01D07 from '@domain/g01/g01-d07/local/route';

import DomainG02D01 from '@domain/g02/g02-d01/local/route';
import DomainG02D02 from '@domain/g02/g02-d02/local/route';

import DomainG03D01 from '@domain/g03/g03-d01/local/route';
import DomainG03D02 from '@domain/g03/g03-d02/local/route';
import DomainG03D03 from '@domain/g03/g03-d03/local/route';
import DomainG03D04 from '@domain/g03/g03-d04/local/route';
import DomainG03D05 from '@domain/g03/g03-d05/local/route';
import DomainG03D06 from '@domain/g03/g03-d06/local/route';

import ArchitectureDomain from 'skillvir-architecture-helper/frontend/domain';
import HelperTanStackRouter from 'skillvir-architecture-helper/library/universal-helper/tanstack-router';

import WCARouteNotFound from '../component/web/template/wc-a-route-not-found';
import WCTRouteTemplate from '../component/web/template/wc-t-route-template';

const { i18nList, sceneStateList, routeFuncList } = ArchitectureDomain.Route.GroupManager(
  [
    //auth
    { group: DomainG00D01, routePath: '/sign-in' },
    { group: DomainG00D02, routePath: '/sign-up' },

    //NON-MEMBER
    { group: DomainG01D01, routePath: '/' },
    { group: DomainG01D01, routePath: '/main' },
    { group: DomainG01D02, routePath: '/post/non-member' }, //NON-MEMBER
    { group: DomainG01D03, routePath: '/download' },
    { group: DomainG01D04, routePath: '/about-us' },
    { group: DomainG01D05, routePath: '/contact' },
    { group: DomainG01D06, routePath: '/faq' },
    { group: DomainG01D07, routePath: '/guide' },

    //MEMBER --> like Non-member except /profile,/post
    { group: DomainG02D01, routePath: '/profile' },
    { group: DomainG02D02, routePath: '/post' }, //MEMBER

    //ADMIN --> Member + Management
    { group: DomainG03D01, routePath: '/admin/announcement' },
    { group: DomainG03D02, routePath: '/admin/banner' },
    { group: DomainG03D03, routePath: '/admin/faq' },
    { group: DomainG03D04, routePath: '/admin/cover' },
    { group: DomainG03D05, routePath: '/admin/approve' },
    { group: DomainG03D06, routePath: '/admin/download' },
  ],
);

// Route
const helperTanStackRouterClass = new HelperTanStackRouter.HelperTanStackRouterClass({
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
