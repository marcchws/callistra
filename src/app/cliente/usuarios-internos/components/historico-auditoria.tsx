"use client"

import { useState, useEffect } from "react"
import { Clock, User, Edit, UserX, UserCheck, Plus, Trash2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUsuariosInternos } from "../use-usuarios-internos"
import { HistoricoAuditoria as HistoricoAuditoriaType } from "../types"

interface HistoricoAuditoriaProps {
  usuarioId: string
  onClose: () => void
}

const acaoConfig = {
  CRIACAO: {
    icon: Plus,
    label: "Usuário Criado",
    color: "bg-green-100 text-green-800",
    iconColor: "text-green-600"
  },
  EDICAO: {
    icon: Edit,
    label: "Dados Editados",
    color: "bg-blue-100 text-blue-800",
    iconColor: "text-blue-600"
  },
  DESATIVACAO: {
    icon: UserX,
    label: "Usuário Desativado",
    color: "bg-red-100 text-red-800",
    iconColor: "text-red-600"
  },
  ATIVACAO: {
    icon: UserCheck,
    label: "Usuário Ativado",
    color: "bg-green-100 text-green-800",
    iconColor: "text-green-600"
  },
  EXCLUSAO: {
    icon: Trash2,
    label: "Usuário Excluído",
    color: "bg-gray-100 text-gray-800",
    iconColor: "text-gray-600"
  }
}

function formatarValor(valor: any): string {
  if (valor === null || valor === undefined) {
    return "Não informado"
  }
  
  if (Array.isArray(valor)) {
    return valor.length > 0 ? valor.join(", ") : "Nenhum"
  }
  
  if (typeof valor === "boolean") {
    return valor ? "Sim" : "Não"
  }
  
  return String(valor)
}

function formatarCampo(campo: string): string {
  const campos: { [key: string]: string } = {
    nome: "Nome",
    cargo: "Cargo",
    telefone: "Telefone",
    email: "E-mail",
    perfilAcesso: "Perfil de Acesso",
    status: "Status",
    especialidades: "Especialidades",
    tipoHonorario: "Tipo de Honorário",
    banco: "Banco",
    agencia: "Agência",
    contaCorrente: "Conta Corrente",
    chavePix: "Chave PIX",
    observacao: "Observações",
    fotoPerfil: "Foto de Perfil"
  }
  
  return campos[campo] || campo
}

export function HistoricoAuditoria({ usuarioId, onClose }: HistoricoAuditoriaProps) {
  const { buscarHistorico } = useUsuariosInternos()
  const [historico, setHistorico] = useState<HistoricoAuditoriaType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregarHistorico() {
      try {
        setLoading(true)
        setError(null)
        const dados = await buscarHistorico(usuarioId)
        setHistorico(dados)
      } catch (err) {
        setError("Erro ao carregar histórico de auditoria")
      } finally {
        setLoading(false)
      }
    }

    if (usuarioId) {
      carregarHistorico()
    }
  }, [usuarioId]) // Removendo buscarHistorico das dependências

  const renderizarDetalhesAcao = (item: HistoricoAuditoriaType) => {
    const config = acaoConfig[item.acao]
    
    return (
      <div className="space-y-3">
        {/* Cabeçalho da ação */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${config.color.replace('text-', 'bg-').replace('800', '100')}`}>
            <config.icon className={`h-4 w-4 ${config.iconColor}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{config.label}</h4>
              <Badge variant="outline" className={config.color}>
                {item.acao}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {item.realizadoPor}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.realizadoEm.toLocaleDateString("pt-BR")} às {item.realizadoEm.toLocaleTimeString("pt-BR")}
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        {item.observacoes && (
          <div className="pl-11">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Observações:</p>
                  <p className="text-sm text-yellow-700">{item.observacoes}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detalhes das mudanças (apenas para edições) */}
        {item.acao === "EDICAO" && (item.dadosAnteriores || item.dadosNovos) && (
          <div className="pl-11">
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-700">Alterações realizadas:</h5>
              
              {/* Combinar campos alterados */}
              {(() => {
                const camposAlterados = new Set([
                  ...Object.keys(item.dadosAnteriores || {}),
                  ...Object.keys(item.dadosNovos || {})
                ])
                
                return Array.from(camposAlterados).map(campo => {
                  const valorAnterior = item.dadosAnteriores?.[campo as keyof typeof item.dadosAnteriores]
                  const valorNovo = item.dadosNovos?.[campo as keyof typeof item.dadosNovos]
                  
                  return (
                    <div key={campo} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {formatarCampo(campo)} - Valor Anterior
                        </p>
                        <p className="text-sm mt-1 font-mono bg-red-50 text-red-800 p-2 rounded">
                          {formatarValor(valorAnterior)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {formatarCampo(campo)} - Valor Novo
                        </p>
                        <p className="text-sm mt-1 font-mono bg-green-50 text-green-800 p-2 rounded">
                          {formatarValor(valorNovo)}
                        </p>
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        )}

        {/* Detalhes para ativação/desativação */}
        {(item.acao === "ATIVACAO" || item.acao === "DESATIVACAO") && (
          <div className="pl-11">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-md">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Status Anterior
                </p>
                <p className="text-sm mt-1 font-mono bg-red-50 text-red-800 p-2 rounded">
                  {formatarValor(item.dadosAnteriores?.status)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Status Novo
                </p>
                <p className="text-sm mt-1 font-mono bg-green-50 text-green-800 p-2 rounded">
                  {formatarValor(item.dadosNovos?.status)}
                </p>
              </div>
            </div>

            {item.acao === "DESATIVACAO" && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <h6 className="text-sm font-medium text-orange-800 mb-2">Consequências da Desativação:</h6>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Login do usuário foi bloqueado automaticamente</li>
                  <li>• Todas as atividades foram transferidas para o Admin Master</li>
                  <li>• Usuário permanecerá na listagem por 1 ano para auditoria</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-muted-foreground">Carregando histórico...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-sm text-red-600">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Tentar Novamente
          </Button>
        </div>
        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Histórico de Auditoria</h3>
          <p className="text-sm text-muted-foreground">
            {historico.length} {historico.length === 1 ? "registro encontrado" : "registros encontrados"}
          </p>
        </div>
      </div>

      {/* Timeline de auditoria */}
      {historico.length > 0 ? (
        <div className="space-y-6">
          {historico.map((item, index) => (
            <div key={item.id} className="relative">
              {/* Linha da timeline (apenas se não for o último item) */}
              {index < historico.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
              )}
              
              <Card>
                <CardContent className="p-6">
                  {renderizarDetalhesAcao(item)}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Nenhum registro de auditoria encontrado
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              As ações realizadas neste usuário aparecerão aqui
            </p>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  )
}