"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  LogOut,
  Printer,
  QrCode,
  Ship,
  Signal,
  User,
  Wifi,
  WifiOff,
  Ticket,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"

// Adicionar o import do componente SeatSelector
import { SeatSelector } from "@/components/seat-selector"

// Tipos de dados
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

interface Employee {
  id: string
  name: string
  company: string
  role: string
}

interface TicketType {
  id: string
  tripId: string
  passengerName: string
  passengerDocument: string
  passengerPhone?: string
  seatNumber?: string
  price: number
  paymentMethod: string
  paymentStatus: "pending" | "completed" | "canceled"
  bpeStatus: "pending" | "issued" | "failed" | "canceled"
  createdAt: Date
  isOfflineSale: boolean
}

export default function CashierPage() {
  const router = useRouter()

  // Estados
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [operationMode, setOperationMode] = useState<"auto" | "online" | "offline">("auto")
  const [emitBPeOnline, setEmitBPeOnline] = useState(true)
  const [pendingSync, setPendingSync] = useState<TicketType[]>([])

  const [currentStep, setCurrentStep] = useState<"select-trip" | "passenger-details" | "payment" | "ticket">(
    "select-trip",
  )
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [passengerCount, setPassengerCount] = useState(1)
  const [passengerInfo, setPassengerInfo] = useState<any[]>([{ name: "", document: "", phone: "" }])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("dinheiro")
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [bpeStatus, setBpeStatus] = useState<"pending" | "issued" | "failed">("pending")

  // Após os outros estados
  const [showSalesHistory, setShowSalesHistory] = useState(false)
  const [salesHistory, setSalesHistory] = useState<TicketType[]>([])

  // Adicionar um novo estado para armazenar os assentos selecionados após os outros estados
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  // Adicionar um novo estado para controlar a visibilidade do seletor de assentos
  // Adicione esta linha após a declaração do estado selectedSeats
  const [showSeatSelector, setShowSeatSelector] = useState(false)

  // Monitorar status de conexão
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Verificar se há vendas pendentes para sincronizar
    const checkPendingTickets = () => {
      const pendingTickets = localStorage.getItem("pendingTickets")
      if (pendingTickets) {
        setPendingSync(JSON.parse(pendingTickets))
      }
    }

    checkPendingTickets()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Sincronizar tickets pendentes quando ficar online
  useEffect(() => {
    if (isOnline && pendingSync.length > 0) {
      syncPendingTickets()
    }
  }, [isOnline, pendingSync])

  // Adicione após o useEffect que monitora isOnline e pendingSync
  useEffect(() => {
    if (isLoggedIn) {
      loadSalesHistory()
    }
  }, [isLoggedIn])

  // Dados simulados
  const employees: Employee[] = [
    { id: "emp1", name: "Carlos Silva", company: "Lanchas Marajó", role: "vendedor" },
    { id: "emp2", name: "Ana Oliveira", company: "Ônibus Tapajós", role: "vendedor" },
    { id: "admin1", name: "Roberto Santos", company: "Lanchas Marajó", role: "admin" },
  ]

  // Viagens de lancha
  const lanchaTrips: Trip[] = [
    {
      id: "L1",
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
      id: "L2",
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
      id: "L3",
      origin: "Belém",
      destination: "Soure",
      departureTime: "14:00",
      arrivalTime: "16:30",
      date: addDays(new Date(), 1),
      price: 75.0,
      availableSeats: 12,
      transportType: "lancha",
      company: "Lanchas Marajó",
      platform: "Terminal Hidroviário de Belém - Plataforma 3",
    },
  ]

  // Viagens de ônibus
  const onibusTrips: Trip[] = [
    {
      id: "B1",
      origin: "Belém",
      destination: "Santarém",
      departureTime: "07:00",
      arrivalTime: "19:00",
      date: new Date(),
      price: 120.0,
      availableSeats: 42,
      transportType: "onibus",
      company: "Ônibus Tapajós",
      platform: "Terminal Rodoviário de Belém - Plataforma 5",
    },
    {
      id: "B2",
      origin: "Belém",
      destination: "Marabá",
      departureTime: "08:00",
      arrivalTime: "16:00",
      date: new Date(),
      price: 100.0,
      availableSeats: 42,
      transportType: "onibus",
      company: "Ônibus Tapajós",
      platform: "Terminal Rodoviário de Belém - Plataforma 7",
    },
    {
      id: "B3",
      origin: "Belém",
      destination: "Santarém",
      departureTime: "07:00",
      arrivalTime: "19:00",
      date: addDays(new Date(), 1),
      price: 120.0,
      availableSeats: 42,
      transportType: "onibus",
      company: "Ônibus Tapajós",
      platform: "Terminal Rodoviário de Belém - Plataforma 5",
    },
  ]

  // Filtrar as viagens com base na empresa do funcionário
  const getFilteredTrips = () => {
    if (!currentEmployee) return []

    const trips = currentEmployee.company === "Lanchas Marajó" ? lanchaTrips : onibusTrips

    // Por padrão, mostrar viagens de hoje
    return trips.filter((trip) => format(trip.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd"))
  }

  // Gerenciar o login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Encontrar o funcionário pelo nome de usuário
    const employee = employees.find((emp) => emp.id === username)

    if (employee && password === "1234") {
      setIsLoggedIn(true)
      setCurrentEmployee(employee)
    } else {
      alert("Credenciais inválidas. Tente emp1 ou emp2 com senha 1234.")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
    setPassword("")
    setCurrentEmployee(null)
    resetSalesProcess()
  }

  // Gerenciar o processo de venda
  const handleSelectTrip = (trip: Trip) => {
    setSelectedTrip(trip)
    setCurrentStep("passenger-details")
  }

  const handleUpdatePassengerCount = (count: number) => {
    setPassengerCount(count)

    // Atualizar a matriz de informações do passageiro
    const newPassengerInfo = Array(count)
      .fill(null)
      .map((_, i) => passengerInfo[i] || { name: "", document: "", phone: "" })

    setPassengerInfo(newPassengerInfo)
  }

  const handlePassengerInfoChange = (index: number, field: string, value: string) => {
    const updatedInfo = [...passengerInfo]
    updatedInfo[index] = { ...updatedInfo[index], [field]: value }
    setPassengerInfo(updatedInfo)
  }

  // Adicionar uma função para lidar com a seleção de assentos após a função handlePassengerInfoChange
  const handleSeatSelection = (seats: string[]) => {
    setSelectedSeats(seats)
  }

  // Modificar a função handleContinueToPayment para verificar se os assentos foram selecionados
  const handleContinueToPayment = () => {
    // Verificar se todos os campos necessários estão preenchidos
    const mainPassengerInfoComplete = passengerInfo[0].name && passengerInfo[0].document

    if (!mainPassengerInfoComplete) {
      alert("Por favor, preencha pelo menos o nome e CPF do passageiro principal.")
      return
    }

    if (selectedSeats.length < passengerCount) {
      alert(`Por favor, selecione ${passengerCount} assento(s) para continuar.`)
      return
    }

    setCurrentStep("payment")
  }

  // Modificar a função handleConfirmPayment para incluir os assentos selecionados
  const handleConfirmPayment = () => {
    // Gerar referência de reserva
    const reference =
      "BK" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0")
    setBookingReference(reference)
    setPaymentConfirmed(true)

    // Criar o ticket
    const newTicket: TicketType = {
      id: reference,
      tripId: selectedTrip?.id || "",
      passengerName: passengerInfo[0].name,
      passengerDocument: passengerInfo[0].document,
      passengerPhone: passengerInfo[0].phone,
      seatNumber: selectedSeats.join(", "), // Adicionar os assentos selecionados
      price: (selectedTrip?.price || 0) * passengerCount,
      paymentMethod: selectedPaymentMethod,
      paymentStatus: "completed",
      bpeStatus: isOnline ? "pending" : "pending",
      createdAt: new Date(),
      isOfflineSale: !isOnline,
    }

    // Verificar se deve operar em modo offline (forçado ou real)
    const isOfflineMode = operationMode === "offline" || (operationMode === "auto" && !isOnline)

    // Se estiver em modo offline ou não emitir BP-e online, armazenar para sincronização posterior
    if (isOfflineMode || !emitBPeOnline) {
      const pendingTickets = JSON.parse(localStorage.getItem("pendingTickets") || "[]")
      pendingTickets.push(newTicket)
      localStorage.setItem("pendingTickets", JSON.stringify(pendingTickets))
      setPendingSync(pendingTickets)
      setBpeStatus("pending")
    } else {
      // Simular emissão de BP-e
      setTimeout(() => {
        setBpeStatus("issued")
      }, 2000)
    }

    setCurrentStep("ticket")
  }

  const syncPendingTickets = () => {
    // Simular sincronização com o servidor
    setTimeout(() => {
      // Em um app real, isso enviaria os tickets para o servidor
      localStorage.removeItem("pendingTickets")
      setPendingSync([])
      alert("Vendas pendentes sincronizadas com sucesso!")
    }, 2000)
  }

  const loadSalesHistory = () => {
    // Em um app real, isso buscaria do servidor ou banco de dados local
    // Aqui vamos simular com alguns dados de exemplo e os pendentes
    const pendingTickets = JSON.parse(localStorage.getItem("pendingTickets") || "[]")

    // Criar alguns exemplos de tickets já emitidos
    const exampleTickets: TicketType[] = [
      {
        id: "BK123456",
        tripId: "L1",
        passengerName: "João Silva",
        passengerDocument: "123.456.789-00",
        passengerPhone: "(91) 98765-4321",
        price: 75.0,
        paymentMethod: "dinheiro",
        paymentStatus: "completed",
        bpeStatus: "issued",
        createdAt: new Date(Date.now() - 86400000), // ontem
        isOfflineSale: false,
      },
      {
        id: "BK234567",
        tripId: "L2",
        passengerName: "Maria Oliveira",
        passengerDocument: "987.654.321-00",
        passengerPhone: "(91) 91234-5678",
        price: 85.0,
        paymentMethod: "cartao_credito",
        paymentStatus: "completed",
        bpeStatus: "issued",
        createdAt: new Date(Date.now() - 43200000), // 12 horas atrás
        isOfflineSale: false,
      },
      {
        id: "BK345678",
        tripId: "B1",
        passengerName: "Pedro Santos",
        passengerDocument: "456.789.123-00",
        price: 120.0 * 2, // 2 passageiros
        paymentMethod: "pix",
        paymentStatus: "completed",
        bpeStatus: "failed",
        createdAt: new Date(Date.now() - 7200000), // 2 horas atrás
        isOfflineSale: false,
      },
    ]

    // Combinar tickets de exemplo com os pendentes
    const allTickets = [...exampleTickets, ...pendingTickets]

    // Ordenar por data de criação (mais recente primeiro)
    allTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setSalesHistory(allTickets)
  }

  const handlePrintTicket = () => {
    alert("Imprimindo bilhete...")
    // Em um app real, isso enviaria o bilhete para impressão
    resetSalesProcess()
  }

  // Modificar a função resetSalesProcess para resetar também os assentos selecionados
  const resetSalesProcess = () => {
    setCurrentStep("select-trip")
    setSelectedTrip(null)
    setPassengerCount(1)
    setPassengerInfo([{ name: "", document: "", phone: "" }])
    setSelectedPaymentMethod("dinheiro")
    setPaymentConfirmed(false)
    setBookingReference("")
    setBpeStatus("pending")
    setSelectedSeats([]) // Resetar assentos selecionados
    setShowSeatSelector(false)
  }

  const handleCancelTicket = (ticketId: string) => {
    if (confirm("Tem certeza que deseja cancelar esta passagem?")) {
      // Em um app real, isso enviaria uma requisição para cancelar a passagem
      const updatedHistory = salesHistory.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, paymentStatus: "pending", bpeStatus: "canceled" } : ticket,
      )
      setSalesHistory(updatedHistory)
      alert("Passagem cancelada com sucesso!")
    }
  }

  const handleReprintTicket = (ticket: TicketType) => {
    // Em um app real, isso enviaria o bilhete para impressão
    alert(`Reimprimindo bilhete para ${ticket.passengerName}...`)
  }

  const handleEmitBPe = (ticketId: string) => {
    // Em um app real, isso enviaria uma requisição para emitir o BP-e
    setTimeout(() => {
      const updatedHistory = salesHistory.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, bpeStatus: "issued" } : ticket,
      )
      setSalesHistory(updatedHistory)
      alert("BP-e emitido com sucesso!")
    }, 1500)

    // Atualizar status para "processando"
    const updatedHistory = salesHistory.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, bpeStatus: "pending" } : ticket,
    )
    setSalesHistory(updatedHistory)
  }

  // Se não estiver logado, mostrar tela de login
  if (!isLoggedIn) {
    return (
      <div className="container flex items-center justify-center min-h-screen py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login do Vendedor</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o sistema de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">ID do Funcionário</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Digite seu ID (emp1 ou emp2)"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha (1234)"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o site
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Pará</span>
            <span>Passagens</span>
            {currentEmployee && (
              <div className="flex items-center text-sm font-normal text-muted-foreground ml-4">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-primary mr-2">
                  {currentEmployee.company}
                </span>
                <span>Terminal de Vendas</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    {operationMode === "auto" ? (
                      isOnline ? (
                        <Wifi className="h-4 w-4 text-green-500" />
                      ) : (
                        <WifiOff className="h-4 w-4 text-red-500" />
                      )
                    ) : operationMode === "online" ? (
                      <Wifi className="h-4 w-4 text-blue-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-orange-500" />
                    )}
                    <span
                      className={`text-xs ${
                        operationMode === "auto"
                          ? isOnline
                            ? "text-green-500"
                            : "text-red-500"
                          : operationMode === "online"
                            ? "text-blue-500"
                            : "text-orange-500"
                      }`}
                    >
                      {operationMode === "auto"
                        ? isOnline
                          ? "Online (Auto)"
                          : "Offline (Auto)"
                        : operationMode === "online"
                          ? "Online (Forçado)"
                          : "Offline (Forçado)"}
                    </span>
                    {(operationMode === "offline" || (operationMode === "auto" && !isOnline) || !emitBPeOnline) &&
                      pendingSync.length > 0 && (
                        <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold text-white bg-red-500 rounded-full">
                          {pendingSync.length}
                        </span>
                      )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {operationMode === "auto"
                    ? isOnline
                      ? `Sistema online - ${emitBPeOnline ? "BP-e será emitido automaticamente" : "BP-e será emitido posteriormente"}`
                      : `Sistema offline - ${pendingSync.length} venda(s) pendente(s) de sincronização`
                    : operationMode === "online"
                      ? `Modo online forçado - ${emitBPeOnline ? "BP-e será emitido automaticamente" : "BP-e será emitido posteriormente"}`
                      : `Modo offline forçado - ${pendingSync.length} venda(s) pendente(s) de sincronização`}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="border-l pl-4 ml-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const dialog = document.getElementById("operation-mode-dialog") as HTMLDialogElement
                  if (dialog) dialog.showModal()
                }}
              >
                Configurações de Operação
              </Button>

              <dialog id="operation-mode-dialog" className="p-0 rounded-lg shadow-lg backdrop:bg-black/50">
                <div className="w-[400px] p-6">
                  <h2 className="text-xl font-bold mb-4">Configurações de Operação</h2>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="font-medium">Modo de Operação</h3>
                      <RadioGroup
                        value={operationMode}
                        onValueChange={(value) => setOperationMode(value as "auto" | "online" | "offline")}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="auto" id="auto" />
                          <Label htmlFor="auto">Automático (baseado na conexão)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online">Forçar Modo Online</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="offline" id="offline" />
                          <Label htmlFor="offline">Forçar Modo Offline</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium">Emissão de BP-e</h3>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="emit-bpe"
                          checked={emitBPeOnline}
                          onChange={(e) => setEmitBPeOnline(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="emit-bpe">Emitir BP-e online (quando possível)</Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6 space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const dialog = document.getElementById("operation-mode-dialog") as HTMLDialogElement
                        if (dialog) dialog.close()
                      }}
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              </dialog>
            </div>

            <div className="border-l pl-4 ml-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  loadSalesHistory()
                  setShowSalesHistory(true)
                }}
              >
                <Ticket className="mr-2 h-4 w-4" />
                Passagens Vendidas
              </Button>
            </div>

            {isOnline && operationMode !== "offline" && pendingSync.length > 0 && (
              <Button variant="outline" size="sm" onClick={syncPendingTickets} className="text-xs">
                <Signal className="mr-1 h-3 w-3" />
                Sincronizar ({pendingSync.length})
              </Button>
            )}

            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {currentEmployee?.name} ({currentEmployee?.role})
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-4">
        <div className="max-w-3xl mx-auto">
          {/* Etapa 1: Selecionar Viagem */}
          {currentStep === "select-trip" && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Viagens Disponíveis</CardTitle>
                    <CardDescription>
                      {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </CardDescription>
                  </div>
                  {currentEmployee?.role === "admin" && <Button size="sm">Gerenciar Linhas</Button>}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="today">
                  <TabsList className="w-full grid grid-cols-2 mb-6">
                    <TabsTrigger value="today">Viagens de Hoje</TabsTrigger>
                    <TabsTrigger value="tomorrow">Viagens de Amanhã</TabsTrigger>
                  </TabsList>

                  <TabsContent value="today" className="space-y-4">
                    {getFilteredTrips().length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">Nenhuma viagem disponível hoje</p>
                      </div>
                    ) : (
                      getFilteredTrips().map((trip) => (
                        <div
                          key={trip.id}
                          className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
                          onClick={() => handleSelectTrip(trip)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-lg font-medium">
                                {trip.origin} → {trip.destination}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>
                                  Partida às {trip.departureTime} - Chegada às {trip.arrivalTime}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">{trip.platform}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">R$ {trip.price.toFixed(2)}</div>
                              <div className="text-sm text-muted-foreground">
                                {trip.availableSeats} lugares disponíveis
                              </div>
                              <div className="mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                                {trip.transportType === "lancha" ? "Lancha" : "Ônibus"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  <TabsContent value="tomorrow" className="space-y-4">
                    {(currentEmployee?.company === "Lanchas Marajó" ? lanchaTrips : onibusTrips)
                      .filter(
                        (trip) => format(trip.date, "yyyy-MM-dd") === format(addDays(new Date(), 1), "yyyy-MM-dd"),
                      )
                      .map((trip) => (
                        <div
                          key={trip.id}
                          className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
                          onClick={() => handleSelectTrip(trip)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-lg font-medium">
                                {trip.origin} → {trip.destination}
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Clock className="mr-1 h-4 w-4" />
                                <span>
                                  Partida às {trip.departureTime} - Chegada às {trip.arrivalTime}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">{trip.platform}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold">R$ {trip.price.toFixed(2)}</div>
                              <div className="text-sm text-muted-foreground">
                                {trip.availableSeats} lugares disponíveis
                              </div>
                              <div className="mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary">
                                {trip.transportType === "lancha" ? "Lancha" : "Ônibus"}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Etapa 2: Dados do Passageiro */}
          {currentStep === "passenger-details" && selectedTrip && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Dados do Passageiro</CardTitle>
                    <CardDescription>
                      Viagem: {selectedTrip.origin} → {selectedTrip.destination} |{" "}
                      {format(selectedTrip.date, "dd/MM/yyyy")} às {selectedTrip.departureTime}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep("select-trip")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center px-4 py-2 bg-muted rounded-lg">
                  <div>
                    <span className="text-sm font-medium">Preço por passageiro:</span>
                    <span className="ml-2 font-bold">R$ {selectedTrip.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center">
                    <Label htmlFor="passenger-count" className="mr-2">
                      Quantidade de passageiros:
                    </Label>
                    <Select
                      value={passengerCount.toString()}
                      onValueChange={(value) => handleUpdatePassengerCount(Number.parseInt(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue placeholder="1" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-medium">Dados do Passageiro Principal</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="name-0">Nome Completo</Label>
                        <Input
                          id="name-0"
                          value={passengerInfo[0].name}
                          onChange={(e) => handlePassengerInfoChange(0, "name", e.target.value)}
                          placeholder="Digite o nome completo"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label htmlFor="document-0">CPF</Label>
                          <Input
                            id="document-0"
                            value={passengerInfo[0].document}
                            onChange={(e) => handlePassengerInfoChange(0, "document", e.target.value)}
                            placeholder="Digite o CPF"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="phone-0">Telefone</Label>
                          <Input
                            id="phone-0"
                            value={passengerInfo[0].phone}
                            onChange={(e) => handlePassengerInfoChange(0, "phone", e.target.value)}
                            placeholder="Digite o telefone"
                          />
                        </div>
                      </div>
                    </div>

                    {passengerCount > 1 && (
                      <div className="mt-3 pt-3 border-t">
                        <h3 className="font-medium mb-2">Passageiros Adicionais</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {passengerCount - 1} passageiro(s) adicional(is)
                        </p>
                        <div className="space-y-2">
                          {passengerInfo.slice(1).map((passenger, index) => (
                            <div key={index + 1} className="grid grid-cols-2 gap-2">
                              <Input
                                value={passenger.name}
                                onChange={(e) => handlePassengerInfoChange(index + 1, "name", e.target.value)}
                                placeholder={`Nome do passageiro ${index + 2}`}
                                size="sm"
                              />
                              <Input
                                value={passenger.document}
                                onChange={(e) => handlePassengerInfoChange(index + 1, "document", e.target.value)}
                                placeholder={`CPF do passageiro ${index + 2}`}
                                size="sm"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Seleção de Assentos</h3>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowSeatSelector(!showSeatSelector)}
                        size="sm"
                      >
                        {showSeatSelector ? "Ocultar Seletor" : "Selecionar Assentos"}
                      </Button>
                    </div>

                    {selectedSeats.length > 0 && (
                      <div className="p-2 bg-muted/50 rounded-md">
                        <p className="text-sm">
                          <span className="font-medium">Assentos:</span>{" "}
                          <span className="font-bold">{selectedSeats.join(", ")}</span>
                          {selectedSeats.length < passengerCount && (
                            <span className="text-amber-600 ml-2">
                              (Faltam {passengerCount - selectedSeats.length})
                            </span>
                          )}
                        </p>
                      </div>
                    )}

                    {showSeatSelector ? (
                      <div className="border rounded-lg p-2 max-h-[320px] overflow-auto">
                        <SeatSelector
                          type={selectedTrip.transportType === "lancha" ? "boat" : "bus"}
                          maxSeats={passengerCount}
                          onSelectionChange={handleSeatSelection}
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Clique em "Selecionar Assentos" para escolher os lugares dos passageiros.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4 mt-2">
                <div className="text-lg font-bold">Total: R$ {(selectedTrip.price * passengerCount).toFixed(2)}</div>
                <Button onClick={handleContinueToPayment}>Continuar para Pagamento</Button>
              </CardFooter>
            </Card>
          )}

          {/* Etapa 3: Pagamento */}
          {currentStep === "payment" && selectedTrip && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Pagamento</CardTitle>
                    <CardDescription>
                      Viagem: {selectedTrip.origin} → {selectedTrip.destination} |{" "}
                      {format(selectedTrip.date, "dd/MM/yyyy")} às {selectedTrip.departureTime}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep("passenger-details")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Passageiro Principal:</div>
                      <div className="font-medium text-right">{passengerInfo[0].name}</div>

                      <div>Quantidade:</div>
                      <div className="font-medium text-right">{passengerCount}</div>

                      <div>Assentos:</div>
                      <div className="font-medium text-right">{selectedSeats.join(", ")}</div>

                      <div>Preço por passageiro:</div>
                      <div className="font-medium text-right">R$ {selectedTrip.price.toFixed(2)}</div>

                      <div className="col-span-2">
                        <Separator className="my-1" />
                      </div>

                      <div className="font-bold">Total:</div>
                      <div className="font-bold text-right">R$ {(selectedTrip.price * passengerCount).toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Método de Pagamento</Label>
                    <RadioGroup
                      value={selectedPaymentMethod}
                      onValueChange={setSelectedPaymentMethod}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div>
                        <RadioGroupItem value="dinheiro" id="dinheiro" className="peer sr-only" />
                        <Label
                          htmlFor="dinheiro"
                          className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          <span className="text-sm font-medium">Dinheiro</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="cartao_credito" id="cartao_credito" className="peer sr-only" />
                        <Label
                          htmlFor="cartao_credito"
                          className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span className="text-sm font-medium">Crédito</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="cartao_debito" id="cartao_debito" className="peer sr-only" />
                        <Label
                          htmlFor="cartao_debito"
                          className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span className="text-sm font-medium">Débito</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem value="pix" id="pix" className="peer sr-only" />
                        <Label
                          htmlFor="pix"
                          className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span className="font-bold text-sm mr-2">PIX</span>
                          <QrCode className="h-4 w-4" />
                        </Label>
                      </div>
                    </RadioGroup>

                    {(operationMode === "offline" || (operationMode === "auto" && !isOnline) || !emitBPeOnline) && (
                      <div className="flex items-center p-2 text-xs bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                        <AlertCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                        <p>
                          {operationMode === "offline" || (operationMode === "auto" && !isOnline)
                            ? "Modo offline. BP-e será emitido quando a conexão for restaurada."
                            : "BP-e configurado para emissão posterior."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={handleConfirmPayment}>Confirmar Pagamento</Button>
              </CardFooter>
            </Card>
          )}

          {/* Etapa 4: Bilhete */}
          {currentStep === "ticket" && selectedTrip && bookingReference && (
            <Card>
              <CardHeader className="border-b bg-muted/20">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center text-green-700">
                      <Check className="mr-2 h-5 w-5" />
                      Venda Concluída
                    </CardTitle>
                    <CardDescription>Referência da Reserva: {bookingReference}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="p-3 border rounded-lg mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        {selectedTrip.transportType === "lancha" ? (
                          <Ship className="h-5 w-5 mr-2 text-primary" />
                        ) : (
                          <Ship className="h-5 w-5 mr-2 text-primary" />
                        )}
                        <div>
                          <h3 className="font-medium">
                            {selectedTrip.origin} → {selectedTrip.destination}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {format(selectedTrip.date, "dd/MM/yyyy")} • {selectedTrip.departureTime} -{" "}
                            {selectedTrip.arrivalTime}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          {selectedTrip.transportType === "lancha" ? "Lancha" : "Ônibus"}
                        </p>
                        <p className="text-xs text-muted-foreground">{selectedTrip.platform}</p>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <Separator className="my-1" />
                    </div>

                    <div className="text-sm">Passageiro:</div>
                    <div className="text-sm font-medium text-right">{passengerInfo[0].name}</div>

                    <div className="text-sm">CPF:</div>
                    <div className="text-sm font-medium text-right">{passengerInfo[0].document}</div>

                    <div className="text-sm">Quantidade:</div>
                    <div className="text-sm font-medium text-right">{passengerCount}</div>

                    <div className="text-sm">Assentos:</div>
                    <div className="text-sm font-medium text-right">{selectedSeats.join(", ")}</div>

                    <div className="text-sm">Pagamento:</div>
                    <div className="text-sm font-medium text-right">
                      {selectedPaymentMethod === "dinheiro" && "Dinheiro"}
                      {selectedPaymentMethod === "cartao_credito" && "Cartão de Crédito"}
                      {selectedPaymentMethod === "cartao_debito" && "Cartão de Débito"}
                      {selectedPaymentMethod === "pix" && "PIX"}
                    </div>

                    <div className="col-span-2">
                      <Separator className="my-1" />
                    </div>

                    <div className="text-sm font-bold">Total Pago:</div>
                    <div className="text-sm font-bold text-right">
                      R$ {(selectedTrip.price * passengerCount).toFixed(2)}
                    </div>

                    <div className="col-span-2 mt-2 flex items-center justify-between p-2 rounded-md bg-muted">
                      <div className="flex items-center">
                        <QrCode className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">BP-e</span>
                      </div>
                      <div>
                        {bpeStatus === "pending" && (
                          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-yellow-100 text-yellow-800 border-yellow-200">
                            {isOnline ? "Processando..." : "Pendente (Offline)"}
                          </span>
                        )}
                        {bpeStatus === "issued" && (
                          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-800 border-green-200">
                            Emitido
                          </span>
                        )}
                        {bpeStatus === "failed" && (
                          <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border-red-200">
                            Falha
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <Button onClick={handlePrintTicket} className="flex items-center">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir Bilhete
                  </Button>
                  {bpeStatus === "issued" && (
                    <Button variant="outline" className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar BP-e
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetSalesProcess}>
                    Nova Venda
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico de Vendas */}
          {showSalesHistory && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold">Passagens Vendidas</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowSalesHistory(false)}>
                    ✕
                  </Button>
                </div>

                <div className="p-4 overflow-auto flex-grow">
                  {salesHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma passagem vendida encontrada</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {salesHistory.map((ticket) => {
                        // Encontrar detalhes da viagem
                        const allTrips = [...lanchaTrips, ...onibusTrips]
                        const tripDetails = allTrips.find((trip) => trip.id === ticket.tripId)

                        return (
                          <div key={ticket.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center">
                                  <span className="font-medium text-lg">{ticket.id}</span>
                                  <span className="ml-2 text-sm text-muted-foreground">
                                    {format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}
                                  </span>
                                  {ticket.isOfflineSale && (
                                    <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-800 border-orange-200">
                                      Venda Offline
                                    </span>
                                  )}
                                </div>
                                <div className="text-lg mt-1">
                                  {tripDetails ? (
                                    <>
                                      {tripDetails.origin} → {tripDetails.destination} |{" "}
                                      {format(tripDetails.date, "dd/MM/yyyy")} às {tripDetails.departureTime}
                                    </>
                                  ) : (
                                    <span className="text-muted-foreground">Detalhes da viagem não disponíveis</span>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  Passageiro: {ticket.passengerName} | CPF: {ticket.passengerDocument}
                                </div>
                                {ticket.seatNumber && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Assentos: {ticket.seatNumber}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold">R$ {ticket.price.toFixed(2)}</div>
                                <div className="text-sm text-muted-foreground">
                                  {ticket.paymentMethod === "dinheiro" && "Dinheiro"}
                                  {ticket.paymentMethod === "cartao_credito" && "Cartão de Crédito"}
                                  {ticket.paymentMethod === "cartao_debito" && "Cartão de Débito"}
                                  {ticket.paymentMethod === "pix" && "PIX"}
                                </div>
                                <div className="mt-1">
                                  <span
                                    className={`ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold 
                                  ${
                                    ticket.bpeStatus === "issued"
                                      ? "bg-green-100 text-green-800 border-green-200"
                                      : ticket.bpeStatus === "pending"
                                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                        : ticket.bpeStatus === "canceled"
                                          ? "bg-red-100 text-red-800 border-red-200"
                                          : "bg-red-100 text-red-800 border-red-200"
                                  }`}
                                  >
                                    BP-e:{" "}
                                    {ticket.bpeStatus === "issued"
                                      ? "Emitido"
                                      : ticket.bpeStatus === "pending"
                                        ? "Pendente"
                                        : ticket.bpeStatus === "canceled"
                                          ? "Cancelado"
                                          : "Falha"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-2">
                              {ticket.paymentStatus === "completed" && (
                                <>
                                  <Button variant="outline" size="sm" onClick={() => handleReprintTicket(ticket)}>
                                    <Printer className="mr-1 h-3 w-3" />
                                    Reimprimir
                                  </Button>

                                  {ticket.bpeStatus !== "issued" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEmitBPe(ticket.id)}
                                      disabled={ticket.bpeStatus === "pending"}
                                    >
                                      <QrCode className="mr-1 h-3 w-3" />
                                      {ticket.bpeStatus === "pending" ? "Processando..." : "Emitir BP-e"}
                                    </Button>
                                  )}

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleCancelTicket(ticket.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    Cancelar
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">Total: {salesHistory.length} passagens</div>
                  <Button onClick={() => setShowSalesHistory(false)}>Fechar</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

