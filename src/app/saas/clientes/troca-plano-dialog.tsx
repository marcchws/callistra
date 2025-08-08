"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowRight } from "lucide-react"
import { Cliente, TrocaPlanoData } from "./types"
import { useClientes } from "./use-clientes"

const TrocaPlanoSchema = z.object({
  novoPlano: z.string().min(1, "Selecione um plano"),
  motivo: z.string().min(10, "Motivo deve ter pelo menos 10 caracteres")
})

type TrocaPlanoFormData = z.infer<typeof TrocaPlanoSchema>

interface TrocaPlanoDialogProps {
  open: boolean
  onClose: () => void
  cliente: Cliente
}

const planosDisponiveis = [
  { value: "Free", label: "Free", color: "bg-gray-100 text-gray-800" },
  { value: "Standard", label: "Standard", color: "bg-blue-100 text-blue-800" },
  { value: "Premium", label: "Premium", color: "bg-purple-100 text-purple-800" },
  { value: "Enterprise", label: "Enterprise", color: "bg-orange-100 text-orange-800" }
]

export function TrocaPlanoDialog({ open, onClose, cliente }: TrocaPlanoDialogProps) {
  const { trocarPlano, loading } = useClientes()

  const form = useForm<TrocaPlanoFormData>({
    resolver: zodResolver(TrocaPlanoSchema),
    defaultValues: {
      novoPlano: "",
      motivo: ""
    }
  })

  const onSubmit = async (data: TrocaPlanoFormData) => {
    const trocaData: TrocaPlanoData = {
      clienteId: cliente.id,
      novoPlano: data.novoPlano,
      motivo: data.motivo
    }

    const result = await trocarPlano(trocaData)
    if (result.success) {
      form.reset()
      onClose()
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  const novoPlanoSelecionado = form.watch("novoPlano")
  const planoAtualConfig = planosDisponiveis.find(p => p.value === cliente.nomePlano)
  const novoPlanoConfig = planosDisponiveis.find(p => p.value === novoPlanoSelecionado)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Trocar Plano do Cliente</DialogTitle>
          <DialogDescription>
            Alterar o plano de assinatura do escritório {cliente.nomeEscritorio}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Visualização da Troca */}
          <div className="flex items-center justify-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Plano Atual</p>
              <Badge 
                variant="outline" 
                className={planoAtualConfig?.color}
              >
                {cliente.nomePlano}
              </Badge>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Novo Plano</p>
              {novoPlanoSelecionado ? (
                <Badge 
                  variant="outline" 
                  className={novoPlanoConfig?.color}
                >
                  {novoPlanoSelecionado}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-100 text-gray-400">
                  Selecione
                </Badge>
              )}
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="novoPlano"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Novo Plano <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o novo plano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {planosDisponiveis
                          .filter(plano => plano.value !== cliente.nomePlano)
                          .map((plano) => (
                            <SelectItem key={plano.value} value={plano.value}>
                              {plano.label}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecione o plano para o qual deseja migrar o cliente
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
                      Motivo da Troca <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o motivo da alteração do plano (ex: upgrade solicitado pelo cliente, downgrade por redução de usuários, etc.)"
                        className="resize-none focus:ring-blue-500"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Registre o motivo para auditoria e histórico
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> A troca de plano será aplicada imediatamente e pode afetar 
                  os limites de usuários, processos e tokens de IA disponíveis para o cliente.
                </p>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !novoPlanoSelecionado}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Alterando..." : "Confirmar Troca"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
