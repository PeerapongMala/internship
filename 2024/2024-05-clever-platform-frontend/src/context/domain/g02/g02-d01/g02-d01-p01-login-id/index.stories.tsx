import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import DomainJSX from '.';

const TestJSX = () => (
  // <WCTRouteTemplate>
  <div className="flex flex-col min-h-[50vh] uh-notch-p-x">
    <main className="bg-gray-500 flex flex-1 flex-col">
      <DomainJSX />
    </main>
  </div>
  // </WCTRouteTemplate>
);
// ignore
const MetaData = {
  title: 'Domain/G001/dxx_connect_account/SS001/Main',
  component: TestJSX,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    // layout: 'centered',
    layout: 'fullscreen', // or `padded` by default
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
