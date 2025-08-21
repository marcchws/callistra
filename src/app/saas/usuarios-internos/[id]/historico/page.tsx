"use client"

// Página de Histórico Completo do Usuário
// Atende ao requisito de visualizar histórico de alterações

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { UserHistory } from "@/components/usuarios-internos/user-history"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, History, Download, Filter } from "lucide-react"
import { 
  UsuarioInterno, 
  HistoricoAlteracao,
  STATUS_LABELS 
} from "@/lib/usuarios-internos/types"
import { mockUsuarios, buscarHistorico } from "@/lib/usuarios-internos/mock-data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"

export default function HistoricoUsuarioPage() {
  const params = useParams()
  const router = useRouter()
  const [usuario, setUsuario] = useState<UsuarioInterno | null>(null)
  const [historicoCompleto, setHistoricoCompleto] = useState<HistoricoAlteracao[]>([])
  const [historicoFiltrado, setHistoricoFiltrado] = useState<HistoricoAlteracao[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroAcao, setFiltroAcao] = useState("todas")

  useEffect(() => {
    // Buscar dados do usuário e histórico
    const user = mockUsuarios.find(u => u.id === params.id)
    if (user) {
      setUsuario(user)
      const hist = buscarHistorico(user.id)
      setHistoricoCompleto(hist)
      setHistoricoFiltrado(hist)
    }
    setLoading(false)
  }, [params.id])

  const handleFiltroAcao = (acao: string) => {
    setFiltroAcao(acao)
    if (acao === "todas") {
      setHistoricoFiltrado(historicoCompleto)
    } else {
      setHistoricoFiltrado(
        historicoCompleto.filter(h => h.acao === acao)
      )
    }
  }

  const exportarHistorico = () => {
    // Simular exportação
    const dataStr = JSON.stringify(historicoFiltrado, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `historico-${usuario?.nome.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando histórico...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Usuário não encontrado</h2>
            <p className="text-muted-foreground mt-2">O usuário solicitado não existe.</p>
            <Button 
              className="mt-4"
              onClick={() => router.push('/saas/usuarios-internos')}
            >
              Voltar para a lista
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header com navegação */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/saas/usuarios-internos/${usuario.id}`)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                    <History className="h-6 w-6" />
                    Histórico de Alterações
                  </h1>
                  <p className="text-muted-foreground">
                    Auditoria completa de todas as alterações do usuário
                  </p>
                </div>
              </div>
              <Button 
                variant="outline"
                className="gap-2"
                onClick={exportarHistorico}
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>

            {/* Card de informações do usuário */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={usuario.fotoPerfil} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getInitials(usuario.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{usuario.nome}</h3>
                    <p className="text-sm text-muted-foreground">{usuario.cargo}</p>
                  </div>
                  <Badge 
                    variant={usuario.status === 'ativo' ? 'default' : 'secondary'}
                    className={usuario.status === 'ativo' ? 'bg-green-100 text-green-700' : ''}
                  >
                    {STATUS_LABELS[usuario.status]}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Select value={filtroAcao} onValueChange={handleFiltroAcao}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Tipo de ação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas as ações</SelectItem>
                      <SelectItem value="criacao">Criação</SelectItem>
                      <SelectItem value="edicao">Edição</SelectItem>
                      <SelectItem value="ativacao">Ativação</SelectItem>
                      <SelectItem value="desativacao">Desativação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="mt-3 text-sm text-muted-foreground">
                  {historicoFiltrado.length} {historicoFiltrado.length === 1 ? 'registro' : 'registros'} encontrado{historicoFiltrado.length !== 1 ? 's' : ''}
                </div>
              </CardContent>
            </Card>

            {/* Histórico */}
            <UserHistory 
              historico={historicoFiltrado} 
              nomeUsuario={usuario.nome}
            />
          </div>
        </div>
      </main>
    </div>
  )
}