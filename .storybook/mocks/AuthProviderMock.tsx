import { AuthContext } from '../../src/features/auth/context/AuthContext';
import type { ReactNode } from 'react';

export function AuthProviderMock({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        isAuthenticated: false,
        isLoading: false,   // ← plus de blocage
        login: async () => {},
        register: async () => {},
        logout: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}