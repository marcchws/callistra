"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  History, 
  Mail, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  UserX,
  UserCheck,
  FileText,
  Clock,
  Filter
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import type { HistoricoCobranca } from "../types"

interface HistoricoCobrancasProps {
  historico: HistoricoCobranca[]
  loading: boolean
}

export function HistoricoCobrancas({ historico, loading }: HistoricoCobrancasProps) {
  const [filtroAcao, setFiltroAcao] = useState<string>("")
  const [filtroUsuario, setFiltroUsuario] = useState<string>("")

  const getIconeAcao = (acao: HistoricoCobranca['acao']) => {
    switch (acao) {
      case 'emitida':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'enviada':
        return <Mail className="h-4 w-4 text-indigo-500" />
      case 'reenviada':
        return <Mail className="h-4 w-4 text-purple-500" />
      case 'paga':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelada':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'bloqueio':
        return <UserX className="h-4 w-4 text-orange-500" />
      case 'desbloqueio':
        return <UserCheck className="h-4 w-4 text-cyan-500" />
      default:
        return <Clock className="h-4 w-4 text-slate-500" />
    }
  }

  const getCorAcao = (acao: HistoricoCobranca['acao']) => {
    switch (acao) {
      case 'emitida':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'enviada':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'reenviada':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'paga':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'cancelada':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'bloqueio':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'desbloqueio':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200'
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  const formatarAcao = (acao: HistoricoCobranca['acao']) => {
    const acoes = {
      emitida: 'Emitida',
      enviada: 'Enviada',
      reenviada: 'Reenviada',
      paga: 'Paga',
      cancelada: 'Cancelada',
      bloqueio: 'Bloqueio',
      desbloqueio: 'Desbloqueio'
    }
    return acoes[acao] || acao
  }

  const historicoFiltrado = historico.filter(item => {
    const matchAcao = !filtroAcao || item.acao === filtroAcao
    const matchUsuario = !filtroUsuario || 
      item.usuarioNome.toLowerCase().includes(filtroUsuario.toLowerCase())
    
    return matchAcao && matchUsuario
  })

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium text-slate-800">
            Histórico de Ações
          </CardTitle>
          <CardDescription className="text-slate-600">
            Carregando histórico...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium text-slate-800">
              Histórico de Ações
            </CardTitle>
            <CardDescription className="text-slate-600">
              Registro completo de cobranças, alertas e pagamentos
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {historicoFiltrado.length} registros
            </Badge>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="flex-1">
            <Input
              placeholder="Filtrar por usuário..."
              value={filtroUsuario}
              onChange={(e) => setFiltroUsuario(e.target.value)}
              className="border-slate-300 focus:border-slate-500 focus:ring-slate-500"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={filtroAcao} onValueChange={setFiltroAcao}>
              <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                <SelectValue placeholder="Todas as ações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as ações</SelectItem>
                <SelectItem value="emitida">Emitida</SelectItem>
                <SelectItem value="enviada">Enviada</SelectItem>
                <SelectItem value="reenviada">Reenviada</SelectItem>
                <SelectItem value="paga">Paga</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="bloqueio">Bloqueio</SelectItem>
                <SelectItem value="desbloqueio">Desbloqueio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(filtroAcao || filtroUsuario) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFiltroAcao("")
                setFiltroUsuario("")
              }}
              className="border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Filter className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {historicoFiltrado.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <History className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p className="text-sm">
              {historico.length === 0 
                ? "Nenhum histórico disponível"
                : "Nenhum registro encontrado com os filtros aplicados"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {historicoFiltrado.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-start space-x-3">
                  {/* Ícone da ação */}
                  <div className="flex-shrink-0 mt-1">
                    {getIconeAcao(item.acao)}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCorAcao(item.acao)}`}
                      >
                        {formatarAcao(item.acao)}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {format(item.dataAcao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>

                    <p className="text-sm text-slate-800 font-medium mb-1">
                      {item.detalhes}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Por: {item.usuarioNome}</span>
                      {item.cobrancaId && (
                        <span>Cobrança: #{item.cobrancaId.slice(-6)}</span>
                      )}
                    </div>

                    {/* Dados adicionais */}
                    {item.dadosAdicionais && Object.keys(item.dadosAdicionais).length > 0 && (
                      <div className="mt-2 p-2 bg-slate-50 rounded-md border border-slate-200">
                        <div className="text-xs text-slate-600 space-y-1">
                          {Object.entries(item.dadosAdicionais).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace('_', ' ')}:</span>
                              <span className="font-medium">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Separador */}
                {index < historicoFiltrado.length - 1 && (
                  <Separator className="mt-4 bg-slate-200" />
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
