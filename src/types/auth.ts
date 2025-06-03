
export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Gerente' | 'Colaborador';
  companyId: string;
  company?: Company;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AuthContextType {
  user: User | null;
  company: Company | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'Gerente' | 'Colaborador';
  companyId: string;
}
