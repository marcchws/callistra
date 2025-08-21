"use client"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Upload, X, FileText, Camera, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { usuarioInternoFormSchema, UsuarioInternoFormData, UsuarioInterno, CreateUsuarioRequest, UpdateUsuarioRequest, DocumentoAnexo } from "../types"

interface UsuarioFormProps {
  usuario?: UsuarioInterno | null
  dadosApoio: {
    especialidades: Array<{ id: string; nome: string }>
    cargos: Array<{ id: string; nome: string }>
    perfisAcesso: Array<{ id: string; nome: string; descricao: string }>
  }
  onSubmit: (request: CreateUsuarioRequest | UpdateUsuarioRequest) => Promise<boolean>
  onCancel: () => void
  loading: boolean
}

const tiposDocumento = [
  { value: "OAB", label: "OAB - Ordem dos Advogados" },
  { value: "TERMO_CONFIDENCIALIDADE", label: "Termo de Confidencialidade" },
  { value: "CPF", label: "CPF - Cadastro de Pessoa Física" },
  { value: "PASSAPORTE", label: "Passaporte" }
] as const

export function UsuarioForm({ usuario, dadosApoio, onSubmit, onCancel, loading }: UsuarioFormProps) {
  const isEdit = !!usuario
  const fileInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  
  // Estados para upload de arquivos
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null)
  const [previewFoto, setPreviewFoto] = useState<string>(usuario?.fotoPerfil || "")
  const [documentos, setDocumentos] = useState<Array<{ arquivo: File; tipo: DocumentoAnexo["tipo"] }>>([])
  const [documentosExistentes, setDocumentosExistentes] = useState<DocumentoAnexo[]>(usuario?.documentos || [])

  // Form setup baseado nos Requirements Lock
  const form = useForm<UsuarioInternoFormData>({
    resolver: zodResolver(usuarioInternoFormSchema),
    defaultValues: {
      nome: usuario?.nome || "",
      cargo: usuario?.cargo || "",
      telefone: usuario?.telefone || "",
      email: usuario?.email || "",
      perfilAcesso: usuario?.perfilAcesso || "",
      status: usuario?.status || "ATIVO",
      especialidades: usuario?.especialidades || [],
      tipoHonorario: usuario?.tipoHonorario || "",
      banco: usuario?.banco || "",
      agencia: usuario?.agencia || "",
      contaCorrente: usuario?.contaCorrente || "",
      chavePix: usuario?.chavePix || "",
      observacao: usuario?.observacao || ""
    }
  })

  // Handle upload de foto de perfil
  const handleFotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validações
      if (file.size > 5 * 1024 * 1024) { // 5MB
        form.setError("root", { message: "Foto muito grande. Máximo 5MB" })
        return
      }
      
      if (!file.type.startsWith("image/")) {
        form.setError("root", { message: "Apenas imagens são permitidas" })
        return
      }
      
      setFotoPerfil(file)
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewFoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle upload de documentos
  const handleDocumentoUpload = (event: React.ChangeEvent<HTMLInputElement>, tipo: DocumentoAnexo["tipo"]) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validações
      if (file.size > 10 * 1024 * 1024) { // 10MB para documentos
        form.setError("root", { message: "Documento muito grande. Máximo 10MB" })
        return
      }
      
      setDocumentos(prev => [...prev, { arquivo: file, tipo }])
    }
  }

  // Remover documento em upload
  const removerDocumento = (index: number) => {
    setDocumentos(prev => prev.filter((_, i) => i !== index))
  }

  // Remover documento existente
  const removerDocumentoExistente = (id: string) => {
    setDocumentosExistentes(prev => prev.filter(doc => doc.id !== id))
  }

  // Handle especialidades (multiple select)
  const handleEspecialidadeChange = (especialidadeNome: string, checked: boolean) => {
    const especialidadesAtuais = form.getValues("especialidades") || []
    
    if (checked) {
      form.setValue("especialidades", [...especialidadesAtuais, especialidadeNome])
    } else {
      form.setValue("especialidades", especialidadesAtuais.filter(esp => esp !== especialidadeNome))
    }
  }

  // Submit form
  const handleSubmit = async (data: UsuarioInternoFormData) => {
    try {
      const request = isEdit 
        ? {
            id: usuario!.id,
            dados: data,
            fotoPerfil: fotoPerfil || undefined,
            documentos: documentos.length > 0 ? documentos : undefined
          } as UpdateUsuarioRequest
        : {
            dados: data,
            fotoPerfil: fotoPerfil || undefined,
            documentos: documentos.length > 0 ? documentos : undefined
          } as CreateUsuarioRequest

      const sucesso = await onSubmit(request)
      if (sucesso) {
        // Modal será fechado automaticamente pelo onSubmit
      }
    } catch (error) {
      form.setError("root", { message: "Erro inesperado ao salvar usuário" })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-600">{form.formState.errors.root.message}</p>
          </div>
        )}

        <Tabs defaultValue="dados-basicos" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dados-basicos">Dados Básicos</TabsTrigger>
            <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
            <TabsTrigger value="financeiro">Dados Financeiros</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>

          {/* Aba: Dados Básicos */}
          <TabsContent value="dados-basicos" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload de Foto de Perfil */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={previewFoto} alt="Foto de perfil" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {form.watch("nome") ? form.watch("nome").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        {previewFoto ? "Alterar Foto" : "Adicionar Foto"}
                      </Button>
                      {previewFoto && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFotoPerfil(null)
                            setPreviewFoto("")
                          }}
                          className="gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remover
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Formatos aceitos: JPG, PNG. Máximo 5MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFotoUpload}
                    className="hidden"
                  />
                </div>

                <Separator />

                {/* Campos obrigatórios conforme Requirements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Nome Completo <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cargo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Cargo <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dadosApoio.cargos.map((cargo) => (
                              <SelectItem key={cargo.id} value={cargo.nome}>
                                {cargo.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Telefone <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+5511999999999 (DDI+DDD+NÚMERO)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Formato: DDI+DDD+NÚMERO (ex: +5511999999999)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          E-mail <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="email@exemplo.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="perfilAcesso"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Perfil de Acesso <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o perfil" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dadosApoio.perfisAcesso.map((perfil) => (
                              <SelectItem key={perfil.id} value={perfil.nome}>
                                <div>
                                  <p className="font-medium">{perfil.nome}</p>
                                  <p className="text-xs text-muted-foreground">{perfil.descricao}</p>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Status <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ATIVO">Ativo</SelectItem>
                            <SelectItem value="INATIVO">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="observacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Observações adicionais sobre o usuário..."
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Especialidades */}
          <TabsContent value="especialidades" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Especialidades Jurídicas</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="especialidades"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Selecione as especialidades do usuário
                      </FormLabel>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                        {dadosApoio.especialidades.map((especialidade) => {
                          const isChecked = (field.value || []).includes(especialidade.nome)
                          return (
                            <div key={especialidade.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={especialidade.id}
                                checked={isChecked}
                                onCheckedChange={(checked) => 
                                  handleEspecialidadeChange(especialidade.nome, !!checked)
                                }
                              />
                              <label
                                htmlFor={especialidade.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {especialidade.nome}
                              </label>
                            </div>
                          )
                        })}
                      </div>
                      {field.value && field.value.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Especialidades selecionadas:</p>
                          <div className="flex flex-wrap gap-2">
                            {field.value.map((esp, index) => (
                              <Badge key={index} variant="secondary">
                                {esp}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Dados Financeiros */}
          <TabsContent value="financeiro" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Informações Financeiras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipoHonorario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Tipo de Honorário</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Por hora">Por hora</SelectItem>
                            <SelectItem value="Fixo mensal">Fixo mensal</SelectItem>
                            <SelectItem value="Por processo">Por processo</SelectItem>
                            <SelectItem value="Percentual">Percentual</SelectItem>
                            <SelectItem value="Misto">Misto</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="banco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Banco</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do banco" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Agência</FormLabel>
                        <FormControl>
                          <Input placeholder="Número da agência" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contaCorrente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Conta Corrente</FormLabel>
                        <FormControl>
                          <Input placeholder="Número da conta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="chavePix"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-sm font-medium">Chave PIX</FormLabel>
                        <FormControl>
                          <Input placeholder="CPF, e-mail, telefone ou chave aleatória" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba: Documentos */}
          <TabsContent value="documentos" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Documentos Anexos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Documentos existentes (apenas em edição) */}
                {isEdit && documentosExistentes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Documentos existentes:</h4>
                    <div className="space-y-2">
                      {documentosExistentes.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">{doc.nomeArquivo}</p>
                              <p className="text-xs text-muted-foreground">
                                {tiposDocumento.find(t => t.value === doc.tipo)?.label} • 
                                Enviado em {doc.uploadedAt.toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removerDocumentoExistente(doc.id)}
                            className="gap-2"
                          >
                            <Trash2 className="h-4 w-4" />
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Novos documentos para upload */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Adicionar novos documentos:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tiposDocumento.map((tipo) => (
                      <div key={tipo.value} className="border rounded-lg p-4">
                        <h5 className="text-sm font-medium mb-2">{tipo.label}</h5>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.createElement("input")
                            input.type = "file"
                            input.accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            input.onchange = (e) => handleDocumentoUpload(e as any, tipo.value)
                            input.click()
                          }}
                          className="gap-2 w-full"
                        >
                          <Upload className="h-4 w-4" />
                          Enviar Arquivo
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          PDF, DOC, DOCX, JPG, PNG. Máximo 10MB
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documentos em upload */}
                {documentos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-3">Documentos para enviar:</h4>
                    <div className="space-y-2">
                      {documentos.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium">{doc.arquivo.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {tiposDocumento.find(t => t.value === doc.tipo)?.label} • 
                                {(doc.arquivo.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removerDocumento(index)}
                            className="gap-2"
                          >
                            <X className="h-4 w-4" />
                            Remover
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer com botões */}
        <div className="flex justify-end gap-3 pt-6 border-t">
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Salvando..." : isEdit ? "Atualizar Usuário" : "Criar Usuário"}
          </Button>
        </div>
      </form>
    </Form>
  )
}