import DomainG03D04P01AvatarCustomRoute from '../g03-d04-p01-avatar-custom/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D04P01AvatarCustomRoute, routePath: routePath + 'avatar-custom' },
];

const DomainG03D04 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D04;
