import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { lazy } from 'react';

const DomainJSX = lazy(() => import('.'));
const TestJSX = () => <DomainJSX />;

const meta = {
  title: 'Domain/G04/D09/P01/HowToUse',
  component: TestJSX,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onClick: fn() },
} satisfies Meta<typeof TestJSX>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
  },
};
