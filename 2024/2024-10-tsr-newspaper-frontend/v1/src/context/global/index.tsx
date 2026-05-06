import { BrowserRouter } from 'react-router-dom';
import './css/font.css';
import './css/index.css';


import WCAUILoader from './component/web/atom/wc-a-ui-loader';
import I18NInit from './i18n';
import Route from './route';
import DevNavBar from '@context/dev/cc-u-dev-nav-bar';

const i18nList = [
  I18NInit({ name: 'global' }),
  ...Route.i18nList,
];

const JSX = () => (
  <BrowserRouter>
    <WCAUILoader>
      <Route.JSX />
    </WCAUILoader>
  </BrowserRouter>
);

const DomainGlobal = { JSX, i18nList };

export default DomainGlobal;
