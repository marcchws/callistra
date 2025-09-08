"use client"

import { useState } from "react"
import { Plus, ArrowLeft, Camera, Edit, Pause, Play, Trash2, Eye, MessageCircle, Phone, BarChart3, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import Link from "next/link"

interface AnuncioVeiculo {
  id: string
  titulo: string
  marca: string
  modelo: string
  ano: number
  categoria: string
  preco: number
  descricao: string
  fotos: string[]
  status: 'ativo' | 'pausado' | 'vendido'
  visualizacoes: number
  interessados: number
  dataCriacao: string
  dataExpiracao: string
  contato: {
    nome: string
    telefone: string
    whatsapp: string
  }
}

const mockAnuncios: AnuncioVeiculo[] = [
  {
    id: "1",
    titulo: "Honda Civic 2018 - Impecável",
    marca: "Honda",
    modelo: "Civic",
    ano: 2018,
    categoria: "carros",
    preco: 65000,
    descricao: "Veículo em excelente estado, revisões em dia, único dono. Aceito financiamento.",
    fotos: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    status: "ativo",
    visualizacoes: 47,
    interessados: 3,
    dataCriacao: "2024-09-01",
    dataExpiracao: "2024-10-01",
    contato: {
      nome: "Vítor Lima",
      telefone: "(11) 99999-9999",
      whatsapp: "(11) 99999-9999"
    }
  },
  {
    id: "2",
    titulo: "Ford EcoSport 2016 - Oportunidade",
    marca: "Ford",
    modelo: "EcoSport",
    ano: 2016,
    categoria: "carros",
    preco: 38000,
    descricao: "Carro bem conservado, todas as revisões feitas na concessionária.",
    fotos: ["/api/placeholder/400/300"],
    status: "pausado",
    visualizacoes: 23,
    interessados: 1,
    dataCriacao: "2024-08-25",
    dataExpiracao: "2024-09-25",
    contato: {
      nome: "Vítor Lima",
      telefone: "(11) 99999-9999",
      whatsapp: "(11) 99999-9999"
    }
  }
]

export default function VenderPage() {
  const [anuncios, setAnuncios] = useState<AnuncioVeiculo[]>(mockAnuncios)
  const [novoAnuncio, setNovoAnuncio] = useState({
    titulo: "",
    marca: "",
    modelo: "",
    ano: new Date().getFullYear(),
    categoria: "",
    preco: 0,
    descricao: "",
    contato: {
      nome: "Vítor Lima",
      telefone: "(11) 99999-9999",
      whatsapp: "(11) 99999-9999"
    }
  })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  // Simulação de limites baseados no plano
  const planoAtual = {
    nome: "Premium",
    limiteMensal: 4,
    anunciosUsados: anuncios.filter(a => a.status === 'ativo').length
  }

  const criarAnuncio = (e: React.FormEvent) => {
    e.preventDefault()

    if (planoAtual.anunciosUsados >= planoAtual.limiteMensal) {
      toast.error(`Limite de ${planoAtual.limiteMensal} anúncios mensais atingido`)
      return
    }

    const novoId = (anuncios.length + 1).toString()
    const anuncio: AnuncioVeiculo = {
      id: novoId,
      titulo: novoAnuncio.titulo,
      marca: novoAnuncio.marca,
      modelo: novoAnuncio.modelo,
      ano: novoAnuncio.ano,
      categoria: novoAnuncio.categoria,
      preco: novoAnuncio.preco,
      descricao: novoAnuncio.descricao,
      fotos: ["/api/placeholder/400/300"],
      status: "ativo",
      visualizacoes: 0,
      interessados: 0,
      dataCriacao: new Date().toISOString().split('T')[0],
      dataExpiracao: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      contato: novoAnuncio.contato
    }

    setAnuncios(prev => [anuncio, ...prev])
    setMostrarFormulario(false)
    setNovoAnuncio({
      titulo: "",
      marca: "",
      modelo: "",
      ano: new Date().getFullYear(),
      categoria: "",
      preco: 0,
      descricao: "",
      contato: {
        nome: "Vítor Lima",
        telefone: "(11) 99999-9999",
        whatsapp: "(11) 99999-9999"
      }
    })
    toast.success("Anúncio criado com sucesso!")
  }

  const alterarStatusAnuncio = (id: string, novoStatus: 'ativo' | 'pausado') => {
    setAnuncios(prev => prev.map(a => 
      a.id === id ? { ...a, status: novoStatus } : a
    ))
    toast.success(`Anúncio ${novoStatus === 'ativo' ? 'ativado' : 'pausado'}`)
  }

  const excluirAnuncio = (id: string) => {
    setAnuncios(prev => prev.filter(a => a.id !== id))
    toast.success("Anúncio excluído")
  }

  const calcularEstatisticas = () => {
    const total = anuncios.length
    const ativos = anuncios.filter(a => a.status === 'ativo').length
    const pausados = anuncios.filter(a => a.status === 'pausado').length
    const vendidos = anuncios.filter(a => a.status === 'vendido').length
    const totalVisualizacoes = anuncios.reduce((sum, a) => sum + a.visualizacoes, 0)
    const totalInteressados = anuncios.reduce((sum, a) => sum + a.interessados, 0)

    return { total, ativos, pausados, vendidos, totalVisualizacoes, totalInteressados }
  }

  const stats = calcularEstatisticas()

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Vender seu Veículo
          </h1>
          <p className="text-gray-600 text-lg">Anuncie na comunidade MaxLeilão e alcance milhares de compradores</p>
          <div className="mt-4 p-4 bg-orange-100 rounded-lg border-l-4 border-orange-500">
            <p className="text-orange-800 font-medium">Funcionalidade Fase 2 - Marketplace próprio mencionado pelo Vítor</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Anúncios</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.ativos}</div>
              <div className="text-sm text-gray-600">Ativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pausados}</div>
              <div className="text-sm text-gray-600">Pausados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalVisualizacoes}</div>
              <div className="text-sm text-gray-600">Visualizações</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalInteressados}</div>
              <div className="text-sm text-gray-600">Interessados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-gray-600">
                {planoAtual.anunciosUsados}/{planoAtual.limiteMensal}
              </div>
              <div className="text-sm text-gray-600">Anúncios Mensais</div>
            </CardContent>
          </Card>
        </div>

        {/* Botão Novo Anúncio */}
        <div className="mb-6">
          <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
            <DialogTrigger asChild>
              <Button 
                size="lg" 
                className="flex items-center gap-2"
                disabled={planoAtual.anunciosUsados >= planoAtual.limiteMensal}
              >
                <Plus className="h-4 w-4" />
                Criar Novo Anúncio
                {planoAtual.anunciosUsados >= planoAtual.limiteMensal && " (Limite Atingido)"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Anúncio</DialogTitle>
              </DialogHeader>
              <form onSubmit={criarAnuncio} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="marca">Marca</Label>
                    <Select value={novoAnuncio.marca} onValueChange={(value) => setNovoAnuncio(prev => ({ ...prev, marca: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a marca" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Honda">Honda</SelectItem>
                        <SelectItem value="Toyota">Toyota</SelectItem>
                        <SelectItem value="Ford">Ford</SelectItem>
                        <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                        <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                        <SelectItem value="BMW">BMW</SelectItem>
                        <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="modelo">Modelo</Label>
                    <Input
                      id="modelo"
                      value={novoAnuncio.modelo}
                      onChange={(e) => setNovoAnuncio(prev => ({ ...prev, modelo: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ano">Ano</Label>
                    <Input
                      id="ano"
                      type="number"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      value={novoAnuncio.ano}
                      onChange={(e) => setNovoAnuncio(prev => ({ ...prev, ano: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select value={novoAnuncio.categoria} onValueChange={(value) => setNovoAnuncio(prev => ({ ...prev, categoria: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carros">Carros</SelectItem>
                        <SelectItem value="motos">Motos</SelectItem>
                        <SelectItem value="pesados">Pesados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="titulo">Título do Anúncio</Label>
                  <Input
                    id="titulo"
                    value={novoAnuncio.titulo}
                    onChange={(e) => setNovoAnuncio(prev => ({ ...prev, titulo: e.target.value }))}
                    placeholder="Ex: Honda Civic 2018 - Impecável"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input
                    id="preco"
                    type="number"
                    min="0"
                    value={novoAnuncio.preco || ""}
                    onChange={(e) => setNovoAnuncio(prev => ({ ...prev, preco: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={novoAnuncio.descricao}
                    onChange={(e) => setNovoAnuncio(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descreva as principais características, estado de conservação, etc."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Fotos do Veículo</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Adicione até 10 fotos</p>
                    <p className="text-sm text-gray-500">Anúncios com fotos têm 5x mais visualizações</p>
                    <Button type="button" variant="outline" className="mt-4">
                      Escolher Fotos
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Dados de Contato</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nomeContato">Nome</Label>
                      <Input
                        id="nomeContato"
                        value={novoAnuncio.contato.nome}
                        onChange={(e) => setNovoAnuncio(prev => ({ 
                          ...prev, 
                          contato: { ...prev.contato, nome: e.target.value }
                        }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone/WhatsApp</Label>
                      <Input
                        id="telefone"
                        value={novoAnuncio.contato.telefone}
                        onChange={(e) => setNovoAnuncio(prev => ({ 
                          ...prev, 
                          contato: { ...prev.contato, telefone: e.target.value, whatsapp: e.target.value }
                        }))}
                        placeholder="(11) 99999-9999"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" className="flex-1">
                    Publicar Anúncio
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setMostrarFormulario(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Anúncios */}
        <Tabs defaultValue="todos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="todos">Todos ({anuncios.length})</TabsTrigger>
            <TabsTrigger value="ativo">Ativos ({stats.ativos})</TabsTrigger>
            <TabsTrigger value="pausado">Pausados ({stats.pausados})</TabsTrigger>
            <TabsTrigger value="vendido">Vendidos ({stats.vendidos})</TabsTrigger>
          </TabsList>

          <TabsContent value="todos" className="space-y-4">
            {anuncios.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum anúncio ainda</h3>
                <p className="text-gray-500 mb-6">Crie seu primeiro anúncio e comece a vender!</p>
                <Button onClick={() => setMostrarFormulario(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Anúncio
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {anuncios.map((anuncio) => (
                  <Card key={anuncio.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <img 
                          src={anuncio.fotos[0]} 
                          alt={anuncio.titulo}
                          className="w-32 h-24 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{anuncio.titulo}</h3>
                              <p className="text-gray-600">{anuncio.marca} {anuncio.modelo} • {anuncio.ano}</p>
                            </div>
                            <div className="flex gap-2">
                              <Badge 
                                className={
                                  anuncio.status === 'ativo' ? 'bg-green-500' :
                                  anuncio.status === 'pausado' ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }
                              >
                                {anuncio.status === 'ativo' ? 'Ativo' :
                                 anuncio.status === 'pausado' ? 'Pausado' : 'Vendido'}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{anuncio.visualizacoes} visualizações</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{anuncio.interessados} interessados</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Expira em {new Date(anuncio.dataExpiracao).toLocaleDateString('pt-BR')}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-green-600">
                              R$ {anuncio.preco.toLocaleString('pt-BR')}
                            </div>
                            
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <BarChart3 className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Estatísticas do Anúncio</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="text-center p-4 bg-blue-50 rounded">
                                        <div className="text-2xl font-bold text-blue-600">{anuncio.visualizacoes}</div>
                                        <div className="text-sm text-blue-800">Visualizações</div>
                                      </div>
                                      <div className="text-center p-4 bg-green-50 rounded">
                                        <div className="text-2xl font-bold text-green-600">{anuncio.interessados}</div>
                                        <div className="text-sm text-green-800">Interessados</div>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <h4 className="font-medium">Detalhes do Contato:</h4>
                                      <div className="text-sm space-y-1">
                                        <p><strong>Nome:</strong> {anuncio.contato.nome}</p>
                                        <p><strong>Telefone:</strong> {anuncio.contato.telefone}</p>
                                        <p><strong>WhatsApp:</strong> {anuncio.contato.whatsapp}</p>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              {anuncio.status === 'ativo' ? (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => alterarStatusAnuncio(anuncio.id, 'pausado')}
                                >
                                  <Pause className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => alterarStatusAnuncio(anuncio.id, 'ativo')}
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => excluirAnuncio(anuncio.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="ativo">
            <div className="grid grid-cols-1 gap-6">
              {anuncios.filter(a => a.status === 'ativo').map((anuncio) => (
                <Card key={anuncio.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img 
                        src={anuncio.fotos[0]} 
                        alt={anuncio.titulo}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{anuncio.titulo}</h3>
                        <p className="text-gray-600">{anuncio.marca} {anuncio.modelo} • {anuncio.ano}</p>
                        <div className="text-2xl font-bold text-green-600 mt-2">
                          R$ {anuncio.preco.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pausado">
            <div className="grid grid-cols-1 gap-6">
              {anuncios.filter(a => a.status === 'pausado').map((anuncio) => (
                <Card key={anuncio.id} className="hover:shadow-md transition-shadow opacity-75">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img 
                        src={anuncio.fotos[0]} 
                        alt={anuncio.titulo}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{anuncio.titulo}</h3>
                        <p className="text-gray-600">{anuncio.marca} {anuncio.modelo} • {anuncio.ano}</p>
                        <div className="text-2xl font-bold text-green-600 mt-2">
                          R$ {anuncio.preco.toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vendido">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum veículo vendido ainda</h3>
              <p className="text-gray-500">Quando vender um veículo, ele aparecerá aqui</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Informações do Plano */}
        <div className="mt-12 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-400">
          <h3 className="font-semibold text-orange-900 mb-4">Recursos do Plano {planoAtual.nome}:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-orange-800">Anúncios mensais: {planoAtual.limiteMensal}</p>
              <p className="text-orange-700">Utilizados: {planoAtual.anunciosUsados}</p>
            </div>
            <div>
              <p className="font-medium text-orange-800">Recursos inclusos:</p>
              <ul className="text-orange-700 mt-1">
                <li>• Até 10 fotos por anúncio</li>
                <li>• Estatísticas detalhadas</li>
                <li>• Contato direto por WhatsApp</li>
                <li>• Renovação automática (30 dias)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
