import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabBar } from './TabBar';

const meta: Meta<typeof TabBar> = {
  title: 'Layout/TabBar',
  component: TabBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TabBar>;

export const Default: Story = {};
