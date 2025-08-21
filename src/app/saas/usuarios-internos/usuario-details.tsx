"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Shield, 
  DollarSign, 
  Building, 
  CreditCard,
  Hash,
  FileText,
  Calendar,
  Edit,
  Download,
  Upload
} from 'lucide-react'
import { Usuario, AuditLog } from './types'

interface UsuarioDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario?: Usuario
  onEdit: (usuario: Usuario) => void
}

// Mock data para auditoria - em produção viria de uma API
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    usuarioId: '1',
    acao: 'criacao',
    dadosNovos: { nome: 'João Silva Santos', status: 'Ativo' },
    realizadoPor: 'Admin Sistema',
    realizadoEm: new Date('2024-01-15T10:30:00'),
    observacoes: 'Usuário criado durante onboarding'
  },
  {
    id: '2',
    usuarioId: '1',
    acao: 'edicao',
    dadosAnteriores: { salario: 12000 },
    dadosNovos: { salario: 15000 },
    realizadoPor: 'Admin Sistema',
    realizadoEm: new Date('2024-03-10T14:20:00'),
    observacoes: 'Aumento salarial aprovado'
  }
]

export function UsuarioDetails({
  open,
  onOpenChange,
  usuario,
  onEdit
}: UsuarioDetailsProps) {
  if (!usuario) return null

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const getStatusBadge = (status: Usuario['status']) => {
    return status === 'Ativo' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Ativo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        Inativo
      </Badge>
    )
  }

  const formatCurrency = (value?: number) => {
    if (!value) return 'Não informado'
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getAcaoLabel = (acao: AuditLog['acao']) => {
    const labels = {
      criacao: 'Criação',
      edicao: 'Edição',
      exclusao: 'Exclusão',
      ativacao: 'Ativação',
      desativacao: 'Desativação'
    }
    return labels[acao]
  }

  const getAcaoIcon = (acao: AuditLog['acao']) => {
    switch (acao) {
      case 'criacao':
        return <User className="h-4 w-4 text-green-600" />
      case 'edicao':
        return <Edit className="h-4 w-4 text-blue-600" />
      case 'exclusao':
        return <FileText className="h-4 w-4 text-red-600" />
      case 'ativacao':
        return <Shield className="h-4 w-4 text-green-600" />
      case 'desativacao':
        return <Shield className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Usuário</DialogTitle>
          <DialogDescription>
            Informações completas e histórico de alterações
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header com informações principais */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={usuario.fotoPerfil} />
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                    {getInitials(usuario.nome)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{usuario.nome}</h3>
                    {getStatusBadge(usuario.status)}
                  </div>
                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {usuario.cargo}
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      {usuario.perfilAcesso}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {usuario.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {usuario.telefone}
                    </div>
                  </div>
                </div>

                <Button onClick={() => onEdit(usuario)} className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs com informações detalhadas */}
          <Tabs defaultValue="pessoais" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pessoais">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="financeiros">Financeiros</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>

            {/* Dados Pessoais */}
            <TabsContent value="pessoais" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                      <p className="text-sm">{usuario.nome}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cargo</label>
                      <p className="text-sm">{usuario.cargo}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">E-mail</label>
                      <p className="text-sm">{usuario.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Telefone</label>
                      <p className="text-sm">{usuario.telefone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Perfil de Acesso</label>
                      <p className="text-sm">{usuario.perfilAcesso}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <p className="text-sm">{usuario.status}</p>
                    </div>
                  </div>
                  
                  {usuario.observacao && (
                    <>
                      <Separator />
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Observações</label>
                        <p className="text-sm mt-1">{usuario.observacao}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Dados Financeiros */}
            <TabsContent value="financeiros" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Informações Financeiras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Salário</label>
                      <p className="text-sm font-medium">{formatCurrency(usuario.salario)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Chave PIX</label>
                      <p className="text-sm">{usuario.chavePix || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Banco</label>
                      <p className="text-sm">{usuario.banco || 'Não informado'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Agência</label>
                      <p className="text-sm">{usuario.agencia || 'Não informado'}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Conta Corrente</label>
                      <p className="text-sm">{usuario.contaCorrente || 'Não informado'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documentos */}
            <TabsContent value="documentos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documentos Anexos
                  </CardTitle>
                  <CardDescription>
                    Documentos digitais do usuário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usuario.documentosAnexos && usuario.documentosAnexos.length > 0 ? (
                    <div className="space-y-3">
                      {usuario.documentosAnexos.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{doc.nome}</p>
                              <p className="text-xs text-muted-foreground">
                                Enviado em {formatDate(doc.uploadEm)} por {doc.uploadPor}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Nenhum documento anexado
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Histórico */}
            <TabsContent value="historico" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Histórico de Alterações
                  </CardTitle>
                  <CardDescription>
                    Registro de todas as modificações realizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAuditLogs.map((log) => (
                      <div key={log.id} className="flex gap-3 pb-4 border-b last:border-b-0">
                        <div className="flex-shrink-0 mt-1">
                          {getAcaoIcon(log.acao)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{getAcaoLabel(log.acao)}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(log.realizadoEm)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Realizado por: {log.realizadoPor}
                          </p>
                          {log.observacoes && (
                            <p className="text-xs text-muted-foreground">
                              {log.observacoes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Informações de criação/atualização */}
                    <div className="mt-6 pt-4 border-t">
                      <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                        <div>
                          <span className="font-medium">Criado em:</span> {formatDate(usuario.criadoEm)}
                        </div>
                        <div>
                          <span className="font-medium">Criado por:</span> {usuario.criadoPor}
                        </div>
                        {usuario.atualizadoEm && (
                          <>
                            <div>
                              <span className="font-medium">Última atualização:</span> {formatDate(usuario.atualizadoEm)}
                            </div>
                            <div>
                              <span className="font-medium">Atualizado por:</span> {usuario.atualizadoPor}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
