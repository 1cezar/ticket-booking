"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Calendar, Clock, Filter, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format, addDays, isSameDay } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Trip {
  id: string
  type: "lancha" | "onibus"
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  duration: string
  price: number
  company: string
  availableSeats: number
  date: Date
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [availableDates, setAvailableDates] = useState<Date[]>([])

  const origin = searchParams.get("origin") || ""
  const destination = searchParams.get("destination") || ""
  const dateParam = searchParams.get("date") || ""
  const passengers = Number.parseInt(searchParams.get("passengers") || "1")

  const date = dateParam ? new Date(dateParam) : new Date()

  useEffect(() => {
    // Simular chamada de API para buscar viagens
    setLoading(true)
    setTimeout(() => {
      // Gerar datas disponíveis para os próximos 15 dias
      const dates = Array.from({ length: 15 }, (_, i) => addDays(new Date(), i))
      setAvailableDates(dates)

      // Definir a data selecionada como a data da busca ou a data atual
      setSelectedDate(date)

      // Gerar viagens para a data selecionada
      const mockTrips: Trip[] = [
        {
          id: "trip1",
          type: "onibus",
          origin: cities.find((c) => c.value === origin)?.label || "Belém",
          destination: cities.find((c) => c.value === destination)?.label || "Santarém",
          departureTime: "08:00",
          arrivalTime: "14:00",
          duration: "6h",
          price: 120.0,
          company: "Transporte Paraense",
          availableSeats: 42,
          date: date,
        },
        {
          id: "trip2",
          type: "onibus",
          origin: cities.find((c) => c.value === origin)?.label || "Belém",
          destination: cities.find((c) => c.value === destination)?.label || "Santarém",
          departureTime: "10:30",
          arrivalTime: "16:30",
          duration: "6h",
          price: 135.0,
          company: "Viação Pará",
          availableSeats: 28,
          date: date,
        },
        {
          id: "trip3",
          type: "lancha",
          origin: cities.find((c) => c.value === origin)?.label || "Belém",
          destination: cities.find((c) => c.value === destination)?.label || "Santarém",
          departureTime: "13:45",
          arrivalTime: "19:45",
          duration: "6h",
          price: 110.0,
          company: "Navegação Amazônica",
          availableSeats: 15,
          date: date,
        },
        {
          id: "trip4",
          type: "lancha",
          origin: cities.find((c) => c.value === origin)?.label || "Belém",
          destination: cities.find((c) => c.value === destination)?.label || "Santarém",
          departureTime: "17:00",
          arrivalTime: "23:00",
          duration: "6h",
          price: 125.0,
          company: "Barcos Marajó",
          availableSeats: 32,
          date: date,
        },
      ]
      setTrips(mockTrips)
      setLoading(false)
    }, 1000)
  }, [origin, destination, dateParam])

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate)
    // Em um app real, isso faria uma nova busca com a data selecionada
    // Aqui vamos simular uma nova busca
    setLoading(true)
    setTimeout(() => {
      const mockTrips: Trip[] = [
        {
          id: `trip1-${format(newDate, "yyyyMMdd")}`,
          type: "onibus",
          origin: cities.find((c) => c.value === origin)?.label || "Belém",
          destination: cities.find((c) => c.value === destination)?.label || "Santarém",
          departureTime: "08:00",
          arrivalTime: "14:00",
          duration: "6h",
          price: 120.0,
          company: "Transporte Paraense",
          availableSeats: 42,
          date: newDate,
        },
        {
          id: `trip2-${format(newDate, "yyyyMMdd")}`,
          type: "onibus",
          origin: cities.find((c) => c.value === origin)?.label || "Belém",
          destination: cities.find((c) => c.value === destination)?.label || "Santarém",
          departureTime: "10:30",
          arrivalTime: "16:30",
          duration: "6h",
          price: 135.0,
          company: "Viação Pará",
          availableSeats: 28,
          date: newDate,
        },
      ]
      setTrips(mockTrips)
      setLoading(false)
    }, 500)
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Início
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Filtrar Resultados</CardTitle>
              <CardDescription>Refine sua busca</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Horário de Partida</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Manhã (6h - 12h)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Tarde (12h - 18h)</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Noite (18h - 0h)</span>
                    </label>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2">Faixa de Preço</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Até R$100</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>R$100 - R$150</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>R$150 - R$200</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Acima de R$200</span>
                    </label>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-sm font-medium mb-2">Empresas</h3>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Transporte Paraense</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Viação Pará</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Navegação Amazônica</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Barcos Marajó</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Aplicar Filtros
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:col-span-3">
          <div className="bg-muted rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center text-lg font-medium">
                  <span>{cities.find((c) => c.value === origin)?.label || "Belém"}</span>
                  <ArrowRight className="mx-2 h-4 w-4" />
                  <span>{cities.find((c) => c.value === destination)?.label || "Santarém"}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>
                    {selectedDate ? format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR }) : ""}
                  </span>
                  <span className="mx-2">•</span>
                  <Users className="mr-1 h-4 w-4" />
                  <span>
                    {passengers} {passengers === 1 ? "Passageiro" : "Passageiros"}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                Alterar Busca
              </Button>
            </div>
          </div>

          <div className="mb-6 overflow-x-auto">
            <div className="flex space-x-2 pb-2">
              {availableDates.map((availableDate) => (
                <Button
                  key={availableDate.toISOString()}
                  variant={selectedDate && isSameDay(availableDate, selectedDate) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDateChange(availableDate)}
                  className="whitespace-nowrap"
                >
                  {format(availableDate, "EEE, dd/MM", { locale: ptBR })}
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="md:col-span-2 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-medium text-lg">{trip.company}</div>
                        <div className="text-sm text-muted-foreground">
                          {trip.type === "onibus" ? "Ônibus" : "Lancha"} • {trip.availableSeats} assentos disponíveis
                        </div>
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="flex flex-col items-center">
                          <div className="text-xl font-bold">{trip.departureTime}</div>
                          <div className="text-sm text-muted-foreground mt-1">{trip.origin}</div>
                        </div>
                        <div className="flex flex-col items-center mx-4">
                          <div className="text-sm font-medium">{trip.duration}</div>
                          <div className="w-24 h-0.5 bg-muted my-2 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                          </div>
                          <div className="text-xs text-muted-foreground">Direto</div>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="text-xl font-bold">{trip.arrivalTime}</div>
                          <div className="text-sm text-muted-foreground mt-1">{trip.destination}</div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>
                          Partida: {format(trip.date, "d 'de' MMM 'de' yyyy", { locale: ptBR })} às {trip.departureTime}
                        </span>
                      </div>
                    </div>
                    <div className="bg-muted/20 p-6 flex flex-col justify-between">
                      <div>
                        <div className="text-2xl font-bold">R${trip.price.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">por passageiro</div>
                      </div>
                      <Link href={`/booking/${trip.id}?date=${trip.date.toISOString()}&passengers=${passengers}`}>
                        <Button className="w-full mt-4">Selecionar</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const cities = [
  { value: "belem", label: "Belém" },
  { value: "santarem", label: "Santarém" },
  { value: "maraba", label: "Marabá" },
  { value: "altamira", label: "Altamira" },
  { value: "breves", label: "Breves" },
  { value: "itaituba", label: "Itaituba" },
  { value: "paragominas", label: "Paragominas" },
  { value: "abaetetuba", label: "Abaetetuba" },
  { value: "castanhal", label: "Castanhal" },
  { value: "tucurui", label: "Tucuruí" },
  { value: "parauapebas", label: "Parauapebas" },
  { value: "capanema", label: "Capanema" },
  { value: "soure", label: "Soure" },
  { value: "barcarena", label: "Barcarena" },
  { value: "obidos", label: "Óbidos" },
]

