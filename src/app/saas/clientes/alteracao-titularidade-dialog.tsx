"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowRight, User } from "lucide-react"
import { Cliente, AlteracaoTitularidadeData } from "./types"
import { useClientes } from "./use-clientes"

const AlteracaoTitularidadeSchema = z.object({
  novoNome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  novoEmail: z.string()
    .email("E-mail inválido")
    .max(100, "E-mail deve ter no máximo 100 caracteres"),
  novoTelefone: z.string()
    .regex(/^\+\d{2}\s\d{2}\s\d{4,5}-\d{4}$/, "Telefone deve ter o formato +XX XX XXXXX-XXXX"),
  motivo: z.string()
    .min(20, "Motivo deve ter pelo menos 20 caracteres")
    .max(500, "Motivo deve ter no máximo 500 caracteres")
})

type AlteracaoTitularidadeFormData = z.infer<typeof AlteracaoTitularidadeSchema>

interface AlteracaoTitularidadeDialogProps {
  open: boolean
  onClose: () => void
  cliente: Cliente
}

export function AlteracaoTitularidadeDialog({ open, onClose, cliente }: AlteracaoTitularidadeDialogProps) {
  const { alterarTitularidade, loading } = useClientes()

  const form = useForm<AlteracaoTitularidadeFormData>({
    resolver: zodResolver(AlteracaoTitularidadeSchema),
    defaultValues: {
      novoNome: "",
      novoEmail: "",
      novoTelefone: "",
      motivo: ""
    }
  })

  const onSubmit = async (data: AlteracaoTitularidadeFormData) => {
    const alteracaoData: AlteracaoTitularidadeData = {
      clienteId: cliente.id,
      novoNome: data.novoNome,
      novoEmail: data.novoEmail,
      novoTelefone: data.novoTelefone,
      motivo: data.motivo
    }

    const result = await alterarTitularidade(alteracaoData)
    if (result.success) {
      form.reset()
      onClose()
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  // Função para formatar telefone
  const formatTelefone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length === 13) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
    }
    return value
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Alterar Titularidade do Cliente</DialogTitle>
          <DialogDescription>
            Transferir a administração do escritório {cliente.nomeEscritorio} para outro responsável
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Visualização da Alteração */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Titular Atual</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{cliente.nomeContratante}</p>
                <p className="text-xs text-muted-foreground">{cliente.emailContratante}</p>
                <p className="text-xs text-muted-foreground">{cliente.telefone}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center md:justify-start">
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
              <div className="md:hidden w-full border-t border-gray-300 my-2"></div>
            </div>
            
            <div className="space-y-2 md:col-start-2">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Novo Titular</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-600">
                  {form.watch("novoNome") || "Nome do novo titular"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {form.watch("novoEmail") || "email@exemplo.com"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {form.watch("novoTelefone") || "+XX XX XXXXX-XXXX"}
                </p>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="novoNome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nome do Novo Titular <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome completo do novo responsável"
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
                  name="novoEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        E-mail do Novo Titular <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="email@escritorio.com.br"
                          {...field}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormDescription>
                        Este será o novo e-mail de acesso administrativo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="novoTelefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Telefone do Novo Titular <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+XX XX XXXXX-XXXX"
                        value={field.value}
                        onChange={(e) => {
                          const formatted = formatTelefone(e.target.value)
                          field.onChange(formatted)
                        }}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Formato: DDI + DDD + Número
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Motivo da Alteração <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva detalhadamente o motivo da alteração de titularidade (ex: solicitação via ticket de suporte, mudança na direção do escritório, etc.)"
                        className="resize-none focus:ring-blue-500"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Este registro será mantido para auditoria e histórico
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-red-800 mb-2">⚠️ Atenção - Ação Crítica</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• O titular atual perderá acesso administrativo imediatamente</li>
                  <li>• O novo titular receberá credenciais de acesso por e-mail</li>
                  <li>• Esta alteração será registrada no histórico de auditoria</li>
                  <li>• A ação é irreversível pelo sistema (necessário novo ticket para reverter)</li>
                </ul>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Alterando..." : "Confirmar Alteração"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
