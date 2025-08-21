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
  FormDescription,
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
import { CalendarIcon, Upload, Loader2, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { 
  DocumentoSchema, 
  Documento, 
  ModeloSistema,
  TIPO_DOCUMENTO_LABELS,
  FORMATO_PAGAMENTO_LABELS
} from "../types"

interface ModalCriarDocumentoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCriar: (documento: Omit<Documento, "id" | "dataCriacao" | "ultimaAtualizacao">) => Promise<Documento>
  onUploadModelo: (arquivo: File, nome: string, tipo: string) => Promise<void>
  modelosSistema: ModeloSistema[]
  loading: boolean
}

export function ModalCriarDocumento({ 
  open, 
  onOpenChange, 
  onCriar, 
  onUploadModelo,
  modelosSistema, 
  loading 
}: ModalCriarDocumentoProps) {
  const [etapa, setEtapa] = useState<"modelo" | "dados">("modelo")
  const [modeloSelecionado, setModeloSelecionado] = useState<string>("")
  const [uploadingModelo, setUploadingModelo] = useState(false)
  const [assinaturas, setAssinaturas] = useState<string[]>([""])

  const form = useForm<Omit<Documento, "id" | "dataCriacao" | "ultimaAtualizacao">>({
    resolver: zodResolver(DocumentoSchema),
    defaultValues: {
      tipoDocumento: "contrato",
      modelo: "",
      cliente: "",
      responsavel: "",
      oab: "",
      enderecoComercial: "",
      valorNegociado: 0,
      formatoPagamento: "a_vista",
      parcelas: "",
      statusPagamento: "pendente",
      renegociacao: "",
      assinaturas: [""],
      anexos: [],
      observacoes: ""
    }
  })

  const handleUploadModelo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = event.target.files?.[0]
    if (!arquivo) return

    const nomeModelo = prompt("Digite o nome para este modelo:")
    if (!nomeModelo) return

    const tipoDocumento = form.watch("tipoDocumento")

    setUploadingModelo(true)
    try {
      await onUploadModelo(arquivo, nomeModelo, tipoDocumento)
      setModeloSelecionado(nomeModelo)
      form.setValue("modelo", nomeModelo)
      setEtapa("dados")
    } catch (error) {
      // Error handled by hook
    } finally {
      setUploadingModelo(false)
      event.target.value = "" // Reset input
    }
  }

  const handleSelecionarModelo = (modeloId: string) => {
    const modelo = modelosSistema.find(m => m.id === modeloId)
    if (modelo) {
      setModeloSelecionado(modelo.nome)
      form.setValue("modelo", modelo.nome)
      form.setValue("tipoDocumento", modelo.tipoDocumento)
      setEtapa("dados")
    }
  }

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

  const onSubmit = async (data: Omit<Documento, "id" | "dataCriacao" | "ultimaAtualizacao">) => {
    try {
      await onCriar(data)
      form.reset()
      setAssinaturas([""])
      setEtapa("modelo")
      setModeloSelecionado("")
      onOpenChange(false)
    } catch (error) {
      // Error handled by hook
    }
  }

  const voltarParaModelo = () => {
    setEtapa("modelo")
    setModeloSelecionado("")
    form.setValue("modelo", "")
  }

  const modelosFiltrados = modelosSistema.filter(
    m => m.tipoDocumento === form.watch("tipoDocumento")
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {etapa === "modelo" ? "Criar Novo Documento" : "Preencher Dados do Documento"}
          </DialogTitle>
          <DialogDescription>
            {etapa === "modelo" 
              ? "Selecione um modelo do sistema ou envie seu próprio modelo."
              : `Preencha os dados para criar o ${form.watch("tipoDocumento")}.`
            }
          </DialogDescription>
        </DialogHeader>

        {etapa === "modelo" && (
          <div className="space-y-6 py-4">
            {/* Seleção do Tipo de Documento */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Documento</label>
              <Select
                value={form.watch("tipoDocumento")}
                onValueChange={(value: any) => form.setValue("tipoDocumento", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TIPO_DOCUMENTO_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Modelos do Sistema */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Modelos do Sistema</h4>
              <div className="grid gap-2">
                {modelosFiltrados.map((modelo) => (
                  <div
                    key={modelo.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleSelecionarModelo(modelo.id)}
                  >
                    <div>
                      <p className="font-medium">{modelo.nome}</p>
                      {modelo.descricao && (
                        <p className="text-sm text-muted-foreground">{modelo.descricao}</p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      Selecionar
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload de Modelo Próprio */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Ou envie seu próprio modelo</h4>
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Arraste um arquivo ou clique para selecionar
                </p>
                <input
                  type="file"
                  accept=".doc,.docx,.pdf"
                  onChange={handleUploadModelo}
                  disabled={uploadingModelo}
                  className="hidden"
                  id="upload-modelo"
                />
                <label htmlFor="upload-modelo">
                  <Button 
                    variant="outline" 
                    disabled={uploadingModelo}
                    asChild
                  >
                    <span>
                      {uploadingModelo && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {uploadingModelo ? "Enviando..." : "Selecionar Arquivo"}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>
        )}

        {etapa === "dados" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Cliente */}
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

                {/* Responsável */}
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

                {/* OAB */}
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

                {/* Valor Negociado */}
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

                {/* Formato de Pagamento */}
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

                {/* Parcelas */}
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

                {/* Data de Início */}
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

                {/* Data de Término */}
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
            </form>
          </Form>
        )}

        <DialogFooter>
          {etapa === "dados" && (
            <Button variant="outline" onClick={voltarParaModelo}>
              Voltar
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          {etapa === "dados" && (
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Criando..." : "Criar Documento"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
