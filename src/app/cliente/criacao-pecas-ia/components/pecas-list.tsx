"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Search, 
  MoreHorizontal, 
  Download, 
  Share2, 
  Trash2, 
  Eye,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Users
} from "lucide-react"
import { PecaJuridica, TIPOS_PECAS_INFO } from "../types"
import { cn } from "@/lib/utils"

interface PecasListProps {
  pecas: PecaJuridica[]
  onView: (peca: PecaJuridica) => void
  onShare: (peca: PecaJuridica) => void
  onDelete: (pecaId: string) => void
  onDownload: (peca: PecaJuridica) => void
  loading?: boolean
}

export function PecasList({ 
  pecas, 
  onView, 
  onShare, 
  onDelete, 
  onDownload,
  loading = false 
}: PecasListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [pecaToDelete, setPecaToDelete] = useState<string | null>(null)

  const filteredPecas = pecas.filter(peca => 
    peca.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    peca.usuarioCriadorNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (peca.tipoPeca && TIPOS_PECAS_INFO[peca.tipoPeca].label.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusIcon = (status: PecaJuridica["status"]) => {
    switch (status) {
      case "concluida":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "em_processamento":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "erro":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "compartilhada":
        return <Users className="h-4 w-4 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: PecaJuridica["status"]) => {
    switch (status) {
      case "concluida":
        return "Concluída"
      case "em_processamento":
        return "Processando"
      case "erro":
        return "Erro"
      case "compartilhada":
        return "Compartilhada"
      default:
        return status
    }
  }

  const getTipoLabel = (tipo: PecaJuridica["tipo"]) => {
    switch (tipo) {
      case "revisao_ortografica":
        return "Revisão Ortográfica"
      case "pesquisa_jurisprudencia":
        return "Pesquisa Jurisprudência"
      case "criacao_peca":
        return "Criação de Peça"
      default:
        return tipo
    }
  }

  const handleDelete = async (pecaId: string) => {
    await onDelete(pecaId)
    setPecaToDelete(null)
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Peças</CardTitle>
              <CardDescription>
                Gerencie todas as peças criadas com IA
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar peças..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Peça Jurídica</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Criado por</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Carregando peças...
                  </TableCell>
                </TableRow>
              ) : filteredPecas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    {searchTerm 
                      ? "Nenhuma peça encontrada com os filtros aplicados."
                      : "Nenhuma peça criada ainda."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPecas.map((peca) => (
                  <TableRow key={peca.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="max-w-[200px] truncate" title={peca.titulo}>
                          {peca.titulo}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="whitespace-nowrap">
                        {getTipoLabel(peca.tipo)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {peca.tipoPeca ? (
                        <span className="text-sm">
                          {TIPOS_PECAS_INFO[peca.tipoPeca].label}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(peca.status)}
                        <span className="text-sm">{getStatusLabel(peca.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {peca.tokensUtilizados.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{peca.usuarioCriadorNome}</p>
                        {peca.compartilhamentos.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            +{peca.compartilhamentos.length} compartilhado(s)
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {peca.dataCriacao.toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {peca.dataCriacao.toLocaleTimeString("pt-BR", { 
                            hour: "2-digit", 
                            minute: "2-digit" 
                          })}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onView(peca)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          {peca.arquivoProcessado && (
                            <DropdownMenuItem onClick={() => onDownload(peca)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onShare(peca)}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Compartilhar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setPecaToDelete(peca.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!pecaToDelete} onOpenChange={() => setPecaToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta peça? Esta ação não pode ser desfeita e 
              removerá todos os compartilhamentos existentes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pecaToDelete && handleDelete(pecaToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}