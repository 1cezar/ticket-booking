export interface Trip {
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

export interface Employee {
  id: string
  name: string
  company: string
  role: string
}

export interface Ticket {
  id: string
  tripId: string
  passengerName: string
  passengerDocument: string
  passengerPhone?: string
  seatNumber?: string
  price: number
  paymentMethod: string
  paymentStatus: "pending" | "completed"
  bpeStatus: "pending" | "issued" | "failed" | "canceled"
  createdAt: Date
  isOfflineSale: boolean
}

export interface BPe {
  id: string
  ticketId: string
  emissionDate: Date
  status: "pending" | "issued" | "canceled"
  xmlData?: string
  authorizationProtocol?: string
}

