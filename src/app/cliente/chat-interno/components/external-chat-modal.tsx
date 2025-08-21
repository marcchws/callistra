"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { createExternalChatSchema, CreateExternalChatFormData } from "../types"
import { toast } from "sonner"

interface ExternalChatModalProps {
  onSubmit: (data: CreateExternalChatFormData) => Promise<void>
  loading: boolean
}

export function ExternalChatModal({ onSubmit, loading }: ExternalChatModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CreateExternalChatFormData>({
    resolver: zodResolver(createExternalChatSchema),
    defaultValues: {
      clientEmail: "",
      clientName: "",
      documentDigits: "",
      sendMethod: "email"
    }
  })

  const handleSubmit = async (data: CreateExternalChatFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      form.reset()
    } catch (error) {
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Iniciar Chat com Cliente</DialogTitle>
        <DialogDescription>
          Crie um link seguro para conversar com um cliente externo. O cliente precisará 
          informar o e-mail e os 5 primeiros dígitos do documento para acessar.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Nome do Cliente */}
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Nome do Cliente <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Ex: João Silva" 
                    {...field}
                    className="focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* E-mail do Cliente */}
          <FormField
            control={form.control}
            name="clientEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  E-mail do Cliente <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email"
                    placeholder="cliente@email.com" 
                    {...field}
                    className="focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  O cliente usará este e-mail para acessar o chat
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 5 Primeiros Dígitos do Documento */}
          <FormField
            control={form.control}
            name="documentDigits"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  5 Primeiros Dígitos do Documento <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="12345"
                    maxLength={5}
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 5)
                      field.onChange(value)
                    }}
                    className="focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormDescription>
                  CPF, CNPJ ou Passaporte (apenas números)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Método de Envio */}
          <FormField
            control={form.control}
            name="sendMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Como enviar o link? <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="space-y-3 pt-2"
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                        <Mail className="h-4 w-4 text-blue-600" />
                        Enviar por E-mail
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="whatsapp" id="whatsapp" />
                      <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                        Enviar por WhatsApp
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              disabled={isSubmitting}
              onClick={() => form.reset()}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Criando..." : "Criar Chat"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  )
}