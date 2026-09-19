import type { Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom';
import { AuthProviderMock } from './mocks/AuthProviderMock';
import '../src/i18n';
import '../src/styles/variables.css';
import '../src/styles/forms.css';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/']}>
        <AuthProviderMock>
          <Story />
        </AuthProviderMock>
      </MemoryRouter>
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