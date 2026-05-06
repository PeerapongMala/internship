import DomainG03D06P01MailboxRoute from '../g03-d06-p01-mailbox/route';
import I18NInit from './i18n';

const domainList = (routePath: string) => [
  { domain: DomainG03D06P01MailboxRoute, routePath: routePath + 'mailbox' },
];

const DomainG03D06 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG03D06;
