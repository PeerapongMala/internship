import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },
  // async viteFinal(config) {
  //   // Merge custom configuration into the default config
  //   const { mergeConfig } = await import('vite');

  // if (configType === 'DEVELOPMENT') {
  //   // Your development configuration goes here
  // }
  // if (configType === 'PRODUCTION') {
  //   // Your production configuration goes here.

  //   return mergeConfig(config, {
  //     // Add dependencies to pre-optimization
  //     optimizeDeps: {
  //       include: ['storybook-dark-mode'],
  //     },
  //   });
  // },
};
export default config;
