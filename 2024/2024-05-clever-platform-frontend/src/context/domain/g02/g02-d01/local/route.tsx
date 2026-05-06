import DomainG02D01P01LoginIDRoute from '../g02-d01-p01-login-id/route';
import DomainG02D01P02PinRoute from '../g02-d01-p02-pin/route';
import DomainG02D01P03InitialRoute from '../g02-d01-p03-initial/route';
import DomainG02D01P04AccountSelectRoute from '../g02-d01-p04-account-select/route';
import DomainG02D01P05SavedAccountsRoute from '../g02-d01-p05-account-saved/route';
import DomainG02D01P06AccountConnectRoute from '../g02-d01-p06-account-connect/route';
import DomainG02D01P08OfflineHistoryRoute from '../g02-d01-p08-offline-history/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG02D01P01LoginIDRoute, routePath: routePath + 'login-id' },
  { domain: DomainG02D01P02PinRoute, routePath: routePath + 'pin' },
  { domain: DomainG02D01P03InitialRoute, routePath: routePath + 'initial' },
  { domain: DomainG02D01P04AccountSelectRoute, routePath: routePath + 'account-select' },
  { domain: DomainG02D01P05SavedAccountsRoute, routePath: routePath + 'accounts-saved' },
  {
    domain: DomainG02D01P06AccountConnectRoute,
    routePath: routePath + 'account-connect',
  },
  // { domain: DomainG02D01P07, routePath: routePath + 'auth-connect' },
  {
    domain: DomainG02D01P08OfflineHistoryRoute,
    routePath: routePath + 'offline-history',
  },
];

const DomainG02D01 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG02D01;
