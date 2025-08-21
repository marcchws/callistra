"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Download, Loader2, FileText, User } from "lucide-react"
import { toast } from "sonner"
import type { DadosClienteIntegrado, ArquivoExportado } from "../types"

interface IntegracaoClienteProps {
  clientesDisponiveis: DadosClienteIntegrado[]
  clienteIntegrado?: DadosClienteIntegrado | null
  arquivoExportado?: ArquivoExportado | null
  onIntegrarCliente: (clienteId: string) => Promise<void>
  onDownload: (url: string, nome: string) => Promise<void>
  loading: boolean
  loadingDownload: boolean
}

export function IntegracaoCliente({
  clientesDisponiveis,
  clienteIntegrado,
  arquivoExportado,
  onIntegrarCliente,
  onDownload,
  loading,
  loadingDownload
}: IntegracaoClienteProps) {
  const [clienteSelecionado, setClienteSelecionado] = useState<string>("") 

  const handleIntegrar = async () => {
    if (!clienteSelecionado) {
      toast.error("Selecione um cliente para integração", { duration: 3000, position: "bottom-right" })
      return
    }

    await onIntegrarCliente(clienteSelecionado)
    setClienteSelecionado("") // Reset após integração
  }

  if (clientesDisponiveis.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            Integração com Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhum cliente disponível para integração.</p>
            <p className="text-sm">Cadastre clientes primeiro no sistema.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Seleção e Integração */}
      {!clienteIntegrado && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              Integração com Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cliente-select" className="text-sm font-medium">
                Selecione o cliente para preenchimento <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={clienteSelecionado} 
                onValueChange={setClienteSelecionado}
                disabled={loading}
              >
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue placeholder="Escolha um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientesDisponiveis.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{cliente.nome}</span>
                        <span className="text-xs text-muted-foreground">{cliente.documento}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm font-medium text-blue-800 mb-1">Sobre a integração:</div>
              <div className="text-xs text-blue-600">
                Os dados do cliente serão automaticamente preenchidos na peça jurídica, 
                mas não serão salvos no histórico de conversa por segurança.
              </div>
            </div>

            <Button
              onClick={handleIntegrar}
              disabled={loading || !clienteSelecionado}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Integrando..." : "Integrar Dados do Cliente"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Cliente Integrado */}
      {clienteIntegrado && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-600" />
              Cliente Integrado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="font-medium text-green-800">{clienteIntegrado.nome}</div>
                  <div className="space-y-1 text-sm text-green-600">
                    <div><strong>Documento:</strong> {clienteIntegrado.documento}</div>
                    {clienteIntegrado.endereco && (
                      <div><strong>Endereço:</strong> {clienteIntegrado.endereco}</div>
                    )}
                    {clienteIntegrado.telefone && (
                      <div><strong>Telefone:</strong> {clienteIntegrado.telefone}</div>
                    )}
                    {clienteIntegrado.email && (
                      <div><strong>E-mail:</strong> {clienteIntegrado.email}</div>
                    )}
                  </div>
                </div>
                <Badge variant="default" className="bg-green-600">
                  Integrado
                </Badge>
              </div>
            </div>

            {/* Aviso sobre privacidade */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="text-sm font-medium text-amber-800 mb-1">🔒 Proteção de Dados</div>
              <div className="text-xs text-amber-700">
                Os dados pessoais do cliente são utilizados apenas para preenchimento do documento 
                e não são armazenados no histórico de conversa com a IA, conforme LGPD.
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Arquivo Exportado */}
      {arquivoExportado && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Download className="h-5 w-5 text-green-600" />
              Documento Gerado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="font-medium text-green-800">
                      {arquivoExportado.nome}
                    </div>
                    <div className="text-sm text-green-600">
                      Gerado em {arquivoExportado.data_geracao.toLocaleDateString('pt-BR')} às {arquivoExportado.data_geracao.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <Badge variant="outline" className="mt-1">
                      {arquivoExportado.tipo.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => onDownload(arquivoExportado.url, arquivoExportado.nome)}
                  disabled={loadingDownload}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {loadingDownload && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loadingDownload ? "Baixando..." : "Download"}
                </Button>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              O documento foi gerado com os dados do cliente integrados automaticamente. 
              Revise o conteúdo antes de usar oficialmente.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
