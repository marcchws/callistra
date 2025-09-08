"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
import { Loader2 } from "lucide-react"
import {
  AccessLevel,
  AccessLevelFormData,
  accessLevelSchema,
  ScreenPermissions
} from "../types"
import { PermissionsGrid } from "./permissions-grid"

interface AccessLevelFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AccessLevelFormData) => Promise<{ success: boolean; error?: string }>
  accessLevel?: AccessLevel | null
  checkNameExists?: (name: string, excludeId?: string) => boolean
  loading?: boolean
}

export function AccessLevelForm({
  open,
  onClose,
  onSubmit,
  accessLevel,
  checkNameExists,
  loading = false
}: AccessLevelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<AccessLevelFormData>({
    resolver: zodResolver(accessLevelSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "ativo",
      permissions: []
    }
  })

  // Resetar formulário quando abrir/fechar ou mudar o perfil
  useEffect(() => {
    if (open) {
      if (accessLevel) {
        form.reset({
          name: accessLevel.name,
          description: accessLevel.description || "",
          status: accessLevel.status,
          permissions: accessLevel.permissions
        })
      } else {
        form.reset({
          name: "",
          description: "",
          status: "ativo",
          permissions: []
        })
      }
    }
  }, [open, accessLevel, form])

  // Validação personalizada do nome (verificar duplicados)
  const validateName = (name: string) => {
    if (!checkNameExists) return true
    
    const exists = checkNameExists(name, accessLevel?.id)
    if (exists) {
      form.setError("name", {
        type: "manual",
        message: "Nome já existe no sistema"
      })
      return false
    }
    return true
  }

  const handleSubmit = async (data: AccessLevelFormData) => {
    // Validar nome duplicado antes de enviar
    if (!validateName(data.name)) {
      return
    }

    setIsSubmitting(true)
    const result = await onSubmit(data)
    setIsSubmitting(false)

    if (result.success) {
      onClose()
    } else if (result.error?.includes("Nome já existe")) {
      form.setError("name", {
        type: "manual",
        message: result.error
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {accessLevel ? "Editar Perfil de Acesso" : "Criar Novo Perfil de Acesso"}
          </DialogTitle>
          <DialogDescription>
            {accessLevel 
              ? "Atualize as informações e permissões do perfil de acesso"
              : "Defina o nome, descrição e permissões para o novo perfil de acesso"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Nome do Perfil */}
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
                      placeholder="Ex: Administrador, Financeiro, Advogado Associado..."
                      {...field}
                      className="focus:ring-blue-500"
                      disabled={loading || isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Nome para diferenciação do tipo de perfil
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição */}
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
                      placeholder="Ex: Perfil para Advogados parceiros..."
                      className="resize-none focus:ring-blue-500"
                      rows={3}
                      {...field}
                      disabled={loading || isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Informação adicional sobre o perfil de acesso (opcional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Status do Perfil
                    </FormLabel>
                    <FormDescription>
                      Perfis inativos não podem ser atribuídos a novos usuários
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value === "ativo"}
                      onCheckedChange={(checked) => field.onChange(checked ? "ativo" : "inativo")}
                      disabled={loading || isSubmitting}
                      className="data-[state=checked]:bg-blue-600"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Permissões */}
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Permissões do Perfil
                  </FormLabel>
                  <FormControl>
                    <PermissionsGrid
                      value={field.value}
                      onChange={field.onChange}
                      disabled={loading || isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading || isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {(loading || isSubmitting) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {accessLevel ? "Salvar Alterações" : "Criar Perfil"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
