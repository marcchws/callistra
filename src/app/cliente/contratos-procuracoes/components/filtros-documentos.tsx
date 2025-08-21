"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover"
import { CalendarIcon, Search, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { 
  FiltrosBusca, 
  TIPO_DOCUMENTO_LABELS, 
  STATUS_PAGAMENTO_LABELS 
} from "../types"

interface FiltrosDocumentosProps {
  filtros: FiltrosBusca
  onFiltrosChange: (filtros: FiltrosBusca) => void
  onLimparFiltros: () => void
}

export function FiltrosDocumentos({ 
  filtros, 
  onFiltrosChange, 
  onLimparFiltros 
}: FiltrosDocumentosProps) {
  const [filtrosLocal, setFiltrosLocal] = useState<FiltrosBusca>(filtros)

  const handleChange = (campo: keyof FiltrosBusca, valor: any) => {
    const novosFiltros = { ...filtrosLocal, [campo]: valor }
    setFiltrosLocal(novosFiltros)
  }

  const aplicarFiltros = () => {
    onFiltrosChange(filtrosLocal)
  }

  const limparFiltros = () => {
    const filtrosVazios: FiltrosBusca = {}
    setFiltrosLocal(filtrosVazios)
    onLimparFiltros()
  }

  const temFiltrosAtivos = Object.values(filtrosLocal).some(valor => 
    valor !== undefined && valor !== "" && valor !== null
  )

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Filtros de Busca</h3>
            {temFiltrosAtivos && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={limparFiltros}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Filtro por Cliente */}
            <div className="space-y-2">
              <Label htmlFor="cliente" className="text-sm font-medium">
                Cliente
              </Label>
              <Input
                id="cliente"
                placeholder="Nome do cliente..."
                value={filtrosLocal.cliente || ""}
                onChange={(e) => handleChange("cliente", e.target.value)}
                className="focus:ring-blue-500"
              />
            </div>

            {/* Filtro por Responsável */}
            <div className="space-y-2">
              <Label htmlFor="responsavel" className="text-sm font-medium">
                Responsável
              </Label>
              <Input
                id="responsavel"
                placeholder="Nome do responsável..."
                value={filtrosLocal.responsavel || ""}
                onChange={(e) => handleChange("responsavel", e.target.value)}
                className="focus:ring-blue-500"
              />
            </div>

            {/* Filtro por Tipo de Documento */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Tipo de Documento
              </Label>
              <Select
                value={filtrosLocal.tipoDocumento || "todos"}
                onValueChange={(value) => 
                  handleChange("tipoDocumento", value === "todos" ? undefined : value)
                }
              >
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue placeholder="Selecionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os tipos</SelectItem>
                  {Object.entries(TIPO_DOCUMENTO_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Status de Pagamento */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Status de Pagamento
              </Label>
              <Select
                value={filtrosLocal.statusPagamento || "todos"}
                onValueChange={(value) => 
                  handleChange("statusPagamento", value === "todos" ? undefined : value)
                }
              >
                <SelectTrigger className="focus:ring-blue-500">
                  <SelectValue placeholder="Selecionar status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os status</SelectItem>
                  {Object.entries(STATUS_PAGAMENTO_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtro por Data de Início */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Data de Início (De)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal focus:ring-blue-500",
                      !filtrosLocal.dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filtrosLocal.dataInicio ? (
                      format(filtrosLocal.dataInicio, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      "Selecionar data..."
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filtrosLocal.dataInicio}
                    onSelect={(date) => handleChange("dataInicio", date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Filtro por Data de Fim */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Data de Início (Até)
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal focus:ring-blue-500",
                      !filtrosLocal.dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filtrosLocal.dataFim ? (
                      format(filtrosLocal.dataFim, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      "Selecionar data..."
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filtrosLocal.dataFim}
                    onSelect={(date) => handleChange("dataFim", date)}
                    initialFocus
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Botão de Aplicar Filtros */}
          <div className="flex justify-end">
            <Button 
              onClick={aplicarFiltros}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Search className="h-4 w-4" />
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
