"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, Shield, GalleryVerticalEnd } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useAuth } from "@/app/sistema/use-auth"
import { LoginFormData } from "@/app/sistema/types"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Campo obrigatório")
    .email("E-mail deve conter o símbolo @"),
  password: z
    .string()
    .min(1, "Campo obrigatório")
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 
      "Senha deve conter letras, números e caracteres especiais")
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { login, loading } = useAuth()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: LoginFormData) => {
    await login(data)
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
                <h1 className="text-2xl font-bold">Acessar sua conta</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Digite suas credenciais para acessar o sistema
                </p>
              </div>
              
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">E-mail <span className="text-red-500">*</span></Label>
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="seuemail@gmail.com" 
                    {...form.register("email")}
                    disabled={loading}
                    className={form.formState.errors.email ? "border-red-500" : ""}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Senha <span className="text-red-500">*</span></Label>
                    <Link
                      href="/sistema/auth/recuperar-senha"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Esqueci minha senha
                    </Link>
                  </div>
                  <div className="relative">
                    <Input 
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      {...form.register("password")}
                      disabled={loading}
                      className={form.formState.errors.password ? "border-red-500 pr-10" : "pr-10"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
              
              <div className="text-center text-sm">
                <p className="text-xs text-muted-foreground">
                  Dados de teste: admin@callistra.com / Admin123!
                </p>
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
