"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileDown, FileSpreadsheet, History, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"
import type { ExportHistory } from "../types"

interface DashboardExportsProps {
  exportHistory: ExportHistory[]
  onExportPDF: () => Promise<string>
  onExportExcel: () => Promise<string>
}

export function DashboardExports({
  exportHistory,
  onExportPDF,
  onExportExcel
}: DashboardExportsProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportType, setExportType] = useState<"pdf" | "excel" | null>(null)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  const handleExportPDF = async () => {
    try {
      setIsExporting(true)
      setExportType("pdf")
      const fileName = await onExportPDF()
      toast.success(`Dashboard exportado com sucesso!`, {
        description: `Arquivo: ${fileName}`,
        duration: 3000,
        position: "bottom-right"
      })
    } catch (error) {
      toast.error("Erro ao exportar dashboard para PDF", {
        description: "Por favor, tente novamente.",
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  const handleExportExcel = async () => {
    try {
      setIsExporting(true)
      setExportType("excel")
      const fileName = await onExportExcel()
      toast.success(`Dashboard exportado com sucesso!`, {
        description: `Arquivo: ${fileName}`,
        duration: 3000,
        position: "bottom-right"
      })
    } catch (error) {
      toast.error("Erro ao exportar dashboard para Excel", {
        description: "Por favor, tente novamente.",
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setIsExporting(false)
      setExportType(null)
    }
  }

  const formatFilters = (filters: ExportHistory["filtros"]) => {
    const parts = []
    
    if (filters.periodo.inicio && filters.periodo.fim) {
      parts.push(`Período: ${format(filters.periodo.inicio, "dd/MM/yyyy")} - ${format(filters.periodo.fim, "dd/MM/yyyy")}`)
    }
    
    if (filters.usuario) {
      parts.push(`Usuário: ${filters.usuario}`)
    }
    
    if (filters.cargo) {
      parts.push(`Cargo: ${filters.cargo}`)
    }
    
    if (filters.status && filters.status !== "todos") {
      parts.push(`Status: ${filters.status}`)
    }
    
    if (filters.busca) {
      parts.push(`Busca: ${filters.busca}`)
    }
    
    return parts.length > 0 ? parts.join(" | ") : "Sem filtros aplicados"
  }

  return (
    <div className="flex items-center gap-3">
      {/* Botão Exportar PDF */}
      <Button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="gap-2 bg-blue-600 hover:bg-blue-700"
      >
        {isExporting && exportType === "pdf" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileDown className="h-4 w-4" />
        )}
        Exportar PDF
      </Button>

      {/* Botão Exportar Excel */}
      <Button
        onClick={handleExportExcel}
        disabled={isExporting}
        variant="outline"
        className="gap-2"
      >
        {isExporting && exportType === "excel" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="h-4 w-4" />
        )}
        Exportar Excel
      </Button>

      {/* Dialog Histórico de Exportações */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <History className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Histórico de Exportações</DialogTitle>
            <DialogDescription>
              Visualize todas as exportações realizadas do dashboard
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Formato</TableHead>
                  <TableHead>Arquivo</TableHead>
                  <TableHead>Filtros Aplicados</TableHead>
                  <TableHead>Usuário</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exportHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Nenhuma exportação realizada ainda
                    </TableCell>
                  </TableRow>
                ) : (
                  exportHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {format(item.data, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.formato === "pdf" ? "default" : "secondary"}>
                          {item.formato.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {item.nomeArquivo}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <span className="text-sm text-muted-foreground truncate">
                          {formatFilters(item.filtros)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.usuario}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}