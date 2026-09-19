import type { Preview } from '@storybook/react-vite'
import React from 'react';
import { AuthProviderMock } from './mocks/AuthProviderMock';
import '../src/styles/variables.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <React.Fragment>
        <AuthProviderMock>
          <Story />
        </AuthProviderMock>
      </React.Fragment>
    ),
  ],

  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
};

export default preview;