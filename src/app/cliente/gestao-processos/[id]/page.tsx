"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { ProcessoHistory } from "@/app/cliente/gestao-processos/components/processo-history"
import { useProcessos } from "@/app/cliente/gestao-processos/hooks/use-processos"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Shield, 
  ShieldOff, 
  ExternalLink,
  Calendar,
  DollarSign,
  User,
  FileText,
  Briefcase,
  Building,
  Scale
} from "lucide-react"
import { 
  Processo,
  HistoricoAlteracao,
  QualificacaoLabels,
  InstanciaLabels,
  NivelAcessoLabels,
  TribunalLabels,
  HonorariosLabels
} from "@/app/cliente/gestao-processos/types"
import { ProcessoDeleteDialog } from "@/app/cliente/gestao-processos/components/processo-delete-dialog"

export default function ProcessoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getProcesso, getHistorico, deleteProcesso, updateProcesso, addHistorico, checkPermissao } = useProcessos()
  
  const [processo, setProcesso] = useState<Processo | null>(null)
  const [historico, setHistorico] = useState<HistoricoAlteracao[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [hasPermission, setHasPermission] = useState(true)

  useEffect(() => {
    loadProcesso()
  }, [params.id])

  const loadProcesso = async () => {
    setLoading(true)
    
    const processoData = getProcesso(params.id as string)
    
    if (processoData) {
      setProcesso(processoData)
      
      // Verificar permissão
      const permission = checkPermissao(processoData)
      setHasPermission(permission)
      
      if (permission) {
        // Carregar histórico
        const historicoResult = await getHistorico(params.id as string)
        if (historicoResult.success && historicoResult.data) {
          setHistorico(historicoResult.data)
        }
        
        // Registrar visualização
        await addHistorico({
          processoId: params.id as string,
          acao: "visualizacao",
          usuario: "user@escritorio.com",
          detalhes: "Processo visualizado"
        })
      }
    }
    
    setLoading(false)
  }

  const handleDelete = async () => {
    const result = await deleteProcesso(params.id as string)
    
    if (result.success) {
      toast.success("Processo excluído com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
      router.push("/cliente/gestao-processos")
    } else {
      toast.error(result.error || "Erro ao excluir processo", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }

  const handleToggleAccess = async () => {
    if (!processo) return
    
    const newAccess = processo.acesso === "privado" ? "publico" : "privado"
    const result = await updateProcesso(params.id as string, { acesso: newAccess as any })
    
    if (result.success) {
      setProcesso(prev => prev ? { ...prev, acesso: newAccess as any } : null)
      
      const accessLabel = newAccess === "privado" ? "privado" : "público"
      toast.success(`Processo alterado para ${accessLabel} com sucesso!`, {
        duration: 2000,
        position: "bottom-right"
      })
      
      await addHistorico({
        processoId: params.id as string,
        acao: "alteracao_acesso",
        usuario: "user@escritorio.com",
        detalhes: `Nível de acesso alterado para ${accessLabel}`,
        camposAlterados: [
          {
            campo: "acesso",
            valorAnterior: processo.acesso,
            valorNovo: newAccess
          }
        ]
      })
      
      // Recarregar histórico
      loadProcesso()
    } else {
      toast.error(result.error || "Erro ao alterar acesso", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return "-"
    try {
      return new Date(date).toLocaleDateString("pt-BR")
    } catch {
      return date
    }
  }

  const formatDateTime = (dateTime: string | undefined) => {
    if (!dateTime) return "-"
    try {
      const date = new Date(dateTime)
      return `${date.toLocaleDateString("pt-BR")} às ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`
    } catch {
      return dateTime
    }
  }

  const getAccessBadgeVariant = (access: string) => {
    switch (access) {
      case "publico":
        return "secondary"
      case "privado":
        return "destructive"
      case "envolvidos":
        return "outline"
      default:
        return "default"
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="container py-6">
            <div className="text-center py-8">Carregando processo...</div>
          </div>
        </main>
      </div>
    )
  }

  if (!processo) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="container py-6">
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground mb-4">Processo não encontrado</p>
              <Button onClick={() => router.push("/cliente/gestao-processos")}>
                Voltar para a lista
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!hasPermission) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto lg:ml-64">
          <div className="container py-6">
            <Card className="max-w-md mx-auto mt-8">
              <CardHeader>
                <div className="flex items-center gap-2 text-red-600">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Acesso Restrito</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Você não tem permissão para visualizar este processo.
                </p>
                <p className="text-sm">
                  Este processo é {processo.acesso === "privado" ? "privado" : "restrito aos envolvidos"}.
                </p>
                <Button onClick={() => router.push("/cliente/gestao-processos")} className="w-full">
                  Voltar para a lista
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header com Ações */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/cliente/gestao-processos")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {processo.titulo || processo.acao || `Processo ${processo.pasta}`}
                  </h1>
                  <p className="text-muted-foreground">
                    {processo.numero || "Sem número de processo"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleAccess}
                >
                  {processo.acesso === "privado" ? (
                    <>
                      <ShieldOff className="h-4 w-4 mr-2" />
                      Tornar Público
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Tornar Privado
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/cliente/gestao-processos/${params.id}/editar`)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>

            {/* Tabs com Informações */}
            <Tabs defaultValue="informacoes" className="space-y-6">
              <TabsList>
                <TabsTrigger value="informacoes">Informações</TabsTrigger>
                <TabsTrigger value="partes">Partes</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>

              {/* Tab: Informações Gerais */}
              <TabsContent value="informacoes" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Card: Identificação */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Identificação</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Pasta</p>
                          <p className="font-medium">{processo.pasta}</p>
                        </div>
                      </div>
                      
                      {processo.titulo && (
                        <div>
                          <p className="text-sm text-muted-foreground">Título</p>
                          <p className="font-medium">{processo.titulo}</p>
                        </div>
                      )}
                      
                      {processo.numero && (
                        <div>
                          <p className="text-sm text-muted-foreground">Número CNJ</p>
                          <p className="font-mono text-sm">{processo.numero}</p>
                        </div>
                      )}
                      
                      {processo.acao && (
                        <div>
                          <p className="text-sm text-muted-foreground">Tipo de Ação</p>
                          <p className="font-medium">{processo.acao}</p>
                        </div>
                      )}
                      
                      {processo.instancia && (
                        <div>
                          <p className="text-sm text-muted-foreground">Instância</p>
                          <Badge variant="outline">
                            {InstanciaLabels[processo.instancia]}
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Card: Jurisdição */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Jurisdição</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {processo.tribunal && (
                        <div>
                          <p className="text-sm text-muted-foreground">Tribunal</p>
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">
                              {TribunalLabels[processo.tribunal]}
                            </p>
                            {processo.linkTribunal && (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                              >
                                <a href={processo.linkTribunal} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {processo.juizo && (
                        <div className="flex items-center gap-2">
                          <Scale className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Juízo</p>
                            <p className="font-medium">{processo.juizo}</p>
                          </div>
                        </div>
                      )}
                      
                      {processo.vara && (
                        <div>
                          <p className="text-sm text-muted-foreground">Vara</p>
                          <p className="font-medium">{processo.vara}</p>
                        </div>
                      )}
                      
                      {processo.foro && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Foro/Comarca</p>
                            <p className="font-medium">{processo.foro}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Card: Detalhes */}
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Detalhes do Processo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {processo.objeto && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Objeto</p>
                          <p className="text-sm leading-relaxed">{processo.objeto}</p>
                        </div>
                      )}
                      
                      {processo.observacoes && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Observações</p>
                          <p className="text-sm leading-relaxed">{processo.observacoes}</p>
                        </div>
                      )}
                      
                      <div className="grid gap-3 md:grid-cols-3 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Distribuído em</p>
                            <p className="font-medium">{formatDate(processo.distribuidoEm)}</p>
                          </div>
                        </div>
                        
                        {processo.dataModificacao && (
                          <div>
                            <p className="text-sm text-muted-foreground">Última Modificação</p>
                            <p className="font-medium">{formatDate(processo.dataModificacao)}</p>
                          </div>
                        )}
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Nível de Acesso</p>
                          <Badge variant={getAccessBadgeVariant(processo.acesso)}>
                            {NivelAcessoLabels[processo.acesso]}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab: Partes Envolvidas */}
              <TabsContent value="partes" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Card: Cliente */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Cliente Principal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="space-y-2 flex-1">
                          <div>
                            <p className="font-medium">{processo.nomeCliente}</p>
                            <Badge variant="outline" className="mt-1">
                              {QualificacaoLabels[processo.qualificacaoCliente]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card: Outros Envolvidos */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Outros Envolvidos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div className="space-y-2 flex-1">
                          <div>
                            <p className="font-medium">{processo.outrosEnvolvidos}</p>
                            <Badge variant="outline" className="mt-1">
                              {QualificacaoLabels[processo.qualificacaoOutros]}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card: Responsabilidade */}
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Responsabilidade</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Advogado Responsável</p>
                          <p className="font-medium">{processo.responsavel}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab: Financeiro */}
              <TabsContent value="financeiro" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Card: Valores */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Valores do Processo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Valor da Causa</p>
                          <p className="font-medium text-lg">{processo.valorCausa || "Não informado"}</p>
                        </div>
                      </div>
                      
                      {processo.valorCondenacao && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Valor da Condenação</p>
                            <p className="font-medium text-lg">{processo.valorCondenacao}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Card: Honorários */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Honorários</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {processo.honorarios && processo.honorarios.length > 0 ? (
                        <div className="space-y-2">
                          {processo.honorarios.map((honorario) => (
                            <Badge key={honorario} variant="secondary">
                              {HonorariosLabels[honorario]}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nenhum tipo de honorário definido</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tab: Histórico */}
              <TabsContent value="historico" className="space-y-6">
                <ProcessoHistory historico={historico} loading={loading} />
              </TabsContent>
            </Tabs>

            {/* Card: Metadados */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Criado em</p>
                    <p>{formatDateTime(processo.criadoEm)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Criado por</p>
                    <p>{processo.criadoPor || "-"}</p>
                  </div>
                  {processo.atualizadoEm && (
                    <>
                      <div>
                        <p className="text-muted-foreground">Última atualização</p>
                        <p>{formatDateTime(processo.atualizadoEm)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Atualizado por</p>
                        <p>{processo.atualizadoPor || "-"}</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialog de Exclusão */}
      <ProcessoDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        processoTitle={processo.titulo || processo.pasta}
      />
    </div>
  )
}