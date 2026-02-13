import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Button>;

// Story 1 : Bouton Primary
export const Primary: Story = {
  args: {
    children: 'Ajouter aux favoris',
    variant: 'primary',
  },
};

// Story 2 : Bouton Secondary
export const Secondary: Story = {
  args: {
    children: 'Annuler',
    variant: 'secondary',
  },
};

// Story 3 : Bouton Danger
export const Danger: Story = {
  args: {
    children: 'Supprimer',
    variant: 'danger',
  },
};

// Story 4 : Bouton avec icône
export const WithIcon: Story = {
  args: {
    children: '⭐ Favoris',
    variant: 'primary',
  },
};

// Story 5 : Petit bouton
export const Small: Story = {
  args: {
    children: 'Petit',
    size: 'small',
  },
};

// Story 6 : Grand bouton
export const Large: Story = {
  args: {
    children: 'Grand',
    size: 'large',
  },
};

// Story 7 : Bouton désactivé
export const Disabled: Story = {
  args: {
    children: 'Désactivé',
    disabled: true,
  },
};