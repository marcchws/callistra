"use client"

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { 
  DollarSign, 
  Percent, 
  Loader2,
  AlertCircle,
  Calculator,
  TrendingUp
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Lancamento, RenegociacaoFormData, RenegociacaoSchema } from "../types"
import { formatCurrency, formatDate, getDiasAtraso, calcularValorComJuros } from "../utils"
import { useEffect, useState } from "react"

interface RenegociacaoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: RenegociacaoFormData) => Promise<void>
  lancamento: Lancamento | null
  loading?: boolean
}

export function RenegociacaoDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  lancamento,
  loading = false 
}: RenegociacaoDialogProps) {
  const [valorComJuros, setValorComJuros] = useState(0)
  
  const form = useForm<RenegociacaoFormData>({
    resolver: zodResolver(RenegociacaoSchema),
    defaultValues: {
      valorNovo: lancamento?.valor || 0,
      juros: 0,
      motivo: ""
    }
  })

  const jurosAtual = form.watch("juros")
  const valorNovoAtual = form.watch("valorNovo")

  // Calcular valor com juros automaticamente
  useEffect(() => {
    if (lancamento) {
      const valorCalculado = calcularValorComJuros(lancamento.valor, jurosAtual)
      setValorComJuros(valorCalculado)
      if (jurosAtual > 0) {
        form.setValue("valorNovo", valorCalculado)
      }
    }
  }, [jurosAtual, lancamento, form])

  const handleSubmit = async (data: RenegociacaoFormData) => {
    try {
      await onSubmit(data)
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao renegociar:", error)
    }
  }

  if (!lancamento) return null

  const diasAtraso = getDiasAtraso(lancamento)
  const temRenegociacoes = lancamento.renegociacoes && lancamento.renegociacoes.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Renegociar Conta
          </DialogTitle>
          <DialogDescription>
            Registre os novos termos de pagamento para esta conta atrasada.
          </DialogDescription>
        </DialogHeader>

        {/* Informações do Lançamento */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Beneficiário</p>
                <p className="font-medium">{lancamento.beneficiario || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Processo</p>
                <p className="font-medium">{lancamento.processo || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Valor Original</p>
                <p className="font-medium text-blue-600">
                  {formatCurrency(lancamento.valor)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Vencimento</p>
                <p className="font-medium">
                  {formatDate(lancamento.dataVencimento)}
                </p>
              </div>
            </div>

            {diasAtraso > 0 && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  Esta conta está <strong>{diasAtraso} dias</strong> em atraso.
                </AlertDescription>
              </Alert>
            )}

            {temRenegociacoes && (
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Esta conta já foi renegociada {lancamento.renegociacoes!.length} vez(es).
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Juros */}
            <FormField
              control={form.control}
              name="juros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Percentual de Juros
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Percent className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        className="pl-10 focus:ring-blue-500"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Digite o percentual de juros a ser aplicado
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Valor calculado com juros */}
            {jurosAtual > 0 && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      Valor com juros ({jurosAtual}%):
                    </span>
                  </div>
                  <span className="font-semibold text-green-800">
                    {formatCurrency(valorComJuros)}
                  </span>
                </CardContent>
              </Card>
            )}

            {/* Novo Valor */}
            <FormField
              control={form.control}
              name="valorNovo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Novo Valor <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        className="pl-10 focus:ring-blue-500"
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Valor final após a renegociação
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Motivo */}
            <FormField
              control={form.control}
              name="motivo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da Renegociação</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o motivo da renegociação..."
                      className="resize-none focus:ring-blue-500"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Opcional, mas recomendado para histórico
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading ? "Salvando..." : "Confirmar Renegociação"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}