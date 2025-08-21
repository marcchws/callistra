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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, DollarSign, Calendar } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  RenegociacaoSchema, 
  Renegociacao, 
  Documento,
  FORMATO_PAGAMENTO_LABELS
} from "../types"

interface ModalRenegociacaoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documento: Documento | null
  onRenegociar: (renegociacao: Renegociacao) => Promise<void>
  loading: boolean
}

export function ModalRenegociacao({ 
  open, 
  onOpenChange, 
  documento,
  onRenegociar,
  loading 
}: ModalRenegociacaoProps) {
  const form = useForm<Renegociacao>({
    resolver: zodResolver(RenegociacaoSchema),
    defaultValues: {
      documentoId: documento?.id || "",
      novoValor: documento?.valorNegociado || 0,
      novoFormatoPagamento: documento?.formatoPagamento || "a_vista",
      novasParcelas: documento?.parcelas || "",
      observacoes: "",
      dataRenegociacao: new Date()
    }
  })

  const onSubmit = async (data: Renegociacao) => {
    if (!documento?.id) return

    try {
      await onRenegociar({
        ...data,
        documentoId: documento.id
      })
      form.reset()
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

  const valorAtual = form.watch("novoValor") || 0
  const valorOriginal = documento?.valorNegociado || 0
  const diferenca = valorAtual - valorOriginal
  const percentualMudanca = valorOriginal > 0 ? ((diferenca / valorOriginal) * 100) : 0

  if (!documento) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Registrar Renegociação
          </DialogTitle>
          <DialogDescription>
            Registre uma nova renegociação para o {documento.tipoDocumento} do cliente {documento.cliente}.
          </DialogDescription>
        </DialogHeader>

        {/* Informações Atuais */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Dados Atuais do Documento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Cliente:</p>
                <p className="font-medium">{documento.cliente}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Responsável:</p>
                <p className="font-medium">{documento.responsavel}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Valor Atual:</p>
                <p className="font-medium text-green-600">{formatarMoeda(valorOriginal)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Formato Atual:</p>
                <p className="font-medium">{FORMATO_PAGAMENTO_LABELS[documento.formatoPagamento]}</p>
              </div>
              {documento.parcelas && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Parcelas Atuais:</p>
                  <p className="font-medium">{documento.parcelas}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Novo Valor */}
            <FormField
              control={form.control}
              name="novoValor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Novo Valor <span className="text-red-500">*</span>
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
                  
                  {/* Indicador de mudança */}
                  {valorAtual !== valorOriginal && (
                    <div className={`text-sm p-2 rounded ${
                      diferenca > 0 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span>
                          {diferenca > 0 ? 'Aumento' : 'Redução'}: {formatarMoeda(Math.abs(diferenca))}
                        </span>
                        <span className="font-medium">
                          {diferenca > 0 ? '+' : ''}{percentualMudanca.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            />

            {/* Novo Formato de Pagamento */}
            <FormField
              control={form.control}
              name="novoFormatoPagamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Novo Formato de Pagamento <span className="text-red-500">*</span>
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

            {/* Novas Parcelas */}
            <FormField
              control={form.control}
              name="novasParcelas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Novas Parcelas</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: 6x R$ 850,00" 
                      {...field} 
                      className="focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observações da Renegociação */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Observações da Renegociação <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Motivo da renegociação, acordos estabelecidos, condições especiais..." 
                      {...field} 
                      className="focus:ring-blue-500 min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Data da Renegociação (readonly) */}
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data da Renegociação</p>
                <p className="text-sm text-muted-foreground">
                  {format(form.watch("dataRenegociacao"), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
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
            {loading ? "Registrando..." : "Registrar Renegociação"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
