
import { DashboardCard } from "@/components/DashboardCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Wrench,
  Package,
  Clock
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Fev", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Abr", revenue: 61000 },
  { month: "Mai", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
];

const serviceData = [
  { name: "Troca de Óleo", value: 35 },
  { name: "Freios", value: 25 },
  { name: "Suspensão", value: 20 },
  { name: "Motor", value: 15 },
  { name: "Outros", value: 5 },
];

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral da sua oficina mecânica
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Ordens Abertas"
          value="24"
          description="Aguardando atendimento"
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Em Andamento"
          value="18"
          description="Sendo executadas"
          icon={Wrench}
          trend={{ value: 5, isPositive: true }}
        />
        <DashboardCard
          title="Clientes Ativos"
          value="342"
          description="Total de clientes"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Faturamento Mensal"
          value="R$ 67.000"
          description="Junho 2024"
          icon={DollarSign}
          trend={{ value: 22, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Faturamento Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Faturamento']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Serviços Mais Realizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Próximos Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { client: "João Silva", service: "Revisão completa", time: "09:00", vehicle: "Honda Civic 2020" },
                { client: "Maria Santos", service: "Troca de óleo", time: "10:30", vehicle: "Toyota Corolla 2019" },
                { client: "Pedro Costa", service: "Alinhamento", time: "14:00", vehicle: "Ford Focus 2021" },
              ].map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{appointment.client}</p>
                    <p className="text-sm text-muted-foreground">{appointment.service}</p>
                    <p className="text-xs text-muted-foreground">{appointment.vehicle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { item: "Óleo 15W40", quantity: 5, min: 10, status: "critical" },
                { item: "Filtro de Ar", quantity: 8, min: 15, status: "warning" },
                { item: "Pastilha de Freio", quantity: 12, min: 20, status: "warning" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{item.item}</p>
                    <p className="text-sm text-muted-foreground">Mínimo: {item.min}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      item.status === 'critical' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {item.quantity} unidades
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
