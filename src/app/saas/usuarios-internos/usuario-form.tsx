"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Usuario, UsuarioFormData, PerfilAcesso } from './types'

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cargo: z.string().min(1, "Cargo é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório"),
  email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
  perfilAcesso: z.string().min(1, "Perfil de acesso é obrigatório"),
  status: z.enum(['Ativo', 'Inativo']),
  salario: z.string().optional(),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  contaCorrente: z.string().optional(),
  chavePix: z.string().optional(),
  observacao: z.string().optional(),
})

interface UsuarioFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario?: Usuario
  perfisAcesso: PerfilAcesso[]
  cargos: string[]
  loading: boolean
  onSubmit: (dados: UsuarioFormData) => Promise<boolean>
}

export function UsuarioForm({
  open,
  onOpenChange,
  usuario,
  perfisAcesso,
  cargos,
  loading,
  onSubmit
}: UsuarioFormProps) {
  const [submitLoading, setSubmitLoading] = useState(false)
  const isEditing = !!usuario

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: usuario?.nome || "",
      cargo: usuario?.cargo || "",
      telefone: usuario?.telefone || "",
      email: usuario?.email || "",
      perfilAcesso: usuario?.perfilAcesso || "",
      status: usuario?.status || "Ativo",
      salario: usuario?.salario?.toString() || "",
      banco: usuario?.banco || "",
      agencia: usuario?.agencia || "",
      contaCorrente: usuario?.contaCorrente || "",
      chavePix: usuario?.chavePix || "",
      observacao: usuario?.observacao || "",
    },
  })

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitLoading(true)
    try {
      const dados: UsuarioFormData = {
        ...values,
        salario: values.salario ? parseFloat(values.salario) : undefined
      }
      
      const sucesso = await onSubmit(dados)
      if (sucesso) {
        form.reset()
        onOpenChange(false)
      }
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  const formatCurrency = (value: string) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '')
    
    // Converte para formato de moeda
    if (numericValue === '') return ''
    
    const number = parseFloat(numericValue) / 100
    return number.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  const formatPhone = (value: string) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '')
    
    // Formata como +55 11 99999-9999
    if (numericValue.length <= 2) {
      return `+${numericValue}`
    } else if (numericValue.length <= 4) {
      return `+${numericValue.slice(0, 2)} ${numericValue.slice(2)}`
    } else if (numericValue.length <= 9) {
      return `+${numericValue.slice(0, 2)} ${numericValue.slice(2, 4)} ${numericValue.slice(4)}`
    } else {
      return `+${numericValue.slice(0, 2)} ${numericValue.slice(2, 4)} ${numericValue.slice(4, 9)}-${numericValue.slice(9, 13)}`
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do usuário interno do sistema'
              : 'Cadastre um novo usuário interno do sistema'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Nome */}
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-sm font-medium">
                      Nome Completo <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite o nome completo..." 
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
                        {cargos.map((cargo) => (
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
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
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
                        placeholder="+55 11 99999-9999" 
                        {...field}
                        onChange={(e) => field.onChange(formatPhone(e.target.value))}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Formato: DDI+DDD+NÚMERO
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
                          <SelectItem key={perfil.id} value={perfil.nome}>
                            <div className="flex flex-col">
                              <span>{perfil.nome}</span>
                              <span className="text-xs text-muted-foreground">{perfil.descricao}</span>
                            </div>
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

              {/* Salário */}
              <FormField
                control={form.control}
                name="salario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Salário
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="0,00"
                        {...field}
                        onChange={(e) => field.onChange(formatCurrency(e.target.value))}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Valor em reais (R$)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Chave PIX */}
              <FormField
                control={form.control}
                name="chavePix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Chave PIX
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="E-mail, CPF, telefone ou chave aleatória" 
                        {...field} 
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
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
                    <FormLabel className="text-sm font-medium">
                      Banco
                    </FormLabel>
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
                    <FormLabel className="text-sm font-medium">
                      Agência
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="1234-5" 
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
                    <FormLabel className="text-sm font-medium">
                      Conta Corrente
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="12345-6" 
                        {...field} 
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Observação */}
              <FormField
                control={form.control}
                name="observacao"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-sm font-medium">
                      Observação
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observações adicionais sobre o usuário..."
                        className="resize-none focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
                disabled={submitLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submitLoading || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitLoading 
                  ? (isEditing ? "Salvando..." : "Criando...")
                  : (isEditing ? "Salvar Alterações" : "Criar Usuário")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
