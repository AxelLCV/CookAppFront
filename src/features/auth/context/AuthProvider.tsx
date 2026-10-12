import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../api/auth';
import { saveToken, getToken, removeToken } from '../utils/token';
import { saveCachedUser, getCachedUser, removeCachedUser } from '../utils/userCache';
import { ApiError } from '@/config/client';
import type { User, LoginCredentials, RegisterData } from '../types/auth';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const token = await getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const cachedUser = await getCachedUser();
      if (cachedUser) {
        setUser(cachedUser);
      }

      try {
        const freshUser = await getCurrentUser();
        setUser(freshUser);
        await saveCachedUser(freshUser);
      } catch (err) {
        // Only a real "token rejected" response logs the user out. Any other
        // failure (most commonly: no network) keeps the cached session, so
        // losing connectivity doesn't bounce the user back to the login page.
        if (err instanceof ApiError && err.status === 401) {
          await removeToken();
          await removeCachedUser();
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiLogin(credentials);
    await saveToken(response.token);
    await saveCachedUser(response.user);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await apiRegister(data);
    await saveToken(response.token);
    await saveCachedUser(response.user);
    setUser(response.user);
  };

  const logout = () => {
    removeToken();
    removeCachedUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
