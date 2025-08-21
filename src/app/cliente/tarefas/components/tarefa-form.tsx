import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Upload, File, Trash2, Plus, Loader2 } from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  TarefaFormData, 
  TarefaFormSchema, 
  Tarefa,
  PRIORIDADE_OPTIONS,
  TIPO_ATIVIDADE_OPTIONS
} from "../types"

interface TarefaFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TarefaFormData) => Promise<boolean>
  tarefa?: Tarefa | null
  loading: boolean
  clientes: Array<{ id: string; nome: string }>
  processos: Array<{ id: string; numero: string; titulo: string }>
  usuarios: Array<{ id: string; nome: string }>
  onAnexarArquivo?: (tarefaId: string, arquivo: File) => Promise<boolean>
}

export function TarefaForm({
  isOpen,
  onClose,
  onSubmit,
  tarefa,
  loading,
  clientes,
  processos,
  usuarios,
  onAnexarArquivo
}: TarefaFormProps) {
  const [etiquetas, setEtiquetas] = useState<string[]>([])
  const [novaEtiqueta, setNovaEtiqueta] = useState("")
  const [anexos, setAnexos] = useState<File[]>([])

  const isEdit = !!tarefa

  const form = useForm<TarefaFormData>({
    resolver: zodResolver(TarefaFormSchema),
    defaultValues: {
      tipoAtividade: "",
      nomeAtividade: "",
      responsavel: "",
      prioridade: "media",
      etiquetas: [],
      dataInicio: "",
      horaInicio: "",
      dataFim: "",
      horaFim: "",
      descricao: "",
      cliente: "",
      processo: "",
      atividade: "",
      subAtividade: "",
      valor: undefined,
      tipoSegmento: "",
      observacoes: "",
    }
  })

  // CARREGAR DADOS DA TAREFA PARA EDIÇÃO
  useEffect(() => {
    if (tarefa && isOpen) {
      form.reset({
        tipoAtividade: tarefa.tipoAtividade,
        nomeAtividade: tarefa.nomeAtividade,
        responsavel: tarefa.responsavel,
        prioridade: tarefa.prioridade,
        etiquetas: tarefa.etiquetas || [],
        dataInicio: tarefa.dataInicio,
        horaInicio: tarefa.horaInicio,
        dataFim: tarefa.dataFim,
        horaFim: tarefa.horaFim,
        descricao: tarefa.descricao,
        cliente: tarefa.cliente,
        processo: tarefa.processo,
        atividade: tarefa.atividade || "",
        subAtividade: tarefa.subAtividade || "",
        valor: tarefa.valor,
        tipoSegmento: tarefa.tipoSegmento || "",
        observacoes: tarefa.observacoes || "",
      })
      setEtiquetas(tarefa.etiquetas || [])
    } else if (!isEdit && isOpen) {
      form.reset()
      setEtiquetas([])
      setAnexos([])
    }
  }, [tarefa, isOpen, isEdit, form])

  // GERENCIAR ETIQUETAS
  const adicionarEtiqueta = () => {
    if (novaEtiqueta.trim() && !etiquetas.includes(novaEtiqueta.trim())) {
      const novasEtiquetas = [...etiquetas, novaEtiqueta.trim()]
      setEtiquetas(novasEtiquetas)
      form.setValue('etiquetas', novasEtiquetas)
      setNovaEtiqueta("")
    }
  }

  const removerEtiqueta = (etiqueta: string) => {
    const novasEtiquetas = etiquetas.filter(e => e !== etiqueta)
    setEtiquetas(novasEtiquetas)
    form.setValue('etiquetas', novasEtiquetas)
  }

  // GERENCIAR ANEXOS
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAnexos(prev => [...prev, ...files])
  }

  const removerAnexo = (index: number) => {
    setAnexos(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // SUBMIT HANDLER - Cenários 1, 2, 8
  const handleSubmit = async (data: TarefaFormData) => {
    const success = await onSubmit({
      ...data,
      etiquetas: etiquetas.length > 0 ? etiquetas : undefined
    })
    
    if (success) {
      onClose()
      form.reset()
      setEtiquetas([])
      setAnexos([])
    }
  }

  const handleClose = () => {
    onClose()
    form.reset()
    setEtiquetas([])
    setAnexos([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEdit ? "Editar Tarefa" : "Nova Tarefa"}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? "Edite as informações da tarefa abaixo." 
              : "Preencha as informações para criar uma nova tarefa."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            {/* SEÇÃO 1: INFORMAÇÕES BÁSICAS */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informações Básicas</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                {/* TIPO DE ATIVIDADE - Obrigatório */}
                <FormField
                  control={form.control}
                  name="tipoAtividade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Tipo de Atividade <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Selecionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIPO_ATIVIDADE_OPTIONS.map(opcao => (
                            <SelectItem key={opcao.value} value={opcao.value}>
                              {opcao.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PRIORIDADE - Obrigatório */}
                <FormField
                  control={form.control}
                  name="prioridade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Prioridade <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Selecionar prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PRIORIDADE_OPTIONS.map(opcao => (
                            <SelectItem key={opcao.value} value={opcao.value}>
                              {opcao.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* NOME DA ATIVIDADE - Obrigatório */}
              <FormField
                control={form.control}
                name="nomeAtividade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Nome da Atividade <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o nome da tarefa..." 
                        {...field} 
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DESCRIÇÃO - Obrigatório */}
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Descrição <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva detalhadamente a tarefa..." 
                        {...field} 
                        className="min-h-[100px] focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SEÇÃO 2: RESPONSABILIDADE E VINCULAÇÃO */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Responsabilidade e Vinculação</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                {/* RESPONSÁVEL - Obrigatório */}
                <FormField
                  control={form.control}
                  name="responsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Responsável <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Selecionar responsável" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {usuarios.map(usuario => (
                            <SelectItem key={usuario.id} value={usuario.id}>
                              {usuario.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CLIENTE - Obrigatório */}
                <FormField
                  control={form.control}
                  name="cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Cliente <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Selecionar cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientes.map(cliente => (
                            <SelectItem key={cliente.id} value={cliente.id}>
                              {cliente.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* PROCESSO - Obrigatório */}
              <FormField
                control={form.control}
                name="processo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Processo <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-blue-500">
                          <SelectValue placeholder="Selecionar processo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {processos.map(processo => (
                          <SelectItem key={processo.id} value={processo.id}>
                            <div className="flex flex-col">
                              <span className="font-mono text-sm">{processo.numero}</span>
                              <span className="text-xs text-muted-foreground">{processo.titulo}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SEÇÃO 3: DATAS E HORÁRIOS */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Datas e Horários</h3>
              
              <div className="grid gap-4 md:grid-cols-4">
                {/* DATA INÍCIO - Obrigatório */}
                <FormField
                  control={form.control}
                  name="dataInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Data Início <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* HORA INÍCIO - Obrigatório */}
                <FormField
                  control={form.control}
                  name="horaInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Hora Início <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* DATA FIM - Obrigatório */}
                <FormField
                  control={form.control}
                  name="dataFim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Data Fim <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* HORA FIM - Obrigatório */}
                <FormField
                  control={form.control}
                  name="horaFim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Hora Fim <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="time" 
                          {...field} 
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SEÇÃO 4: CATEGORIZAÇÃO E DETALHES */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Categorização e Detalhes</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                {/* ATIVIDADE - Opcional */}
                <FormField
                  control={form.control}
                  name="atividade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Atividade</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Peticionamento" 
                          {...field} 
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SUB ATIVIDADE - Opcional */}
                <FormField
                  control={form.control}
                  name="subAtividade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Sub Atividade</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Petição inicial" 
                          {...field} 
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* VALOR - Opcional */}
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Valor (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0,00" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* TIPO DE SEGMENTO - Opcional */}
                <FormField
                  control={form.control}
                  name="tipoSegmento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Tipo de Segmento</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Trabalhista, Cível, Criminal" 
                          {...field} 
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ETIQUETAS - Opcional */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Etiquetas</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Digite uma etiqueta..." 
                    value={novaEtiqueta}
                    onChange={(e) => setNovaEtiqueta(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarEtiqueta())}
                    className="focus:ring-blue-500"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={adicionarEtiqueta}
                    disabled={!novaEtiqueta.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {etiquetas.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {etiquetas.map((etiqueta, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {etiqueta}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removerEtiqueta(etiqueta)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* OBSERVAÇÕES - Opcional */}
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
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SEÇÃO 5: ANEXOS - Cenário 4 */}
            {!isEdit && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Anexos</h3>
                
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                      <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="font-medium text-blue-600 hover:text-blue-500">
                            Clique para fazer upload
                          </span>
                          <span className="text-muted-foreground"> ou arraste arquivos aqui</span>
                        </label>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileChange}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PDF, DOC, DOCX, XLS, XLSX, JPG, PNG até 10MB
                      </p>
                    </div>
                  </div>

                  {anexos.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Arquivos selecionados:</h4>
                      {anexos.map((arquivo, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <File className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{arquivo.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(arquivo.size)}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removerAnexo(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

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
                {loading 
                  ? (isEdit ? "Salvando..." : "Criando...") 
                  : (isEdit ? "Salvar Alterações" : "Criar Tarefa")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}