export type User = {
  id: string;
  email?: string;
  username: string;
  roles?: string[];
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  username: string;
  languageId: number;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
};