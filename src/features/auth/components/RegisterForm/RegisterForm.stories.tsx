import type { Meta, StoryObj } from '@storybook/react';
import { RegisterForm } from './RegisterForm';

const meta: Meta<typeof RegisterForm> = {
  title: 'Auth/RegisterForm',
  component: RegisterForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RegisterForm>;

export const Default: Story = {};