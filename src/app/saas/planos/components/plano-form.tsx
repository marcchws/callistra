"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Plano, PlanoFormData, PlanoFormSchema } from "../types"
import { useEffect } from "react"

interface PlanoFormProps {
  plano?: Plano | null
  isOpen: boolean
  loading: boolean
  onClose: () => void
  onSubmit: (data: PlanoFormData) => void
}

// Formulário baseado EXATAMENTE nos campos especificados no PRD
export function PlanoForm({ plano, isOpen, loading, onClose, onSubmit }: PlanoFormProps) {
  const form = useForm<PlanoFormData>({
    resolver: zodResolver(PlanoFormSchema),
    defaultValues: {
      nome: "",
      status: "ativo",
      valor: 0,
      formaPagamento: "",
      descricao: "",
      periodoFree: 0,
      quantidadeUsuarios: 1,
      quantidadeProcessos: 1,
      quantidadeTokensMensais: 0,
      diasInadimplencia: 5,
      diasBloqueio: 15,
      visivelSite: true,
      planoRecomendado: false
    }
  })

  // Carregar dados do plano para edição
  useEffect(() => {
    if (plano && isOpen) {
      form.reset({
        nome: plano.nome,
        status: plano.status,
        vigencia: plano.vigencia,
        valor: plano.valor,
        formaPagamento: plano.formaPagamento,
        descricao: plano.descricao,
        periodoFree: plano.periodoFree,
        quantidadeUsuarios: plano.quantidadeUsuarios,
        quantidadeProcessos: plano.quantidadeProcessos,
        quantidadeTokensMensais: plano.quantidadeTokensMensais,
        diasInadimplencia: plano.diasInadimplencia,
        diasBloqueio: plano.diasBloqueio,
        visivelSite: plano.visivelSite,
        planoRecomendado: plano.planoRecomendado,
        valorComDesconto: plano.valorComDesconto
      })
    } else if (!plano && isOpen) {
      form.reset()
    }
  }, [plano, isOpen, form])

  const handleSubmit = (data: PlanoFormData) => {
    onSubmit(data)
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {plano ? "Editar Plano" : "Novo Plano"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Informações Básicas</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Nome do plano - Campo Obrigatório */}
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Nome do Plano <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Free, Standard, Premium..." 
                            {...field}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Nome de visualização do plano para o contratante
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status do Plano */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Status do Plano <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-blue-500">
                              <SelectValue placeholder="Selecionar status..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ativo">Ativo</SelectItem>
                            <SelectItem value="inativo">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Define se o plano está ativo ou inativo no sistema
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Vigência do plano - opcional */}
                <FormField
                  control={form.control}
                  name="vigencia"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium">Vigência do Plano</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal focus:ring-blue-500",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecionar data de expiração...</span>
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
                            disabled={(date) => date <= new Date()}
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Data em que o plano irá vencer/expirar (opcional). Ex: plano promocional
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Descrição do plano - Campo obrigatório */}
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Descrição do Plano <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Plano Standard mensal para até 10 usuários com funcionalidades completas..."
                          className="resize-none focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Descrição do que foi adquirido no plano
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Configurações Financeiras */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Configurações Financeiras</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Valor do plano - Campo obrigatório */}
                  <FormField
                    control={form.control}
                    name="valor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Valor do Plano (R$) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Valor pago pelo plano
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Valor com desconto - opcional */}
                  <FormField
                    control={form.control}
                    name="valorComDesconto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Valor com Desconto (R$)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Valor com desconto (Black Friday, Mês do Consumidor, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Forma de pagamento - Campo obrigatório */}
                <FormField
                  control={form.control}
                  name="formaPagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Forma de Pagamento <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Plano anual à vista, Plano mensal 12x no cartão..."
                          {...field}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormDescription>
                        Forma de pagamento do plano
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Limites e Configurações */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Limites e Configurações</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Período Free */}
                  <FormField
                    control={form.control}
                    name="periodoFree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Período Free (dias)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Dias gratuitos de teste antes de iniciar cobrança
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantidade de usuários */}
                  <FormField
                    control={form.control}
                    name="quantidadeUsuarios"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Limite de Usuários <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Limite máximo de usuários que podem ser criados
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantidade de processos */}
                  <FormField
                    control={form.control}
                    name="quantidadeProcessos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Limite de Processos <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            placeholder="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Limite máximo de processos que podem ser criados
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantidade de Tokens mensais */}
                  <FormField
                    control={form.control}
                    name="quantidadeTokensMensais"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Tokens Mensais (IA)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Tokens mensais para criação de peças, revisão ortográfica e pesquisas
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Configurações de Inadimplência */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Configurações de Inadimplência</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Dias para Inadimplência */}
                  <FormField
                    control={form.control}
                    name="diasInadimplencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Dias para Inadimplência</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            max="90"
                            placeholder="5"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Dias após vencimento para aguardar antes de categorizar como inadimplente
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Dias para bloqueio */}
                  <FormField
                    control={form.control}
                    name="diasBloqueio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Dias para Bloqueio</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            max="365"
                            placeholder="15"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Dias inadimplente antes de bloquear acesso do escritório
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Configurações de Exibição */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b pb-2">Configurações de Exibição</h3>
                
                <div className="space-y-4">
                  {/* Visível no site */}
                  <FormField
                    control={form.control}
                    name="visivelSite"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Visível no Site de Vendas
                          </FormLabel>
                          <FormDescription>
                            Define se o plano será exibido na Landing Page
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Plano recomendado */}
                  <FormField
                    control={form.control}
                    name="planoRecomendado"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Plano Recomendado
                          </FormLabel>
                          <FormDescription>
                            Exibe etiqueta visual de "Plano Recomendado" no site
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-3">
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
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Salvando..." : plano ? "Atualizar" : "Criar Plano"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
