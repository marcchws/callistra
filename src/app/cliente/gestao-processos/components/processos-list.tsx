"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Eye, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  History,
  ExternalLink,
  Shield,
  ShieldCheck,
  Users
} from "lucide-react"
import { Processo } from "../types"
import { 
  formatarData, 
  formatarValor, 
  getCorAcesso, 
  getTextoAcesso,
  truncarTexto,
  extrairIniciais
} from "../utils"

interface ProcessosListProps {
  processos: Processo[]
  onEdit: (processo: Processo) => void
  onDelete: (id: string) => void
  onViewHistory: (processo: Processo) => void
  loading?: boolean
}

export function ProcessosList({ 
  processos, 
  onEdit, 
  onDelete, 
  onViewHistory,
  loading = false 
}: ProcessosListProps) {
  const [processoParaExcluir, setProcessoParaExcluir] = useState<string | null>(null)

  const handleDelete = () => {
    if (processoParaExcluir) {
      onDelete(processoParaExcluir)
      setProcessoParaExcluir(null)
    }
  }

  const getIconeAcesso = (acesso: string) => {
    switch (acesso) {
      case 'privado':
        return <Shield className="h-4 w-4" />
      case 'envolvidos':
        return <Users className="h-4 w-4" />
      default:
        return <ShieldCheck className="h-4 w-4" />
    }
  }

  const abrirLinkTribunal = (link?: string) => {
    if (link) {
      window.open(link, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 animate-pulse rounded" />
        ))}
      </div>
    )
  }

  if (processos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Nenhum processo encontrado</p>
        <p className="text-sm text-muted-foreground mt-2">
          Use os filtros acima ou adicione um novo processo
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pasta</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Processo</TableHead>
              <TableHead>Vara/Foro</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Valor da Causa</TableHead>
              <TableHead>Acesso</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processos.map((processo) => (
              <TableRow key={processo.id}>
                <TableCell>
                  <div className="font-medium">
                    {processo.pasta || "—"}
                  </div>
                  {processo.numero && (
                    <div className="text-xs text-muted-foreground">
                      {processo.numero}
                    </div>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {truncarTexto(processo.nomeCliente, 30)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {processo.qualificacaoCliente}
                    </Badge>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {processo.tituloProcesso || processo.acao || "—"}
                    </div>
                    {processo.instancia && (
                      <Badge variant="secondary" className="text-xs">
                        {processo.instancia}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      {processo.vara || "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {processo.foro || "—"}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                      {extrairIniciais(processo.responsavel)}
                    </div>
                    <div className="text-sm">
                      {truncarTexto(processo.responsavel, 15)}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="text-sm font-medium">
                    {formatarValor(processo.valorCausa)}
                  </div>
                  {processo.valorCondenacao && processo.valorCondenacao > 0 && (
                    <div className="text-xs text-green-600">
                      Cond: {formatarValor(processo.valorCondenacao)}
                    </div>
                  )}
                </TableCell>
                
                <TableCell>
                  <Badge 
                    variant={getCorAcesso(processo.acesso)}
                    className="gap-1"
                  >
                    {getIconeAcesso(processo.acesso)}
                    {getTextoAcesso(processo.acesso)}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      {formatarData(processo.distribuidoEm)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Atualizado: {formatarData(processo.atualizadoEm)}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      
                      <DropdownMenuItem onClick={() => onEdit(processo)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => onViewHistory(processo)}>
                        <History className="mr-2 h-4 w-4" />
                        Histórico
                      </DropdownMenuItem>
                      
                      {processo.linkTribunal && (
                        <DropdownMenuItem onClick={() => abrirLinkTribunal(processo.linkTribunal)}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Ver no Tribunal
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        onClick={() => setProcessoParaExcluir(processo.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <AlertDialog 
        open={!!processoParaExcluir} 
        onOpenChange={() => setProcessoParaExcluir(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O processo será removido permanentemente
              do sistema. Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
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
