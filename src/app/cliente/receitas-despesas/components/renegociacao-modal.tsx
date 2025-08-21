"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import {
  RenegociacaoForm,
  RenegociacaoSchema,
  LancamentoFinanceiro
} from "../types"

interface RenegociacaoModalProps {
  aberto: boolean
  onClose: () => void
  onSubmit: (dados: RenegociacaoForm) => Promise<void>
  lancamento: LancamentoFinanceiro | null
  loading?: boolean
}

export function RenegociacaoModal({
  aberto,
  onClose,
  onSubmit,
  lancamento,
  loading = false
}: RenegociacaoModalProps) {
  const form = useForm<RenegociacaoForm>({
    resolver: zodResolver(RenegociacaoSchema),
    defaultValues: {
      novoValor: lancamento?.valor || 0,
      jurosAplicados: 0,
      observacoes: ""
    }
  })

  const novoValor = form.watch("novoValor")
  const jurosAplicados = form.watch("jurosAplicados")

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const calcularValorTotal = () => {
    return (novoValor || 0) + (jurosAplicados || 0)
  }

  const calcularDiferenca = () => {
    if (!lancamento) return 0
    return calcularValorTotal() - lancamento.valor
  }

  const handleSubmit = async (dados: RenegociacaoForm) => {
    try {
      await onSubmit(dados)
      form.reset()
    } catch (error) {
      // Error handling já está no hook principal
    }
  }

  const handleCancel = () => {
    form.reset()
    onClose()
  }

  if (!lancamento) return null

  return (
    <Dialog open={aberto} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Renegociar Conta Atrasada
          </DialogTitle>
        </DialogHeader>

        {/* Informações do Lançamento Original */}
        <div className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Dados Originais</h4>
              <Badge 
                variant={lancamento.tipo === "receita" ? "default" : "secondary"}
                className={lancamento.tipo === "receita" ? "bg-green-600" : "bg-orange-600"}
              >
                {lancamento.tipo === "receita" ? "Receita" : "Despesa"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Categoria:</span>
                <p className="font-medium">{lancamento.categoria}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Subcategoria:</span>
                <p className="font-medium">{lancamento.subcategoria}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Valor Original:</span>
                <p className="font-medium text-lg">{formatarMoeda(lancamento.valor)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Vencimento:</span>
                <p className="font-medium">
                  {format(lancamento.dataVencimento, "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              {lancamento.processo && (
                <div>
                  <span className="text-muted-foreground">Processo:</span>
                  <p className="font-medium">{lancamento.processo}</p>
                </div>
              )}
              {lancamento.beneficiario && (
                <div>
                  <span className="text-muted-foreground">Beneficiário:</span>
                  <p className="font-medium">{lancamento.beneficiario}</p>
                </div>
              )}
            </div>

            {/* Histórico de Renegociações */}
            {lancamento.renegociacoes && lancamento.renegociacoes.length > 0 && (
              <div className="mt-4">
                <h5 className="font-medium mb-2 text-sm">Renegociações Anteriores:</h5>
                <div className="space-y-2">
                  {lancamento.renegociacoes.map((renegociacao, index) => (
                    <div key={renegociacao.id} className="bg-background p-2 rounded text-xs">
                      <div className="flex justify-between items-center">
                        <span>
                          {format(renegociacao.dataRenegociacao, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                        <span className="font-medium">
                          {formatarMoeda(renegociacao.valorOriginal)} → {formatarMoeda(renegociacao.novoValor)}
                        </span>
                      </div>
                      {renegociacao.observacoes && (
                        <p className="text-muted-foreground mt-1">{renegociacao.observacoes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Formulário de Renegociação */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                          min="0"
                          placeholder="0,00"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormDescription>
                        Valor principal renegociado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Juros Aplicados */}
                <FormField
                  control={form.control}
                  name="jurosAplicados"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Juros Aplicados
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormDescription>
                        Juros de mora ou multa
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Resumo da Renegociação */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium mb-2 text-blue-900">Resumo da Renegociação</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Valor Principal:</span>
                    <span className="font-medium">{formatarMoeda(novoValor || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Juros/Multa:</span>
                    <span className="font-medium">{formatarMoeda(jurosAplicados || 0)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-base">
                    <span className="font-medium">Valor Total:</span>
                    <span className="font-bold text-blue-900">
                      {formatarMoeda(calcularValorTotal())}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Diferença do Original:</span>
                    <span className={`font-medium ${
                      calcularDiferenca() >= 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {calcularDiferenca() >= 0 ? '+' : ''}
                      {formatarMoeda(calcularDiferenca())}
                    </span>
                  </div>
                </div>
              </div>

              {/* Observações */}
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Observações da Renegociação
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Motivo da renegociação, condições acordadas, etc..."
                        className="resize-none focus:ring-blue-500"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Detalhes sobre as condições da renegociação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Confirmar Renegociação"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
