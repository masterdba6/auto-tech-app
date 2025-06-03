
import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/DashboardCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  amount: number;
  category: string;
  date: string;
  orderId?: string;
  status: 'pending' | 'completed' | 'cancelled';
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    description: "Ordem de Serviço #1 - João Silva",
    amount: 185.00,
    category: "Serviços",
    date: "2024-01-15",
    orderId: "1",
    status: "completed",
  },
  {
    id: "2",
    type: "expense",
    description: "Compra de peças - Filtros",
    amount: 350.00,
    category: "Estoque",
    date: "2024-01-14",
    status: "completed",
  },
  {
    id: "3",
    type: "income",
    description: "Ordem de Serviço #3 - Carlos Oliveira",
    amount: 450.00,
    category: "Serviços",
    date: "2024-01-13",
    orderId: "3",
    status: "completed",
  },
  {
    id: "4",
    type: "expense",
    description: "Aluguel da oficina",
    amount: 2500.00,
    category: "Despesas Fixas",
    date: "2024-01-10",
    status: "completed",
  },
  {
    id: "5",
    type: "income",
    description: "Orçamento #2 - Maria Santos (Pendente)",
    amount: 120.00,
    category: "Orçamentos",
    date: "2024-01-16",
    orderId: "2",
    status: "pending",
  },
];

const revenueData = [
  { month: "Set", receita: 8500, despesas: 4200 },
  { month: "Out", receita: 9200, despesas: 4800 },
  { month: "Nov", receita: 7800, despesas: 3900 },
  { month: "Dez", receita: 10500, despesas: 5200 },
  { month: "Jan", receita: 11200, despesas: 5800 },
];

const categoryData = [
  { category: "Serviços", value: 15400, percentage: 68 },
  { category: "Peças", value: 4200, percentage: 18 },
  { category: "Revisões", value: 2800, percentage: 12 },
  { category: "Outros", value: 450, percentage: 2 },
];

export default function Financial() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredTransactions = transactions.filter(transaction => {
    if (filterStatus === "all") return true;
    return transaction.status === filterStatus;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-muted-foreground">Acompanhe receitas, despesas e lucratividade</p>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Receita Total"
          value={`R$ ${totalIncome.toFixed(2)}`}
          icon={TrendingUp}
          trend={{ value: 12.5, isPositive: true }}
        />
        <DashboardCard
          title="Despesas Totais"
          value={`R$ ${totalExpenses.toFixed(2)}`}
          icon={TrendingDown}
        />
        <DashboardCard
          title="Lucro Líquido"
          value={`R$ ${profit.toFixed(2)}`}
          icon={DollarSign}
          trend={{ value: profitMargin, isPositive: profit > 0 }}
        />
        <DashboardCard
          title="Receitas Pendentes"
          value={`R$ ${pendingIncome.toFixed(2)}`}
          icon={Calendar}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Financeira</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`R$ ${value}`, ""]} />
                <Line 
                  type="monotone" 
                  dataKey="receita" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Receita"
                />
                <Line 
                  type="monotone" 
                  dataKey="despesas" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Despesas"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receita por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`R$ ${value}`, ""]} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Transações Recentes
            </CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label>Status:</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{transaction.description}</div>
                      {transaction.orderId && (
                        <div className="text-sm text-muted-foreground">
                          Ordem #{transaction.orderId}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                      {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        transaction.status === 'completed' ? 'default' :
                        transaction.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {transaction.status === 'completed' ? 'Concluído' :
                       transaction.status === 'pending' ? 'Pendente' : 'Cancelado'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {transaction.type === 'income' ? '+' : '-'}R$ {transaction.amount.toFixed(2)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Receitas</span>
                <span className="text-green-600 font-semibold">
                  R$ {totalIncome.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Despesas</span>
                <span className="text-red-600 font-semibold">
                  R$ {totalExpenses.toFixed(2)}
                </span>
              </div>
              <hr />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Lucro Líquido</span>
                <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                  R$ {profit.toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                Margem de lucro: {profitMargin.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metas do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Receita Meta</span>
                  <span>R$ 15.000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((totalIncome / 15000) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {((totalIncome / 15000) * 100).toFixed(1)}% da meta
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Ordens Concluídas</span>
                  <span>25 / 30</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  83% da meta
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Vencimentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium">Aluguel</div>
                  <div className="text-sm text-muted-foreground">Vence em 5 dias</div>
                </div>
                <div className="text-red-600 font-semibold">R$ 2.500</div>
              </div>
              
              <div className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium">Energia Elétrica</div>
                  <div className="text-sm text-muted-foreground">Vence em 12 dias</div>
                </div>
                <div className="text-red-600 font-semibold">R$ 380</div>
              </div>
              
              <div className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium">Internet</div>
                  <div className="text-sm text-muted-foreground">Vence em 18 dias</div>
                </div>
                <div className="text-red-600 font-semibold">R$ 120</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
