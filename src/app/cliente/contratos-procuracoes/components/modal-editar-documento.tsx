"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { CalendarIcon, Loader2, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { 
  DocumentoSchema, 
  Documento,
  FORMATO_PAGAMENTO_LABELS,
  STATUS_PAGAMENTO_LABELS
} from "../types"

interface ModalEditarDocumentoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documento: Documento | null
  onSalvar: (id: string, dadosAtualizados: Partial<Documento>) => Promise<void>
  loading: boolean
}

export function ModalEditarDocumento({ 
  open, 
  onOpenChange, 
  documento,
  onSalvar,
  loading 
}: ModalEditarDocumentoProps) {
  const [assinaturas, setAssinaturas] = useState<string[]>(documento?.assinaturas || [""])

  const form = useForm<Partial<Documento>>({
    resolver: zodResolver(DocumentoSchema.partial()),
    values: documento ? {
      ...documento,
      assinaturas: documento.assinaturas || [""]
    } : undefined
  })

  const adicionarAssinatura = () => {
    setAssinaturas(prev => [...prev, ""])
  }

  const removerAssinatura = (index: number) => {
    if (assinaturas.length > 1) {
      const novasAssinaturas = assinaturas.filter((_, i) => i !== index)
      setAssinaturas(novasAssinaturas)
      form.setValue("assinaturas", novasAssinaturas.filter(a => a.trim() !== ""))
    }
  }

  const atualizarAssinatura = (index: number, valor: string) => {
    const novasAssinaturas = [...assinaturas]
    novasAssinaturas[index] = valor
    setAssinaturas(novasAssinaturas)
    form.setValue("assinaturas", novasAssinaturas.filter(a => a.trim() !== ""))
  }

  const onSubmit = async (data: Partial<Documento>) => {
    if (!documento?.id) return

    try {
      await onSalvar(documento.id, data)
      onOpenChange(false)
    } catch (error) {
      // Error handled by hook
    }
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(valor)
  }

  if (!documento) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Documento</DialogTitle>
          <DialogDescription>
            Edite as informações do {documento.tipoDocumento} do cliente {documento.cliente}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Informações do Cliente */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="cliente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Cliente <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome do cliente..." 
                        {...field} 
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Responsável <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome do responsável..." 
                        {...field} 
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="oab"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">OAB</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Número OAB..." 
                        {...field} 
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="statusPagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Status de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-blue-500">
                          <SelectValue placeholder="Selecionar status..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(STATUS_PAGAMENTO_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Endereço Comercial */}
            <FormField
              control={form.control}
              name="enderecoComercial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Endereço Comercial</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Endereço comercial..." 
                      {...field} 
                      className="focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Informações Financeiras */}
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="valorNegociado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Valor Negociado <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="0,00" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="formatoPagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Formato de Pagamento <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-blue-500">
                          <SelectValue placeholder="Selecionar formato..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(FORMATO_PAGAMENTO_LABELS).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parcelas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Parcelas</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: 5x R$ 1.000,00" 
                        {...field} 
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Datas */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Data de Início <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal focus:ring-blue-500",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              "Selecionar data..."
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataTermino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Data de Término</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal focus:ring-blue-500",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              "Selecionar data..."
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Assinaturas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Assinaturas <span className="text-red-500">*</span>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarAssinatura}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {assinaturas.map((assinatura, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Assinatura ${index + 1}...`}
                      value={assinatura}
                      onChange={(e) => atualizarAssinatura(index, e.target.value)}
                      className="focus:ring-blue-500"
                    />
                    {assinaturas.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removerAssinatura(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Renegociação */}
            <FormField
              control={form.control}
              name="renegociacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Histórico de Renegociações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Registre aqui as renegociações realizadas..." 
                      {...field} 
                      className="focus:ring-blue-500 min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observações */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais..." 
                      {...field} 
                      className="focus:ring-blue-500 min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Informações de Auditoria */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Informações do Documento</h4>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Tipo:</span>
                  <span className="capitalize">{documento.tipoDocumento}</span>
                </div>
                <div className="flex justify-between">
                  <span>Modelo:</span>
                  <span>{documento.modelo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Criado em:</span>
                  <span>
                    {documento.dataCriacao && 
                      format(documento.dataCriacao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Última atualização:</span>
                  <span>
                    {documento.ultimaAtualizacao && 
                      format(documento.ultimaAtualizacao, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Valor atual:</span>
                  <span className="font-medium">{formatarMoeda(documento.valorNegociado)}</span>
                </div>
              </div>
            </div>
          </form>
        </Form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
