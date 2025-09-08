"use client"

import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Loader2, Mail, MessageSquare, Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { ExternalChatSchema, type ExternalChatForm } from "../types"

interface ExternalChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ExternalChatForm) => Promise<any>
}

export function ExternalChatDialog({
  open,
  onOpenChange,
  onSubmit
}: ExternalChatDialogProps) {
  const [loading, setLoading] = useState(false)
  const [generatedLink, setGeneratedLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const form = useForm<ExternalChatForm>({
    resolver: zodResolver(ExternalChatSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientDocument: "",
      sendMethod: "email",
      whatsappNumber: "",
      initialMessage: ""
    }
  })

  const sendMethod = form.watch("sendMethod")

  const handleSubmit = async (data: ExternalChatForm) => {
    setLoading(true)
    try {
      const result = await onSubmit(data)
      if (result?.secureLink) {
        setGeneratedLink(result.secureLink)
        toast.success("Chat criado com sucesso!")
        
        // Se não fechar o dialog imediatamente para mostrar o link
        setTimeout(() => {
          onOpenChange(false)
          form.reset()
          setGeneratedLink(null)
        }, 3000)
      }
    } catch (error) {
      toast.error("Erro ao criar chat externo")
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      toast.success("Link copiado!")
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 2) return numbers
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Iniciar Chat com Cliente Externo</DialogTitle>
          <DialogDescription>
            Crie um chat seguro com um cliente externo. Um link de acesso será gerado
            e enviado ao cliente.
          </DialogDescription>
        </DialogHeader>

        {!generatedLink ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Nome do Cliente */}
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome do Cliente <span className="text-red-500">*</span>
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

              {/* E-mail do Cliente */}
              <FormField
                control={form.control}
                name="clientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      E-mail do Cliente <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="cliente@exemplo.com" 
                        {...field}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Este e-mail será usado para autenticação
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CPF do Cliente */}
              <FormField
                control={form.control}
                name="clientDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      CPF do Cliente <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="000.000.000-00" 
                        {...field}
                        onChange={(e) => {
                          const formatted = formatCPF(e.target.value)
                          field.onChange(formatted)
                        }}
                        maxLength={14}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Os 5 primeiros dígitos serão usados para autenticação
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
                    <FormLabel>Como enviar o link?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="email" />
                          <Label htmlFor="email" className="flex items-center gap-2 cursor-pointer">
                            <Mail className="h-4 w-4" />
                            Por E-mail
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="whatsapp" id="whatsapp" />
                          <Label htmlFor="whatsapp" className="flex items-center gap-2 cursor-pointer">
                            <MessageSquare className="h-4 w-4" />
                            Via WhatsApp
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* WhatsApp Number (condicional) */}
              {sendMethod === "whatsapp" && (
                <FormField
                  control={form.control}
                  name="whatsappNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Número do WhatsApp <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="(00) 00000-0000" 
                          {...field}
                          onChange={(e) => {
                            const formatted = formatWhatsApp(e.target.value)
                            field.onChange(formatted)
                          }}
                          maxLength={15}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Mensagem Inicial */}
              <FormField
                control={form.control}
                name="initialMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensagem Inicial (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Olá! Estou entrando em contato sobre seu processo..." 
                        className="resize-none focus:ring-blue-500"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Esta mensagem será enviada automaticamente ao iniciar o chat
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
                  {loading ? "Criando..." : "Criar Chat"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4">
              <p className="text-sm font-medium text-green-800 mb-2">
                Chat criado com sucesso!
              </p>
              <p className="text-xs text-green-700">
                O link foi enviado para o cliente conforme solicitado.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Link de Acesso</Label>
              <div className="flex gap-2">
                <Input 
                  value={generatedLink} 
                  readOnly 
                  className="font-mono text-xs"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button 
                onClick={() => {
                  onOpenChange(false)
                  form.reset()
                  setGeneratedLink(null)
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Fechar
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}