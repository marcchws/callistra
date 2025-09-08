"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  FileText,
  Calendar,
  User,
  Zap,
  Download,
  Share2,
  Users,
  Clock,
  CheckCircle,
  FileEdit,
  Search
} from "lucide-react"
import { PecaJuridica, TIPOS_PECAS_INFO, Cliente } from "../types"
import { cn } from "@/lib/utils"

interface VisualizarPecaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  peca: PecaJuridica | null
  onDownload?: (peca: PecaJuridica) => void
  onShare?: (peca: PecaJuridica) => void
  onIntegrarCliente?: (pecaId: string, clienteId: string) => Promise<string | null>
  clientes?: Cliente[]
}

export function VisualizarPecaDialog({ 
  open, 
  onOpenChange,
  peca,
  onDownload,
  onShare,
  onIntegrarCliente,
  clientes = []
}: VisualizarPecaDialogProps) {
  if (!peca) return null

  const getTipoIcon = () => {
    switch (peca.tipo) {
      case "revisao_ortografica":
        return <FileEdit className="h-5 w-5 text-blue-600" />
      case "pesquisa_jurisprudencia":
        return <Search className="h-5 w-5 text-green-600" />
      case "criacao_peca":
        return <FileText className="h-5 w-5 text-purple-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getTipoLabel = () => {
    switch (peca.tipo) {
      case "revisao_ortografica":
        return "Revisão Ortográfica"
      case "pesquisa_jurisprudencia":
        return "Pesquisa de Jurisprudência"
      case "criacao_peca":
        return "Criação de Peça"
      default:
        return peca.tipo
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTipoIcon()}
            {peca.titulo}
          </DialogTitle>
          <DialogDescription>
            Visualização completa da peça jurídica
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[500px] pr-4">
          <div className="space-y-4 py-4">
            {/* Informações gerais */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Tipo</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{getTipoLabel()}</Badge>
                  {peca.tipoPeca && (
                    <Badge variant="secondary">
                      {TIPOS_PECAS_INFO[peca.tipoPeca].label}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="flex items-center gap-2">
                  {peca.status === "concluida" && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Concluída</span>
                    </>
                  )}
                  {peca.status === "em_processamento" && (
                    <>
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Processando</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Criado por</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{peca.usuarioCriadorNome}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Data de criação</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {peca.dataCriacao.toLocaleDateString("pt-BR")} às{" "}
                    {peca.dataCriacao.toLocaleTimeString("pt-BR", { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Tokens utilizados</Label>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">
                    {peca.tokensUtilizados.toLocaleString()} tokens
                  </span>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Compartilhamentos</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">
                    {peca.compartilhamentos.length === 0 
                      ? "Não compartilhado" 
                      : `${peca.compartilhamentos.length} usuário(s)`}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Arquivos */}
            {(peca.arquivoOriginal || peca.arquivoProcessado) && (
              <>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Arquivos</Label>
                  <div className="space-y-2">
                    {peca.arquivoOriginal && (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Arquivo original</p>
                            <p className="text-xs text-muted-foreground">
                              {peca.arquivoOriginal.nome} • {(peca.arquivoOriginal.tamanho / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {peca.arquivoProcessado && (
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-sm font-medium">Arquivo processado</p>
                            <p className="text-xs text-muted-foreground">
                              {peca.arquivoProcessado.nome}
                            </p>
                          </div>
                        </div>
                        {onDownload && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDownload(peca)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Prompt utilizado */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Prompt utilizado</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {peca.promptUtilizado}
                </p>
              </div>
            </div>

            <Separator />

            {/* Conteúdo gerado */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {peca.tipo === "pesquisa_jurisprudencia" ? "Resultados da pesquisa" : "Conteúdo gerado"}
              </Label>
              <div className="p-3 bg-blue-50/50 rounded-md">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {peca.conteudo}
                </p>
              </div>
            </div>

            {/* Compartilhamentos */}
            {peca.compartilhamentos.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Compartilhado com</Label>
                  <div className="space-y-1">
                    {peca.compartilhamentos.map((compartilhamento) => (
                      <div 
                        key={compartilhamento.id}
                        className="flex items-center justify-between p-2 bg-blue-50 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-blue-600" />
                          <span className="text-sm">{compartilhamento.usuarioDestinoNome}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {compartilhamento.permissoes.podeExportar && (
                            <Badge variant="outline" className="text-xs">
                              <Download className="h-3 w-3 mr-1" />
                              Exportar
                            </Badge>
                          )}
                          {compartilhamento.permissoes.podeIntegrarCliente && (
                            <Badge variant="outline" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              Integrar
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          {onShare && (
            <Button 
              variant="outline"
              onClick={() => onShare(peca)}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          )}
          {peca.arquivoProcessado && onDownload && (
            <Button 
              variant="outline"
              onClick={() => onDownload(peca)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          )}
          <Button 
            onClick={() => onOpenChange(false)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}