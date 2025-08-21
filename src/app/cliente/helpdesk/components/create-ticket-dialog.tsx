"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Upload, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createTicketSchema, CreateTicketFormData } from "../types"

interface CreateTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateTicketFormData & { anexoInicial?: File }) => Promise<void>
  loading: boolean
}

export function CreateTicketDialog({
  open,
  onOpenChange,
  onSubmit,
  loading
}: CreateTicketDialogProps) {
  const [anexoInicial, setAnexoInicial] = useState<File | null>(null)

  const form = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      nomeCliente: "",
      emailCliente: "",
      motivoSuporte: "",
      descricao: ""
    }
  })

  const handleSubmit = async (data: CreateTicketFormData) => {
    try {
      await onSubmit({
        ...data,
        anexoInicial: anexoInicial || undefined
      })
      
      form.reset()
      setAnexoInicial(null)
      onOpenChange(false)
    } catch (error) {
      // Error is handled in the hook
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("Arquivo muito grande. Máximo permitido: 10MB")
        return
      }
      setAnexoInicial(file)
    }
  }

  const removeFile = () => {
    setAnexoInicial(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Ticket de Suporte</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Nome do Cliente - Campo obrigatório baseado no PRD */}
            <FormField
              control={form.control}
              name="nomeCliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Nome do Cliente <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Digite o nome completo do cliente..." 
                      {...field}
                      className="focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* E-mail do Cliente - Campo obrigatório baseado no PRD */}
            <FormField
              control={form.control}
              name="emailCliente"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    E-mail do Cliente <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Digite o e-mail do cliente..." 
                      {...field}
                      className="focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormDescription>
                    E-mail para notificações sobre o ticket
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Motivo do Suporte - Campo obrigatório baseado no PRD */}
            <FormField
              control={form.control}
              name="motivoSuporte"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Motivo do Suporte <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: Problema com login, Dúvida sobre funcionalidade..." 
                      {...field}
                      className="focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descrição - Campo obrigatório baseado no PRD */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Descrição <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descreva detalhadamente o problema ou dúvida..."
                      rows={4}
                      {...field}
                      className="focus:ring-blue-500"
                    />
                  </FormControl>
                  <FormDescription>
                    Quanto mais detalhes, melhor poderemos ajudar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Anexo Inicial - Campo opcional baseado no PRD */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Anexo Inicial (opcional)
              </label>
              
              {!anexoInicial ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Arraste um arquivo ou clique para selecionar
                  </p>
                  <p className="text-xs text-gray-500">
                    Máximo 10MB - Imagens, PDF, DOC, DOCX
                  </p>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{anexoInicial.name}</p>
                    <p className="text-xs text-gray-500">
                      {(anexoInicial.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
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
                {loading ? "Criando..." : "Criar Ticket"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
