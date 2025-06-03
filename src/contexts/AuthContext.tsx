
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, Company, LoginCredentials } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data - em produção isso viria do backend
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'AutoTech Oficina',
    cnpj: '12.345.678/0001-90',
    email: 'contato@autotech.com',
    phone: '(11) 99999-9999',
    address: 'Rua das Oficinas, 123 - São Paulo, SP',
    createdAt: '2024-01-01',
    isActive: true,
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@autotech.com',
    role: 'Gerente',
    companyId: '1',
    isActive: true,
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@autotech.com',
    role: 'Colaborador',
    companyId: '1',
    isActive: true,
    createdAt: '2024-01-05',
    lastLogin: '2024-01-14',
  },
];

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const savedUser = localStorage.getItem('user');
    const savedCompany = localStorage.getItem('company');
    
    if (savedUser && savedCompany) {
      setUser(JSON.parse(savedUser));
      setCompany(JSON.parse(savedCompany));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulação de autenticação - em produção seria uma chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email && u.isActive);
      if (!foundUser) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      const foundCompany = mockCompanies.find(c => c.id === foundUser.companyId);
      if (!foundCompany) {
        throw new Error('Empresa não encontrada');
      }

      const userWithCompany = { ...foundUser, company: foundCompany };
      
      setUser(userWithCompany);
      setCompany(foundCompany);
      
      localStorage.setItem('user', JSON.stringify(userWithCompany));
      localStorage.setItem('company', JSON.stringify(foundCompany));
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${foundUser.name}!`,
      });
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Credenciais inválidas",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do sistema",
    });
  };

  const value: AuthContextType = {
    user,
    company,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
