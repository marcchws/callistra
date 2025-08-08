"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  MoreHorizontal, 
  Mail, 
  Eye, 
  CheckCircle, 
  UserX, 
  UserCheck, 
  FileText,
  Search,
  Filter,
  Send,
  AlertTriangle,
  Clock,
  Download,
  Shield,
  DollarSign
} from "lucide-react"
import type { CobrancasAtrasoTableProps } from "../types"
import { 
  formatCurrency, 
  formatDate, 
  getStatusBadgeClass, 
  getStatusLabel,
  calcularDiasAtraso,
  cn
} from "../utils"

export function CobrancasAtrasoTable({ 
  cobrancas, 
  loading, 
  onEmitirBoleto,
  onEnviarCobranca,
  onConfirmarPagamento,
  onReenviar, 
  onBloquearCliente,
  onLiberarCliente,
  onVerHistorico
}: CobrancasAtrasoTableProps) {
  const [filtroStatus, setFiltroStatus] = useState<string>("todas")
  const [filtroDiasAtraso, setFiltroDiasAtraso] = useState<string>("todos")
  const [filtroCliente, setFiltroCliente] = useState("")
  const [cobrancasSelecionadas, setCobrancasSelecionadas] = useState<string[]>([])

  // Filtrar cobranças em atraso
  const cobrancasFiltradas = cobrancas.filter(cobranca => {
    const matchStatus = filtroStatus === "todas" || cobranca.status === filtroStatus
    const matchCliente = !filtroCliente || 
      cobranca.clienteNome.toLowerCase().includes(filtroCliente.toLowerCase())
    
    let matchDiasAtraso = true
    if (filtroDiasAtraso !== "todos") {
      const dias = cobranca.diasAtraso
      switch (filtroDiasAtraso) {
        case "0-15":
          matchDiasAtraso = dias <= 15
          break
        case "15-30":
          matchDiasAtraso = dias > 15 && dias <= 30
          break
        case "30-60":
          matchDiasAtraso = dias > 30 && dias <= 60
          break
        case "60+":
          matchDiasAtraso = dias > 60
          break
      }
    }
    
    return matchStatus && matchCliente && matchDiasAtraso
  })

  const handleSelectCobranca = (cobrancaId: string, checked: boolean) => {
    if (checked) {
      setCobrancasSelecionadas(prev => [...prev, cobrancaId])
    } else {
      setCobrancasSelecionadas(prev => prev.filter(id => id !== cobrancaId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setCobrancasSelecionadas(cobrancasFiltradas.map(c => c.id))
    } else {
      setCobrancasSelecionadas([])
    }
  }

  const handleEnviarSelecionadas = () => {
    if (cobrancasSelecionadas.length > 0) {
      onEnviarCobranca(cobrancasSelecionadas)
      setCobrancasSelecionadas([])
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-[250px] mb-2" />
              <Skeleton className="h-4 w-[350px]" />
            </div>
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-8 w-8" />
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
            <CardTitle className="text-xl font-semibold text-slate-800">
              Cobranças em Atraso
            </CardTitle>
            <CardDescription className="text-slate-600">
              Gerencie cobranças vencidas e automatize envios e alertas
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {cobrancasSelecionadas.length > 0 && (
              <Button 
                onClick={handleEnviarSelecionadas}
                className="gap-2 bg-slate-600 hover:bg-slate-700"
              >
                <Send className="h-4 w-4" />
                Enviar Selecionadas ({cobrancasSelecionadas.length})
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filtros específicos para cobranças em atraso */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
          <div className="flex-1">
            <Label htmlFor="busca-cliente" className="text-sm font-medium text-slate-700">
              Buscar Cliente
            </Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="busca-cliente"
                placeholder="Digite o nome do cliente..."
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
                className="pl-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
              />
            </div>
          </div>
          
          <div className="w-48">
            <Label className="text-sm font-medium text-slate-700">
              Status da Cobrança
            </Label>
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="mt-1 border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="vencida">Vencida (Não Enviada)</SelectItem>
                <SelectItem value="cobranca_enviada">Cobrança Enviada</SelectItem>
                <SelectItem value="aguardando_pago">Aguardando Pagamento</SelectItem>
                <SelectItem value="bloqueada">Cliente Bloqueado</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-48">
            <Label className="text-sm font-medium text-slate-700">
              Dias de Atraso
            </Label>
            <Select value={filtroDiasAtraso} onValueChange={setFiltroDiasAtraso}>
              <SelectTrigger className="mt-1 border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="0-15">0-15 dias</SelectItem>
                <SelectItem value="15-30">15-30 dias</SelectItem>
                <SelectItem value="30-60">30-60 dias</SelectItem>
                <SelectItem value="60+">Mais de 60 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabela de Cobranças em Atraso */}
        <div className="border border-slate-200 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200">
                <TableHead className="w-12">
                  <Checkbox
                    checked={cobrancasSelecionadas.length === cobrancasFiltradas.length && cobrancasFiltradas.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-slate-700 font-medium">Cliente</TableHead>
                <TableHead className="text-slate-700 font-medium">Contrato Original</TableHead>
                <TableHead className="text-slate-700 font-medium">Valor</TableHead>
                <TableHead className="text-slate-700 font-medium">Dias de Atraso</TableHead>
                <TableHead className="text-slate-700 font-medium">Status</TableHead>
                <TableHead className="text-slate-700 font-medium">Último Envio</TableHead>
                <TableHead className="text-slate-700 font-medium text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cobrancasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                      <p className="text-sm text-slate-500">
                        {filtroStatus === "todas" && !filtroCliente 
                          ? "Nenhuma cobrança em atraso encontrada"
                          : "Nenhuma cobrança encontrada com os filtros aplicados"
                        }
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                cobrancasFiltradas.map((cobranca) => {
                  const isSelected = cobrancasSelecionadas.includes(cobranca.id)
                  const precisaBloqueio = cobranca.diasAtraso >= 15 && !cobranca.clienteBloqueado
                  
                  return (
                    <TableRow key={cobranca.id} className="border-slate-200 hover:bg-slate-50">
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSelectCobranca(cobranca.id, checked as boolean)}
                        />
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800">
                              {cobranca.clienteNome}
                            </span>
                            {cobranca.clienteBloqueado && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <Shield className="h-3 w-3 mr-1" />
                                Bloqueado
                              </Badge>
                            )}
                            {precisaBloqueio && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Para Bloquear
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{cobranca.clienteEmail}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-slate-700 font-mono text-sm">
                          {cobranca.contratoOriginal}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <span className="font-medium text-slate-800">
                            {formatCurrency(cobranca.valorAtualizado)}
                          </span>
                          {cobranca.valorAtualizado > cobranca.valorOriginal && (
                            <p className="text-xs text-slate-500">
                              Original: {formatCurrency(cobranca.valorOriginal)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {cobranca.diasAtraso >= 60 ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : cobranca.diasAtraso >= 15 ? (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                          )}
                          <span className={cn(
                            "font-medium",
                            cobranca.diasAtraso >= 60 ? "text-red-700" : 
                            cobranca.diasAtraso >= 15 ? "text-orange-700" : "text-yellow-700"
                          )}>
                            {cobranca.diasAtraso} dias
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Venc: {formatDate(cobranca.dataVencimentoOriginal)}
                        </p>
                      </TableCell>
                      
                      <TableCell>
                        <span className={getStatusBadgeClass(cobranca.status)}>
                          {getStatusLabel(cobranca.status)}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        {cobranca.dataUltimoEnvio ? (
                          <div className="space-y-1">
                            <span className="text-slate-700 text-sm">
                              {formatDate(cobranca.dataUltimoEnvio)}
                            </span>
                            <p className="text-xs text-slate-500">
                              {cobranca.alertasEnviados.length} envio(s)
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-sm">Não enviado</span>
                        )}
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações da Cobrança</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuItem onClick={() => onVerHistorico(cobranca)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Histórico
                            </DropdownMenuItem>
                            
                            {!cobranca.boletoAtualizado && (
                              <DropdownMenuItem onClick={() => onEmitirBoleto(cobranca.id)}>
                                <FileText className="mr-2 h-4 w-4" />
                                Emitir Boleto
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem onClick={() => onReenviar(cobranca.id)}>
                              <Mail className="mr-2 h-4 w-4" />
                              Reenviar Cobrança
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            {cobranca.status !== "pago" && (
                              <DropdownMenuItem onClick={() => onConfirmarPagamento(cobranca.id)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Confirmar Pagamento
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />
                            
                            {!cobranca.clienteBloqueado ? (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Bloquear Cliente
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-semibold text-slate-800">
                                      Bloquear Cliente por Inadimplência
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-600">
                                      Tem certeza que deseja bloquear o cliente <strong>{cobranca.clienteNome}</strong>? 
                                      O cliente será impedido de contratar novos serviços até regularizar a situação.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => onBloquearCliente(cobranca.clienteId)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Bloquear Cliente
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Liberar Cliente
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-semibold text-slate-800">
                                      Liberar Cliente Bloqueado
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-600">
                                      Tem certeza que deseja liberar o cliente <strong>{cobranca.clienteNome}</strong>? 
                                      Esta ação deve ser autorizada apenas por administradores.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => onLiberarCliente(cobranca.clienteId)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      Liberar Cliente
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Resumo dos resultados */}
        {cobrancasFiltradas.length > 0 && (
          <div className="flex items-center justify-between pt-4 text-sm text-slate-500 border-t border-slate-200 mt-4">
            <span>
              Mostrando {cobrancasFiltradas.length} de {cobrancas.length} cobrança(s) em atraso
            </span>
            <div className="flex items-center gap-4">
              <span>
                Valor total: {formatCurrency(
                  cobrancasFiltradas.reduce((sum, c) => sum + c.valorAtualizado, 0)
                )}
              </span>
              <span>
                Média de atraso: {Math.round(
                  cobrancasFiltradas.reduce((sum, c) => sum + c.diasAtraso, 0) / cobrancasFiltradas.length
                )} dias
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}