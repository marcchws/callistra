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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Loader2, Shield, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClientAuthSchema, type ClientAuthForm } from "../types"

interface ClientAuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ClientAuthForm) => Promise<boolean>
  chatId: string
}

export function ClientAuthDialog({
  open,
  onOpenChange,
  onSubmit,
  chatId
}: ClientAuthDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attempts, setAttempts] = useState(0)

  const form = useForm<ClientAuthForm>({
    resolver: zodResolver(ClientAuthSchema),
    defaultValues: {
      email: "",
      documentDigits: ""
    }
  })

  const handleSubmit = async (data: ClientAuthForm) => {
    setLoading(true)
    setError(null)
    
    try {
      const success = await onSubmit(data)
      
      if (success) {
        onOpenChange(false)
        form.reset()
        setAttempts(0)
      } else {
        setAttempts(prev => prev + 1)
        
        if (attempts >= 2) {
          setError("Muitas tentativas incorretas. Por favor, verifique seus dados ou entre em contato com o escritório.")
        } else {
          setError("Dados incorretos. Verifique seu e-mail e os 5 primeiros dígitos do seu documento.")
        }
      }
    } catch (err) {
      setError("Erro ao autenticar. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const formatDocumentDigits = (value: string) => {
    // Permitir apenas números e limitar a 5 dígitos
    return value.replace(/\D/g, "").slice(0, 5)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Autenticação Necessária
          </DialogTitle>
          <DialogDescription>
            Para acessar este chat, você precisa confirmar seus dados.
            Informe o e-mail cadastrado e os 5 primeiros dígitos do seu documento.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* E-mail */}
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
                      placeholder="seu@email.com" 
                      {...field}
                      disabled={loading}
                      className="focus:ring-blue-500"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormDescription>
                    Use o mesmo e-mail informado ao escritório
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Primeiros 5 dígitos do documento */}
            <FormField
              control={form.control}
              name="documentDigits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Primeiros 5 dígitos do CPF/Passaporte <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="text"
                      placeholder="12345" 
                      {...field}
                      onChange={(e) => {
                        const formatted = formatDocumentDigits(e.target.value)
                        field.onChange(formatted)
                      }}
                      maxLength={5}
                      disabled={loading}
                      className="focus:ring-blue-500 font-mono text-center text-lg tracking-wider"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormDescription>
                    Digite apenas os 5 primeiros números do seu documento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Informação adicional */}
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs text-blue-700">
                <strong>Importante:</strong> Seus dados são protegidos e usados apenas para 
                verificar sua identidade. Após 3 tentativas incorretas, o acesso será bloqueado 
                por segurança.
              </p>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  onOpenChange(false)
                  form.reset()
                  setError(null)
                  setAttempts(0)
                }}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading || attempts >= 3}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Verificando..." : "Acessar Chat"}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {attempts >= 3 && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Acesso bloqueado após múltiplas tentativas. 
              Entre em contato com o escritório para obter ajuda.
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  )
}