
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Car, Settings, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Manufacturer {
  id: number;
  name: string;
  country: string;
  isActive: boolean;
}

interface VehicleModel {
  id: number;
  manufacturerId: number;
  manufacturerName: string;
  name: string;
  year: number;
  category: string;
  isActive: boolean;
}

const ManufacturerManagement: React.FC = () => {
  const { toast } = useToast();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([
    { id: 1, name: 'Toyota', country: 'Japão', isActive: true },
    { id: 2, name: 'Volkswagen', country: 'Alemanha', isActive: true },
    { id: 3, name: 'Ford', country: 'Estados Unidos', isActive: true },
    { id: 4, name: 'Chevrolet', country: 'Estados Unidos', isActive: true },
    { id: 5, name: 'Fiat', country: 'Itália', isActive: true },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
  });

  const handleSave = () => {
    if (!formData.name.trim() || !formData.country.trim()) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (editingManufacturer) {
      setManufacturers(prev => prev.map(m => 
        m.id === editingManufacturer.id 
          ? { ...m, name: formData.name, country: formData.country }
          : m
      ));
      toast({
        title: "Sucesso",
        description: "Fabricante atualizado com sucesso",
      });
    } else {
      const newManufacturer: Manufacturer = {
        id: Date.now(),
        name: formData.name,
        country: formData.country,
        isActive: true,
      };
      setManufacturers(prev => [...prev, newManufacturer]);
      toast({
        title: "Sucesso",
        description: "Fabricante adicionado com sucesso",
      });
    }

    setFormData({ name: '', country: '' });
    setEditingManufacturer(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (manufacturer: Manufacturer) => {
    setFormData({ name: manufacturer.name, country: manufacturer.country });
    setEditingManufacturer(manufacturer);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setManufacturers(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Sucesso",
      description: "Fabricante removido com sucesso",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fabricantes</CardTitle>
            <CardDescription>Gerencie os fabricantes de veículos</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setFormData({ name: '', country: '' });
                setEditingManufacturer(null);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Fabricante
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingManufacturer ? 'Editar Fabricante' : 'Adicionar Fabricante'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações do fabricante
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Toyota"
                  />
                </div>
                <div>
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="Ex: Japão"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>País</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {manufacturers.map((manufacturer) => (
              <TableRow key={manufacturer.id}>
                <TableCell className="font-medium">{manufacturer.name}</TableCell>
                <TableCell>{manufacturer.country}</TableCell>
                <TableCell>
                  <Badge variant={manufacturer.isActive ? "default" : "secondary"}>
                    {manufacturer.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(manufacturer)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(manufacturer.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const ModelManagement: React.FC = () => {
  const { toast } = useToast();
  const [manufacturers] = useState<Manufacturer[]>([
    { id: 1, name: 'Toyota', country: 'Japão', isActive: true },
    { id: 2, name: 'Volkswagen', country: 'Alemanha', isActive: true },
    { id: 3, name: 'Ford', country: 'Estados Unidos', isActive: true },
    { id: 4, name: 'Chevrolet', country: 'Estados Unidos', isActive: true },
    { id: 5, name: 'Fiat', country: 'Itália', isActive: true },
  ]);

  const [models, setModels] = useState<VehicleModel[]>([
    { id: 1, manufacturerId: 1, manufacturerName: 'Toyota', name: 'Corolla', year: 2024, category: 'Sedã', isActive: true },
    { id: 2, manufacturerId: 1, manufacturerName: 'Toyota', name: 'Hilux', year: 2024, category: 'Picape', isActive: true },
    { id: 3, manufacturerId: 2, manufacturerName: 'Volkswagen', name: 'Gol', year: 2024, category: 'Hatch', isActive: true },
    { id: 4, manufacturerId: 3, manufacturerName: 'Ford', name: 'Ka', year: 2024, category: 'Hatch', isActive: true },
    { id: 5, manufacturerId: 4, manufacturerName: 'Chevrolet', name: 'Onix', year: 2024, category: 'Hatch', isActive: true },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<VehicleModel | null>(null);
  const [formData, setFormData] = useState({
    manufacturerId: '',
    name: '',
    year: new Date().getFullYear(),
    category: '',
  });

  const vehicleCategories = ['Hatch', 'Sedã', 'SUV', 'Picape', 'Van', 'Utilitário', 'Moto', 'Caminhão'];

  const handleSave = () => {
    if (!formData.manufacturerId || !formData.name.trim() || !formData.category) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const manufacturer = manufacturers.find(m => m.id === parseInt(formData.manufacturerId));
    if (!manufacturer) return;

    if (editingModel) {
      setModels(prev => prev.map(m => 
        m.id === editingModel.id 
          ? { 
              ...m, 
              manufacturerId: parseInt(formData.manufacturerId),
              manufacturerName: manufacturer.name,
              name: formData.name,
              year: formData.year,
              category: formData.category
            }
          : m
      ));
      toast({
        title: "Sucesso",
        description: "Modelo atualizado com sucesso",
      });
    } else {
      const newModel: VehicleModel = {
        id: Date.now(),
        manufacturerId: parseInt(formData.manufacturerId),
        manufacturerName: manufacturer.name,
        name: formData.name,
        year: formData.year,
        category: formData.category,
        isActive: true,
      };
      setModels(prev => [...prev, newModel]);
      toast({
        title: "Sucesso",
        description: "Modelo adicionado com sucesso",
      });
    }

    setFormData({ manufacturerId: '', name: '', year: new Date().getFullYear(), category: '' });
    setEditingModel(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (model: VehicleModel) => {
    setFormData({
      manufacturerId: model.manufacturerId.toString(),
      name: model.name,
      year: model.year,
      category: model.category,
    });
    setEditingModel(model);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    setModels(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Sucesso",
      description: "Modelo removido com sucesso",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Modelos de Veículos</CardTitle>
            <CardDescription>Gerencie os modelos de veículos por fabricante</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setFormData({ manufacturerId: '', name: '', year: new Date().getFullYear(), category: '' });
                setEditingModel(null);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Modelo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingModel ? 'Editar Modelo' : 'Adicionar Modelo'}
                </DialogTitle>
                <DialogDescription>
                  Preencha as informações do modelo
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="manufacturer">Fabricante</Label>
                  <Select value={formData.manufacturerId} onValueChange={(value) => setFormData(prev => ({ ...prev, manufacturerId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fabricante" />
                    </SelectTrigger>
                    <SelectContent>
                      {manufacturers.filter(m => m.isActive).map((manufacturer) => (
                        <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
                          {manufacturer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="name">Nome do Modelo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Corolla"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Ano</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    min="1900"
                    max="2030"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fabricante</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => (
              <TableRow key={model.id}>
                <TableCell>{model.manufacturerName}</TableCell>
                <TableCell className="font-medium">{model.name}</TableCell>
                <TableCell>{model.year}</TableCell>
                <TableCell>{model.category}</TableCell>
                <TableCell>
                  <Badge variant={model.isActive ? "default" : "secondary"}>
                    {model.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(model)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(model.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const VehicleManagement: React.FC = () => {
  return (
    <Tabs defaultValue="manufacturers" className="space-y-4">
      <TabsList>
        <TabsTrigger value="manufacturers">
          <Settings className="mr-2 h-4 w-4" />
          Fabricantes
        </TabsTrigger>
        <TabsTrigger value="models">
          <Car className="mr-2 h-4 w-4" />
          Modelos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="manufacturers">
        <ManufacturerManagement />
      </TabsContent>
      <TabsContent value="models">
        <ModelManagement />
      </TabsContent>
    </Tabs>
  );
};
