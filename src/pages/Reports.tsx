
import { useState } from "react";
import { BarChart3, Download, Calendar, TrendingUp, Users, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

const performanceData = [
  { month: "Set 23", ordens: 45, receita: 8500, clientes: 38 },
  { month: "Out 23", ordens: 52, receita: 9200, clientes: 42 },
  { month: "Nov 23", ordens: 38, receita: 7800, clientes: 35 },
  { month: "Dez 23", ordens: 68, receita: 10500, clientes: 55 },
  { month: "Jan 24", ordens: 72, receita: 11200, clientes: 58 },
];

const servicesData = [
  { name: "Troca de Óleo", quantity: 45, revenue: 6750 },
  { name: "Alinhamento", quantity: 28, revenue: 3360 },
  { name: "Balanceamento", quantity: 32, revenue: 2880 },
  { name: "Freios", quantity: 18, revenue: 3600 },
  { name: "Suspensão", quantity: 12, revenue: 2400 },
  { name: "Motor", quantity: 8, revenue: 4800 },
];

const partsData = [
  { name: "Filtros", quantity: 85, cost: 2550 },
  { name: "Óleo", quantity: 45, cost: 2025 },
  { name: "Pastilhas", quantity: 32, cost: 3840 },
  { name: "Pneus", quantity: 24, cost: 9600 },
  { name: "Baterias", quantity: 15, cost: 2250 },
];

const clientsData = [
  { name: "João Silva", orders: 8, total: 1450 },
  { name: "Maria Santos", orders: 6, total: 980 },
  { name: "Carlos Oliveira", orders: 5, total: 1200 },
  { name: "Ana Costa", orders: 4, total: 750 },
  { name: "Pedro Alves", orders: 3, total: 560 },
];

const statusDistribution = [
  { name: "Concluídas", value: 156, color: "#10b981" },
  { name: "Em Andamento", value: 24, color: "#f59e0b" },
  { name: "Abertas", value: 12, color: "#3b82f6" },
  { name: "Canceladas", value: 8, color: "#ef4444" },
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [reportType, setReportType] = useState("performance");

  const exportReport = (type: string) => {
    // Simulação de exportação
    console.log(`Exportando relatório: ${type}`);
    // Aqui seria implementada a lógica real de exportação
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análises e insights do negócio</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label>Período:</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
                <SelectItem value="quarter">Trimestre</SelectItem>
                <SelectItem value="year">Ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={() => exportReport(reportType)}>
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Ordens Concluídas"
          value="72"
          icon={BarChart3}
          trend={{ value: 12.5, isPositive: true }}
        />
        <DashboardCard
          title="Receita do Período"
          value="R$ 11.200"
          icon={TrendingUp}
          trend={{ value: 8.3, isPositive: true }}
        />
        <DashboardCard
          title="Clientes Atendidos"
          value="58"
          icon={Users}
          trend={{ value: 5.4, isPositive: true }}
        />
        <DashboardCard
          title="Ticket Médio"
          value="R$ 193"
          icon={Car}
          trend={{ value: -2.1, isPositive: false }}
        />
      </div>

      <Tabs defaultValue="performance" onValueChange={setReportType}>
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="parts">Peças</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução de Ordens de Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="ordens" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Ordens"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`R$ ${value}`, ""]} />
                    <Bar dataKey="receita" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Status das Ordens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Serviços Mais Realizados</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead className="text-center">Quantidade</TableHead>
                    <TableHead className="text-right">Receita Total</TableHead>
                    <TableHead className="text-right">Ticket Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {servicesData.map((service) => (
                    <TableRow key={service.name}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="text-center">{service.quantity}</TableCell>
                      <TableCell className="text-right">R$ {service.revenue.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        R$ {(service.revenue / service.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance de Serviços</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={servicesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#3b82f6" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Peças Mais Utilizadas</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Peça</TableHead>
                    <TableHead className="text-center">Quantidade</TableHead>
                    <TableHead className="text-right">Custo Total</TableHead>
                    <TableHead className="text-right">Custo Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {partsData.map((part) => (
                    <TableRow key={part.name}>
                      <TableCell className="font-medium">{part.name}</TableCell>
                      <TableCell className="text-center">{part.quantity}</TableCell>
                      <TableCell className="text-right">R$ {part.cost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        R$ {(part.cost / part.quantity).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consumo de Peças</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={partsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#f59e0b" name="Quantidade" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Clientes por Valor</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-center">Ordens</TableHead>
                    <TableHead className="text-right">Total Gasto</TableHead>
                    <TableHead className="text-right">Ticket Médio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientsData.map((client, index) => (
                    <TableRow key={client.name}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          {client.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">{client.orders}</TableCell>
                      <TableCell className="text-right">R$ {client.total.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        R$ {(client.total / client.orders).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Crescimento de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="clientes" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Clientes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Fidelização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Taxa de Retorno</span>
                    <span className="font-semibold">73%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Clientes Frequentes</span>
                    <span className="font-semibold">42</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Novos Clientes/Mês</span>
                    <span className="font-semibold">16</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tempo Médio Entre Visitas</span>
                    <span className="font-semibold">45 dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
