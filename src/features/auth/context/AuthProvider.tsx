import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '../api/auth';
import { saveToken, getToken, removeToken } from '../utils/token';
import type { User, LoginCredentials, RegisterData } from '../types/auth';

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const token = getToken();
    if (token) {
      getCurrentUser()
        .then((user) => {
          setUser(user);
          setIsLoading(false);
        })
        .catch(() => {
          removeToken();
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await apiLogin(credentials);
    saveToken(response.token);
    setUser(response.user);
    console.log(response.user);
  };

  const register = async (data: RegisterData) => {
    const response = await apiRegister(data);
    saveToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    apiLogout().catch(console.error); // Appel backend (best effort)
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