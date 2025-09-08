"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  X, 
  Loader2,
  User,
  FileText,
  CreditCard,
  Camera,
  Trash2
} from "lucide-react"
import { 
  User as UserType, 
  UserFormData, 
  userFormSchema,
  UserStatus,
  TipoHonorario,
  ESPECIALIDADES_JURIDICAS,
  CARGOS_PADRAO,
  PerfilAcesso
} from "../types"

interface UserFormProps {
  user?: UserType
  perfisAcesso: PerfilAcesso[]
  onSubmit: (data: UserFormData) => Promise<void>
  onUploadPhoto?: (file: File) => Promise<void>
  onUploadDocument?: (file: File, tipo: string) => Promise<void>
  loading?: boolean
}

export function UserForm({ 
  user, 
  perfisAcesso,
  onSubmit,
  onUploadPhoto,
  onUploadDocument,
  loading = false 
}: UserFormProps) {
  const router = useRouter()
  const [selectedEspecialidades, setSelectedEspecialidades] = useState<string[]>(
    user?.especialidades || []
  )
  const [profilePhoto, setProfilePhoto] = useState<string | null>(
    user?.fotoPerfil || null
  )
  // Estado local para documentos
  const [documentosAnexos, setDocumentosAnexos] = useState(
    user?.documentosAnexos || []
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState(false)
  const [docType, setDocType] = useState<string>("")
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null)

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nome: user?.nome || "",
      cargo: user?.cargo || "",
      telefone: user?.telefone || "",
      email: user?.email || "",
      perfilAcesso: user?.perfilAcesso || "",
      especialidades: user?.especialidades || [],
      status: user?.status || UserStatus.ATIVO,
      tipoHonorario: user?.tipoHonorario,
      banco: user?.banco || "",
      agencia: user?.agencia || "",
      contaCorrente: user?.contaCorrente || "",
      chavePix: user?.chavePix || "",
      observacao: user?.observacao || "",
    },
  })

  const getInitials = (name: string) => {
    const parts = name.split(" ")
    if (parts.length >= 2) {
      return parts[0][0] + parts[parts.length - 1][0]
    }
    return name.substring(0, 2)
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onUploadPhoto) {
      setUploadingPhoto(true)
      try {
        await onUploadPhoto(file)
        const photoUrl = URL.createObjectURL(file)
        setProfilePhoto(photoUrl)
      } finally {
        setUploadingPhoto(false)
      }
    }
  }

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onUploadDocument && docType) {
      setUploadingDoc(true)
      try {
        await onUploadDocument(file, docType)
        
        // Adicionar documento ao estado local
        const newDocument = {
          id: String(Date.now()),
          nome: file.name,
          tipo: docType as any,
          url: URL.createObjectURL(file),
          tamanho: file.size,
          uploadEm: new Date(),
          uploadPor: "Usuário Atual"
        }
        
        setDocumentosAnexos(prev => [...prev, newDocument])
        
        // Mostrar feedback de sucesso
        setUploadSuccess(`Documento ${file.name} enviado com sucesso!`)
        setTimeout(() => setUploadSuccess(null), 3000)
        
        // Limpar input
        if (docInputRef.current) {
          docInputRef.current.value = ""
        }
      } catch (error) {
        console.error("Erro ao fazer upload:", error)
      } finally {
        setUploadingDoc(false)
        setDocType("")
      }
    }
  }

  const toggleEspecialidade = (especialidade: string) => {
    setSelectedEspecialidades(prev => {
      const updated = prev.includes(especialidade)
        ? prev.filter(e => e !== especialidade)
        : [...prev, especialidade]
      
      form.setValue("especialidades", updated)
      return updated
    })
  }

  const removeProfilePhoto = () => {
    setProfilePhoto(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeDocument = (docId: string) => {
    setDocumentosAnexos(prev => prev.filter(doc => doc.id !== docId))
  }

  const handleSubmit = async (data: UserFormData) => {
    // Incluir documentos anexados nos dados
    const dataWithDocs = {
      ...data,
      documentosAnexos: documentosAnexos
    }
    await onSubmit(dataWithDocs)
  }

  const getPerfilPermissoes = (perfilId: string) => {
    const perfil = perfisAcesso.find(p => p.id === perfilId)
    return perfil?.descricao || "Sem descrição disponível"
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="dados-pessoais" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dados-pessoais">
              <User className="h-4 w-4 mr-2" />
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="documentos">
              <FileText className="h-4 w-4 mr-2" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="financeiro">
              <CreditCard className="h-4 w-4 mr-2" />
              Financeiro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dados-pessoais" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                {/* Foto de perfil */}
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profilePhoto || ""} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {form.watch("nome") 
                        ? getInitials(form.watch("nome")).toUpperCase()
                        : "US"
                      }
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      disabled={uploadingPhoto}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                      >
                        {uploadingPhoto ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4 mr-2" />
                        )}
                        {profilePhoto ? "Alterar foto" : "Adicionar foto"}
                      </Button>
                      {profilePhoto && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeProfilePhoto}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Nome */}
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-sm font-medium">
                          Nome completo <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Digite o nome completo" 
                            {...field} 
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cargo */}
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
                            <SelectTrigger className="focus:ring-blue-500">
                              <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CARGOS_PADRAO.map((cargo) => (
                              <SelectItem key={cargo} value={cargo}>
                                {cargo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
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
                            <SelectTrigger className="focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={UserStatus.ATIVO}>Ativo</SelectItem>
                            <SelectItem value={UserStatus.INATIVO}>Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Usuários inativos terão o login bloqueado
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Telefone */}
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
                            placeholder="+55 (11) 98765-4321" 
                            {...field} 
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Formato: +55 (11) 98765-4321
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* E-mail */}
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
                            placeholder="usuario@escritorio.com" 
                            {...field} 
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Perfil de Acesso */}
                  <FormField
                    control={form.control}
                    name="perfilAcesso"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-sm font-medium">
                          Perfil de Acesso <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-blue-500">
                              <SelectValue placeholder="Selecione o perfil de acesso" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {perfisAcesso.map((perfil) => (
                              <SelectItem key={perfil.id} value={perfil.id}>
                                {perfil.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {field.value && (
                          <FormDescription>
                            {getPerfilPermissoes(field.value)}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Especialidades */}
                  <div className="md:col-span-2">
                    <FormLabel className="text-sm font-medium">Especialidades</FormLabel>
                    <ScrollArea className="h-[200px] mt-2 border rounded-md p-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {ESPECIALIDADES_JURIDICAS.map((esp) => (
                          <Badge
                            key={esp}
                            variant={selectedEspecialidades.includes(esp) ? "default" : "outline"}
                            className={`cursor-pointer transition-colors ${
                              selectedEspecialidades.includes(esp)
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "hover:bg-blue-50 hover:text-blue-600"
                            }`}
                            onClick={() => toggleEspecialidade(esp)}
                          >
                            {esp}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Observação */}
                  <FormField
                    control={form.control}
                    name="observacao"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-sm font-medium">Observações</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Observações adicionais sobre o usuário"
                            className="resize-none focus:ring-blue-500"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Máximo de 500 caracteres
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Feedback de sucesso */}
                  {uploadSuccess && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-3">
                      <div className="flex items-center gap-2 text-green-800">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium">{uploadSuccess}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium mb-3">Enviar Documentos</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Clique no tipo de documento que deseja enviar
                    </p>
                    <input
                      ref={docInputRef}
                      type="file"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      disabled={uploadingDoc}
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["OAB", "TERMO_CONFIDENCIALIDADE", "CPF", "PASSAPORTE"].map((tipo) => (
                        <Button
                          key={tipo}
                          type="button"
                          variant="outline"
                          className="h-24 flex-col"
                          onClick={() => {
                            setDocType(tipo)
                            docInputRef.current?.click()
                          }}
                          disabled={uploadingDoc}
                        >
                          {uploadingDoc && docType === tipo ? (
                            <Loader2 className="h-6 w-6 animate-spin mb-2" />
                          ) : (
                            <Upload className="h-6 w-6 mb-2" />
                          )}
                          <span className="text-xs">
                            {tipo === "TERMO_CONFIDENCIALIDADE" ? "Termo" : tipo}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Lista de documentos */}
                  {documentosAnexos.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-3">Documentos Anexados ({documentosAnexos.length})</h4>
                      <div className="space-y-2">
                        {documentosAnexos.map((doc) => (
                          <div 
                            key={doc.id}
                            className="flex items-center justify-between p-3 border rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">{doc.nome}</span>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Badge variant="secondary" className="text-xs">
                                    {doc.tipo}
                                  </Badge>
                                  <span>•</span>
                                  <span>{(doc.tamanho / 1024 / 1024).toFixed(2)} MB</span>
                                  <span>•</span>
                                  <span>{doc.uploadEm.toLocaleDateString('pt-BR')}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-blue-600 hover:text-blue-700"
                                onClick={() => window.open(doc.url, '_blank')}
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                                onClick={() => removeDocument(doc.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mensagem quando não há documentos */}
                  {documentosAnexos.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">Nenhum documento anexado</p>
                      <p className="text-xs">Use os botões acima para enviar documentos</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Tipo de Honorário */}
                  <FormField
                    control={form.control}
                    name="tipoHonorario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Tipo de Honorário</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-blue-500">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={TipoHonorario.FIXO}>Fixo</SelectItem>
                            <SelectItem value={TipoHonorario.PERCENTUAL}>Percentual</SelectItem>
                            <SelectItem value={TipoHonorario.HORA_TRABALHADA}>
                              Hora Trabalhada
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Banco */}
                  <FormField
                    control={form.control}
                    name="banco"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Banco</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nome do banco" 
                            {...field} 
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Agência */}
                  <FormField
                    control={form.control}
                    name="agencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Agência</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="0000-0" 
                            {...field} 
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conta Corrente */}
                  <FormField
                    control={form.control}
                    name="contaCorrente"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Conta Corrente</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="00000-0" 
                            {...field} 
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Chave PIX */}
                  <FormField
                    control={form.control}
                    name="chavePix"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-sm font-medium">Chave PIX</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="E-mail, telefone, CPF ou chave aleatória" 
                            {...field} 
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Botões de ação */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/cliente/usuarios-internos")}
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
            {loading ? "Salvando..." : user ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
