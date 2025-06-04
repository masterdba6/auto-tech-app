
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Crown, Star, Calendar, CreditCard, Users, Car } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Plan, Subscription } from '@/types/subscription';

const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Básico',
    description: 'Ideal para oficinas pequenas',
    price: 29.90,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Até 5 usuários',
      'Até 100 veículos',
      'Ordens de serviço básicas',
      'Relatórios simples',
      'Suporte por email'
    ],
    maxUsers: 5,
    maxVehicles: 100
  },
  {
    id: '2',
    name: 'Profissional',
    description: 'Para oficinas em crescimento',
    price: 59.90,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Até 15 usuários',
      'Até 500 veículos',
      'Ordens de serviço avançadas',
      'Controle de estoque',
      'Relatórios avançados',
      'Suporte prioritário'
    ],
    maxUsers: 15,
    maxVehicles: 500,
    isPopular: true
  },
  {
    id: '3',
    name: 'Empresarial',
    description: 'Para grandes oficinas e redes',
    price: 99.90,
    currency: 'BRL',
    interval: 'monthly',
    features: [
      'Usuários ilimitados',
      'Veículos ilimitados',
      'Todos os recursos',
      'Integrações personalizadas',
      'Relatórios personalizados',
      'Suporte 24/7'
    ],
    maxUsers: -1,
    maxVehicles: -1
  }
];

const mockSubscription: Subscription = {
  id: '1',
  companyId: '1',
  planId: '2',
  status: 'active',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z',
  autoRenew: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

const PlanCard: React.FC<{ plan: Plan; currentPlan?: boolean; onSelect: (planId: string) => void }> = ({ 
  plan, 
  currentPlan = false, 
  onSelect 
}) => {
  return (
    <Card className={`relative ${currentPlan ? 'border-primary ring-2 ring-primary/20' : ''} ${plan.isPopular ? 'border-orange-500' : ''}`}>
      {plan.isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-orange-500 text-white">
            <Star className="mr-1 h-3 w-3" />
            Mais Popular
          </Badge>
        </div>
      )}
      {currentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-green-500 text-white">
            <Crown className="mr-1 h-3 w-3" />
            Seu Plano
          </Badge>
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">R$ {plan.price.toFixed(2)}</span>
          <span className="text-muted-foreground">/mês</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
          <div className="flex items-center">
            <Users className="mr-1 h-4 w-4" />
            {plan.maxUsers === -1 ? 'Ilimitado' : `${plan.maxUsers} usuários`}
          </div>
          <div className="flex items-center">
            <Car className="mr-1 h-4 w-4" />
            {plan.maxVehicles === -1 ? 'Ilimitado' : `${plan.maxVehicles} veículos`}
          </div>
        </div>
        <Button 
          className="w-full" 
          variant={currentPlan ? "outline" : "default"}
          onClick={() => onSelect(plan.id)}
          disabled={currentPlan}
        >
          {currentPlan ? 'Plano Atual' : 'Selecionar Plano'}
        </Button>
      </CardContent>
    </Card>
  );
};

const SubscriptionPage: React.FC = () => {
  const { user, company } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(mockSubscription);
  const [isLoading, setIsLoading] = useState(false);

  const currentPlan = mockPlans.find(plan => plan.id === subscription?.planId);

  const handlePlanSelect = async (planId: string) => {
    setIsLoading(true);
    try {
      // Aqui você implementaria a lógica de assinatura
      console.log('Selecionando plano:', planId);
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erro ao selecionar plano:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Tem certeza que deseja cancelar sua assinatura?')) return;
    
    setIsLoading(true);
    try {
      // Aqui você implementaria a lógica de cancelamento
      console.log('Cancelando assinatura');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assinatura</h1>
        <p className="text-muted-foreground">
          Gerencie o plano de assinatura da sua empresa
        </p>
      </div>

      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Assinatura Atual
            </CardTitle>
            <CardDescription>
              Detalhes da assinatura de {company?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Plano</p>
                <p className="text-lg font-semibold">{currentPlan?.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={subscription.status === 'active' ? 'default' : 'destructive'}>
                  {subscription.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Renovação</p>
                <p className="text-lg">{subscription.autoRenew ? 'Automática' : 'Manual'}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Início</p>
                  <p>{formatDate(subscription.startDate)}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Próxima cobrança</p>
                  <p>{formatDate(subscription.endDate)}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancelSubscription} disabled={isLoading}>
                Cancelar Assinatura
              </Button>
              <Button variant="outline" disabled={isLoading}>
                Alterar Forma de Pagamento
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Planos Disponíveis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {mockPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              currentPlan={plan.id === subscription?.planId}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
          <CardDescription>
            Últimas cobranças da sua assinatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Janeiro 2024</p>
                <p className="text-sm text-muted-foreground">Plano Profissional</p>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ 59,90</p>
                <Badge variant="default">Pago</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Dezembro 2023</p>
                <p className="text-sm text-muted-foreground">Plano Profissional</p>
              </div>
              <div className="text-right">
                <p className="font-medium">R$ 59,90</p>
                <Badge variant="default">Pago</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPage;
