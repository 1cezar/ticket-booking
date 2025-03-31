"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Download, LogOut, Printer, QrCode, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Ticket {
  id: string
  tripId: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  date: Date
  price: number
  passengerName: string
  passengerDocument: string
  seatNumber: string
  paymentMethod: string
  status: "active" | "completed" | "canceled"
}

export default function UserPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("João Silva")

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

    // Simular carregamento de passagens
    setTimeout(() => {
      const mockTickets: Ticket[] = [
        {
          id: "BK123456",
          tripId: "trip1",
          origin: "Belém",
          destination: "Santarém",
          departureTime: "08:00",
          arrivalTime: "14:00",
          date: new Date(new Date().setDate(new Date().getDate() + 3)),
          price: 120.0,
          passengerName: "João Silva",
          passengerDocument: "123.456.789-00",
          seatNumber: "A12",
          paymentMethod: "credit_card",
          status: "active",
        },
        {
          id: "BK234567",
          tripId: "trip2",
          origin: "Belém",
          destination: "Marabá",
          departureTime: "09:30",
          arrivalTime: "15:30",
          date: new Date(new Date().setDate(new Date().getDate() + 7)),
          price: 100.0,
          passengerName: "João Silva",
          passengerDocument: "123.456.789-00",
          seatNumber: "B05",
          paymentMethod: "pix",
          status: "active",
        },
        {
          id: "BK345678",
          tripId: "trip3",
          origin: "Belém",
          destination: "Soure",
          departureTime: "08:00",
          arrivalTime: "10:30",
          date: new Date(new Date().setDate(new Date().getDate() - 10)),
          price: 75.0,
          passengerName: "João Silva",
          passengerDocument: "123.456.789-00",
          seatNumber: "C03",
          paymentMethod: "credit_card",
          status: "completed",
        },
      ]
      setTickets(mockTickets)
      setLoading(false)
    }, 1000)
  }, [router])

  const handleLogout = () => {
    // Em um app real, isso faria logout do usuário
    router.push("/login")
  }

  const activeTickets = tickets.filter((ticket) => ticket.status === "active")
  const completedTickets = tickets.filter((ticket) => ticket.status === "completed")

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Pará</span>
            <span>Passagens</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{userName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Minhas Passagens</h1>

          <Tabs defaultValue="active">
            <TabsList className="mb-6">
              <TabsTrigger value="active">Passagens Ativas</TabsTrigger>
              <TabsTrigger value="completed">Histórico de Viagens</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              {activeTickets.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Você não possui passagens ativas no momento.</p>
                  <Link href="/">
                    <Button className="mt-4">Comprar Passagens</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {activeTickets.map((ticket) => (
                    <Card key={ticket.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Passagem #{ticket.id}</CardTitle>
                          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200">
                            Ativa
                          </div>
                        </div>
                        <CardDescription>
                          {format(ticket.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col items-center">
                              <div className="text-xl font-bold">{ticket.departureTime}</div>
                              <div className="text-sm text-muted-foreground mt-1">{ticket.origin}</div>
                            </div>
                            <div className="flex flex-col items-center mx-4">
                              <div className="w-24 h-0.5 bg-muted my-2 relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="text-xl font-bold">{ticket.arrivalTime}</div>
                              <div className="text-sm text-muted-foreground mt-1">{ticket.destination}</div>
                            </div>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Passageiro</p>
                              <p className="font-medium">{ticket.passengerName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Documento</p>
                              <p className="font-medium">{ticket.passengerDocument}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Assento</p>
                              <p className="font-medium">{ticket.seatNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Pagamento</p>
                              <p className="font-medium">
                                {ticket.paymentMethod === "credit_card" ? "Cartão de Crédito" : "PIX"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="text-lg font-bold">R$ {ticket.price.toFixed(2)}</div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Printer className="mr-2 h-4 w-4" />
                            Imprimir
                          </Button>
                          <Button variant="outline" size="sm">
                            <QrCode className="mr-2 h-4 w-4" />
                            Mostrar QR Code
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed">
              {completedTickets.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Você não possui histórico de viagens.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {completedTickets.map((ticket) => (
                    <Card key={ticket.id}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">Passagem #{ticket.id}</CardTitle>
                          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800 border-gray-200">
                            Concluída
                          </div>
                        </div>
                        <CardDescription>
                          {format(ticket.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col items-center">
                              <div className="text-xl font-bold">{ticket.departureTime}</div>
                              <div className="text-sm text-muted-foreground mt-1">{ticket.origin}</div>
                            </div>
                            <div className="flex flex-col items-center mx-4">
                              <div className="w-24 h-0.5 bg-muted my-2 relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                              </div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="text-xl font-bold">{ticket.arrivalTime}</div>
                              <div className="text-sm text-muted-foreground mt-1">{ticket.destination}</div>
                            </div>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Passageiro</p>
                              <p className="font-medium">{ticket.passengerName}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Documento</p>
                              <p className="font-medium">{ticket.passengerDocument}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Assento</p>
                              <p className="font-medium">{ticket.seatNumber}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Pagamento</p>
                              <p className="font-medium">
                                {ticket.paymentMethod === "credit_card" ? "Cartão de Crédito" : "PIX"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <div className="text-lg font-bold">R$ {ticket.price.toFixed(2)}</div>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          Baixar Comprovante
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

