"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, FileText, Upload, X, Plus, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SignatureManager } from "./components/signature-manager"
import { 
  ContractSchema, 
  ContractFormData, 
  Contract,
  SYSTEM_TEMPLATES,
  Signature
} from "./types"

interface ContractFormProps {
  contract?: Contract
  onSubmit: (data: ContractFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function ContractForm({ 
  contract, 
  onSubmit, 
  onCancel,
  loading = false 
}: ContractFormProps) {
  const [signatures, setSignatures] = useState<Signature[]>(
    contract?.assinaturas || []
  )
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showEditor, setShowEditor] = useState(false)

  const form = useForm<ContractFormData>({
    resolver: zodResolver(ContractSchema),
    defaultValues: {
      tipoDocumento: contract?.tipoDocumento || "contrato",
      modelo: contract?.modelo || "",
      cliente: contract?.cliente || "",
      responsavel: contract?.responsavel || "",
      oab: contract?.oab || "",
      enderecoComercial: contract?.enderecoComercial || "",
      valorNegociado: contract?.valorNegociado || 0,
      formatoPagamento: contract?.formatoPagamento || "a_vista",
      parcelas: contract?.parcelas,
      valorParcela: contract?.valorParcela,
      dataInicio: contract?.dataInicio || new Date(),
      dataTermino: contract?.dataTermino,
      statusPagamento: contract?.statusPagamento || "pendente",
      assinaturas: contract?.assinaturas || [],
      observacoes: contract?.observacoes || "",
      conteudoDocumento: contract?.conteudoDocumento || "",
    }
  })

  const watchTipoDocumento = form.watch("tipoDocumento")
  const watchModelo = form.watch("modelo")
  const watchFormatoPagamento = form.watch("formatoPagamento")
  const watchValorNegociado = form.watch("valorNegociado")
  const watchParcelas = form.watch("parcelas")

  // Calcular valor da parcela automaticamente
  useEffect(() => {
    if (watchFormatoPagamento === "parcelado" && watchValorNegociado && watchParcelas) {
      const valorParcela = watchValorNegociado / watchParcelas
      form.setValue("valorParcela", Number(valorParcela.toFixed(2)))
    }
  }, [watchValorNegociado, watchParcelas, watchFormatoPagamento, form])

  // Atualizar assinaturas no form
  useEffect(() => {
    form.setValue("assinaturas", signatures)
  }, [signatures, form])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      form.setValue("modeloCustomizado", file)
    }
  }

  const handleSubmit = async (data: ContractFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">
          {contract ? "Editar" : "Novo"} {watchTipoDocumento === "contrato" ? "Contrato" : "Procuração"}
        </CardTitle>
        <CardDescription>
          {contract 
            ? "Edite os dados do documento conforme necessário"
            : "Preencha os campos para criar o documento"
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Seção: Tipo e Modelo */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Tipo e Modelo</h3>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipoDocumento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Tipo de Documento <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="contrato">Contrato</SelectItem>
                          <SelectItem value="procuracao">Procuração</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="modelo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Modelo <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Selecione o modelo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SYSTEM_TEMPLATES
                            .filter(t => 
                              watchTipoDocumento === "contrato" 
                                ? t.value.includes("contrato") || t.value === "customizado"
                                : t.value.includes("procuracao") || t.value === "customizado"
                            )
                            .map(template => (
                              <SelectItem key={template.value} value={template.value}>
                                {template.label}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Upload de modelo customizado */}
              {watchModelo === "customizado" && (
                <div className="space-y-2">
                  <FormLabel className="text-sm font-medium">
                    Upload do Modelo Customizado
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept=".doc,.docx,.pdf"
                      onChange={handleFileUpload}
                      disabled={loading}
                      className="flex-1"
                    />
                    {uploadedFile && (
                      <Badge variant="secondary" className="gap-2">
                        <FileText className="h-3 w-3" />
                        {uploadedFile.name}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Seção: Dados das Partes */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Dados das Partes</h3>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
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
                          placeholder="Nome do cliente" 
                          {...field} 
                          disabled={loading}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          placeholder="Nome do responsável" 
                          {...field}
                          disabled={loading}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="oab"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">OAB</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="123456/UF" 
                          {...field}
                          disabled={loading}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="enderecoComercial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Endereço Comercial
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Endereço completo" 
                          {...field}
                          disabled={loading}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção: Valores e Pagamento */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Valores e Pagamento</h3>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
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
                          placeholder="0.00"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                          disabled={loading}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="formatoPagamento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Formato de Pagamento <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Selecione o formato" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="a_vista">À Vista</SelectItem>
                          <SelectItem value="parcelado">Parcelado</SelectItem>
                          <SelectItem value="mensal">Mensal</SelectItem>
                          <SelectItem value="trimestral">Trimestral</SelectItem>
                          <SelectItem value="customizado">Customizado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchFormatoPagamento === "parcelado" && (
                  <>
                    <FormField
                      control={form.control}
                      name="parcelas"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Número de Parcelas
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value))}
                              disabled={loading}
                              className="focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="valorParcela"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Valor da Parcela
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              placeholder="0.00"
                              step="0.01"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value))}
                              disabled={loading}
                              className="focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormDescription>
                            Calculado automaticamente
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Seção: Datas */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Vigência</h3>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dataInicio"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium">
                        Data de Início <span className="text-red-500">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={loading}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
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
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataTermino"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-sm font-medium">
                        Data de Término
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                              disabled={loading}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
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
                            disabled={(date) =>
                              date < new Date("1900-01-01")
                            }
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
            </div>

            {/* Seção: Assinaturas */}
            <SignatureManager
              signatures={signatures}
              onSignaturesChange={setSignatures}
              disabled={loading}
              cliente={form.watch("cliente")}
              responsavel={form.watch("responsavel")}
            />

            {/* Seção: Observações */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Informações Adicionais</h3>
              <Separator />
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Observações</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observações adicionais sobre o documento..."
                        className="resize-none focus:ring-blue-500"
                        rows={4}
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Editor de conteúdo do documento */}
              {contract && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditor(!showEditor)}
                    disabled={loading}
                    className="gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {showEditor ? "Ocultar" : "Editar"} Conteúdo do Documento
                  </Button>
                  
                  {showEditor && (
                    <FormField
                      control={form.control}
                      name="conteudoDocumento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Conteúdo do Documento
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Digite ou edite o conteúdo do documento..."
                              className="resize-none font-mono text-sm focus:ring-blue-500"
                              rows={12}
                              {...field}
                              disabled={loading}
                            />
                          </FormControl>
                          <FormDescription>
                            Edite o conteúdo gerado automaticamente conforme necessário
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button 
          onClick={form.handleSubmit(handleSubmit)}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </CardFooter>
    </Card>
  )
}
