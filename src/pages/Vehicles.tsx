import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Car, Plus, Edit, Trash2, Search } from 'lucide-react';

interface Vehicle {
  id: string;
  plate: string;
  chassis: string;
  year: number;
  manufacturer: string;
  model: string;
  color: string;
  currentKm: number;
  clientName: string;
  additionalInfo?: string;
}

interface VehicleFormData {
  plate: string;
  chassis: string;
  year: number;
  manufacturer: string;
  model: string;
  color: string;
  currentKm: number;
  clientName: string;
  additionalInfo: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC-1234",
    chassis: "1HGBH41JXMN109186",
    year: 2020,
    manufacturer: "Toyota",
    model: "Corolla",
    color: "Prata",
    currentKm: 45000,
    clientName: "João Silva",
    additionalInfo: "Carro em ótimo estado",
  },
  {
    id: "2",
    plate: "XYZ-5678",
    chassis: "2HGBH41JXMN109187",
    year: 2019,
    manufacturer: "Honda",
    model: "Civic",
    color: "Preto",
    currentKm: 52000,
    clientName: "Maria Santos",
  },
];

const manufacturers = ["Toyota", "Honda", "Volkswagen", "Ford", "Chevrolet", "Hyundai"];
const models = {
  Toyota: ["Corolla", "Camry", "RAV4", "Hilux"],
  Honda: ["Civic", "Accord", "CR-V", "Fit"],
  Volkswagen: ["Jetta", "Golf", "Tiguan", "Polo"],
  Ford: ["Focus", "Fusion", "EcoSport", "Ranger"],
  Chevrolet: ["Onix", "Cruze", "Tracker", "S10"],
  Hyundai: ["HB20", "Elantra", "Tucson", "Creta"],
};

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  
  const [formData, setFormData] = useState<VehicleFormData>({
    plate: '',
    chassis: '',
    year: new Date().getFullYear(),
    manufacturer: '',
    model: '',
    color: '',
    currentKm: 0,
    clientName: '',
    additionalInfo: ''
  });

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingVehicle) {
      setVehicles(vehicles.map(v => 
        v.id === editingVehicle.id 
          ? { ...editingVehicle, ...formData }
          : v
      ));
    } else {
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        ...formData
      };
      setVehicles([...vehicles, newVehicle]);
    }
    
    setIsDialogOpen(false);
    setEditingVehicle(null);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      plate: '',
      chassis: '',
      year: new Date().getFullYear(),
      manufacturer: '',
      model: '',
      color: '',
      currentKm: 0,
      clientName: '',
      additionalInfo: ''
    });
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      plate: vehicle.plate,
      chassis: vehicle.chassis,
      year: vehicle.year,
      manufacturer: vehicle.manufacturer,
      model: vehicle.model,
      color: vehicle.color,
      currentKm: vehicle.currentKm,
      clientName: vehicle.clientName,
      additionalInfo: vehicle.additionalInfo || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Veículos</h1>
          <p className="text-muted-foreground">Gerencie os veículos dos clientes</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? "Editar Veículo" : "Novo Veículo"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="chassis">Chassi</Label>
                  <Input
                    id="chassis"
                    value={formData.chassis}
                    onChange={(e) => setFormData({ ...formData, chassis: e.target.value })}
                    placeholder="Número do chassi"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    min="1990"
                    max={new Date().getFullYear() + 1}
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Fabricante</Label>
                  <Select
                    value={formData.manufacturer}
                    onValueChange={(value) => setFormData({ ...formData, manufacturer: value, model: "" })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {manufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer} value={manufacturer}>
                          {manufacturer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model">Modelo</Label>
                  <Select
                    value={formData.model}
                    onValueChange={(value) => setFormData({ ...formData, model: value })}
                    disabled={!formData.manufacturer}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.manufacturer && models[formData.manufacturer as keyof typeof models]?.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="color">Cor</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="Cor do veículo"
                  />
                </div>
                <div>
                  <Label htmlFor="currentKm">KM Atual</Label>
                  <Input
                    id="currentKm"
                    type="number"
                    value={formData.currentKm}
                    onChange={(e) => setFormData({ ...formData, currentKm: parseInt(e.target.value) })}
                    min="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="clientName">Cliente</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Nome do cliente"
                  required
                />
              </div>

              <div>
                <Label htmlFor="additionalInfo">Informações Adicionais</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                  placeholder="Observações sobre o veículo"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingVehicle ? "Salvar" : "Cadastrar"}
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
              <Car className="w-5 h-5" />
              Lista de Veículos
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Buscar por placa, cliente, marca..."
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
                <TableHead>Placa</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Ano</TableHead>
                <TableHead>Cor</TableHead>
                <TableHead>KM Atual</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.plate}</TableCell>
                  <TableCell>{vehicle.clientName}</TableCell>
                  <TableCell>{vehicle.manufacturer} {vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.color}</TableCell>
                  <TableCell>{vehicle.currentKm.toLocaleString()} km</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(vehicle)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(vehicle.id)}
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
};

export default Vehicles;
