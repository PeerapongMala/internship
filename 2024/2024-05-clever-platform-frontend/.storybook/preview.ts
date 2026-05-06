import type { Preview } from '@storybook/react';

import '../src/core/css/index.css'; // import tailwind css file

// import i18n middleware
import DomainGlobal from '../src/context/global/index.tsx';
import { MiddlewareInit } from '../src/core/middleware/index.ts';
MiddlewareInit({ i18nList: DomainGlobal.i18nList });

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
