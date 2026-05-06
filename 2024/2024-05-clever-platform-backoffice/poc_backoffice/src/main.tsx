import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'

import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';

// Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';

// Tailwind css
import './tailwind.css';

// i18n (needs to be bundled)
import './i18n';

// Router
import { RouterProvider } from 'react-router-dom';
import router from './router/index';

// Redux
import { Provider } from 'react-redux';
import store from './store/index';

import { createTheme, MantineProvider } from '@mantine/core';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Suspense>
            <Provider store={store}>
                <MantineProvider>
                    <RouterProvider router={router} />
                </MantineProvider>
            </Provider>
        </Suspense>
    </React.StrictMode>
);

