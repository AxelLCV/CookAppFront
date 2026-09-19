import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../api/auth';
import { saveToken, getToken, removeToken } from '../utils/token';
import type { User, LoginCredentials, RegisterData } from '../types/auth';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getToken().then((token) => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      getCurrentUser()
        .then((user) => {
          setUser(user);
          setIsLoading(false);
        })
        .catch(() => {
          removeToken();
          setIsLoading(false);
        });
    });
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiLogin(credentials);
    await saveToken(response.token);
    setUser(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await apiRegister(data);
    await saveToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    removeToken();
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