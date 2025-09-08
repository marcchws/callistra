"use client"

import { useState, useEffect } from "react"
import { Heart, ArrowLeft, ExternalLink, Car, Bike, Truck, Filter, Calendar, DollarSign, MapPin, Trash2, BarChart3, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import Link from "next/link"

// Simulação de veículos favoritos baseados na página principal
const mockFavoritos = [
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
    dataFavorito: "2024-09-10",
    notasPessoais: "Bom estado geral, verificar suspensão"
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
    dataFavorito: "2024-09-09",
    notasPessoais: "Moto para uso pessoal"
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
    dataFavorito: "2024-09-08",
    notasPessoais: "Investimento para revenda"
  }
]

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState(mockFavoritos)
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [ordenarPor, setOrdenarPor] = useState("dataFavorito")
  const [busca, setBusca] = useState("")
  const [veiculoSelecionado, setVeiculoSelecionado] = useState<any>(null)

  const filtrarFavoritos = () => {
    let filtrados = [...favoritos]

    // Filtro por categoria
    if (filtroCategoria !== "todos") {
      filtrados = filtrados.filter(v => v.categoria === filtroCategoria)
    }

    // Filtro por status
    if (filtroStatus !== "todos") {
      filtrados = filtrados.filter(v => v.statusSinistro.toLowerCase() === filtroStatus.toLowerCase())
    }

    // Busca por texto
    if (busca) {
      filtrados = filtrados.filter(v => 
        v.marca.toLowerCase().includes(busca.toLowerCase()) ||
        v.modelo.toLowerCase().includes(busca.toLowerCase()) ||
        v.numeroLote.toLowerCase().includes(busca.toLowerCase()) ||
        v.leiloeiro.toLowerCase().includes(busca.toLowerCase())
      )
    }

    // Ordenação
    filtrados.sort((a, b) => {
      switch (ordenarPor) {
        case "dataFavorito":
          return new Date(b.dataFavorito).getTime() - new Date(a.dataFavorito).getTime()
        case "dataLeilao":
          return new Date(a.dataLeilao).getTime() - new Date(b.dataLeilao).getTime()
        case "preco":
          return a.maiorLance - b.maiorLance
        case "precoDesc":
          return b.maiorLance - a.maiorLance
        case "marca":
          return a.marca.localeCompare(b.marca)
        default:
          return 0
      }
    })

    return filtrados
  }

  const removerFavorito = (id: string) => {
    setFavoritos(prev => prev.filter(f => f.id !== id))
    toast.success("Veículo removido dos favoritos")
  }

  const calcularEstatisticas = () => {
    const total = favoritos.length
    const valorTotal = favoritos.reduce((sum, v) => sum + v.maiorLance, 0)
    const valorMedio = total > 0 ? valorTotal / total : 0
    const categorias = favoritos.reduce((acc, v) => {
      acc[v.categoria] = (acc[v.categoria] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { total, valorTotal, valorMedio, categorias }
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

  const stats = calcularEstatisticas()
  const favoritosFiltrados = filtrarFavoritos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/demo-leiloes">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Leilões
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Heart className="h-10 w-10 text-pink-600 fill-current" />
            Meus Favoritos
          </h1>
          <p className="text-gray-600 text-lg">Acompanhe de perto os veículos que você tem interesse</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Veículos Favoritos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                R$ {stats.valorTotal.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-gray-600">Valor Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                R$ {stats.valorMedio.toLocaleString('pt-BR')}
              </div>
              <div className="text-sm text-gray-600">Valor Médio</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full h-12 flex flex-col items-center justify-center">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-xs">Ver Estatísticas</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Estatísticas Detalhadas</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Por Categoria:</h4>
                      <div className="space-y-2">
                        {Object.entries(stats.categorias).map(([categoria, quantidade]) => (
                          <div key={categoria} className="flex justify-between">
                            <span className="capitalize">{categoria}:</span>
                            <span className="font-medium">{quantidade}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Próximos Leilões:</h4>
                      <div className="space-y-2">
                        {favoritos
                          .sort((a, b) => new Date(a.dataLeilao).getTime() - new Date(b.dataLeilao).getTime())
                          .slice(0, 3)
                          .map(v => (
                            <div key={v.id} className="flex justify-between text-sm">
                              <span>{v.marca} {v.modelo}</span>
                              <span>{new Date(v.dataLeilao).toLocaleDateString('pt-BR')}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-pink-600" />
              <h2 className="text-lg font-semibold">Filtros e Organização</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                placeholder="Buscar nos favoritos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
              
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

              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos Status</SelectItem>
                  <SelectItem value="recuperável">Recuperável</SelectItem>
                  <SelectItem value="financeira">Financeira</SelectItem>
                  <SelectItem value="perda total">Perda Total</SelectItem>
                  <SelectItem value="remarcado">Remarcado</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ordenarPor} onValueChange={setOrdenarPor}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dataFavorito">Data do Favorito</SelectItem>
                  <SelectItem value="dataLeilao">Data do Leilão</SelectItem>
                  <SelectItem value="preco">Menor Preço</SelectItem>
                  <SelectItem value="precoDesc">Maior Preço</SelectItem>
                  <SelectItem value="marca">Marca A-Z</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  setFiltroCategoria("todos")
                  setFiltroStatus("todos")
                  setBusca("")
                  setOrdenarPor("dataFavorito")
                }}
                variant="outline"
              >
                Limpar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Favoritos */}
        {favoritosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {favoritos.length === 0 ? "Nenhum favorito ainda" : "Nenhum favorito encontrado"}
            </h3>
            <p className="text-gray-500 mb-6">
              {favoritos.length === 0 
                ? "Adicione veículos aos favoritos para acompanhá-los aqui"
                : "Tente ajustar os filtros para encontrar seus favoritos"
              }
            </p>
            <Link href="/demo-leiloes">
              <Button>
                Explorar Leilões
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600">
                Mostrando {favoritosFiltrados.length} de {favoritos.length} favoritos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritosFiltrados.map((veiculo) => (
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
                      <div className="flex gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                              <Eye className="h-4 w-4 text-gray-400" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{veiculo.marca} {veiculo.modelo}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <img 
                                src={veiculo.imagemUrl} 
                                alt={`${veiculo.marca} ${veiculo.modelo}`}
                                className="w-full h-64 object-cover rounded-lg"
                              />
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-600">Ano:</span>
                                  <span className="ml-2 font-medium">{veiculo.ano}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Status:</span>
                                  <span className="ml-2 font-medium">{veiculo.statusSinistro}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Localização:</span>
                                  <span className="ml-2 font-medium">{veiculo.localizacao}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Leilão:</span>
                                  <span className="ml-2 font-medium">
                                    {new Date(veiculo.dataLeilao).toLocaleDateString('pt-BR')}
                                  </span>
                                </div>
                              </div>
                              {veiculo.notasPessoais && (
                                <div>
                                  <h4 className="font-medium mb-2">Suas notas:</h4>
                                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                    {veiculo.notasPessoais}
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          onClick={() => removerFavorito(veiculo.id)}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          <span>Favoritado em {new Date(veiculo.dataFavorito).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full"
                      onClick={() => window.open(veiculo.linkOriginal, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ver no {veiculo.leiloeiro}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Dicas */}
        <div className="mt-12 p-6 bg-pink-50 rounded-lg border-l-4 border-pink-400">
          <h3 className="font-semibold text-pink-900 mb-2">Dicas para seus favoritos:</h3>
          <ul className="text-pink-800 space-y-1 text-sm">
            <li>• Configure alertas para ser notificado sobre mudanças nos lances</li>
            <li>• Use a calculadora de investimento para analisar a viabilidade</li>
            <li>• Organize por data do leilão para não perder prazos</li>
            <li>• Adicione notas pessoais para lembrar detalhes importantes</li>
            <li>• Compare veículos similares para tomar melhores decisões</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
