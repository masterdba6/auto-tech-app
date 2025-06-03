
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { CreateUserData } from '@/types/auth';

const CreateUser: React.FC = () => {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    role: 'Colaborador',
    companyId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, company } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se o usuário tem permissão de gerente
  React.useEffect(() => {
    if (!user || user.role !== 'Gerente') {
      navigate('/');
      toast({
        title: "Acesso negado",
        description: "Apenas gerentes podem criar novos usuários",
        variant: "destructive",
      });
    }
  }, [user, navigate, toast]);

  React.useEffect(() => {
    if (company) {
      setFormData(prev => ({ ...prev, companyId: company.id }));
    }
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulação de criação de usuário - em produção seria uma chamada para API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Usuário criado com sucesso",
        description: `${formData.name} foi adicionado ao sistema`,
      });
      
      navigate('/settings');
    } catch (error) {
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao criar o usuário. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user || user.role !== 'Gerente') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/settings')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Criar Novo Usuário</h1>
            <p className="text-muted-foreground">Adicione um novo usuário ao sistema</p>
          </div>
        </div>
        <Badge variant="secondary">
          {company?.name}
        </Badge>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Informações do Usuário
          </CardTitle>
          <CardDescription>
            Preencha os dados do novo usuário. Apenas gerentes podem criar novos usuários.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite o nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@empresa.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Digite a senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Perfil de Acesso</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => handleInputChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Colaborador">Colaborador</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Empresa</Label>
              <Input
                value={company?.name || ''}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Criando...' : 'Criar Usuário'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/settings')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUser;
