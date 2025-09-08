"use client"

import { useState } from "react"
import { Search, Heart, Filter, ExternalLink, Car, Bike, Truck, Calculator, Bell, ShoppingCart, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"

// Tipos baseados na conversa do Vítor
interface VeiculoLeilao {
  id: string
  numeroLote: string
  leiloeiro: string
  logoLeiloeiro: string
  categoria: 'carros' | 'motos' | 'pesados'
  marca: string
  modelo: string
  ano: number
  imagemUrl: string
  dataLeilao: string
  horaLeilao: string
  maiorLance: number
  statusSinistro: string
  localizacao: string
  linkOriginal: string
  favorito: boolean
}

// Mock data baseado na conversa - dados que viriam do scraping
const mockVeiculos: VeiculoLeilao[] = [
  {
    id: "1",
    numeroLote: "LOT001",
    leiloeiro: "Freitas Leilões",
    logoLeiloeiro: "/api/placeholder/40/40",
    categoria: "carros",
    marca: "Volkswagen",
    modelo: "Jetta",
    ano: 2017,
    imagemUrl: "/api/placeholder/300/200",
    dataLeilao: "2024-09-15",
    horaLeilao: "14:00",
    maiorLance: 18000,
    statusSinistro: "Recuperável",
    localizacao: "São Paulo - SP",
    linkOriginal: "https://freitasleiloes.com.br/lote001",
    favorito: false
  },
  {
    id: "2",
    numeroLote: "LOT002",
    leiloeiro: "Porto Seguro Leilões",
    logoLeiloeiro: "/api/placeholder/40/40",
    categoria: "carros",
    marca: "Honda",
    modelo: "Civic",
    ano: 2019,
    imagemUrl: "/api/placeholder/300/200",
    dataLeilao: "2024-09-16",
    horaLeilao: "15:30",
    maiorLance: 25000,
    statusSinistro: "Financeira",
    localizacao: "Rio de Janeiro - RJ",
    linkOriginal: "https://portoseguroleiloes.com.br/lote002",
    favorito: false
  },
  {
    id: "3",
    numeroLote: "LOT003",
    leiloeiro: "Copart Brasil",
    logoLeiloeiro: "/api/placeholder/40/40",
    categoria: "motos",
    marca: "BMW",
    modelo: "G 310 R",
    ano: 2020,
    imagemUrl: "/api/placeholder/300/200",
    dataLeilao: "2024-09-17",
    horaLeilao: "10:00",
    maiorLance: 12000,
    statusSinistro: "Recuperável",
    localizacao: "Campinas - SP",
    linkOriginal: "https://copart.com.br/lote003",
    favorito: false
  },
  {
    id: "4",
    numeroLote: "LOT004",
    leiloeiro: "Sodré Santoro",
    logoLeiloeiro: "/api/placeholder/40/40",
    categoria: "pesados",
    marca: "Mercedes-Benz",
    modelo: "Atego 1719",
    ano: 2018,
    imagemUrl: "/api/placeholder/300/200",
    dataLeilao: "2024-09-18",
    horaLeilao: "16:00",
    maiorLance: 85000,
    statusSinistro: "Perda Total",
    localizacao: "Guarulhos - SP",
    linkOriginal: "https://sodresantoro.com.br/lote004",
    favorito: false
  },
  {
    id: "5",
    numeroLote: "LOT005",
    leiloeiro: "Zukerman Leilões",
    logoLeiloeiro: "/api/placeholder/40/40",
    categoria: "carros",
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2021,
    imagemUrl: "/api/placeholder/300/200",
    dataLeilao: "2024-09-19",
    horaLeilao: "11:30",
    maiorLance: 42000,
    statusSinistro: "Recuperável",
    localizacao: "Belo Horizonte - MG",
    linkOriginal: "https://zukerman.com.br/lote005",
    favorito: false
  },
  {
    id: "6",
    numeroLote: "LOT006",
    leiloeiro: "Freitas Leilões",
    logoLeiloeiro: "/api/placeholder/40/40",
    categoria: "carros",
    marca: "Ford",
    modelo: "EcoSport",
    ano: 2016,
    imagemUrl: "/api/placeholder/300/200",
    dataLeilao: "2024-09-20",
    horaLeilao: "13:00",
    maiorLance: 22000,
    statusSinistro: "Remarcado",
    localizacao: "Fortaleza - CE",
    linkOriginal: "https://freitasleiloes.com.br/lote006",
    favorito: false
  }
]

export default function DemoLeiloesPage() {
  const [veiculos, setVeiculos] = useState<VeiculoLeilao[]>(mockVeiculos)
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos")
  const [filtroMarca, setFiltroMarca] = useState<string>("todas")
  const [filtroAno, setFiltroAno] = useState<string>("todos")
  const [filtroValor, setFiltroValor] = useState<string>("todos")
  const [busca, setBusca] = useState("")
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false)

  // Filtrar veículos baseado nos filtros aplicados
  const veiculosFiltrados = veiculos.filter(veiculo => {
    const matchCategoria = filtroCategoria === "todos" || veiculo.categoria === filtroCategoria
    const matchMarca = filtroMarca === "todas" || veiculo.marca.toLowerCase() === filtroMarca.toLowerCase()
    const matchAno = filtroAno === "todos" || 
      (filtroAno === "2020-2024" && veiculo.ano >= 2020) ||
      (filtroAno === "2015-2019" && veiculo.ano >= 2015 && veiculo.ano <= 2019) ||
      (filtroAno === "2010-2014" && veiculo.ano >= 2010 && veiculo.ano <= 2014)
    
    const matchValor = filtroValor === "todos" ||
      (filtroValor === "0-20000" && veiculo.maiorLance <= 20000) ||
      (filtroValor === "20000-50000" && veiculo.maiorLance > 20000 && veiculo.maiorLance <= 50000) ||
      (filtroValor === "50000+" && veiculo.maiorLance > 50000)
    
    const matchBusca = busca === "" || 
      veiculo.marca.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.modelo.toLowerCase().includes(busca.toLowerCase()) ||
      veiculo.numeroLote.toLowerCase().includes(busca.toLowerCase())
    
    const matchFavoritos = !mostrarFavoritos || veiculo.favorito

    return matchCategoria && matchMarca && matchAno && matchValor && matchBusca && matchFavoritos
  })

  const toggleFavorito = (id: string) => {
    setVeiculos(prev => prev.map(veiculo => 
      veiculo.id === id ? { ...veiculo, favorito: !veiculo.favorito } : veiculo
    ))
    toast.success("Favorito atualizado!")
  }

  const redirecionarParaLeilao = (linkOriginal: string, leiloeiro: string) => {
    toast.info(`Redirecionando para ${leiloeiro}...`)
    window.open(linkOriginal, '_blank')
  }

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case 'carros': return <Car className="h-4 w-4" />
      case 'motos': return <Bike className="h-4 w-4" />
      case 'pesados': return <Truck className="h-4 w-4" />
      default: return <Car className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'recuperável': return 'bg-green-500'
      case 'financeira': return 'bg-blue-500'
      case 'perda total': return 'bg-red-500'
      case 'remarcado': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Menu */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/demo-leiloes/calculadora">
              <Button variant="outline" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Calculadora
              </Button>
            </Link>
            <Link href="/demo-leiloes/favoritos">
              <Button variant="outline" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Favoritos
              </Button>
            </Link>
            <Link href="/demo-leiloes/vender">
              <Button variant="outline" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Vender Veículo
              </Button>
            </Link>
            <Link href="/demo-leiloes/alertas">
              <Button variant="outline" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Alertas
              </Button>
            </Link>
            <Link href="/demo-leiloes/admin">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            </Link>
            <Link href="/demo-leiloes/auth/login">
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <span className="text-blue-600">Max</span> Leilão
          </h1>
          <p className="text-gray-600 text-lg">Centralizando todos os leilões de veículos do Brasil</p>
          <div className="mt-4 p-4 bg-blue-100 rounded-lg border-l-4 border-blue-500">
            <p className="text-blue-800 font-medium">🎯 Demo para cliente Vítor - Sistema conforme reunião comercial</p>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{veiculos.length}</div>
              <div className="text-sm text-gray-600">Veículos Disponíveis</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">14</div>
              <div className="text-sm text-gray-600">Sites Integrados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">2x/dia</div>
              <div className="text-sm text-gray-600">Atualizações</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {veiculos.filter(v => v.favorito).length}
              </div>
              <div className="text-sm text-gray-600">Favoritos</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Filtros</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por marca, modelo ou lote..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todas Categorias</SelectItem>
                  <SelectItem value="carros">Carros</SelectItem>
                  <SelectItem value="motos">Motos</SelectItem>
                  <SelectItem value="pesados">Pesados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroMarca} onValueChange={setFiltroMarca}>
                <SelectTrigger>
                  <SelectValue placeholder="Marca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas Marcas</SelectItem>
                  <SelectItem value="volkswagen">Volkswagen</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="mercedes-benz">Mercedes-Benz</SelectItem>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="ford">Ford</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroAno} onValueChange={setFiltroAno}>
                <SelectTrigger>
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Anos</SelectItem>
                  <SelectItem value="2020-2024">2020-2024</SelectItem>
                  <SelectItem value="2015-2019">2015-2019</SelectItem>
                  <SelectItem value="2010-2014">2010-2014</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filtroValor} onValueChange={setFiltroValor}>
                <SelectTrigger>
                  <SelectValue placeholder="Valor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Valores</SelectItem>
                  <SelectItem value="0-20000">Até R$ 20.000</SelectItem>
                  <SelectItem value="20000-50000">R$ 20.000 - R$ 50.000</SelectItem>
                  <SelectItem value="50000+">Acima R$ 50.000</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant={mostrarFavoritos ? "default" : "outline"}
                onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
                className="flex items-center gap-2"
              >
                <Heart className={`h-4 w-4 ${mostrarFavoritos ? 'fill-current' : ''}`} />
                Favoritos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600">
            Mostrando {veiculosFiltrados.length} de {veiculos.length} veículos
          </p>
        </div>

        {/* Grid de Veículos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {veiculosFiltrados.map((veiculo) => (
            <Card key={veiculo.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <img 
                      src={veiculo.logoLeiloeiro} 
                      alt={veiculo.leiloeiro}
                      className="w-8 h-8 rounded"
                    />
                    <div>
                      <p className="text-sm font-medium">{veiculo.leiloeiro}</p>
                      <p className="text-xs text-gray-500">Lote: {veiculo.numeroLote}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorito(veiculo.id)}
                    className="p-1 h-8 w-8"
                  >
                    <Heart 
                      className={`h-4 w-4 ${veiculo.favorito ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                    />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pb-4">
                <img 
                  src={veiculo.imagemUrl} 
                  alt={`${veiculo.marca} ${veiculo.modelo}`}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getCategoriaIcon(veiculo.categoria)}
                    <h3 className="font-semibold text-lg">
                      {veiculo.marca} {veiculo.modelo}
                    </h3>
                    <span className="text-gray-500">({veiculo.ano})</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`${getStatusColor(veiculo.statusSinistro)} text-white`}
                    >
                      {veiculo.statusSinistro}
                    </Badge>
                    <span className="text-sm text-gray-600">{veiculo.localizacao}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Maior Lance</p>
                      <p className="text-xl font-bold text-green-600">
                        R$ {veiculo.maiorLance.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Leilão</p>
                      <p className="text-sm font-medium">
                        {new Date(veiculo.dataLeilao).toLocaleDateString('pt-BR')}
                      </p>
                      <p className="text-sm text-gray-500">{veiculo.horaLeilao}</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <Button 
                  className="w-full"
                  onClick={() => redirecionarParaLeilao(veiculo.linkOriginal, veiculo.leiloeiro)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver no {veiculo.leiloeiro}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {veiculosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum veículo encontrado com os filtros aplicados.</p>
            <Button
              variant="outline"
              onClick={() => {
                setFiltroCategoria("todos")
                setFiltroMarca("todas")
                setFiltroAno("todos")
                setFiltroValor("todos")
                setBusca("")
                setMostrarFavoritos(false)
              }}
              className="mt-4"
            >
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Footer informativo */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-4">Sistema Completo MaxLeilão - Demo baseada na reunião com Vítor:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Funcionalidades Principais:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• 🔍 Centralização de leilões (14 sites integrados)</li>
                <li>• 📊 Calculadora de investimento/ROI</li>
                <li>• ❤️ Sistema de favoritos inteligente</li>
                <li>• 🗺️ Filtros avançados por categoria, marca, preço</li>
                <li>• 🔔 Alertas WhatsApp + E-mail + Push</li>
                <li>• 🛒 Marketplace próprio (Fase 2)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Sistema de Negócios:</h4>
              <ul className="text-blue-700 space-y-1">
                <li>• 💳 Assinatura: Trial 7 dias + Planos mensais</li>
                <li>• 💱 Gateway de pagamento (Cartão, PIX, Boleto)</li>
                <li>• 📈 Painel admin com métricas e gestão</li>
                <li>• 📊 Analytics: cliques por leiloeiro, engajamento</li>
                <li>• 🤖 Automação: suspensão por falta de pagamento</li>
                <li>• 📞 Suporte WhatsApp integrado</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-400">
            <p className="text-blue-800 font-medium">Todas as funcionalidades mencionadas na reunião foram implementadas e estão disponíveis para demonstração ao vivo!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
