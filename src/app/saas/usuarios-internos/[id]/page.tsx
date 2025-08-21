"use client"

// Página de Visualização de Detalhes do Usuário
// Exibe todas as informações do usuário

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { UserHistory } from "@/components/usuarios-internos/user-history"
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  Building,
  DollarSign,
  FileText,
  Shield,
  User,
  Calendar,
  Power
} from "lucide-react"
import { 
  UsuarioInterno, 
  STATUS_LABELS,
  PERFIS_ACESSO,
  TIPOS_DOCUMENTO 
} from "@/lib/usuarios-internos/types"
import { mockUsuarios, buscarHistorico } from "@/lib/usuarios-internos/mock-data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function UsuarioDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const [usuario, setUsuario] = useState<UsuarioInterno | null>(null)
  const [historico, setHistorico] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Buscar dados do usuário
    const user = mockUsuarios.find(u => u.id === params.id)
    if (user) {
      setUsuario(user)
      const hist = buscarHistorico(user.id)
      setHistorico(hist)
    }
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando...</p>
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

  const getPerfilNome = (perfilId: string) => {
    const perfil = PERFIS_ACESSO.find(p => p.id === perfilId)
    return perfil?.nome || 'Sem perfil'
  }

  const getPerfilDescricao = (perfilId: string) => {
    const perfil = PERFIS_ACESSO.find(p => p.id === perfilId)
    return perfil?.descricao || ''
  }

  const getPerfilPermissoes = (perfilId: string) => {
    const perfil = PERFIS_ACESSO.find(p => p.id === perfilId)
    return perfil?.permissoes || []
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
                  onClick={() => router.push('/saas/usuarios-internos')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Detalhes do Usuário
                  </h1>
                  <p className="text-muted-foreground">
                    Visualize todas as informações do usuário
                  </p>
                </div>
              </div>
              <Button 
                className="gap-2"
                onClick={() => router.push(`/saas/usuarios-internos/${usuario.id}/editar`)}
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </div>

            {/* Card de informações principais */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={usuario.fotoPerfil} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                      {getInitials(usuario.nome)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-semibold">{usuario.nome}</h2>
                      <p className="text-muted-foreground">{usuario.cargo}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge 
                        variant={usuario.status === 'ativo' ? 'default' : 'secondary'}
                        className={usuario.status === 'ativo' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {STATUS_LABELS[usuario.status]}
                      </Badge>
                      <Badge variant="outline">
                        {getPerfilNome(usuario.perfilAcesso)}
                      </Badge>
                    </div>
                    
                    <div className="grid gap-2 md:grid-cols-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{usuario.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{usuario.telefone}</span>
                      </div>
                      {usuario.criadoEm && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Desde {format(new Date(usuario.criadoEm), "MMMM 'de' yyyy", { locale: ptBR })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs com informações detalhadas */}
            <Tabs defaultValue="perfil" className="space-y-4">
              <TabsList>
                <TabsTrigger value="perfil">
                  <Shield className="mr-2 h-4 w-4" />
                  Perfil de Acesso
                </TabsTrigger>
                <TabsTrigger value="financeiro">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Dados Financeiros
                </TabsTrigger>
                <TabsTrigger value="documentos">
                  <FileText className="mr-2 h-4 w-4" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="historico">
                  <Calendar className="mr-2 h-4 w-4" />
                  Histórico
                </TabsTrigger>
              </TabsList>

              <TabsContent value="perfil">
                <Card>
                  <CardHeader>
                    <CardTitle>Perfil de Acesso</CardTitle>
                    <CardDescription>
                      {getPerfilDescricao(usuario.perfilAcesso)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Permissões do perfil:</h4>
                        <div className="flex flex-wrap gap-2">
                          {getPerfilPermissoes(usuario.perfilAcesso).map((perm) => (
                            <Badge key={perm} variant="secondary">
                              {perm.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {usuario.observacao && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Observações:</h4>
                          <p className="text-sm text-muted-foreground">
                            {usuario.observacao}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financeiro">
                <Card>
                  <CardHeader>
                    <CardTitle>Dados Financeiros</CardTitle>
                    <CardDescription>
                      Informações bancárias e de pagamento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {usuario.salario && (
                        <div>
                          <p className="text-sm font-medium">Salário</p>
                          <p className="text-lg">
                            R$ {usuario.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      )}
                      
                      {usuario.banco && (
                        <div>
                          <p className="text-sm font-medium">Banco</p>
                          <p className="text-lg">{usuario.banco}</p>
                        </div>
                      )}
                      
                      {usuario.agencia && (
                        <div>
                          <p className="text-sm font-medium">Agência</p>
                          <p className="text-lg">{usuario.agencia}</p>
                        </div>
                      )}
                      
                      {usuario.contaCorrente && (
                        <div>
                          <p className="text-sm font-medium">Conta Corrente</p>
                          <p className="text-lg">{usuario.contaCorrente}</p>
                        </div>
                      )}
                      
                      {usuario.chavePix && (
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium">Chave PIX</p>
                          <p className="text-lg">{usuario.chavePix}</p>
                        </div>
                      )}
                    </div>
                    
                    {!usuario.salario && !usuario.banco && !usuario.agencia && 
                     !usuario.contaCorrente && !usuario.chavePix && (
                      <p className="text-muted-foreground text-center py-4">
                        Nenhuma informação financeira cadastrada
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentos">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentos Anexados</CardTitle>
                    <CardDescription>
                      Arquivos e documentos do usuário
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {usuario.documentosAnexos && usuario.documentosAnexos.length > 0 ? (
                      <div className="space-y-3">
                        {usuario.documentosAnexos.map((doc) => (
                          <div 
                            key={doc.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{doc.nome}</p>
                                <p className="text-sm text-muted-foreground">
                                  {TIPOS_DOCUMENTO[doc.tipo as keyof typeof TIPOS_DOCUMENTO]} • 
                                  {' '}
                                  {(doc.tamanho / 1024 / 1024).toFixed(2)} MB •
                                  {' '}
                                  Enviado em {format(new Date(doc.uploadEm), "dd/MM/yyyy", { locale: ptBR })}
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Baixar
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhum documento anexado
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="historico">
                <UserHistory 
                  historico={historico} 
                  nomeUsuario={usuario.nome}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}