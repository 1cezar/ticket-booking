import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TripSearch } from "@/components/trip-search"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">Pará</span>
            <span>Passagens</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium">
              Início
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Minhas Passagens
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Suporte
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Entrar
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-primary/10 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Reserve Sua Viagem com Facilidade
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Encontre e reserve as melhores passagens para sua próxima aventura no Pará.
                </p>
              </div>
            </div>
            <div className="mx-auto mt-8 max-w-3xl">
              <Card>
                <CardContent className="p-6">
                  <TripSearch />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Destinos Populares</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Explore nossas rotas e destinos mais procurados no Pará
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {[
                { name: "Belém", image: "/placeholder.svg?height=200&width=300" },
                { name: "Santarém", image: "/placeholder.svg?height=200&width=300" },
                { name: "Marabá", image: "/placeholder.svg?height=200&width=300" },
                { name: "Altamira", image: "/placeholder.svg?height=200&width=300" },
                { name: "Breves", image: "/placeholder.svg?height=200&width=300" },
                { name: "Itaituba", image: "/placeholder.svg?height=200&width=300" },
              ].map((destination) => (
                <Link href={`/search?destination=${destination.name}`} key={destination.name}>
                  <div className="group relative overflow-hidden rounded-lg border">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={destination.image || "/placeholder.svg"}
                        alt={destination.name}
                        className="object-cover transition-transform group-hover:scale-105 h-full w-full"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 p-4 text-white">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted/40">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-primary">Pará</span>
              <span>Passagens</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Reserve sua viagem com confiança. Rápido, seguro e conveniente.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Empresa</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Sobre
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Carreiras
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contato
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Ajuda</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Atendimento ao Cliente
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Termos de Serviço
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Política de Privacidade
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Redes Sociais</h3>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Twitter
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Instagram
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Facebook
              </Link>
            </div>
          </nav>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {new Date().getFullYear()} Pará Passagens. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

