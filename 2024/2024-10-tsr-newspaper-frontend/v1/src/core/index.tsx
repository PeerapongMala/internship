import './css/index.css';

import ReactDOM from 'react-dom/client';

import DomainGlobal from '../context/global/index';
import { FixbugInit } from './fixbug/index';
import { HelperStrictMode } from './helper/strict-mode';
import { MiddlewareInit } from './middleware/index';

FixbugInit();
MiddlewareInit({ i18nList: DomainGlobal.i18nList });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelperStrictMode>
      <DomainGlobal.JSX />
  </HelperStrictMode>
);
