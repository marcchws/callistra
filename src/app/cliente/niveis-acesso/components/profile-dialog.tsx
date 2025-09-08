"use client"

import { useState, useEffect } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { PermissionsMatrix } from "./permissions-matrix"
import { 
  AccessProfile,
  ProfileFormData,
  profileSchema,
  ProfileStatus,
  statusLabels
} from "../types"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile?: AccessProfile | null
  onSubmit: (data: ProfileFormData) => Promise<void>
  generateEmptyPermissions: () => any[]
  loading?: boolean
}

export function ProfileDialog({
  open,
  onOpenChange,
  profile,
  onSubmit,
  generateEmptyPermissions,
  loading = false
}: ProfileDialogProps) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      description: "",
      status: ProfileStatus.ATIVO,
      screenPermissions: []
    }
  })

  // Atualizar formulário quando o perfil mudar
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        description: profile.description || "",
        status: profile.status,
        screenPermissions: profile.screenPermissions
      })
    } else {
      form.reset({
        name: "",
        description: "",
        status: ProfileStatus.ATIVO,
        screenPermissions: generateEmptyPermissions()
      })
    }
  }, [profile, form, generateEmptyPermissions])

  const handleSubmit = async (data: ProfileFormData) => {
    setSubmitting(true)
    try {
      // Validar se pelo menos uma permissão foi selecionada
      const hasPermissions = data.screenPermissions.some(screen => 
        screen.permissions.some(perm => perm.enabled)
      )
      
      if (!hasPermissions) {
        form.setError("screenPermissions", {
          message: "Selecione pelo menos uma permissão"
        })
        return
      }

      await onSubmit(data)
      onOpenChange(false)
      form.reset()
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {profile ? "Editar Perfil de Acesso" : "Criar Novo Perfil de Acesso"}
          </DialogTitle>
          <DialogDescription>
            {profile 
              ? "Atualize as informações e permissões do perfil de acesso."
              : "Defina um nome, descrição e as permissões para o novo perfil de acesso."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Nome do Perfil <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Administrador, Financeiro, Advogado Associado"
                        {...field}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="focus:ring-blue-500">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Descrição do Perfil
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ex: Perfil para advogados parceiros com acesso limitado"
                      className="min-h-[80px] focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Adicione uma descrição para ajudar a identificar o propósito deste perfil.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="screenPermissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Permissões do Sistema <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <PermissionsMatrix
                      permissions={field.value}
                      onChange={field.onChange}
                      loading={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Selecione as permissões que este perfil terá em cada tela do sistema.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitting 
                  ? (profile ? "Atualizando..." : "Criando...") 
                  : (profile ? "Salvar Alterações" : "Criar Perfil")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
