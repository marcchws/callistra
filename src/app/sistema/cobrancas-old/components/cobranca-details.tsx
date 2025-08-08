"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Mail, 
  Copy, 
  Download, 
  Clock, 
  User, 
  Calendar, 
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  History,
  Shield,
  Activity
} from "lucide-react"
import type { CobrancaEmAtraso } from "../types"
import { 
  formatCurrency, 
  formatDate, 
  formatDateTime,
  getStatusBadgeClass, 
  getStatusLabel,
  getAcaoHistoricoLabel,
  calcularDiasAtraso,
  cn
} from "../utils"
import { toast } from "sonner"

interface CobrancaHistoricoDialogProps {
  cobranca: CobrancaEmAtraso | null
  onClose: () => void
  onReenviar: (id: string) => void
  onEmitirBoleto: (id: string) => void
}

export function CobrancaHistoricoDialog({ 
  cobranca, 
  onClose, 
  onReenviar,
  onEmitirBoleto 
}: CobrancaHistoricoDialogProps) {
  
  if (!cobranca) return null

  const handleCopyBoleto = () => {
    if (cobranca.boletoAtualizado?.codigo) {
      navigator.clipboard.writeText(cobranca.boletoAtualizado.codigo)
      toast.success("Código do boleto copiado!", { duration: 2000 })
    }
  }

  const handleCopyLink = () => {
    if (cobranca.boletoAtualizado?.linkPagamento) {
      navigator.clipboard.writeText(cobranca.boletoAtualizado.linkPagamento)
      toast.success("Link de pagamento copiado!", { duration: 2000 })
    }
  }

  const precisaBloqueio = cobranca.diasAtraso >= 15 && !cobranca.clienteBloqueado

  return (
    <Dialog open={!!cobranca} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico da Cobrança em Atraso
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Informações completas e histórico de ações da inadimplência
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Status da Cobrança em Atraso */}
            <Card className="border-2 border-slate-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-slate-800">
                    Status da Inadimplência
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className={getStatusBadgeClass(cobranca.status)}>
                      {getStatusLabel(cobranca.status)}
                    </span>
                    {cobranca.clienteBloqueado && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Cliente Bloqueado
                      </Badge>
                    )}
                    {precisaBloqueio && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Para Bloquear (15+ dias)
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-slate-700">Dias de Atraso</span>
                    </div>
                    <div className="text-2xl font-bold text-red-700">
                      {cobranca.diasAtraso} dias
                    </div>
                    <p className="text-xs text-slate-500">
                      Venceu em {formatDate(cobranca.dataVencimentoOriginal)}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-700">Valor Atualizado</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">
                      {formatCurrency(cobranca.valorAtualizado)}
                    </div>
                    {cobranca.valorAtualizado > cobranca.valorOriginal && (
                      <p className="text-xs text-slate-500">
                        Original: {formatCurrency(cobranca.valorOriginal)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-slate-700">Alertas Enviados</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">
                      {cobranca.alertasEnviados.length}
                    </div>
                    <p className="text-xs text-slate-500">
                      {cobranca.dataUltimoEnvio ? `Último: ${formatDate(cobranca.dataUltimoEnvio)}` : "Nenhum envio"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações do Cliente e Contrato */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Dados do Cliente e Contrato Original
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Cliente</p>
                      <p className="text-slate-800">{cobranca.clienteNome}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Email</p>
                      <p className="text-slate-600">{cobranca.clienteEmail}</p>
                    </div>
                    {cobranca.clienteTelefone && (
                      <div>
                        <p className="text-sm font-medium text-slate-700">Telefone</p>
                        <p className="text-slate-600">{cobranca.clienteTelefone}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Contrato Original</p>
                      <p className="font-mono text-slate-800">{cobranca.contratoOriginal}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Situação Financeira</p>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600">
                          {cobranca.lancamentoFinanceiro?.situacao === "pendente" ? "Pendente" : 
                           cobranca.lancamentoFinanceiro?.situacao === "baixado" ? "Baixado" : "Cancelado"}
                        </span>
                        <Badge variant="outline" className={cn(
                          cobranca.lancamentoFinanceiro?.situacao === "pendente" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                          cobranca.lancamentoFinanceiro?.situacao === "baixado" ? "bg-green-50 text-green-700 border-green-200" :
                          "bg-slate-50 text-slate-700 border-slate-200"
                        )}>
                          {cobranca.lancamentoFinanceiro?.contaReceberOriginal}
                        </Badge>
                      </div>
                    </div>
                    {cobranca.clienteBloqueado && (
                      <div>
                        <p className="text-sm font-medium text-slate-700">Bloqueio</p>
                        <p className="text-red-600 text-sm">
                          {cobranca.motivoBloqueio} em {formatDate(cobranca.dataBloqueio!)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Boleto Atualizado */}
            {cobranca.boletoAtualizado && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Boleto Atualizado para Cobrança
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Boleto gerado em {formatDateTime(cobranca.boletoAtualizado.dataGeracao)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-slate-700">Código do Boleto</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyBoleto}
                        className="gap-2"
                      >
                        <Copy className="h-3 w-3" />
                        Copiar
                      </Button>
                    </div>
                    <p className="font-mono text-sm text-slate-800 break-all">
                      {cobranca.boletoAtualizado.codigo}
                    </p>
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-slate-700">Link de Pagamento</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyLink}
                        className="gap-2"
                      >
                        <Copy className="h-3 w-3" />
                        Copiar
                      </Button>
                    </div>
                    <p className="text-sm text-slate-600 break-all">
                      {cobranca.boletoAtualizado.linkPagamento}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alertas de Inadimplência Enviados */}
            {cobranca.alertasEnviados.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Alertas Automáticos de Inadimplência
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Histórico de alertas enviados automaticamente pelo sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {cobranca.alertasEnviados.map((alerta) => (
                      <div key={alerta.id} className="p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-slate-700">
                              {alerta.tipo === "primeira_cobranca" ? "Primeira Cobrança" :
                               alerta.tipo === "segunda_cobranca" ? "Segunda Cobrança" :
                               alerta.tipo === "pre_bloqueio" ? "Pré-Bloqueio" :
                               alerta.tipo === "cliente_bloqueado" ? "Cliente Bloqueado" :
                               "Pagamento Confirmado"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {alerta.canalEnvio}
                            </Badge>
                            {alerta.entregue ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mb-1">{alerta.conteudo}</p>
                        <p className="text-xs text-slate-400">
                          {formatDateTime(alerta.dataEnvio)} • {alerta.destinatarios.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Histórico Completo de Ações */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico Completo de Ações
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Todas as ações realizadas nesta cobrança em atraso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cobranca.historicoAcoes.map((item, index) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          "rounded-full p-2",
                          index === 0 ? "bg-blue-100" : "bg-slate-100"
                        )}>
                          {item.acao === "cobranca_identificada" && <AlertTriangle className="h-3 w-3 text-red-600" />}
                          {item.acao === "boleto_gerado" && <FileText className="h-3 w-3 text-slate-600" />}
                          {item.acao === "envio_automatico" && <Mail className="h-3 w-3 text-blue-600" />}
                          {item.acao === "alerta_inadimplencia" && <AlertTriangle className="h-3 w-3 text-yellow-600" />}
                          {item.acao === "pagamento_confirmado" && <CheckCircle className="h-3 w-3 text-green-600" />}
                          {item.acao === "cliente_bloqueado" && <Shield className="h-3 w-3 text-red-600" />}
                          {item.acao === "cliente_liberado" && <UserCheck className="h-3 w-3 text-green-600" />}
                          {item.acao === "reenvio_manual" && <Mail className="h-3 w-3 text-blue-600" />}
                          {item.acao === "status_atualizado" && <Activity className="h-3 w-3 text-slate-600" />}
                          {item.acao === "integracao_financeira" && <DollarSign className="h-3 w-3 text-slate-600" />}
                        </div>
                        {index < cobranca.historicoAcoes.length - 1 && (
                          <div className="w-px h-6 bg-slate-200 mt-2" />
                        )}
                      </div>
                      
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-slate-800">
                            {getAcaoHistoricoLabel(item.acao)}
                          </p>
                          <div className="flex items-center gap-1">
                            {item.automatica ? (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                Automático
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs bg-slate-50 text-slate-700 border-slate-200">
                                Manual
                              </Badge>
                            )}
                            <span className="text-xs text-slate-500">por {item.usuario}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 mb-1">{item.detalhes}</p>
                        <p className="text-xs text-slate-400">{formatDateTime(item.data)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => onReenviar(cobranca.id)}
              className="gap-2"
            >
              <Mail className="h-4 w-4" />
              Reenviar Cobrança
            </Button>
            
            {!cobranca.boletoAtualizado && (
              <Button
                variant="outline"
                onClick={() => onEmitirBoleto(cobranca.id)}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Emitir Boleto
              </Button>
            )}
          </div>
          
          <Button onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}