"use client"

import { useState } from "react"
import { format } from "date-fns"
import { 
  Search, 
  Filter, 
  FileText,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  ChevronRight,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Contract, ContractFilters } from "./types"

interface ContractListProps {
  contracts: Contract[]
  onSelectContract: (contract: Contract) => void
  onApplyFilters: (filters: ContractFilters) => void
  loading?: boolean
}

export function ContractList({ 
  contracts, 
  onSelectContract, 
  onApplyFilters,
  loading = false 
}: ContractListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<ContractFilters>({})

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onApplyFilters({ ...filters, cliente: value })
  }

  const handleFilterChange = (key: keyof ContractFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onApplyFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({})
    setSearchTerm("")
    onApplyFilters({})
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pago":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "inadimplente":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pago":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Pago
          </Badge>
        )
      case "inadimplente":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Inadimplente
          </Badge>
        )
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Pendente
          </Badge>
        )
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  const hasActiveFilters = Object.keys(filters).length > 0 || searchTerm !== ""

  return (
    <div className="space-y-4">
      {/* Barra de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por cliente..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2"
                disabled={loading}
              >
                <Filter className="h-4 w-4" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1">
                    {Object.keys(filters).length + (searchTerm ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Filtros Avançados</h4>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tipo de Documento</label>
                    <Select
                      value={filters.tipoDocumento || "todos"}
                      onValueChange={(value) => 
                        handleFilterChange("tipoDocumento", value === "todos" ? undefined : value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="contrato">Contratos</SelectItem>
                        <SelectItem value="procuracao">Procurações</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status de Pagamento</label>
                    <Select
                      value={filters.statusPagamento || "todos"}
                      onValueChange={(value) => 
                        handleFilterChange("statusPagamento", value === "todos" ? undefined : value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="inadimplente">Inadimplente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Valor Mínimo</label>
                      <Input
                        type="number"
                        placeholder="R$ 0,00"
                        value={filters.valorMin || ""}
                        onChange={(e) => 
                          handleFilterChange("valorMin", e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Valor Máximo</label>
                      <Input
                        type="number"
                        placeholder="R$ 0,00"
                        value={filters.valorMax || ""}
                        onChange={(e) => 
                          handleFilterChange("valorMax", e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                  >
                    Limpar Filtros
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Badges de Filtros Ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-1">
              Cliente: {searchTerm}
              <button
                onClick={() => handleSearch("")}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.tipoDocumento && (
            <Badge variant="secondary" className="gap-1">
              Tipo: {filters.tipoDocumento === "contrato" ? "Contratos" : "Procurações"}
              <button
                onClick={() => handleFilterChange("tipoDocumento", undefined)}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.statusPagamento && (
            <Badge variant="secondary" className="gap-1">
              Status: {filters.statusPagamento}
              <button
                onClick={() => handleFilterChange("statusPagamento", undefined)}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Tabela de Contratos */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {hasActiveFilters 
                      ? "Nenhum documento encontrado com os filtros aplicados"
                      : "Nenhum documento cadastrado"
                    }
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => (
                <TableRow 
                  key={contract.id} 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onSelectContract(contract)}
                >
                  <TableCell>
                    <FileText className="h-4 w-4 text-gray-400" />
                  </TableCell>
                  <TableCell className="font-medium">
                    {contract.cliente}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {contract.tipoDocumento === "contrato" ? "Contrato" : "Procuração"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {contract.modelo.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-gray-400" />
                      <span className="font-medium">
                        {formatCurrency(contract.valorNegociado)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(contract.statusPagamento)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(contract.dataInicio, "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Resumo */}
      {contracts.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {contracts.length} {contracts.length === 1 ? "documento" : "documentos"}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              {getStatusIcon("pago")}
              {contracts.filter(c => c.statusPagamento === "pago").length} pagos
            </span>
            <span className="flex items-center gap-1">
              {getStatusIcon("pendente")}
              {contracts.filter(c => c.statusPagamento === "pendente").length} pendentes
            </span>
            <span className="flex items-center gap-1">
              {getStatusIcon("inadimplente")}
              {contracts.filter(c => c.statusPagamento === "inadimplente").length} inadimplentes
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
