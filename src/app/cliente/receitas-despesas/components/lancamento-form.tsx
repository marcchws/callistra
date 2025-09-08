"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { 
  CalendarIcon, 
  Upload, 
  X, 
  FileText, 
  Loader2,
  Paperclip,
  DollarSign,
  Tag
} from "lucide-react"
import { 
  Lancamento, 
  LancamentoFormData, 
  LancamentoSchema, 
  TipoLancamento,
  Anexo
} from "../types"
import { categoriasReceitas, categoriasDespesas, getSubcategorias } from "../categorias"
import { formatFileSize, getFileExtension, isValidFileType } from "../utils"
import { toast } from "sonner"

interface LancamentoFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: LancamentoFormData) => Promise<any>
  onAnexar?: (file: File) => Promise<Anexo>
  lancamento?: Lancamento | null
  tipo?: TipoLancamento
  loading?: boolean
}

export function LancamentoForm({ 
  open, 
  onOpenChange, 
  onSubmit, 
  onAnexar,
  lancamento, 
  tipo,
  loading = false 
}: LancamentoFormProps) {
  const [categoriaAtual, setCategoriaAtual] = useState<string>("")
  const [arquivosParaUpload, setArquivosParaUpload] = useState<File[]>([])
  const [uploadingFiles, setUploadingFiles] = useState(false)

  const form = useForm<LancamentoFormData>({
    resolver: zodResolver(LancamentoSchema),
    defaultValues: {
      tipo: tipo || TipoLancamento.RECEITA,
      categoria: "",
      subcategoria: "",
      valor: 0,
      dataVencimento: new Date(),
      dataPagamento: null,
      processo: null,
      beneficiario: null,
      observacoes: null
    }
  })

  // Atualizar form quando lancamento mudar
  useEffect(() => {
    if (lancamento) {
      form.reset({
        tipo: lancamento.tipo,
        categoria: lancamento.categoria,
        subcategoria: lancamento.subcategoria,
        valor: lancamento.valor,
        dataVencimento: new Date(lancamento.dataVencimento),
        dataPagamento: lancamento.dataPagamento ? new Date(lancamento.dataPagamento) : null,
        processo: lancamento.processo,
        beneficiario: lancamento.beneficiario,
        observacoes: lancamento.observacoes
      })
      setCategoriaAtual(lancamento.categoria)
    } else if (tipo) {
      form.setValue("tipo", tipo)
    }
  }, [lancamento, tipo, form])

  const tipoAtual = form.watch("tipo")
  const categorias = tipoAtual === TipoLancamento.RECEITA ? categoriasReceitas : categoriasDespesas
  const subcategorias = getSubcategorias(tipoAtual, categoriaAtual)

  const handleCategoriaChange = (categoria: string) => {
    setCategoriaAtual(categoria)
    form.setValue("categoria", categoria)
    form.setValue("subcategoria", "") // Limpar subcategoria quando categoria mudar
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      if (!isValidFileType(file)) {
        toast.error(`Tipo de arquivo não permitido: ${file.name}`)
        return false
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error(`Arquivo muito grande: ${file.name}`)
        return false
      }
      return true
    })

    setArquivosParaUpload(prev => [...prev, ...validFiles])
  }

  const removerArquivo = (index: number) => {
    setArquivosParaUpload(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (data: LancamentoFormData) => {
    try {
      const resultado = await onSubmit(data)
      
      // Upload de arquivos se houver
      if (onAnexar && arquivosParaUpload.length > 0 && resultado?.id) {
        setUploadingFiles(true)
        for (const file of arquivosParaUpload) {
          await onAnexar(file)
        }
        setUploadingFiles(false)
      }

      setArquivosParaUpload([])
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao salvar lançamento:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {lancamento ? "Editar" : "Novo"} Lançamento
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do lançamento. Campos marcados com * são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Tipo */}
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tipo <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!!lancamento || !!tipo}
                  >
                    <FormControl>
                      <SelectTrigger className="focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TipoLancamento.RECEITA}>
                        Receita
                      </SelectItem>
                      <SelectItem value={TipoLancamento.DESPESA}>
                        Despesa
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {/* Categoria */}
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Categoria <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={handleCategoriaChange}
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-blue-500">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categorias.map(cat => (
                          <SelectItem key={cat.nome} value={cat.nome}>
                            {cat.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Subcategoria */}
              <FormField
                control={form.control}
                name="subcategoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Subcategoria <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!categoriaAtual}
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-blue-500">
                          <SelectValue placeholder="Selecione a categoria primeiro..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subcategorias.map(sub => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Valor */}
            <FormField
              control={form.control}
              name="valor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Valor <span className="text-red-500">*</span>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              {/* Data de Vencimento */}
              <FormField
                control={form.control}
                name="dataVencimento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Data de Vencimento <span className="text-red-500">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              "Selecione a data"
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
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

              {/* Data de Pagamento */}
              <FormField
                control={form.control}
                name="dataPagamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Pagamento/Recebimento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              "Não pago/recebido"
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Preencha se já foi pago ou recebido
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Processo */}
              <FormField
                control={form.control}
                name="processo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Processo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: PROC-001"
                        className="focus:ring-blue-500"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Beneficiário */}
              <FormField
                control={form.control}
                name="beneficiario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Beneficiário</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do cliente ou fornecedor"
                        className="focus:ring-blue-500"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Observações */}
            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Informações adicionais..."
                      className="resize-none focus:ring-blue-500"
                      rows={3}
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Anexos */}
            <div className="space-y-2">
              <Label>Anexos</Label>
              <div className="border-2 border-dashed rounded-lg p-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Clique ou arraste arquivos aqui
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    PDF, Imagens, Word, Excel (máx. 10MB)
                  </span>
                </label>
              </div>

              {/* Lista de arquivos */}
              {arquivosParaUpload.length > 0 && (
                <div className="space-y-2 mt-3">
                  {arquivosParaUpload.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                    >
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {getFileExtension(file.name)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removerArquivo(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Anexos existentes */}
              {lancamento?.anexos && lancamento.anexos.length > 0 && (
                <div className="space-y-2 mt-3">
                  <p className="text-sm font-medium">Anexos existentes:</p>
                  {lancamento.anexos.map((anexo) => (
                    <div
                      key={anexo.id}
                      className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg"
                    >
                      <Paperclip className="h-4 w-4 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{anexo.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(anexo.tamanho)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading || uploadingFiles}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || uploadingFiles}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {(loading || uploadingFiles) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {loading || uploadingFiles 
                  ? "Salvando..." 
                  : lancamento 
                    ? "Atualizar" 
                    : "Cadastrar"
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}