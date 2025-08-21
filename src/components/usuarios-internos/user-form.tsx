"use client"

// Componente de Formulário de Usuário
// Atende todos os campos obrigatórios e opcionais do PRD

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { usuarioSchema, UsuarioFormData } from "@/lib/usuarios-internos/validations"
import { 
  UsuarioInterno, 
  CARGOS_DISPONIVEIS, 
  PERFIS_ACESSO,
  TIPOS_DOCUMENTO 
} from "@/lib/usuarios-internos/types"
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
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { 
  Upload, 
  X, 
  Loader2, 
  User, 
  Briefcase, 
  DollarSign,
  FileText,
  Camera,
  Trash2
} from "lucide-react"
import { emailJaCadastrado } from "@/lib/usuarios-internos/mock-data"

interface UserFormProps {
  usuario?: UsuarioInterno
  mode: 'create' | 'edit'
}

export function UserForm({ usuario, mode }: UserFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fotoPerfil, setFotoPerfil] = useState<string | undefined>(usuario?.fotoPerfil)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [documentos, setDocumentos] = useState(usuario?.documentosAnexos || [])

  const form = useForm<UsuarioFormData>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nome: usuario?.nome || "",
      cargo: usuario?.cargo || "",
      telefone: usuario?.telefone || "",
      email: usuario?.email || "",
      perfilAcesso: usuario?.perfilAcesso || "",
      status: usuario?.status || "ativo",
      salario: usuario?.salario || undefined,
      banco: usuario?.banco || "",
      agencia: usuario?.agencia || "",
      contaCorrente: usuario?.contaCorrente || "",
      chavePix: usuario?.chavePix || "",
      observacao: usuario?.observacao || "",
    }
  })

  const onSubmit = async (data: UsuarioFormData) => {
    setLoading(true)

    // Validação de e-mail duplicado (Cenário 3)
    if (emailJaCadastrado(data.email, usuario?.id)) {
      form.setError('email', {
        type: 'manual',
        message: 'E-mail já cadastrado no sistema'
      })
      toast.error("E-mail já cadastrado no sistema", { duration: 3000 })
      setLoading(false)
      return
    }

    // Simular salvamento
    setTimeout(() => {
      if (mode === 'create') {
        toast.success("Usuário criado com sucesso!", { duration: 2000 })
      } else {
        toast.success("Dados atualizados com sucesso", { duration: 2000 })
      }
      router.push('/saas/usuarios-internos')
    }, 1000)
  }

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação de tamanho e tipo
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Arquivo deve ter no máximo 5MB")
      return
    }

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error("Formato inválido. Use: JPG, PNG ou WEBP")
      return
    }

    // Preview da imagem
    const reader = new FileReader()
    reader.onloadend = () => {
      setFotoPerfil(reader.result as string)
      setFotoFile(file)
    }
    reader.readAsDataURL(file)
  }

  const removeFoto = () => {
    setFotoPerfil(undefined)
    setFotoFile(null)
  }

  const handleDocumentoUpload = (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo deve ter no máximo 10MB")
      return
    }

    // Simular upload
    const novoDoc = {
      id: Date.now().toString(),
      nome: file.name,
      tipo: tipo as any,
      url: URL.createObjectURL(file),
      tamanho: file.size,
      uploadEm: new Date(),
      uploadPor: 'Usuário Atual'
    }

    setDocumentos([...documentos, novoDoc])
    toast.success("Documento anexado com sucesso")
  }

  const removeDocumento = (docId: string) => {
    setDocumentos(documentos.filter(d => d.id !== docId))
    toast.success("Documento removido")
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="dados-pessoais" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dados-pessoais">
              <User className="mr-2 h-4 w-4" />
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="profissional">
              <Briefcase className="mr-2 h-4 w-4" />
              Profissional
            </TabsTrigger>
            <TabsTrigger value="financeiro">
              <DollarSign className="mr-2 h-4 w-4" />
              Financeiro
            </TabsTrigger>
            <TabsTrigger value="documentos">
              <FileText className="mr-2 h-4 w-4" />
              Documentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dados-pessoais" className="space-y-4 mt-6">
            {/* Foto de Perfil */}
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={fotoPerfil} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {form.watch('nome') ? getInitials(form.watch('nome')) : <User />}
                </AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <Label>Foto de Perfil</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('foto-upload')?.click()}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {fotoPerfil ? 'Alterar' : 'Adicionar'}
                  </Button>
                  {fotoPerfil && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeFoto}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover
                    </Button>
                  )}
                </div>
                <input
                  id="foto-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFotoUpload}
                />
              </div>
            </div>

            {/* Campos pessoais */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome completo <span className="text-red-500">*</span>
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      E-mail <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="exemplo@callistra.com.br" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Telefone <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+55 11 98765-4321" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Formato: DDI+DDD+Número
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    {field.value === 'inativo' && (
                      <FormDescription className="text-destructive">
                        Usuário inativo terá o login bloqueado
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="profissional" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="cargo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cargo <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o cargo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CARGOS_DISPONIVEIS.map((cargo) => (
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

              <FormField
                control={form.control}
                name="perfilAcesso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Perfil de Acesso <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PERFIS_ACESSO.map((perfil) => (
                          <SelectItem key={perfil.id} value={perfil.id}>
                            {perfil.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Define as permissões do usuário no sistema
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salario"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Salário</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0,00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações adicionais sobre o usuário"
                        className="resize-none"
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
          </TabsContent>

          <TabsContent value="financeiro" className="space-y-4 mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="banco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banco</FormLabel>
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
                    <FormLabel>Agência</FormLabel>
                    <FormControl>
                      <Input placeholder="0000" {...field} />
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
                    <FormLabel>Conta Corrente</FormLabel>
                    <FormControl>
                      <Input placeholder="00000-0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chavePix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave PIX</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="E-mail, CPF, telefone ou chave aleatória" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4 mt-6">
            <div className="space-y-4">
              {/* Upload de documentos */}
              <div className="grid gap-4 md:grid-cols-3">
                {Object.entries(TIPOS_DOCUMENTO).map(([key, label]) => (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <Label>{label}</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => document.getElementById(`doc-${key}`)?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Anexar
                        </Button>
                        <input
                          id={`doc-${key}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          className="hidden"
                          onChange={(e) => handleDocumentoUpload(e, key)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Lista de documentos anexados */}
              {documentos.length > 0 && (
                <div className="space-y-2">
                  <Label>Documentos Anexados</Label>
                  <div className="space-y-2">
                    {documentos.map((doc) => (
                      <div 
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{doc.nome}</p>
                            <p className="text-xs text-muted-foreground">
                              {TIPOS_DOCUMENTO[doc.tipo as keyof typeof TIPOS_DOCUMENTO]} • 
                              {(doc.tamanho / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocumento(doc.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Botões de ação */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/saas/usuarios-internos')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Salvando..." : mode === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Form>
  )
}