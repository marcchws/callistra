"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Loader2, CalendarIcon, DollarSign, FileText } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { ConfirmarPagamento } from "../types"
import { ConfirmarPagamentoSchema } from "../types"
import { formatCurrency, cn } from "../utils"

interface ConfirmarPagamentoDialogProps {
  open: boolean
  onClose: () => void
  cobranca: {
    id: string
    clienteNome: string
    valorAtualizado: number
    contratoOriginal: string
  } | null
  onConfirmar: (cobrancaId: string, dados: ConfirmarPagamento) => void
  loading: boolean
}

export function ConfirmarPagamentoDialog({
  open,
  onClose,
  cobranca,
  onConfirmar,
  loading
}: ConfirmarPagamentoDialogProps) {
  const [valorTemp, setValorTemp] = useState("")

  const form = useForm<ConfirmarPagamento>({
    resolver: zodResolver(ConfirmarPagamentoSchema),
    defaultValues: {
      cobrancaId: cobranca?.id || "",
      valorPago: cobranca?.valorAtualizado || 0,
      dataPagamento: new Date(),
      formaPagamento: "boleto",
      comprovante: "",
      observacoes: ""
    }
  })

  // Resetar form quando cobrança mudar
  useState(() => {
    if (cobranca) {
      form.reset({
        cobrancaId: cobranca.id,
        valorPago: cobranca.valorAtualizado,
        dataPagamento: new Date(),
        formaPagamento: "boleto",
        comprovante: "",
        observacoes: ""
      })
      setValorTemp(formatCurrency(cobranca.valorAtualizado))
    }
  }, [cobranca, form])

  // Formatação de valor em tempo real
  const handleValorChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "")
    const floatValue = parseFloat(numericValue) / 100
    
    form.setValue("valorPago", floatValue)
    
    if (numericValue) {
      setValorTemp(
        new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(floatValue)
      )
    } else {
      setValorTemp("")
    }
  }

  const handleSubmit = (data: ConfirmarPagamento) => {
    if (cobranca) {
      onConfirmar(cobranca.id, data)
      onClose()
    }
  }

  const handleClose = () => {
    form.reset()
    setValorTemp("")
    onClose()
  }

  if (!cobranca) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800">
            Confirmar Pagamento Recebido
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Registre o pagamento recebido para atualizar o status da cobrança
          </DialogDescription>
        </DialogHeader>

        {/* Informações da Cobrança */}
        <Card className="bg-slate-50 border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-slate-800">
              Dados da Cobrança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Cliente:</span>
              <span className="text-sm font-medium text-slate-800">{cobranca.clienteNome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Contrato:</span>
              <span className="text-sm font-mono text-slate-800">{cobranca.contratoOriginal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Valor da Cobrança:</span>
              <span className="text-sm font-bold text-slate-800">
                {formatCurrency(cobranca.valorAtualizado)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Valor Pago */}
              <FormField
                control={form.control}
                name="valorPago"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Valor Pago *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="R$ 0,00"
                          value={valorTemp}
                          onChange={(e) => handleValorChange(e.target.value)}
                          className="pl-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                        />
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500">
                      Valor efetivamente recebido
                    </FormDescription>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              {/* Data do Pagamento */}
              <FormField
                control={form.control}
                name="dataPagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Data do Pagamento *
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal border-slate-300 focus:border-slate-500 focus:ring-slate-500",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs text-slate-500">
                      Data em que o pagamento foi recebido
                    </FormDescription>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </div>

            {/* Forma de Pagamento */}
            <FormField
              control={form.control}
              name="formaPagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Forma de Pagamento *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="boleto">Boleto Bancário</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="cartao">Cartão</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-slate-500">
                    Como o pagamento foi realizado
                  </FormDescription>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            {/* Comprovante */}
            <FormField
              control={form.control}
              name="comprovante"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Comprovante
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Número do comprovante, TID, etc."
                        className="pl-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500">
                    Número do comprovante ou identificação do pagamento (opcional)
                  </FormDescription>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            {/* Observações */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Observações
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais sobre o pagamento (opcional)"
                      className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500">
                    Detalhes adicionais sobre o pagamento
                  </FormDescription>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            {/* Preview da Confirmação */}
            {form.watch("valorPago") > 0 && (
              <>
                <Separator />
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-sm font-medium text-green-800 mb-2">
                    Resumo da Confirmação
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Valor a ser confirmado:</span>
                      <span className="font-medium text-green-800">
                        {formatCurrency(form.watch("valorPago"))}
                      </span>
                    </div>
                    {form.watch("valorPago") !== cobranca.valorAtualizado && (
                      <div className="flex justify-between">
                        <span className="text-green-700">
                          {form.watch("valorPago") > cobranca.valorAtualizado ? "Diferença a maior:" : "Diferença a menor:"}
                        </span>
                        <span className={cn(
                          "font-medium",
                          form.watch("valorPago") > cobranca.valorAtualizado ? "text-green-800" : "text-orange-700"
                        )}>
                          {formatCurrency(Math.abs(form.watch("valorPago") - cobranca.valorAtualizado))}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-green-700">Data:</span>
                      <span className="text-green-800">
                        {form.watch("dataPagamento") && 
                          format(form.watch("dataPagamento"), "dd/MM/yyyy")
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Confirmando..." : "Confirmar Pagamento"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}