"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Check, Download, Printer, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [bookingDetails, setBookingDetails] = useState<any>(null)

  const tripId = searchParams.get("tripId")

  useEffect(() => {
    // Simular chamada de API para buscar detalhes da reserva
    setLoading(true)
    setTimeout(() => {
      const mockBooking = {
        id:
          "BK" +
          Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0"),
        trip: {
          id: tripId,
          type: Math.random() > 0.5 ? "bus" : "boat",
          origin: "Belém",
          destination: "Santarém",
          departureTime: "08:00",
          arrivalTime: "14:00",
          duration: "6h",
          company: Math.random() > 0.5 ? "Transporte Paraense" : "Navios Amazônia",
        },
        date: new Date(),
        passengers: [
          { name: "João Silva", document: "123.456.789-00", seat: "A1" },
          { name: "Maria Silva", document: "987.654.321-00", seat: "A2" },
        ],
        paymentMethod: "PIX",
        totalPrice: 240.0,
        status: "confirmed",
      }
      setBookingDetails(mockBooking)
      setLoading(false)
    }, 1500)
  }, [tripId])

  if (loading) {
    return (
      <div className="container py-8 flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!bookingDetails) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Reserva não encontrada</h1>
          <p className="mt-2">A reserva que você está procurando não existe ou foi removida.</p>
          <Link href="/">
            <Button className="mt-4">Voltar para Início</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 flex items-center">
          <div className="bg-green-100 rounded-full p-2 mr-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800">Reserva Confirmada!</h2>
            <p className="text-green-700">Sua reserva foi confirmada e suas passagens estão prontas.</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Reserva #{bookingDetails.id}</CardTitle>
                <CardDescription>
                  Reservada em {format(bookingDetails.date, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Detalhes da Viagem</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="mb-4">
                    <div className="font-medium">{bookingDetails.trip.company}</div>
                    <div className="text-sm text-muted-foreground">
                      {bookingDetails.trip.type === "bus" ? "Ônibus" : "Barco"} •{" "}
                      {format(bookingDetails.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex flex-col items-start">
                      <div className="text-lg font-bold">{bookingDetails.trip.departureTime}</div>
                      <div className="text-sm text-muted-foreground mt-1">{bookingDetails.trip.origin}</div>
                    </div>
                    <div className="flex flex-col items-center mx-4">
                      <div className="text-sm font-medium">{bookingDetails.trip.duration}</div>
                      <div className="w-24 h-0.5 bg-background my-2 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                      </div>
                      <div className="text-xs text-muted-foreground">Direto</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-lg font-bold">{bookingDetails.trip.arrivalTime}</div>
                      <div className="text-sm text-muted-foreground mt-1">{bookingDetails.trip.destination}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Informações do Passageiro</h3>
                <div className="space-y-4">
                  {bookingDetails.passengers.map((passenger: any, index: number) => (
                    <div key={index} className="bg-muted p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Nome do Passageiro</p>
                          <p className="font-medium">{passenger.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">CPF</p>
                          <p className="font-medium">{passenger.document}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Assento</p>
                          <p className="font-medium">{passenger.seat}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Informações de Pagamento</h3>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                      <p className="font-medium">{bookingDetails.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <p className="font-medium text-green-600">Pago</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Total</p>
                      <p className="font-medium">R${bookingDetails.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Informações Importantes</h3>
                <div className="space-y-2 text-sm">
                  <p>• Chegue pelo menos 30 minutos antes do horário de partida.</p>
                  <p>• Traga um documento de identidade válido para todos os passageiros.</p>
                  <p>• Cada passageiro tem direito a uma bagagem (máx. 20kg) e um item de mão.</p>
                  <p>
                    • Em caso de cancelamento, entre em contato conosco com pelo menos 24 horas de antecedência para
                    reembolso total.
                  </p>
                  <p>• Para qualquer assistência, contate nosso suporte ao cliente em suporte@parapassagens.com.</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/20 flex justify-between">
            <div className="text-sm text-muted-foreground">
              Obrigado por escolher Pará Passagens. Tenha uma boa viagem!
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                Voltar para Início
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <div className="text-center">
          <h3 className="text-lg font-medium mb-4">Precisa de Ajuda?</h3>
          <p className="text-muted-foreground mb-6">
            Se você tiver alguma dúvida ou precisar de assistência com sua reserva, nossa equipe de suporte ao cliente
            está aqui para ajudar.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline">Contatar Suporte</Button>
            <Button variant="outline">Perguntas Frequentes</Button>
            <Button variant="outline">Gerenciar Reserva</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

