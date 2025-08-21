"use client"

import { Edit, History, User, Mail, Phone, Badge as BadgeIcon, FileText, CreditCard, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsuarioInterno, DocumentoAnexo } from "../types"
import { cn } from "@/lib/utils"

interface UsuarioDetailsProps {
  usuario: UsuarioInterno
  dadosApoio: {
    especialidades: Array<{ id: string; nome: string }>
    cargos: Array<{ id: string; nome: string }>
    perfisAcesso: Array<{ id: string; nome: string; descricao: string }>
  }
  onEdit: () => void
  onViewHistory: () => void
  onClose: () => void
}

const tiposDocumento = {
  "OAB": "OAB - Ordem dos Advogados",
  "TERMO_CONFIDENCIALIDADE": "Termo de Confidencialidade",
  "CPF": "CPF - Cadastro de Pessoa Física",
  "PASSAPORTE": "Passaporte"
}

export function UsuarioDetails({ usuario, dadosApoio, onEdit, onViewHistory, onClose }: UsuarioDetailsProps) {
  const perfilAcesso = dadosApoio.perfisAcesso.find(p => p.nome === usuario.perfilAcesso)

  return (
    <div className="space-y-6">
      {/* Header com foto e informações principais */}
      <div className="flex items-start space-x-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={usuario.fotoPerfil} alt={usuario.nome} />
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
            {usuario.nome.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{usuario.nome}</h2>
              <p className="text-muted-foreground">{usuario.cargo}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button variant="outline" onClick={onViewHistory} className="gap-2">
                <History className="h-4 w-4" />
                Histórico
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge 
              variant={usuario.status === "ATIVO" ? "default" : "destructive"}
              className={cn(
                "font-medium",
                usuario.status === "ATIVO" && "bg-green-100 text-green-800"
              )}
            >
              {usuario.status}
            </Badge>
            <Badge variant="secondary">
              ID: {usuario.id}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      {/* Informações detalhadas em tabs */}
      <Tabs defaultValue="contato" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contato">Contato</TabsTrigger>
          <TabsTrigger value="perfil">Perfil & Acesso</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        {/* Aba: Informações de Contato */}
        <TabsContent value="contato" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">E-mail</label>
                  </div>
                  <p className="text-sm">{usuario.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <label className="text-sm font-medium">Telefone</label>
                  </div>
                  <p className="text-sm">{usuario.telefone}</p>
                </div>
              </div>

              {usuario.observacao && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Observações</label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">{usuario.observacao}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Perfil e Acesso */}
        <TabsContent value="perfil" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <BadgeIcon className="h-5 w-5 text-blue-600" />
                Perfil de Acesso e Especialidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Perfil de Acesso</label>
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="font-medium text-blue-900">{usuario.perfilAcesso}</p>
                    {perfilAcesso && (
                      <p className="text-sm text-blue-700 mt-1">{perfilAcesso.descricao}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Cargo</label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="font-medium">{usuario.cargo}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium">Especialidades Jurídicas</label>
                {usuario.especialidades.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {usuario.especialidades.map((especialidade, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {especialidade}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhuma especialidade cadastrada
                  </p>
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-2">
                  <label className="font-medium">Criado em</label>
                  <p className="text-muted-foreground">
                    {usuario.createdAt.toLocaleDateString("pt-BR")} às {usuario.createdAt.toLocaleTimeString("pt-BR")}
                  </p>
                  <p className="text-xs text-muted-foreground">por {usuario.createdBy}</p>
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Última atualização</label>
                  <p className="text-muted-foreground">
                    {usuario.updatedAt.toLocaleDateString("pt-BR")} às {usuario.updatedAt.toLocaleTimeString("pt-BR")}
                  </p>
                  <p className="text-xs text-muted-foreground">por {usuario.updatedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Dados Financeiros */}
        <TabsContent value="financeiro" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Informações Financeiras
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Honorário</label>
                  <p className="text-sm">{usuario.tipoHonorario || "Não informado"}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Banco</label>
                  <p className="text-sm">{usuario.banco || "Não informado"}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Agência</label>
                  <p className="text-sm">{usuario.agencia || "Não informado"}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Conta Corrente</label>
                  <p className="text-sm">{usuario.contaCorrente || "Não informado"}</p>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Chave PIX</label>
                  <p className="text-sm">{usuario.chavePix || "Não informado"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba: Documentos */}
        <TabsContent value="documentos" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Documentos Anexos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {usuario.documentos.length > 0 ? (
                <div className="space-y-3">
                  {usuario.documentos.map((documento) => (
                    <div key={documento.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">{documento.nomeArquivo}</p>
                          <p className="text-xs text-muted-foreground">
                            {tiposDocumento[documento.tipo as keyof typeof tiposDocumento]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Enviado em {documento.uploadedAt.toLocaleDateString("pt-BR")} por {documento.uploadedBy}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(documento.url, '_blank')}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Visualizar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum documento anexado
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use a opção "Editar" para adicionar documentos
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  )
}