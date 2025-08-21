"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, Upload } from "lucide-react"
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
} from "@/components/ui/form"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

import {
  LancamentoFinanceiroForm,
  LancamentoFinanceiroSchema,
  LancamentoFinanceiro,
  TipoLancamento,
  categoriasReceitas,
  categoriasDespesas,
  subcategoriasReceitas,
  subcategoriasDespesas
} from "../types"

interface LancamentoFormProps {
  aberto: boolean
  onClose: () => void
  onSubmit: (dados: LancamentoFinanceiroForm) => Promise<void>
  lancamento?: LancamentoFinanceiro | null
  modoEdicao?: boolean
  tipoInicial?: TipoLancamento
  loading?: boolean
}

export function LancamentoForm({
  aberto,
  onClose,
  onSubmit,
  lancamento,
  modoEdicao = false,
  tipoInicial,
  loading = false
}: LancamentoFormProps) {
  // Form baseado em schema de validação rigorosa
  const form = useForm<LancamentoFinanceiroForm>({
    resolver: zodResolver(LancamentoFinanceiroSchema),
    defaultValues: {
      tipo: lancamento?.tipo || tipoInicial || "receita",
      categoria: lancamento?.categoria || "",
      subcategoria: lancamento?.subcategoria || "",
      valor: lancamento?.valor || 0,
      dataVencimento: lancamento?.dataVencimento || new Date(),
      dataPagamento: lancamento?.dataPagamento,
      processo: lancamento?.processo || "",
      beneficiario: lancamento?.beneficiario || "",
      observacoes: lancamento?.observacoes || ""
    }
  })

  const tipoSelecionado = form.watch("tipo")
  const categoriaSelecionada = form.watch("categoria")

  // Obter categorias baseadas no tipo
  const categorias = tipoSelecionado === "receita" ? categoriasReceitas : categoriasDespesas

  // Obter subcategorias baseadas na categoria
  const subcategorias = tipoSelecionado === "receita" 
    ? (subcategoriasReceitas as any)[categoriaSelecionada] || []
    : (subcategoriasDespesas as any)[categoriaSelecionada] || []

  // Reset subcategoria quando categoria muda
  const handleCategoriaChange = (novaCategoria: string) => {
    form.setValue("categoria", novaCategoria)
    form.setValue("subcategoria", "") // Reset subcategoria
  }

  const handleSubmit = async (dados: LancamentoFinanceiroForm) => {
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

  return (
    <Dialog open={aberto} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {modoEdicao ? "Editar Lançamento" : "Novo Lançamento"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Tipo - Campo obrigatório */}
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Tipo <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={modoEdicao} // Tipo não pode ser alterado na edição
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-blue-500">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Valor - Campo obrigatório */}
              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Valor <span className="text-red-500">*</span>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Categoria - Campo obrigatório */}
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Categoria <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select 
                    onValueChange={handleCategoriaChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:ring-blue-500">
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subcategoria - Campo obrigatório */}
            <FormField
              control={form.control}
              name="subcategoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Subcategoria <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!categoriaSelecionada}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:ring-blue-500">
                        <SelectValue placeholder="Selecione a subcategoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {subcategorias.map((subcategoria: string) => (
                        <SelectItem key={subcategoria} value={subcategoria}>
                          {subcategoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Data de Vencimento - Campo obrigatório */}
              <FormField
                control={form.control}
                name="dataVencimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Data de Vencimento <span className="text-red-500">*</span>
                    </FormLabel>
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
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
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
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Data de Pagamento - Campo opcional */}
              <FormField
                control={form.control}
                name="dataPagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Data de Pagamento
                    </FormLabel>
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
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione a data</span>
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
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Processo - Campo opcional para agrupamento */}
              <FormField
                control={form.control}
                name="processo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Processo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: PROC-2024-001"
                        {...field}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Beneficiário - Campo opcional para agrupamento */}
              <FormField
                control={form.control}
                name="beneficiario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Beneficiário</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do beneficiário"
                        {...field}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações - Campo opcional */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais..."
                      className="resize-none focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
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
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
