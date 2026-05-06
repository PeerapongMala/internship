import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

import './css/index.css';
import './css/vristo.css';

import './css/datatables.css';

import './css/file-upload-preview.css';

import 'katex/dist/katex.min.css';
import './css/latex.css';

import ReactDOM from 'react-dom/client';

import DomainGlobal from '../context/global/index.tsx';
import { FixbugInit } from './fixbug/index.ts';
import { HelperStrictMode } from './helper/strict-mode.tsx';
import { MiddlewareInit } from './middleware/index.ts';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

FixbugInit();
MiddlewareInit({ i18nList: DomainGlobal.i18nList });
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelperStrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <DomainGlobal.JSX />
      </MantineProvider>
    </QueryClientProvider>
  </HelperStrictMode>,
);
