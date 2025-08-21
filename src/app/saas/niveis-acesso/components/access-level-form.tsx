import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from 'lucide-react'
import { AccessLevel, AccessLevelFormData, AccessLevelSchema, Permission } from '../types'
import { PermissionsManager } from './permissions-manager'
import { toast } from 'sonner'

interface AccessLevelFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AccessLevelFormData) => Promise<boolean>
  accessLevel?: AccessLevel | null
  checkNameExists: (name: string, excludeId?: string) => boolean
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
    resolver: zodResolver(AccessLevelSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      status: 'ativo',
      permissoes: {}
    }
  })

  // Preenche o formulário quando editar
  useEffect(() => {
    if (accessLevel) {
      form.reset({
        nome: accessLevel.nome,
        descricao: accessLevel.descricao || '',
        status: accessLevel.status,
        permissoes: accessLevel.permissoes || {}
      })
    } else {
      form.reset({
        nome: '',
        descricao: '',
        status: 'ativo',
        permissoes: {}
      })
    }
  }, [accessLevel, form])

  // Validação personalizada do nome
  const validateName = (value: string) => {
    if (!value || value.trim() === '') {
      return 'Nome é obrigatório'
    }
    
    if (checkNameExists(value, accessLevel?.id)) {
      return 'Nome já existe no sistema'
    }
    
    return true
  }

  // Handle submit
  const handleSubmit = async (data: AccessLevelFormData) => {
    // Validação extra do nome
    const nameValidation = validateName(data.nome)
    if (nameValidation !== true) {
      form.setError('nome', { message: nameValidation })
      return
    }

    setIsSubmitting(true)
    
    try {
      const success = await onSubmit(data)
      if (success) {
        handleClose()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle close
  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {accessLevel ? 'Editar Perfil de Acesso' : 'Criar Novo Perfil de Acesso'}
          </DialogTitle>
          <DialogDescription>
            {accessLevel 
              ? 'Altere as informações e permissões do perfil de acesso.'
              : 'Defina o nome, descrição e as permissões para o novo perfil de acesso.'}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 pb-4">
                {/* Nome do Perfil */}
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nome do Perfil <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Administrador, Financeiro, Marketing" 
                          {...field}
                          className="focus:ring-blue-500"
                          onBlur={(e) => {
                            field.onBlur()
                            const validation = validateName(e.target.value)
                            if (validation !== true) {
                              form.setError('nome', { message: validation })
                            } else {
                              form.clearErrors('nome')
                            }
                          }}
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
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Descrição do Perfil
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Perfil para advogados parceiros com acesso limitado"
                          className="resize-none focus:ring-blue-500"
                          rows={3}
                          {...field}
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
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Status do Perfil <span className="text-red-500">*</span>
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
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Define se o perfil está disponível para uso
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Permissões */}
                <FormField
                  control={form.control}
                  name="permissoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Permissões do Perfil
                      </FormLabel>
                      <FormControl>
                        <PermissionsManager
                          permissions={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Selecione as permissões para cada tela do sistema
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            
            <DialogFooter className="pt-4 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting || loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {(isSubmitting || loading) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting || loading 
                  ? (accessLevel ? "Salvando..." : "Criando...") 
                  : (accessLevel ? "Salvar Alterações" : "Criar Perfil")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
