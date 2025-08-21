"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Loader2 
} from "lucide-react"
import { toast } from 'sonner'

interface BalanceteExportProps {
  onExport: (formato: 'pdf' | 'csv') => Promise<void>
  disabled?: boolean
}

export function BalanceteExport({ onExport, disabled }: BalanceteExportProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exporting, setExporting] = useState<'pdf' | 'csv' | null>(null)
  const [options, setOptions] = useState({
    incluirGraficos: true,
    incluirDetalhes: true,
    incluirKpis: true
  })

  const handleExport = async (formato: 'pdf' | 'csv') => {
    setExporting(formato)
    
    try {
      await onExport(formato)
      
      toast.success(
        `Relatório exportado em ${formato.toUpperCase()} com sucesso!`,
        {
          duration: 3000,
          position: "bottom-right"
        }
      )
      
      setIsOpen(false)
    } catch (error) {
      toast.error(
        `Erro ao exportar relatório em ${formato.toUpperCase()}`,
        {
          duration: 3000,
          position: "bottom-right"
        }
      )
    } finally {
      setExporting(null)
    }
  }

  const exportOptions = [
    {
      format: 'pdf' as const,
      title: 'Exportar PDF',
      description: 'Relatório completo com gráficos e formatação',
      icon: FileText,
      color: 'bg-red-50 text-red-600 hover:bg-red-100'
    },
    {
      format: 'csv' as const,
      title: 'Exportar CSV',
      description: 'Dados tabulares para análise em planilhas',
      icon: FileSpreadsheet,
      color: 'bg-green-50 text-green-600 hover:bg-green-100'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2"
          disabled={disabled}
        >
          <Download className="h-4 w-4" />
          Exportar Relatório
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportar Balancete</DialogTitle>
          <DialogDescription>
            Selecione o formato e opções para exportação do relatório
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Opções de Exportação */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Incluir no relatório:</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="graficos"
                  checked={options.incluirGraficos}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, incluirGraficos: !!checked }))
                  }
                />
                <Label htmlFor="graficos" className="text-sm">
                  Gráficos e visualizações
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="detalhes"
                  checked={options.incluirDetalhes}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, incluirDetalhes: !!checked }))
                  }
                />
                <Label htmlFor="detalhes" className="text-sm">
                  Detalhamento por categoria
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="kpis"
                  checked={options.incluirKpis}
                  onCheckedChange={(checked) => 
                    setOptions(prev => ({ ...prev, incluirKpis: !!checked }))
                  }
                />
                <Label htmlFor="kpis" className="text-sm">
                  Indicadores de performance
                </Label>
              </div>
            </div>
          </div>

          {/* Formatos de Exportação */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Formato de exportação:</Label>
            <div className="grid gap-3">
              {exportOptions.map((option) => (
                <Card 
                  key={option.format}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => handleExport(option.format)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${option.color}`}>
                        <option.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{option.title}</h4>
                          {exporting === option.format && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={!!exporting}
          >
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
