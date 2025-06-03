
import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Plus, Search, Edit, Trash2, Download } from 'lucide-react';

interface Order {
  id: string;
  type: 'budget' | 'service_order';
  vehicleId: string;
  clientName: string;
  vehicle: string;
  plate: string;
  currentKm: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  totalValue: number;
  createdAt: string;
  notes?: string;
}

const mockVehicleOrders: Order[] = [
  {
    id: "1",
    type: "service_order",
    vehicleId: "1",
    clientName: "João Silva",
    vehicle: "Toyota Corolla 2020",
    plate: "ABC-1234",
    currentKm: 45000,
    status: "in_progress",
    totalValue: 185,
    createdAt: "2024-01-15",
    notes: "Cliente solicitou revisão completa",
  },
  {
    id: "3",
    type: "budget",
    vehicleId: "1",
    clientName: "João Silva",
    vehicle: "Toyota Corolla 2020",
    plate: "ABC-1234",
    currentKm: 44500,
    status: "completed",
    totalValue: 350,
    createdAt: "2024-01-10",
    notes: "Troca de pneus",
  },
  {
    id: "4",
    type: "service_order",
    vehicleId: "1",
    clientName: "João Silva",
    vehicle: "Toyota Corolla 2020",
    plate: "ABC-1234",
    currentKm: 44000,
    status: "completed",
    totalValue: 120,
    createdAt: "2024-01-05",
  },
  {
    id: "2",
    type: "budget",
    vehicleId: "2",
    clientName: "Maria Santos",
    vehicle: "Honda Civic 2019",
    plate: "XYZ-5678",
    currentKm: 52000,
    status: "open",
    totalValue: 120,
    createdAt: "2024-01-16",
  },
];

const statusLabels = {
  open: "Aberta",
  in_progress: "Em Andamento",
  completed: "Concluída",
  cancelled: "Cancelada",
};

const statusColors = {
  open: "bg-blue-500",
  in_progress: "bg-yellow-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

const VehicleOrders = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleName = searchParams.get('name') || 'Veículo';
  const plate = searchParams.get('plate') || '';
  
  const [searchTerm, setSearchTerm] = useState('');

  const vehicleOrders = mockVehicleOrders.filter(order => order.vehicleId === vehicleId);
  
  const filteredOrders = vehicleOrders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statusLabels[order.status].toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (orderId: string) => {
    navigate(`/orders`); // Navega para a página de ordens para editar
  };

  const handleDelete = (orderId: string) => {
    // Implementar lógica de exclusão
    console.log('Deletar ordem:', orderId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/vehicles')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Ordens de {vehicleName}</h1>
            <p className="text-muted-foreground">Placa: {plate} • Histórico de orçamentos e ordens de serviço</p>
          </div>
        </div>

        <Button onClick={() => navigate('/orders')}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Ordem
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Histórico de Ordens
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Buscar por ID, status, tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma ordem encontrada para este veículo</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/orders')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Ordem
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>KM</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {order.type === 'budget' ? 'Orçamento' : 'O.S.'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.currentKm.toLocaleString()} km</TableCell>
                    <TableCell>R$ {order.totalValue.toFixed(2)}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" title="Download">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(order.id)}
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(order.id)}
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleOrders;
