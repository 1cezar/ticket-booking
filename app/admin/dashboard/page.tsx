"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Calendar,
  Clock,
  DollarSign,
  LogOut,
  Package,
  Settings,
  Ship,
  Ticket,
  Truck,
  User,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, subDays } from "date-fns"
import { ptBR } from "date-fns/locale"

interface SalesData {
  date: string
  amount: number
}

interface Trip {
  id: string
  origin: string
  destination: string
  departureTime: string
  date: Date
  availableSeats: number
  soldSeats: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [upcomingTrips, setUpcomingTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<"admin" | "employee">("admin")

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

    // Simular carregamento de dados de vendas
    const mockSalesData: SalesData[] = Array.from({ length: 7 }, (_, i) => ({
      date: format(subDays(new Date(), i), "dd/MM"),
      amount: Math.floor(Math.random() * 5000) + 1000,
    })).reverse()

    // Simular carregamento de viagens próximas
    const mockTrips: Trip[] = [
      {
        id: "trip1",
        origin: "Belém",
        destination: "Santarém",
        departureTime: "08:00",
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        availableSeats: 42,
        soldSeats: 28,
      },
      {
        id: "trip2",
        origin: "Belém",
        destination: "Marabá",
        departureTime: "09:30",
        date: new Date(new Date().setDate(new Date().getDate() + 1)),
        availableSeats: 42,
        soldSeats: 15,
      },
      {
        id: "trip3",
        origin: "Belém",
        destination: "Altamira",
        departureTime: "07:00",
        date: new Date(new Date().setDate(new Date().getDate() + 2)),
        availableSeats: 42,
        soldSeats: 32,
      },
    ]

    setSalesData(mockSalesData)
    setUpcomingTrips(mockTrips)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    // Em um app real, isso faria logout do usuário
    router.push("/login")
  }

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
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-primary/10 text-primary"
              >
                <BarChart className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/trips"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
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
                <h1 className="text-2xl font-semibold">Dashboard</h1>
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
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <DollarSign className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Vendas Hoje</p>
                        <h3 className="text-2xl font-bold">R$ 3.240,00</h3>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <Ticket className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Passagens Vendidas</p>
                        <h3 className="text-2xl font-bold">27</h3>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <Ship className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Viagens Hoje</p>
                        <h3 className="text-2xl font-bold">8</h3>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 flex items-center">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Novos Usuários</p>
                        <h3 className="text-2xl font-bold">12</h3>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8">
                  <Tabs defaultValue="sales">
                    <TabsList>
                      <TabsTrigger value="sales">Vendas</TabsTrigger>
                      <TabsTrigger value="trips">Próximas Viagens</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sales" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Vendas dos Últimos 7 Dias</CardTitle>
                          <CardDescription>Acompanhe o desempenho de vendas da sua empresa</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80 flex items-end justify-between">
                            {salesData.map((data, index) => (
                              <div key={index} className="flex flex-col items-center">
                                <div
                                  className="bg-primary w-12 rounded-t-md"
                                  style={{ height: `${(data.amount / 5000) * 200}px` }}
                                ></div>
                                <div className="mt-2 text-sm">{data.date}</div>
                                <div className="text-xs text-muted-foreground">R$ {data.amount.toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="trips" className="mt-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Próximas Viagens</CardTitle>
                          <CardDescription>Viagens programadas para os próximos dias</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {upcomingTrips.map((trip) => (
                              <div key={trip.id} className="flex justify-between items-center p-4 border rounded-lg">
                                <div>
                                  <div className="font-medium">
                                    {trip.origin} → {trip.destination}
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    <span>{format(trip.date, "dd/MM/yyyy", { locale: ptBR })}</span>
                                    <span className="mx-2">•</span>
                                    <Clock className="mr-1 h-4 w-4" />
                                    <span>{trip.departureTime}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm">
                                    <span className="font-medium">{trip.soldSeats}</span> / {trip.availableSeats}{" "}
                                    assentos
                                  </div>
                                  <div className="w-32 h-2 bg-muted rounded-full mt-1">
                                    <div
                                      className="h-2 bg-primary rounded-full"
                                      style={{ width: `${(trip.soldSeats / trip.availableSeats) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

