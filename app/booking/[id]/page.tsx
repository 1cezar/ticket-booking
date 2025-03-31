"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Calendar, Check, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SeatSelector } from "@/components/seat-selector"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Trip {
  id: string
  type: "bus" | "boat"
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  company: string
  availableSeats: number
}

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [passengerInfo, setPassengerInfo] = useState<any[]>([])

  const tripId = params.id as string
  const dateParam = searchParams.get("date") || new Date().toISOString()
  const passengers = Number.parseInt(searchParams.get("passengers") || "1")
  const date = new Date(dateParam)

  useEffect(() => {
    // Simular chamada de API para buscar detalhes da viagem
    setLoading(true)
    setTimeout(() => {
      const mockTrip: Trip = {
        id: tripId,
        type: Math.random() > 0.5 ? "bus" : "boat",
        origin: "Belém",
        destination: "Santarém",
        departureTime: "08:00",
        arrivalTime: "14:00",
        duration: "6h",
        price: 120.0,
        company: Math.random() > 0.5 ? "Transporte Paraense" : "Navios Amazônia",
        availableSeats: 42,
      }
      setTrip(mockTrip)

      // Inicializar informações do passageiro
      const initialPassengerInfo = Array(passengers)
        .fill(null)
        .map((_, i) => ({
          name: "",
          document: "",
          email: "",
          phone: "",
        }))
      setPassengerInfo(initialPassengerInfo)

      setLoading(false)
    }, 1000)
  }, [tripId, passengers])

  const handleSeatSelection = (seats: string[]) => {
    setSelectedSeats(seats)
  }

  const handlePassengerInfoChange = (index: number, field: string, value: string) => {
    const updatedInfo = [...passengerInfo]
    updatedInfo[index] = { ...updatedInfo[index], [field]: value }
    setPassengerInfo(updatedInfo)
  }

  const handlePayment = () => {
    // Em um app real, isso processaria o pagamento
    router.push(`/booking/confirmation?tripId=${tripId}`)
  }

  const totalPrice = trip ? trip.price * passengers : 0

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Viagem não encontrada</h1>
          <p className="mt-2">A viagem que você está procurando não existe ou foi removida.</p>
          <Link href="/">
            <Button className="mt-4">Voltar para Início</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Link href="/search">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Resultados da Busca
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Processo de Reserva</CardTitle>
              <CardDescription>Complete as etapas a seguir para reservar suas passagens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-8">
                <div className={`flex flex-col items-center ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {step > 1 ? <Check className="h-5 w-5" /> : "1"}
                  </div>
                  <span className="text-sm">Selecionar Assentos</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className={`h-0.5 w-full ${step > 1 ? "bg-primary" : "bg-muted"}`}></div>
                </div>
                <div className={`flex flex-col items-center ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    {step > 2 ? <Check className="h-5 w-5" /> : "2"}
                  </div>
                  <span className="text-sm">Dados do Passageiro</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <div className={`h-0.5 w-full ${step > 2 ? "bg-primary" : "bg-muted"}`}></div>
                </div>
                <div className={`flex flex-col items-center ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                  >
                    3
                  </div>
                  <span className="text-sm">Pagamento</span>
                </div>
              </div>

              {step === 1 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Selecione Seus Assentos</h3>
                  <p className="text-muted-foreground mb-6">
                    Por favor, selecione {passengers} {passengers === 1 ? "assento" : "assentos"} para sua viagem.
                  </p>
                  <SeatSelector type={trip.type} maxSeats={passengers} onSelectionChange={handleSeatSelection} />
                  <div className="flex justify-end mt-6">
                    <Button onClick={() => setStep(2)} disabled={selectedSeats.length !== passengers}>
                      Continuar para Dados do Passageiro
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Dados do Passageiro</h3>
                  <p className="text-muted-foreground mb-6">Por favor, forneça os detalhes de todos os passageiros.</p>

                  {passengerInfo.map((passenger, index) => (
                    <div key={index} className="mb-8">
                      <h4 className="font-medium mb-4">
                        Passageiro {index + 1} {index === 0 ? "(Contato Principal)" : ""}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`name-${index}`}>Nome Completo</Label>
                          <Input
                            id={`name-${index}`}
                            value={passenger.name}
                            onChange={(e) => handlePassengerInfoChange(index, "name", e.target.value)}
                            placeholder="Digite o nome completo"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`document-${index}`}>CPF</Label>
                          <Input
                            id={`document-${index}`}
                            value={passenger.document}
                            onChange={(e) => handlePassengerInfoChange(index, "document", e.target.value)}
                            placeholder="Digite o CPF"
                            className="mt-1"
                          />
                        </div>
                        {index === 0 && (
                          <>
                            <div>
                              <Label htmlFor="email">E-mail</Label>
                              <Input
                                id="email"
                                type="email"
                                value={passenger.email}
                                onChange={(e) => handlePassengerInfoChange(index, "email", e.target.value)}
                                placeholder="Digite o e-mail"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Telefone</Label>
                              <Input
                                id="phone"
                                value={passenger.phone}
                                onChange={(e) => handlePassengerInfoChange(index, "phone", e.target.value)}
                                placeholder="Digite o telefone"
                                className="mt-1"
                              />
                            </div>
                          </>
                        )}
                      </div>
                      {index < passengerInfo.length - 1 && <Separator className="mt-6" />}
                    </div>
                  ))}

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar para Seleção de Assentos
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={
                        !passengerInfo.every((p) => p.name && p.document) ||
                        !passengerInfo[0].email ||
                        !passengerInfo[0].phone
                      }
                    >
                      Continuar para Pagamento
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Pagamento</h3>
                  <p className="text-muted-foreground mb-6">Escolha seu método de pagamento e complete sua reserva.</p>

                  <Tabs defaultValue="pix" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6">
                      <TabsTrigger value="pix">PIX</TabsTrigger>
                      <TabsTrigger value="credit">Cartão de Crédito</TabsTrigger>
                      <TabsTrigger value="bank">Transferência Bancária</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pix">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center">
                            <div className="bg-muted p-4 rounded-lg mb-4">
                              <Image
                                src="/placeholder.svg?height=200&width=200"
                                alt="QR Code PIX"
                                width={200}
                                height={200}
                                className="mx-auto"
                              />
                            </div>
                            <p className="text-center mb-4">
                              Escaneie o QR code com seu aplicativo bancário ou copie a chave PIX abaixo
                            </p>
                            <div className="flex w-full max-w-sm mb-4">
                              <Input value="pix12345678901234567890" readOnly />
                              <Button variant="outline" className="ml-2">
                                Copiar
                              </Button>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Info className="mr-2 h-4 w-4" />
                              <span>O pagamento PIX será processado imediatamente</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="credit">
                      <Card>
                        <CardContent className="pt-6 space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <Label htmlFor="card-name">Nome no Cartão</Label>
                              <Input
                                id="card-name"
                                placeholder="Digite o nome como aparece no cartão"
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="card-number">Número do Cartão</Label>
                              <Input id="card-number" placeholder="0000 0000 0000 0000" className="mt-1" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="expiry">Data de Validade</Label>
                                <Input id="expiry" placeholder="MM/AA" className="mt-1" />
                              </div>
                              <div>
                                <Label htmlFor="cvv">CVV</Label>
                                <Input id="cvv" placeholder="123" className="mt-1" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="bank">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="bg-muted p-4 rounded-lg">
                              <h4 className="font-medium mb-2">Dados para Transferência Bancária</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">Banco</p>
                                  <p className="font-medium">Banco do Brasil</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Nome da Conta</p>
                                  <p className="font-medium">Pará Passagens Ltda</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Agência</p>
                                  <p className="font-medium">1234-5</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Número da Conta</p>
                                  <p className="font-medium">67890-1</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">CNPJ</p>
                                  <p className="font-medium">12.345.678/0001-90</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Info className="mr-2 h-4 w-4" />
                              <span>Por favor, envie o comprovante de pagamento para reservas@parapassagens.com</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Voltar para Dados do Passageiro
                    </Button>
                    <Button onClick={handlePayment}>
                      Finalizar Pagamento
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Resumo da Reserva</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{trip.company}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <span>{trip.type === "bus" ? "Ônibus" : "Barco"}</span>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div className="flex flex-col items-start">
                    <div className="text-lg font-bold">{trip.departureTime}</div>
                    <div className="text-sm text-muted-foreground mt-1">{trip.origin}</div>
                  </div>
                  <div className="flex flex-col items-center mx-4">
                    <div className="text-sm font-medium">{trip.duration}</div>
                    <div className="w-16 h-0.5 bg-muted my-2 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                    <div className="text-xs text-muted-foreground">Direto</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-lg font-bold">{trip.arrivalTime}</div>
                    <div className="text-sm text-muted-foreground mt-1">{trip.destination}</div>
                  </div>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Passageiros</span>
                    <span>
                      {passengers} {passengers === 1 ? "pessoa" : "pessoas"}
                    </span>
                  </div>
                  {selectedSeats.length > 0 && (
                    <div className="flex justify-between mb-2">
                      <span>Assentos</span>
                      <span>{selectedSeats.join(", ")}</span>
                    </div>
                  )}
                  <div className="flex justify-between mb-2">
                    <span>Preço por passageiro</span>
                    <span>R${trip.price.toFixed(2)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>R${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

