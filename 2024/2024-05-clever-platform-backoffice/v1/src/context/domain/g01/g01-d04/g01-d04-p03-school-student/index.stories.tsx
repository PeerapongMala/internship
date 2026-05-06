import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
// import WCTRouteTemplate from '../../global/component/web/template/wc-t-route-template';
import { lazy } from 'react';

const DomainJSX = lazy(() => import('.'));

const TestJSX = () => (
  // <WCTRouteTemplate>
  <DomainJSX />
  // </WCTRouteTemplate>
);
// ignore
const MetaData = {
  title: 'Domain/G01/D04/P03/Main',
  component: TestJSX,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  //   argTypes: {
  //     backgroundColor: { control: 'color' },
  //   },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof TestJSX>;

export default MetaData;

type Story = StoryObj<typeof MetaData>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
