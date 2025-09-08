"use client"

import { useState, useEffect } from "react"
import { Bell, ArrowLeft, Plus, Edit, Trash2, MessageCircle, Mail, Smartphone, Settings, Clock, Target, TrendingUp, TrendingDown, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import Link from "next/link"

interface Alerta {
  id: string
  nome: string
  tipo: 'novo_leilao' | 'mudanca_preco' | 'prazo_final' | 'favorito_ativo' | 'oportunidade'
  condicoes: {
    marca?: string
    categoria?: string
    precoMin?: number
    precoMax?: number
    localizacao?: string
    horasAntes?: number
  }
  canais: {
    whatsapp: boolean
    email: boolean
    push: boolean
  }
  ativo: boolean
  dataCriacao: string
  ultimaExecucao?: string
  totalEnvios: number
}

interface HistoricoNotificacao {
  id: string
  alertaId: string
  tipo: string
  titulo: string
  mensagem: string
  canal: 'whatsapp' | 'email' | 'push'
  dataEnvio: string
  status: 'enviado' | 'falha' | 'pendente'
  veiculoInfo?: {
    marca: string
    modelo: string
    preco: number
    leiloeiro: string
  }
}

const mockAlertas: Alerta[] = [
  {
    id: "1",
    nome: "Honda Civic até R$ 50k",
    tipo: "novo_leilao",
    condicoes: {
      marca: "Honda",
      precoMax: 50000
    },
    canais: {
      whatsapp: true,
      email: true,
      push: false
    },
    ativo: true,
    dataCriacao: "2024-09-01",
    ultimaExecucao: "2024-09-10",
    totalEnvios: 8
  },
  {
    id: "2", 
    nome: "Carros em SP - Oportunidades",
    tipo: "oportunidade",
    condicoes: {
      categoria: "carros",
      localizacao: "São Paulo",
      precoMax: 30000
    },
    canais: {
      whatsapp: true,
      email: false,
      push: true
    },
    ativo: true,
    dataCriacao: "2024-08-25",
    ultimaExecucao: "2024-09-09",
    totalEnvios: 15
  },
  {
    id: "3",
    nome: "Favoritos - Prazo Final",
    tipo: "prazo_final",
    condicoes: {
      horasAntes: 24
    },
    canais: {
      whatsapp: true,
      email: true,
      push: true
    },
    ativo: false,
    dataCriacao: "2024-09-05",
    totalEnvios: 3
  }
]

const mockHistorico: HistoricoNotificacao[] = [
  {
    id: "1",
    alertaId: "1",
    tipo: "novo_leilao",
    titulo: "Novo Honda Civic encontrado!",
    mensagem: "Honda Civic 2019 por R$ 45.000 na Freitas Leilões",
    canal: "whatsapp",
    dataEnvio: "2024-09-10 14:30",
    status: "enviado",
    veiculoInfo: {
      marca: "Honda",
      modelo: "Civic",
      preco: 45000,
      leiloeiro: "Freitas Leilões"
    }
  },
  {
    id: "2",
    alertaId: "2",
    tipo: "oportunidade",
    titulo: "Oportunidade em São Paulo",
    mensagem: "Ford EcoSport 2017 por R$ 28.000 - 15% abaixo da média",
    canal: "push",
    dataEnvio: "2024-09-09 09:15",
    status: "enviado",
    veiculoInfo: {
      marca: "Ford",
      modelo: "EcoSport",
      preco: 28000,
      leiloeiro: "Porto Seguro"
    }
  },
  {
    id: "3",
    alertaId: "1",
    tipo: "novo_leilao",
    titulo: "Honda encontrado",
    mensagem: "Honda Fit 2018 por R$ 35.000",
    canal: "email",
    dataEnvio: "2024-09-08 16:45",
    status: "falha"
  }
]

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>(mockAlertas)
  const [historico] = useState<HistoricoNotificacao[]>(mockHistorico)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [novoAlerta, setNovoAlerta] = useState<Partial<Alerta>>({
    nome: "",
    tipo: "novo_leilao",
    condicoes: {},
    canais: {
      whatsapp: true,
      email: false,
      push: false
    },
    ativo: true
  })

  // Simulação de notificações em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        const tiposNotificacao = [
          "Novo Honda encontrado!",
          "Oportunidade: preço reduzido",
          "Leilão termina em 2 horas",
          "Favorito teve lance atualizado"
        ]
        
        const tipo = tiposNotificacao[Math.floor(Math.random() * tiposNotificacao.length)]
        toast.info(`💬 ${tipo}`, {
          description: "Clique aqui para ver detalhes"
        })
      }
    }, 15000) // A cada 15 segundos

    return () => clearInterval(interval)
  }, [])

  const criarAlerta = () => {
    if (!novoAlerta.nome?.trim()) {
      toast.error("Digite um nome para o alerta")
      return
    }

    const alerta: Alerta = {
      id: (alertas.length + 1).toString(),
      nome: novoAlerta.nome!,
      tipo: novoAlerta.tipo!,
      condicoes: novoAlerta.condicoes!,
      canais: novoAlerta.canais!,
      ativo: novoAlerta.ativo!,
      dataCriacao: new Date().toISOString().split('T')[0],
      totalEnvios: 0
    }

    setAlertas(prev => [alerta, ...prev])
    setMostrarFormulario(false)
    setNovoAlerta({
      nome: "",
      tipo: "novo_leilao",
      condicoes: {},
      canais: {
        whatsapp: true,
        email: false,
        push: false
      },
      ativo: true
    })
    toast.success("Alerta criado com sucesso!")
  }

  const toggleAlerta = (id: string) => {
    setAlertas(prev => prev.map(a => 
      a.id === id ? { ...a, ativo: !a.ativo } : a
    ))
    toast.success("Status do alerta alterado")
  }

  const excluirAlerta = (id: string) => {
    setAlertas(prev => prev.filter(a => a.id !== id))
    toast.success("Alerta removido")
  }

  const calcularEstatisticas = () => {
    const totalAlertas = alertas.length
    const alertasAtivos = alertas.filter(a => a.ativo).length
    const totalNotificacoes = alertas.reduce((sum, a) => sum + a.totalEnvios, 0)
    const notificacoesHoje = historico.filter(h => 
      h.dataEnvio.startsWith(new Date().toISOString().split('T')[0])
    ).length

    return { totalAlertas, alertasAtivos, totalNotificacoes, notificacoesHoje }
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'novo_leilao': return <Target className="h-4 w-4" />
      case 'mudanca_preco': return <TrendingDown className="h-4 w-4" />
      case 'prazo_final': return <Clock className="h-4 w-4" />
      case 'favorito_ativo': return <Bell className="h-4 w-4" />
      case 'oportunidade': return <TrendingUp className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'novo_leilao': return 'Novo Leilão'
      case 'mudanca_preco': return 'Mudança de Preço'
      case 'prazo_final': return 'Prazo Final'
      case 'favorito_ativo': return 'Favorito Ativo'
      case 'oportunidade': return 'Oportunidade'
      default: return tipo
    }
  }

  const getCanalIcon = (canal: string) => {
    switch (canal) {
      case 'whatsapp': return <MessageCircle className="h-4 w-4 text-green-500" />
      case 'email': return <Mail className="h-4 w-4 text-blue-500" />
      case 'push': return <Smartphone className="h-4 w-4 text-purple-500" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const stats = calcularEstatisticas()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
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
            <Bell className="h-10 w-10 text-blue-600" />
            Sistema de Alertas
          </h1>
          <p className="text-gray-600 text-lg">Configure notificações inteligentes e nunca perca uma oportunidade</p>
          <div className="mt-4 p-4 bg-blue-100 rounded-lg border-l-4 border-blue-500">
            <p className="text-blue-800 font-medium">Funcionalidade com MessageCircle mencionada pelo Vítor na reunião</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalAlertas}</div>
              <div className="text-sm text-gray-600">Total de Alertas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.alertasAtivos}</div>
              <div className="text-sm text-gray-600">Alertas Ativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalNotificacoes}</div>
              <div className="text-sm text-gray-600">Total Enviadas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.notificacoesHoje}</div>
              <div className="text-sm text-gray-600">Hoje</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principais */}
        <Tabs defaultValue="alertas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="alertas">Meus Alertas</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
          </TabsList>

          {/* Tab Alertas */}
          <TabsContent value="alertas" className="space-y-6">
            {/* Botão Criar Alerta */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Alertas Configurados</h2>
              <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Alerta
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Alerta</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="nome">Nome do Alerta</Label>
                      <Input
                        id="nome"
                        value={novoAlerta.nome}
                        onChange={(e) => setNovoAlerta(prev => ({ ...prev, nome: e.target.value }))}
                        placeholder="Ex: Honda Civic até R$ 50k"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tipo">Tipo de Alerta</Label>
                      <Select 
                        value={novoAlerta.tipo} 
                        onValueChange={(value) => setNovoAlerta(prev => ({ ...prev, tipo: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="novo_leilao">Novo Leilão</SelectItem>
                          <SelectItem value="mudanca_preco">Mudança de Preço</SelectItem>
                          <SelectItem value="prazo_final">Prazo Final</SelectItem>
                          <SelectItem value="favorito_ativo">Favorito Ativo</SelectItem>
                          <SelectItem value="oportunidade">Oportunidade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Marca (opcional)</Label>
                        <Select 
                          value={novoAlerta.condicoes?.marca || ""} 
                          onValueChange={(value) => setNovoAlerta(prev => ({ 
                            ...prev, 
                            condicoes: { ...prev.condicoes, marca: value || undefined }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Qualquer marca" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Qualquer marca</SelectItem>
                            <SelectItem value="Honda">Honda</SelectItem>
                            <SelectItem value="Toyota">Toyota</SelectItem>
                            <SelectItem value="Ford">Ford</SelectItem>
                            <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Select 
                          value={novoAlerta.condicoes?.categoria || ""} 
                          onValueChange={(value) => setNovoAlerta(prev => ({ 
                            ...prev, 
                            condicoes: { ...prev.condicoes, categoria: value || undefined }
                          }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Qualquer categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Qualquer categoria</SelectItem>
                            <SelectItem value="carros">Carros</SelectItem>
                            <SelectItem value="motos">Motos</SelectItem>
                            <SelectItem value="pesados">Pesados</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Preço Mínimo (R$)</Label>
                        <Input
                          type="number"
                          value={novoAlerta.condicoes?.precoMin || ""}
                          onChange={(e) => setNovoAlerta(prev => ({ 
                            ...prev, 
                            condicoes: { ...prev.condicoes, precoMin: parseFloat(e.target.value) || undefined }
                          }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <Label>Preço Máximo (R$)</Label>
                        <Input
                          type="number"
                          value={novoAlerta.condicoes?.precoMax || ""}
                          onChange={(e) => setNovoAlerta(prev => ({ 
                            ...prev, 
                            condicoes: { ...prev.condicoes, precoMax: parseFloat(e.target.value) || undefined }
                          }))}
                          placeholder="Sem limite"
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Canais de Notificação</Label>
                      <div className="space-y-3 mt-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-green-500" />
                            <span>MessageCircle</span>
                            <Badge className="bg-green-500 text-white text-xs">Recomendado</Badge>
                          </div>
                          <Switch
                            checked={novoAlerta.canais?.whatsapp}
                            onCheckedChange={(checked) => setNovoAlerta(prev => ({
                              ...prev,
                              canais: { ...prev.canais!, whatsapp: checked }
                            }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-blue-500" />
                            <span>E-mail</span>
                          </div>
                          <Switch
                            checked={novoAlerta.canais?.email}
                            onCheckedChange={(checked) => setNovoAlerta(prev => ({
                              ...prev,
                              canais: { ...prev.canais!, email: checked }
                            }))}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4 text-purple-500" />
                            <span>Push (App)</span>
                          </div>
                          <Switch
                            checked={novoAlerta.canais?.push}
                            onCheckedChange={(checked) => setNovoAlerta(prev => ({
                              ...prev,
                              canais: { ...prev.canais!, push: checked }
                            }))}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button onClick={criarAlerta} className="flex-1">
                        Criar Alerta
                      </Button>
                      <Button variant="outline" onClick={() => setMostrarFormulario(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Lista de Alertas */}
            {alertas.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum alerta configurado</h3>
                <p className="text-gray-500 mb-6">Crie alertas personalizados para não perder oportunidades</p>
                <Button onClick={() => setMostrarFormulario(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Alerta
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {alertas.map((alerta) => (
                  <Card key={alerta.id} className={`hover:shadow-md transition-shadow ${!alerta.ativo ? 'opacity-60' : ''}`}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getTipoIcon(alerta.tipo)}
                            <h3 className="text-lg font-semibold">{alerta.nome}</h3>
                            <Badge className={alerta.ativo ? "bg-green-500" : "bg-gray-500"}>
                              {alerta.ativo ? "Ativo" : "Pausado"}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{getTipoLabel(alerta.tipo)}</p>
                          
                          <div className="space-y-2 text-sm">
                            {alerta.condicoes.marca && (
                              <div>Marca: <span className="font-medium">{alerta.condicoes.marca}</span></div>
                            )}
                            {alerta.condicoes.categoria && (
                              <div>Categoria: <span className="font-medium">{alerta.condicoes.categoria}</span></div>
                            )}
                            {(alerta.condicoes.precoMin || alerta.condicoes.precoMax) && (
                              <div>
                                Preço: 
                                <span className="font-medium ml-1">
                                  {alerta.condicoes.precoMin ? `R$ ${alerta.condicoes.precoMin.toLocaleString()}` : "R$ 0"} - 
                                  {alerta.condicoes.precoMax ? ` R$ ${alerta.condicoes.precoMax.toLocaleString()}` : " Sem limite"}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span>{alerta.totalEnvios} notificações enviadas</span>
                            </div>
                            {alerta.ultimaExecucao && (
                              <div>
                                Última: {new Date(alerta.ultimaExecucao).toLocaleDateString('pt-BR')}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-sm text-gray-600">Canais:</span>
                            {alerta.canais.whatsapp && getCanalIcon('whatsapp')}
                            {alerta.canais.email && getCanalIcon('email')}
                            {alerta.canais.push && getCanalIcon('push')}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleAlerta(alerta.id)}
                          >
                            {alerta.ativo ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => excluirAlerta(alerta.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Tab Histórico */}
          <TabsContent value="historico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Notificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {historico.map((notificacao) => (
                    <div key={notificacao.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="mt-1">
                        {getCanalIcon(notificacao.canal)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{notificacao.titulo}</h4>
                          <Badge className={
                            notificacao.status === 'enviado' ? 'bg-green-500' :
                            notificacao.status === 'falha' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }>
                            {notificacao.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notificacao.mensagem}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{notificacao.dataEnvio}</span>
                          <span className="capitalize">{notificacao.canal}</span>
                          {notificacao.veiculoInfo && (
                            <span>
                              {notificacao.veiculoInfo.marca} {notificacao.veiculoInfo.modelo} - 
                              R$ {notificacao.veiculoInfo.preco.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Configurações */}
          <TabsContent value="configuracoes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    MessageCircle
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notificações MessageCircle</div>
                      <div className="text-sm text-gray-600">Receba alertas instantâneos</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div>
                    <Label>Número do MessageCircle</Label>
                    <Input placeholder="(11) 99999-9999" defaultValue="(11) 99999-9999" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Horário silencioso</div>
                      <div className="text-sm text-gray-600">22h às 8h (sem notificações)</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-500" />
                    E-mail
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Notificações por e-mail</div>
                      <div className="text-sm text-gray-600">Resumos e alertas importantes</div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div>
                    <Label>Frequência de resumos</Label>
                    <Select defaultValue="diario">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instantaneo">Instantâneo</SelectItem>
                        <SelectItem value="diario">Diário (9h)</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="nunca">Nunca</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configurações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Alertas inteligentes</div>
                    <div className="text-sm text-gray-600">IA sugere oportunidades baseadas no seu perfil</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Alertas de sistema</div>
                    <div className="text-sm text-gray-600">Manutenções, falhas de scraping, etc.</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div>
                  <Label>Limite diário de notificações</Label>
                  <Select defaultValue="20">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 notificações</SelectItem>
                      <SelectItem value="10">10 notificações</SelectItem>
                      <SelectItem value="20">20 notificações</SelectItem>
                      <SelectItem value="ilimitado">Ilimitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Informações sobre MessageCircle */}
        <div className="mt-12 p-6 bg-green-50 rounded-lg border-l-4 border-green-400">
          <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            MessageCircle Business Integration:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-green-800">Funcionalidades Disponíveis:</p>
              <ul className="text-green-700 mt-1 space-y-1">
                <li>• Notificações instantâneas de novos leilões</li>
                <li>• Alertas de mudança de preço em favoritos</li>
                <li>• Lembretes de prazo final (24h, 2h, 30min)</li>
                <li>• Oportunidades personalizadas por IA</li>
                <li>• Status de pagamento e renovação</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-800">Como mencionado pelo Vítor:</p>
              <ul className="text-green-700 mt-1 space-y-1">
                <li>• Integração com ComBook para disparos</li>
                <li>• Suspensão automática quando não paga</li>
                <li>• Notificações de cobrança</li>
                <li>• Suporte via MessageCircle</li>
                <li>• Confirmações de pagamento</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
