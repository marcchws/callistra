"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Clock, User, FileText, Image, Package, Edit, Search, Filter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { HistoryEntry } from "../types"

interface HistoryDialogProps {
  isOpen: boolean
  onClose: () => void
  history: HistoryEntry[]
}

export function HistoryDialog({ isOpen, onClose, history }: HistoryDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  // Ícones para cada tipo de ação
  const actionIcons: Record<HistoryEntry["action"], React.ReactNode> = {
    text_edit: <FileText className="h-4 w-4" />,
    image_upload: <Image className="h-4 w-4" />,
    image_delete: <Image className="h-4 w-4" />,
    plan_update: <Package className="h-4 w-4" />,
    section_update: <Edit className="h-4 w-4" />,
  }

  // Cores para badges de ação
  const actionColors: Record<HistoryEntry["action"], string> = {
    text_edit: "bg-blue-100 text-blue-700",
    image_upload: "bg-green-100 text-green-700",
    image_delete: "bg-red-100 text-red-700",
    plan_update: "bg-purple-100 text-purple-700",
    section_update: "bg-amber-100 text-amber-700",
  }

  // Labels para ações
  const actionLabels: Record<HistoryEntry["action"], string> = {
    text_edit: "Edição de Texto",
    image_upload: "Upload de Imagem",
    image_delete: "Exclusão de Imagem",
    plan_update: "Atualização de Planos",
    section_update: "Atualização de Seção",
  }

  // Filtrar histórico
  const filteredHistory = history.filter(entry => {
    const matchesSearch = 
      entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === "all" || entry.action === filterType

    return matchesSearch && matchesFilter
  })

  // Formatar data/hora
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }

  // Calcular tempo decorrido
  const getTimeAgo = (timestamp: string) => {
    const now = new Date()
    const date = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Agora mesmo"
    if (diffInMinutes < 60) return `${diffInMinutes} min atrás`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h atrás`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 30) return `${diffInDays} dias atrás`
    
    return formatDateTime(timestamp)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Histórico de Alterações
          </DialogTitle>
          <DialogDescription>
            Visualize todas as alterações realizadas no conteúdo da landing page
          </DialogDescription>
        </DialogHeader>

        {/* Filtros */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar no histórico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as ações</SelectItem>
              <SelectItem value="text_edit">Edição de Texto</SelectItem>
              <SelectItem value="image_upload">Upload de Imagem</SelectItem>
              <SelectItem value="image_delete">Exclusão de Imagem</SelectItem>
              <SelectItem value="plan_update">Atualização de Planos</SelectItem>
              <SelectItem value="section_update">Atualização de Seção</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabela de histórico */}
        <ScrollArea className="h-[400px] border rounded-lg">
          {filteredHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">Data/Hora</TableHead>
                  <TableHead className="w-[100px]">Usuário</TableHead>
                  <TableHead className="w-[150px]">Ação</TableHead>
                  <TableHead>Detalhes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">
                      <div>
                        <p className="font-medium">{getTimeAgo(entry.timestamp)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(entry.timestamp)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span className="text-sm">{entry.user}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${actionColors[entry.action]} gap-1`}>
                        {actionIcons[entry.action]}
                        {actionLabels[entry.action]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <p>{entry.details}</p>
                      {entry.blockId && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Bloco: {entry.blockId}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
              <Clock className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">Nenhum registro encontrado</p>
              <p className="text-xs mt-1">
                {searchTerm || filterType !== "all"
                  ? "Tente ajustar os filtros"
                  : "O histórico aparecerá aqui após as primeiras alterações"}
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Resumo */}
        {history.length > 0 && (
          <div className="flex justify-between items-center pt-2 border-t text-sm text-muted-foreground">
            <p>
              Mostrando {filteredHistory.length} de {history.length} registros
            </p>
            <p>
              Últimas 100 alterações são mantidas
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
