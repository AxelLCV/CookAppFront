import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoginForm } from './LoginForm';

const meta: Meta<typeof LoginForm> = {
  title: 'Auth/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};
