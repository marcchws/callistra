"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Loader2, CalendarIcon, DollarSign, FileText } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { CobrancaFormProps, CobrancaForm } from "../types"
import { CobrancaFormSchema } from "../types"
import { formatCurrency, cn } from "../utils"

export function CobrancaForm({ 
  cobranca, 
  clientes, 
  onSubmit, 
  onCancel, 
  loading 
}: CobrancaFormProps) {
  const [valorTemp, setValorTemp] = useState("")
  
  const form = useForm<CobrancaForm>({
    resolver: zodResolver(CobrancaFormSchema),
    defaultValues: {
      clienteId: cobranca?.clienteId || "",
      valor: cobranca?.valor || 0,
      dataVencimento: cobranca?.dataVencimento || new Date(),
      tipo: cobranca?.tipo || "boleto",
      observacoes: cobranca?.observacoes || ""
    }
  })

  const isEditMode = !!cobranca

  // Formatação de valor em tempo real
  const handleValorChange = (value: string) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, "")
    
    // Converte para número com duas casas decimais
    const floatValue = parseFloat(numericValue) / 100
    
    // Atualiza o valor no formulário
    form.setValue("valor", floatValue)
    
    // Formata para exibição
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

  const handleSubmit = (data: CobrancaForm) => {
    onSubmit(data)
  }

  const clientesDisponiveis = clientes.filter(c => !c.bloqueado)
  const clientesBloqueados = clientes.filter(c => c.bloqueado)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="pb-6">
        <CardTitle className="text-xl font-semibold text-slate-800">
          {isEditMode ? "Editar Cobrança" : "Nova Cobrança"}
        </CardTitle>
        <CardDescription className="text-slate-600">
          {isEditMode 
            ? "Edite os dados da cobrança selecionada"
            : "Preencha os dados para gerar uma nova cobrança"
          }
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            {/* Seleção de Cliente */}
            <FormField
              control={form.control}
              name="clienteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Cliente *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientesDisponiveis.length > 0 && (
                        <>
                          {clientesDisponiveis.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id}>
                              <div className="flex items-center gap-2">
                                <span>{cliente.nome}</span>
                                <span className="text-xs text-slate-500">
                                  ({cliente.documento})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </>
                      )}
                      
                      {clientesBloqueados.length > 0 && (
                        <>
                          <SelectItem value="divider" disabled>
                            <div className="text-xs text-slate-400 border-t pt-2">
                              Clientes Bloqueados (não podem receber cobranças)
                            </div>
                          </SelectItem>
                          {clientesBloqueados.map((cliente) => (
                            <SelectItem key={cliente.id} value={cliente.id} disabled>
                              <div className="flex items-center gap-2 opacity-50">
                                <span>{cliente.nome}</span>
                                <span className="text-xs text-red-500">
                                  BLOQUEADO
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-slate-500">
                    Apenas clientes não bloqueados podem receber novas cobranças
                  </FormDescription>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Valor */}
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Valor *
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
                      Digite o valor da cobrança
                    </FormDescription>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />

              {/* Data de Vencimento */}
              <FormField
                control={form.control}
                name="dataVencimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Data de Vencimento *
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
                          disabled={(date) => date < new Date()}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs text-slate-500">
                      Data limite para pagamento
                    </FormDescription>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
            </div>

            {/* Tipo de Cobrança */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Tipo de Cobrança *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="boleto">
                        <div className="flex flex-col gap-1">
                          <span>Boleto Bancário</span>
                          <span className="text-xs text-slate-500">
                            Geração automática de boleto registrado
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="pix">
                        <div className="flex flex-col gap-1">
                          <span>PIX</span>
                          <span className="text-xs text-slate-500">
                            Pagamento instantâneo via PIX
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="link_pagamento">
                        <div className="flex flex-col gap-1">
                          <span>Link de Pagamento</span>
                          <span className="text-xs text-slate-500">
                            Link para múltiplas formas de pagamento
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-xs text-slate-500">
                    Escolha a forma de cobrança mais adequada
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
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Textarea
                        placeholder="Adicione informações relevantes sobre a cobrança (opcional)"
                        className="pl-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500 resize-none"
                        rows={3}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500">
                    Informações adicionais que aparecerão na cobrança
                  </FormDescription>
                  <FormMessage className="text-xs text-red-600" />
                </FormItem>
              )}
            />

            {/* Preview do Valor */}
            {form.watch("valor") > 0 && (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  Resumo da Cobrança
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Valor:</span>
                    <span className="font-medium text-slate-800">
                      {formatCurrency(form.watch("valor"))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vencimento:</span>
                    <span className="text-slate-800">
                      {form.watch("dataVencimento") && 
                        format(form.watch("dataVencimento"), "dd/MM/yyyy")
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tipo:</span>
                    <span className="text-slate-800">
                      {form.watch("tipo") === "boleto" && "Boleto Bancário"}
                      {form.watch("tipo") === "pix" && "PIX"}
                      {form.watch("tipo") === "link_pagamento" && "Link de Pagamento"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end gap-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-slate-600 hover:bg-slate-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading 
                ? "Salvando..." 
                : isEditMode 
                  ? "Atualizar Cobrança" 
                  : "Criar Cobrança"
              }
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}