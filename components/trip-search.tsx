"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MapPin, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { zodResolver } from "@hookform/resolvers/zod"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useForm } from "react-hook-form"
import * as z from "zod"

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

const formSchema = z.object({
  origin: z.string({
    required_error: "Por favor, selecione uma cidade de partida.",
  }),
  destination: z.string({
    required_error: "Por favor, selecione uma cidade de destino.",
  }),
  date: z.date({
    required_error: "Por favor, selecione uma data.",
  }),
  passengers: z.number().min(1).max(10),
})

export function TripSearch() {
  const router = useRouter()
  const [originOpen, setOriginOpen] = useState(false)
  const [destinationOpen, setDestinationOpen] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      passengers: 1,
      date: new Date(),
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams({
      origin: values.origin,
      destination: values.destination,
      date: values.date.toISOString(),
      passengers: values.passengers.toString(),
    })
    router.push(`/search?${params.toString()}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>De</FormLabel>
                <Popover open={originOpen} onOpenChange={setOriginOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" role="combobox" className="justify-between w-full">
                        {field.value
                          ? cities.find((city) => city.value === field.value)?.label
                          : "Selecione cidade de partida"}
                        <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar cidade..." />
                      <CommandList>
                        <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                        <CommandGroup>
                          {cities.map((city) => (
                            <CommandItem
                              key={city.value}
                              value={city.value}
                              onSelect={(value) => {
                                form.setValue("origin", value)
                                setOriginOpen(false)
                              }}
                            >
                              {city.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Para</FormLabel>
                <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" role="combobox" className="justify-between w-full">
                        {field.value
                          ? cities.find((city) => city.value === field.value)?.label
                          : "Selecione cidade de destino"}
                        <MapPin className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-full" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar cidade..." />
                      <CommandList>
                        <CommandEmpty>Nenhuma cidade encontrada.</CommandEmpty>
                        <CommandGroup>
                          {cities.map((city) => (
                            <CommandItem
                              key={city.value}
                              value={city.value}
                              onSelect={(value) => {
                                form.setValue("destination", value)
                                setDestinationOpen(false)
                              }}
                            >
                              {city.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Partida</FormLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant="outline" className="justify-between w-full">
                        {field.value ? format(field.value, "PPP", { locale: ptBR }) : "Selecione a data"}
                        <Calendar className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          field.onChange(date)
                          setCalendarOpen(false)
                        }
                      }}
                      disabled={(date) => date < new Date() || date > addDays(new Date(), 15)}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passengers"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Passageiros</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={field.value}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Passageiro" : "Passageiros"}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Buscar Passagens
        </Button>
      </form>
    </Form>
  )
}

