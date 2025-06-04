
import { Bell, Moon, Sun, User, LogOut, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock data for search
const mockClients = [
  { id: "1", name: "João Silva", phone: "(11) 99999-1234", cpf: "123.456.789-01" },
  { id: "2", name: "Maria Santos", phone: "(11) 88888-5678", cnpj: "12.345.678/0001-90" },
  { id: "3", name: "Pedro Costa", phone: "(11) 77777-9012", cpf: "987.654.321-09" },
];

const mockVehicles = [
  { id: "1", plate: "ABC-1234", model: "Toyota Corolla", clientName: "João Silva" },
  { id: "2", plate: "XYZ-5678", model: "Honda Civic", clientName: "Pedro Costa" },
  { id: "3", plate: "DEF-9012", model: "Toyota Hilux", clientName: "João Silva" },
];

export function TopBar() {
  const { theme, setTheme } = useTheme();
  const { user, company, logout } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const filterClients = (value: string) => {
    return mockClients.filter((client) =>
      client.name.toLowerCase().includes(value.toLowerCase()) ||
      client.phone.includes(value) ||
      client.cpf?.includes(value) ||
      client.cnpj?.includes(value)
    );
  };

  const filterVehicles = (value: string) => {
    return mockVehicles.filter((vehicle) =>
      vehicle.plate.toLowerCase().includes(value.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(value.toLowerCase()) ||
      vehicle.clientName.toLowerCase().includes(value.toLowerCase())
    );
  };

  const handleClientSelect = (clientId: string) => {
    navigate(`/clients/${clientId}/vehicles?name=${encodeURIComponent(mockClients.find(c => c.id === clientId)?.name || '')}`);
    setSearchOpen(false);
    setSearchValue("");
  };

  const handleVehicleSelect = (vehicleId: string) => {
    const vehicle = mockVehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      navigate(`/vehicles/${vehicleId}/orders?name=${encodeURIComponent(vehicle.model)}&plate=${vehicle.plate}`);
    }
    setSearchOpen(false);
    setSearchValue("");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6 gap-4">
        <SidebarTrigger />
        
        <div className="flex-1 max-w-md">
          <Popover open={searchOpen} onOpenChange={setSearchOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={searchOpen}
                className="w-full justify-between text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Buscar cliente ou veículo...</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Digite telefone, CPF, CNPJ ou placa..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandList>
                  <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
                  
                  {filterClients(searchValue).length > 0 && (
                    <CommandGroup heading="Clientes">
                      {filterClients(searchValue).map((client) => (
                        <CommandItem
                          key={client.id}
                          value={client.id}
                          onSelect={() => handleClientSelect(client.id)}
                        >
                          <User className="mr-2 h-4 w-4" />
                          <div className="flex flex-col">
                            <span className="font-medium">{client.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {client.phone} • {client.cpf || client.cnpj}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {filterVehicles(searchValue).length > 0 && (
                    <CommandGroup heading="Veículos">
                      {filterVehicles(searchValue).map((vehicle) => (
                        <CommandItem
                          key={vehicle.id}
                          value={vehicle.id}
                          onSelect={() => handleVehicleSelect(vehicle.id)}
                        >
                          <div className="mr-2 h-4 w-4 flex items-center justify-center bg-muted rounded text-xs font-bold">
                            🚗
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{vehicle.plate}</span>
                            <span className="text-xs text-muted-foreground">
                              {vehicle.model} • {vehicle.clientName}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notificações</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Avatar" />
                  <AvatarFallback>{user ? getInitials(user.name) : 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={user?.role === 'Gerente' ? 'default' : 'secondary'} className="text-xs">
                      {user?.role}
                    </Badge>
                  </div>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {company?.name}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
