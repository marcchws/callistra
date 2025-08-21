"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Loader2, Mail, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useAuth } from "@/app/sistema/use-auth"
import { RecoverPasswordFormData } from "@/app/sistema/types"

const recoverPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Campo obrigatório")
    .email("E-mail deve conter o símbolo @")
})

export default function RecoverPasswordPage() {
  const { recoverPassword, loading } = useAuth()

  const form = useForm<RecoverPasswordFormData>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      email: ""
    }
  })

  const onSubmit = async (data: RecoverPasswordFormData) => {
    await recoverPassword(data)
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Shield className="size-4" />
            </div>
            Callistra
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Recuperar Senha</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Digite seu e-mail para receber um link de recuperação de senha
                </p>
              </div>
              
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">E-mail <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="seuemail@gmail.com" 
                      {...form.register("email")}
                      className={form.formState.errors.email ? "border-red-500 pl-10" : "pl-10"}
                      disabled={loading}
                    />
                  </div>
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                  </Button>

                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full"
                    asChild
                    disabled={loading}
                  >
                    <Link href="/sistema/auth/login" className="flex items-center justify-center gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Voltar ao Login
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">
                      Instruções de Recuperação
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>• O link de recuperação expira em 24 horas</p>
                      <p>• O link pode ser usado apenas uma vez</p>
                      <p>• Verifique sua caixa de spam caso não receba o e-mail</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="bg-muted relative hidden lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-white">
              <Shield className="mx-auto h-16 w-16 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Sistema de Gestão Jurídica</h2>
              <p className="text-blue-100">Gerencie seus processos de forma eficiente e segura</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
