"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Edit,
  LogOut,
  Package,
  Plus,
  Search,
  Settings,
  Ship,
  Ticket,
  Trash,
  Truck,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Trip {
  id: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  date: Date
  price: number
  availableSeats: number
  transportType: "lancha" | "onibus"
  company: string
  platform: string
}

export default function AdminTripsPage() {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)

  // Form states
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureTime, setDepartureTime] = useState("")
  const [arrivalTime, setArrivalTime] = useState("")
  const [date, setDate] = useState("")
  const [price, setPrice] = useState("")
  const [availableSeats, setAvailableSeats] = useState("")
  const [transportType, setTransportType] = useState<"lancha" | "onibus">("onibus")
  const [company, setCompany] = useState("")
  const [platform, setPlatform] = useState("")

  useEffect(() => {
    // Simular carregamento de dados
    setLoading(true)

    // Verificar se o usuário está logado
    const checkAuth = () => {
      // Em um app real, isso verificaria a sessão do usuário
      // Aqui vamos simular que o usuário está logado
      return true
    }

    if (!checkAuth()) {
      router.push("/login")
      return
    }

    // Simular carregamento de viagens
    setTimeout(() => {
      const mockTrips: Trip[] = [
        {
          id: "trip1",
          origin: "Belém",
          destination: "Santarém",
          departureTime: "08:00",
          arrivalTime: "14:00",
          date: new Date(),
          price: 120.0,
          availableSeats: 42,
          transportType: "onibus",
          company: "Transporte Paraense",
          platform: "Terminal Rodoviário de Belém - Plataforma 5",
        },
        {
          id: "trip2",
          origin: "Belém",
          destination: "Marabá",
          departureTime: "09:30",
          arrivalTime: "15:30",
          date: new Date(),
          price: 100.0,
          availableSeats: 42,
          transportType: "onibus",
          company: "Viação Pará",
          platform: "Terminal Rodoviário de Belém - Plataforma 7",
        },
        {
          id: "trip3",
          origin: "Belém",
          destination: "Soure",
          departureTime: "08:00",
          arrivalTime: "10:30",
          date: new Date(),
          price: 75.0,
          availableSeats: 12,
          transportType: "lancha",
          company: "Lanchas Marajó",
          platform: "Terminal Hidroviário de Belém - Plataforma 3",
        },
        {
          id: "trip4",
          origin: "Belém",
          destination: "Breves",
          departureTime: "09:30",
          arrivalTime: "12:00",
          date: new Date(),
          price: 85.0,
          availableSeats: 12,
          transportType: "lancha",
          company: "Lanchas Marajó",
          platform: "Terminal Hidroviário de Belém - Plataforma 2",
        },
        {
          id: "trip5",
          origin: "Belém",
          destination: "Santarém",
          departureTime: "07:00",
          arrivalTime: "19:00",
          date: addDays(new Date(), 1),
          price: 120.0,
          availableSeats: 42,
          transportType: "onibus",
          company: "Transporte Paraense",
          platform: "Terminal Rodoviário de Belém - Plataforma 5",
        },
      ]
      setTrips(mockTrips)
      setLoading(false)
    }, 1000)
  }, [router])

  const handleLogout = () => {
    // Em um app real, isso faria logout do usuário
    router.push("/login")
  }

  const handleAddTrip = (e: React.FormEvent) => {
    e.preventDefault()

    // Criar nova viagem
    const newTrip: Trip = {
      id: `trip${trips.length + 1}`,
      origin,
      destination,
      departureTime,
      arrivalTime,
      date: new Date(date),
      price: Number.parseFloat(price),
      availableSeats: Number.parseInt(availableSeats),
      transportType,
      company,
      platform,
    }

    // Adicionar à lista de viagens
    setTrips([...trips, newTrip])

    // Fechar o diálogo
    setShowAddDialog(false)

    // Limpar o formulário
    setOrigin("")
    setDestination("")
    setDepartureTime("")
    setArrivalTime("")
    setDate("")
    setPrice("")
    setAvailableSeats("")
    setTransportType("onibus")
    setCompany("")
    setPlatform("")
  }

  const handleDeleteTrip = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta viagem?")) {
      setTrips(trips.filter((trip) => trip.id !== id))
    }
  }

  const filteredTrips = trips.filter(
    (trip) =>
      trip.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.company.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r bg-card z-10">
          <div className="flex items-center h-16 px-6 border-b">
            <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-primary">Pará</span>
              <span>Passagens</span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
            <nav className="flex-1 px-4 space-y-1">
              <Link
                href="/admin/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <BarChart className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/trips"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary"
              >
                <Ship className="mr-3 h-5 w-5" />
                Viagens
              </Link>
              <Link
                href="/admin/tickets"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Ticket className="mr-3 h-5 w-5" />
                Passagens
              </Link>
              <Link
                href="/admin/companies"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Truck className="mr-3 h-5 w-5" />
                Empresas
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Users className="mr-3 h-5 w-5" />
                Usuários
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Settings className="mr-3 h-5 w-5" />
                Configurações
              </Link>
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium">Administrador</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center text-xs text-muted-foreground"
                  >
                    <LogOut className="mr-2 h-3 w-3" />
                    Sair
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b flex items-center">
            <div className="flex-1 px-4 flex justify-between">
              <div className="flex-1 flex">
                <h1 className="text-2xl font-semibold">Gerenciar Viagens</h1>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <Button variant="outline" size="sm" onClick={() => router.push("/admin")}>
                  <Package className="mr-2 h-4 w-4" />
                  Terminal de Vendas
                </Button>
              </div>
            </div>
          </div>

          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="relative w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar viagens..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Viagem
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Adicionar Nova Viagem</DialogTitle>
                        <DialogDescription>
                          Preencha os detalhes da nova viagem. Clique em salvar quando terminar.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddTrip}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="origin">Origem</Label>
                              <Input id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="destination">Destino</Label>
                              <Input
                                id="destination"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="departureTime">Horário de Partida</Label>
                              <Input
                                id="departureTime"
                                type="time"
                                value={departureTime}
                                onChange={(e) => setDepartureTime(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="arrivalTime">Horário de Chegada</Label>
                              <Input
                                id="arrivalTime"
                                type="time"
                                value={arrivalTime}
                                onChange={(e) => setArrivalTime(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="date">Data</Label>
                              <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="price">Preço (R$)</Label>
                              <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="availableSeats">Assentos Disponíveis</Label>
                              <Input
                                id="availableSeats"
                                type="number"
                                value={availableSeats}
                                onChange={(e) => setAvailableSeats(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="transportType">Tipo de Transporte</Label>
                              <Select
                                value={transportType}
                                onValueChange={(value) => setTransportType(value as "lancha" | "onibus")}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="onibus">Ônibus</SelectItem>
                                  <SelectItem value="lancha">Lancha</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="company">Empresa</Label>
                              <Input
                                id="company"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="platform">Plataforma</Label>
                              <Input
                                id="platform"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Salvar Viagem</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Viagens Cadastradas</CardTitle>
                    <CardDescription>Gerencie todas as viagens disponíveis no sistema</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Rota</th>
                            <th className="text-left p-2">Data/Hora</th>
                            <th className="text-left p-2">Empresa</th>
                            <th className="text-left p-2">Tipo</th>
                            <th className="text-left p-2">Preço</th>
                            <th className="text-left p-2">Assentos</th>
                            <th className="text-left p-2">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredTrips.map((trip) => (
                            <tr key={trip.id} className="border-b hover:bg-muted/50">
                              <td className="p-2">
                                <div className="font-medium">
                                  {trip.origin} → {trip.destination}
                                </div>
                                <div className="text-xs text-muted-foreground">{trip.platform}</div>
                              </td>
                              <td className="p-2">
                                <div>{format(trip.date, "dd/MM/yyyy", { locale: ptBR })}</div>
                                <div className="text-xs text-muted-foreground">
                                  {trip.departureTime} - {trip.arrivalTime}
                                </div>
                              </td>
                              <td className="p-2">{trip.company}</td>
                              <td className="p-2">
                                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                                  {trip.transportType === "onibus" ? "Ônibus" : "Lancha"}
                                </span>
                              </td>
                              <td className="p-2">R$ {trip.price.toFixed(2)}</td>
                              <td className="p-2">{trip.availableSeats}</td>
                              <td className="p-2">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTrip(trip.id)}>
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Mostrando {filteredTrips.length} de {trips.length} viagens
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

