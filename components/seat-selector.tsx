"use client"

import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SeatSelectorProps {
  type: "bus" | "boat"
  maxSeats: number
  onSelectionChange: (seats: string[]) => void
}

export function SeatSelector({ type, maxSeats, onSelectionChange }: SeatSelectorProps) {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  // Gerar assentos com base no tipo
  const generateSeats = () => {
    if (type === "bus") {
      // Layout de ônibus: 4 assentos por fileira (configuração 2-2)
      const rows = 12
      const seats = []

      for (let i = 1; i <= rows; i++) {
        const rowSeats = [
          { id: `A${i}`, status: Math.random() > 0.7 ? "occupied" : "available" },
          { id: `B${i}`, status: Math.random() > 0.7 ? "occupied" : "available" },
          { id: null, status: "aisle" }, // Corredor
          { id: `C${i}`, status: Math.random() > 0.7 ? "occupied" : "available" },
          { id: `D${i}`, status: Math.random() > 0.7 ? "occupied" : "available" },
        ]
        seats.push(rowSeats)
      }

      return seats
    } else {
      // Layout de barco: 6 assentos por fileira (configuração 3-3)
      const rows = 10
      const seats = []

      for (let i = 1; i <= rows; i++) {
        const rowSeats = [
          { id: `A${i}`, status: Math.random() > 0.7 ? "occupied" : "available" },
          { id: `B${i}`, status: Math.random() > 0.7 ? "occupied" : "available" },
          { id: `C${i}`, status: Math.random() > 0.7 ? "occupied" : "available" },
          { id: null, status: "aisle" }, // Corredor
          { id: `D${i}`, status: Math.random() > 0.7 ? "occupied" : "available" },
          { id: `E${i}`, status: Math.random() > 0.7 ? "occupied" : "available" },
          { id: `F${i}`, status: Math.random() > 0.7 ? "occupied" : "available" },
        ]
        seats.push(rowSeats)
      }

      return seats
    }
  }

  const seats = generateSeats()

  const handleSeatClick = (seatId: string, status: string) => {
    if (status === "occupied") return

    const seatIndex = selectedSeats.indexOf(seatId)
    let updatedSeats = [...selectedSeats]

    if (seatIndex === -1) {
      // Adicionar assento se não estiver selecionado e não atingimos o máximo
      if (selectedSeats.length < maxSeats) {
        updatedSeats = [...selectedSeats, seatId]
      }
    } else {
      // Remover assento se já estiver selecionado
      updatedSeats.splice(seatIndex, 1)
    }

    setSelectedSeats(updatedSeats)
    onSelectionChange(updatedSeats)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex items-center justify-center space-x-6 text-xs">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-muted rounded mr-1"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-primary rounded mr-1"></div>
          <span>Selecionado</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-400 rounded mr-1"></div>
          <span>Ocupado</span>
        </div>
      </div>

      <div className="bg-muted/30 p-3 rounded-lg w-full max-w-md mx-auto">
        {type === "bus" && (
          <div className="mb-3 flex justify-between items-center">
            <div className="w-10 h-10 bg-gray-300 rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-600">Mot.</span>
            </div>
            <div className="w-10 h-6 bg-gray-300 rounded-md flex items-center justify-center">
              <span className="text-xs text-gray-600">Porta</span>
            </div>
          </div>
        )}

        {type === "boat" && (
          <div className="mb-3 flex justify-center">
            <div className="w-20 h-10 bg-blue-100 rounded-md flex items-center justify-center">
              <span className="text-xs text-blue-600">Proa</span>
            </div>
          </div>
        )}

        <div className="grid gap-1">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((seat, seatIndex) => {
                if (seat.status === "aisle") {
                  return <div key={`aisle-${rowIndex}-${seatIndex}`} className="w-4 h-4"></div>
                }

                const isSelected = selectedSeats.includes(seat.id as string)
                const isOccupied = seat.status === "occupied"

                return (
                  <TooltipProvider key={`${rowIndex}-${seatIndex}`}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : isOccupied
                                ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                                : "bg-muted hover:bg-muted/80"
                          }`}
                          onClick={() => handleSeatClick(seat.id as string, seat.status)}
                          disabled={isOccupied}
                        >
                          {seat.id}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Assento {seat.id} - {isOccupied ? "Ocupado" : "Disponível"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          ))}
        </div>

        {type === "boat" && (
          <div className="mt-3 flex justify-center">
            <div className="w-20 h-10 bg-blue-100 rounded-md flex items-center justify-center">
              <span className="text-xs text-blue-600">Popa</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-center">
        {selectedSeats.length < maxSeats && (
          <span className="text-muted-foreground">Selecione mais {maxSeats - selectedSeats.length} assento(s)</span>
        )}
      </div>
    </div>
  )
}

