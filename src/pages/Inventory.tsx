
import { useState } from "react";
import { Plus, Search, Edit, Trash2, Package, AlertTriangle } from "lucide-react";
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
import { DashboardCard } from "@/components/DashboardCard";

interface InventoryItem {
  id: string;
  code: string;
  description: string;
  manufacturer: string;
  vehicleManufacturer: string;
  vehicleModel: string;
  vehicleYear: string;
  quantity: number;
  minQuantity: number;
  unitPrice: number;
  location?: string;
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    code: "FLT001",
    description: "Filtro de Óleo",
    manufacturer: "Mann Filter",
    vehicleManufacturer: "Toyota",
    vehicleModel: "Corolla",
    vehicleYear: "2018-2023",
    quantity: 15,
    minQuantity: 5,
    unitPrice: 35.00,
    location: "Prateleira A1",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    code: "OIL001",
    description: "Óleo Motor 5W30 Sintético",
    manufacturer: "Castrol",
    vehicleManufacturer: "Diversos",
    vehicleModel: "Diversos",
    vehicleYear: "Todos",
    quantity: 3,
    minQuantity: 5,
    unitPrice: 45.00,
    location: "Depósito B2",
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    code: "BRK001",
    description: "Pastilha de Freio Dianteira",
    manufacturer: "Bosch",
    vehicleManufacturer: "Honda",
    vehicleModel: "Civic",
    vehicleYear: "2017-2021",
    quantity: 8,
    minQuantity: 3,
    unitPrice: 120.00,
    location: "Prateleira C3",
    lastUpdated: "2024-01-16",
  },
];

export default function Inventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    manufacturer: "",
    vehicleManufacturer: "",
    vehicleModel: "",
    vehicleYear: "",
    quantity: 0,
    minQuantity: 0,
    unitPrice: 0,
    location: "",
  });

  const filteredInventory = inventory.filter(
    (item) =>
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicleManufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.quantity <= item.minQuantity);
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setInventory(inventory.map(item => 
        item.id === editingItem.id 
          ? { ...formData, id: editingItem.id, lastUpdated: new Date().toISOString().split('T')[0] }
          : item
      ));
    } else {
      const newItem: InventoryItem = {
        ...formData,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setInventory([...inventory, newItem]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      manufacturer: "",
      vehicleManufacturer: "",
      vehicleModel: "",
      vehicleYear: "",
      quantity: 0,
      minQuantity: 0,
      unitPrice: 0,
      location: "",
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: InventoryItem) => {
    setFormData({
      code: item.code,
      description: item.description,
      manufacturer: item.manufacturer,
      vehicleManufacturer: item.vehicleManufacturer,
      vehicleModel: item.vehicleModel,
      vehicleYear: item.vehicleYear,
      quantity: item.quantity,
      minQuantity: item.minQuantity,
      unitPrice: item.unitPrice,
      location: item.location || "",
    });
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estoque</h1>
          <p className="text-muted-foreground">Gerencie o estoque de peças e materiais</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Peça
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Editar Peça" : "Nova Peça"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Código *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Ex: FLT001"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Fabricante da Peça</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="Ex: Bosch, Mann Filter"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição detalhada da peça"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="vehicleManufacturer">Marca do Veículo</Label>
                  <Input
                    id="vehicleManufacturer"
                    value={formData.vehicleManufacturer}
                    onChange={(e) => setFormData({ ...formData, vehicleManufacturer: e.target.value })}
                    placeholder="Toyota, Honda..."
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleModel">Modelo</Label>
                  <Input
                    id="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                    placeholder="Corolla, Civic..."
                  />
                </div>
                <div>
                  <Label htmlFor="vehicleYear">Ano</Label>
                  <Input
                    id="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={(e) => setFormData({ ...formData, vehicleYear: e.target.value })}
                    placeholder="2018-2023"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantidade *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minQuantity">Estoque Mínimo</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({ ...formData, minQuantity: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Preço Unitário</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Prateleira A1, Depósito B2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingItem ? "Salvar" : "Cadastrar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Total de Itens"
          value={totalItems}
          icon={Package}
        />
        <DashboardCard
          title="Valor Total do Estoque"
          value={`R$ ${totalValue.toFixed(2)}`}
          icon={Package}
        />
        <DashboardCard
          title="Itens em Baixa"
          value={lowStockItems.length}
          icon={AlertTriangle}
          trend={lowStockItems.length > 0 ? { value: lowStockItems.length, isPositive: false } : undefined}
        />
        <DashboardCard
          title="Última Atualização"
          value="Hoje"
          icon={Package}
        />
      </div>

      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-5 h-5" />
              Itens com Estoque Baixo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-white rounded">
                  <span>{item.description} ({item.code})</span>
                  <Badge variant="destructive">
                    {item.quantity} unidades (mín: {item.minQuantity})
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Estoque de Peças
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Buscar por código, descrição, marca..."
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
                <TableHead>Código</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço Unit.</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.code}</TableCell>
                  <TableCell>
                    <div>
                      <div>{item.description}</div>
                      <div className="text-sm text-muted-foreground">{item.manufacturer}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{item.vehicleManufacturer} {item.vehicleModel}</div>
                      <div className="text-muted-foreground">{item.vehicleYear}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{item.quantity}</span>
                      {item.quantity <= item.minQuantity && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>R$ {item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>R$ {(item.quantity * item.unitPrice).toFixed(2)}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
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
