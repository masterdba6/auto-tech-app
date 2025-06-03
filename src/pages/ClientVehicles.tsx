
import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, Plus, Search, FileText, Edit, Trash2 } from 'lucide-react';

interface Vehicle {
  id: string;
  plate: string;
  chassis: string;
  year: number;
  manufacturer: string;
  model: string;
  color: string;
  currentKm: number;
  clientId: string;
  ordersCount: number;
}

const mockClientVehicles: Vehicle[] = [
  {
    id: "1",
    plate: "ABC-1234",
    chassis: "1HGBH41JXMN109186",
    year: 2020,
    manufacturer: "Toyota",
    model: "Corolla",
    color: "Prata",
    currentKm: 45000,
    clientId: "1",
    ordersCount: 3,
  },
  {
    id: "3",
    plate: "DEF-9012",
    chassis: "3HGBH41JXMN109188",
    year: 2018,
    manufacturer: "Toyota",
    model: "Hilux",
    color: "Branco",
    currentKm: 78000,
    clientId: "1",
    ordersCount: 5,
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
    clientId: "2",
    ordersCount: 2,
  },
];

const ClientVehicles = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientName = searchParams.get('name') || 'Cliente';
  
  const [searchTerm, setSearchTerm] = useState('');

  const clientVehicles = mockClientVehicles.filter(vehicle => vehicle.clientId === clientId);
  
  const filteredVehicles = clientVehicles.filter(
    (vehicle) =>
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewOrders = (vehicleId: string, vehicleName: string, plate: string) => {
    navigate(`/vehicles/${vehicleId}/orders?name=${encodeURIComponent(vehicleName)}&plate=${plate}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/clients')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Veículos de {clientName}</h1>
            <p className="text-muted-foreground">Gerencie os veículos deste cliente</p>
          </div>
        </div>

        <Button onClick={() => navigate('/vehicles')}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Veículo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Veículos do Cliente
            </CardTitle>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Buscar por placa, marca, modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-8">
              <Car className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum veículo encontrado para este cliente</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/vehicles')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Veículo
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Placa</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Ano</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>KM Atual</TableHead>
                  <TableHead>Ordens</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.plate}</TableCell>
                    <TableCell>{vehicle.manufacturer} {vehicle.model}</TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.color}</TableCell>
                    <TableCell>{vehicle.currentKm.toLocaleString()} km</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {vehicle.ordersCount} ordem{vehicle.ordersCount !== 1 ? 's' : ''}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrders(vehicle.id, `${vehicle.manufacturer} ${vehicle.model}`, vehicle.plate)}
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/vehicles')}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
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

export default ClientVehicles;
