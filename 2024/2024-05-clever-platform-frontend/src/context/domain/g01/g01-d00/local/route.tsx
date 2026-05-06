import I18NInit from './i18n';

import DomainG01D00P01Demo1Route from '../g01-d00-p01-demo1/route';
import DomainG01D00P02Demo2Route from '../g01-d00-p02-demo2/route';
import DomainG01D00P03Demo3Route from '../g01-d00-p03-demo3/route';
import DomainG01D00P04Demo4Route from '../g01-d00-p04-demo4/route';
import DomainG01D00P05Demo5Route from '../g01-d00-p05-demo5/route';
import DomainG01D00P06DownloadRoute from '../g01-d00-p06-download/route';
import DomainG01D00P07GameplayModelRendererRoute from '../g01-d00-p07-gameplay-model-renderer/route';

const domainList = (routePath: string) => [
  { domain: DomainG01D00P01Demo1Route, routePath: routePath + 'demo1' },
  { domain: DomainG01D00P02Demo2Route, routePath: routePath + 'demo2' },
  { domain: DomainG01D00P03Demo3Route, routePath: routePath + 'demo3' },
  { domain: DomainG01D00P04Demo4Route, routePath: routePath + 'demo4' },
  { domain: DomainG01D00P05Demo5Route, routePath: routePath + 'demo5' },
  { domain: DomainG01D00P06DownloadRoute, routePath: routePath + 'download' },
  { domain: DomainG01D00P07GameplayModelRendererRoute, routePath: routePath + 'model-renderer' },
];

const DomainG01D00 = {
  domainList: domainList,
  i18NInit: I18NInit,
};
export default DomainG01D00;
