"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react"
import { ExportOptions } from "../types"

interface BalanceteExportProps {
  onExport: (options: ExportOptions) => Promise<void>
  exportando: boolean
  disabled?: boolean
}

export function BalanceteExport({ onExport, exportando, disabled }: BalanceteExportProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formato, setFormato] = useState<'pdf' | 'csv'>('pdf')
  const [incluirGraficos, setIncluirGraficos] = useState(true)
  const [incluirDetalhamento, setIncluirDetalhamento] = useState(true)
  const [incluirIndicadores, setIncluirIndicadores] = useState(true)

  const handleExport = async () => {
    const options: ExportOptions = {
      formato,
      incluirGraficos: formato === 'pdf' ? incluirGraficos : false,
      incluirDetalhamento,
      incluirIndicadores
    }

    await onExport(options)
    setDialogOpen(false)
  }

  const getFormatIcon = () => {
    return formato === 'pdf' ? FileText : FileSpreadsheet
  }

  const FormatIcon = getFormatIcon()

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        disabled={disabled || exportando}
        className="gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <Download className="h-4 w-4" />
        Exportar Relatório
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Exportar Relatório</DialogTitle>
            <DialogDescription>
              Configure as opções de exportação do balancete
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Formato de Exportação */}
            <div className="space-y-3">
              <Label>Formato do Arquivo</Label>
              <RadioGroup value={formato} onValueChange={(value) => setFormato(value as 'pdf' | 'csv')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4 text-red-600" />
                    PDF - Relatório Completo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    CSV - Dados para Planilha
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Opções de Conteúdo */}
            <div className="space-y-3">
              <Label>Conteúdo a Incluir</Label>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="indicadores"
                    checked={incluirIndicadores}
                    onCheckedChange={(checked) => setIncluirIndicadores(checked as boolean)}
                  />
                  <Label 
                    htmlFor="indicadores" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Indicadores de Performance
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="detalhamento"
                    checked={incluirDetalhamento}
                    onCheckedChange={(checked) => setIncluirDetalhamento(checked as boolean)}
                  />
                  <Label 
                    htmlFor="detalhamento" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Detalhamento por Cliente e Serviço
                  </Label>
                </div>

                {formato === 'pdf' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="graficos"
                      checked={incluirGraficos}
                      onCheckedChange={(checked) => setIncluirGraficos(checked as boolean)}
                    />
                    <Label 
                      htmlFor="graficos" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      Gráficos e Visualizações
                    </Label>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Card */}
            <Card className="bg-gray-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FormatIcon className="h-4 w-4" />
                  Prévia do Relatório
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Período do balancete</li>
                  <li>• Resumo financeiro completo</li>
                  {incluirIndicadores && <li>• Indicadores de performance</li>}
                  {incluirDetalhamento && <li>• Detalhamento por cliente</li>}
                  {incluirDetalhamento && <li>• Detalhamento por serviço</li>}
                  {formato === 'pdf' && incluirGraficos && <li>• Gráficos interativos</li>}
                </ul>
              </CardContent>
            </Card>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDialogOpen(false)}
              disabled={exportando}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleExport}
              disabled={exportando}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {exportando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Exportar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
