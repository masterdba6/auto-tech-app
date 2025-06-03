
import { useState } from "react";
import { Plus, Search, Edit, Trash2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface OrderItem {
  id: string;
  type: 'service' | 'part';
  description: string;
  additionalInfo?: string;
  quantity?: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  type: 'budget' | 'service_order';
  clientName: string;
  vehicle: string;
  plate: string;
  currentKm: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  items: OrderItem[];
  totalValue: number;
  createdAt: string;
  notes?: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    type: "service_order",
    clientName: "João Silva",
    vehicle: "Toyota Corolla 2020",
    plate: "ABC-1234",
    currentKm: 45000,
    status: "in_progress",
    items: [
      {
        id: "1",
        type: "service",
        description: "Troca de óleo",
        additionalInfo: "Óleo sintético 5W30",
        quantity: 1,
        unitPrice: 150,
        totalPrice: 150,
      },
      {
        id: "2",
        type: "part",
        description: "Filtro de óleo",
        quantity: 1,
        unitPrice: 35,
        totalPrice: 35,
      },
    ],
    totalValue: 185,
    createdAt: "2024-01-15",
    notes: "Cliente solicitou revisão completa",
  },
  {
    id: "2",
    type: "budget",
    clientName: "Maria Santos",
    vehicle: "Honda Civic 2019",
    plate: "XYZ-5678",
    currentKm: 52000,
    status: "open",
    items: [
      {
        id: "1",
        type: "service",
        description: "Alinhamento e balanceamento",
        quantity: 1,
        unitPrice: 120,
        totalPrice: 120,
      },
    ],
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

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    type: 'service_order' as 'budget' | 'service_order',
    clientName: "",
    vehicle: "",
    plate: "",
    currentKm: 0,
    status: 'open' as Order['status'],
    notes: "",
  });
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  const filteredOrders = orders.filter(
    (order) =>
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addNewItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      type: 'service',
      description: "",
      additionalInfo: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setOrderItems([...orderItems, newItem]);
  };

  const updateItem = (id: string, updates: Partial<OrderItem>) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        updated.totalPrice = (updated.quantity || 1) * updated.unitPrice;
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalValue = calculateTotal();
    
    if (editingOrder) {
      setOrders(orders.map(order => 
        order.id === editingOrder.id 
          ? { ...formData, id: editingOrder.id, items: orderItems, totalValue, createdAt: editingOrder.createdAt }
          : order
      ));
    } else {
      const newOrder: Order = {
        ...formData,
        id: Date.now().toString(),
        items: orderItems,
        totalValue,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setOrders([...orders, newOrder]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'service_order',
      clientName: "",
      vehicle: "",
      plate: "",
      currentKm: 0,
      status: 'open',
      notes: "",
    });
    setOrderItems([]);
    setEditingOrder(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (order: Order) => {
    setFormData({
      type: order.type,
      clientName: order.clientName,
      vehicle: order.vehicle,
      plate: order.plate,
      currentKm: order.currentKm,
      status: order.status,
      notes: order.notes || "",
    });
    setOrderItems(order.items);
    setEditingOrder(order);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ordens de Serviço</h1>
          <p className="text-muted-foreground">Gerencie orçamentos e ordens de serviço</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Ordem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOrder ? "Editar Ordem" : "Nova Ordem de Serviço"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Orçamento</SelectItem>
                      <SelectItem value="service_order">Ordem de Serviço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Aberta</SelectItem>
                      <SelectItem value="in_progress">Em Andamento</SelectItem>
                      <SelectItem value="completed">Concluída</SelectItem>
                      <SelectItem value="cancelled">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="clientName">Cliente *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="plate">Placa *</Label>
                  <Input
                    id="plate"
                    value={formData.plate}
                    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                    placeholder="ABC-1234"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vehicle">Veículo *</Label>
                  <Input
                    id="vehicle"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                    placeholder="Toyota Corolla 2020"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="currentKm">KM Atual *</Label>
                  <Input
                    id="currentKm"
                    type="number"
                    value={formData.currentKm}
                    onChange={(e) => setFormData({ ...formData, currentKm: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label>Serviços e Peças</Label>
                  <Button type="button" variant="outline" onClick={addNewItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <Card key={item.id} className="p-4">
                      <div className="grid grid-cols-6 gap-4 items-end">
                        <div>
                          <Label>Tipo</Label>
                          <Select
                            value={item.type}
                            onValueChange={(value) => updateItem(item.id, { type: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="service">Serviço</SelectItem>
                              <SelectItem value="part">Peça</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Descrição</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(item.id, { description: e.target.value })}
                            placeholder="Descrição do item"
                          />
                        </div>
                        <div>
                          <Label>Quantidade</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) })}
                            min="1"
                          />
                        </div>
                        <div>
                          <Label>Valor Unit.</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label>Total</Label>
                          <Input
                            value={`R$ ${item.totalPrice.toFixed(2)}`}
                            readOnly
                            className="bg-muted"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="mt-2">
                        <Label>Informações Adicionais</Label>
                        <Input
                          value={item.additionalInfo}
                          onChange={(e) => updateItem(item.id, { additionalInfo: e.target.value })}
                          placeholder="Observações sobre o item"
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="mt-4 text-right">
                  <p className="text-xl font-bold">
                    Total: R$ {calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Observações gerais sobre a ordem"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingOrder ? "Salvar" : "Criar Ordem"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Lista de Ordens
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Buscar por cliente, placa, veículo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Status</TableHead>
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
                    {order.type === 'budget' ? 'Orçamento' : 'O.S.'}
                  </TableCell>
                  <TableCell>{order.clientName}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.vehicle}</div>
                      <div className="text-sm text-muted-foreground">{order.plate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>R$ {order.totalValue.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(order)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(order.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
