"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, Shield, Check, X, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useAuth } from "@/app/sistema/use-auth"
import { NewPasswordFormData, PasswordRequirements } from "@/app/sistema/types"

const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, 
      "Senha deve conter letras, números e caracteres especiais"),
  confirmPassword: z.string().min(1, "Confirmação de senha obrigatória")
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"]
})

export default function NewPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordRequirements, setPasswordRequirements] = useState<PasswordRequirements>({
    minLength: false,
    hasLetters: false,
    hasNumbers: false,
    hasSpecialChars: false
  })

  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  
  const { resetPassword, validatePassword, generatePassword, loading } = useAuth()

  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  const watchPassword = form.watch("password")

  useEffect(() => {
    if (watchPassword) {
      setPasswordRequirements(validatePassword(watchPassword))
    }
  }, [watchPassword, validatePassword])

  const onSubmit = async (data: NewPasswordFormData) => {
    await resetPassword(data, token)
  }

  const handleGeneratePassword = () => {
    const generatedPassword = generatePassword()
    form.setValue("password", generatedPassword)
    form.setValue("confirmPassword", generatedPassword)
    setPasswordRequirements(validatePassword(generatedPassword))
  }

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}
      <span className={met ? "text-green-700" : "text-red-600"}>
        {text}
      </span>
    </div>
  )

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Shield className="size-4" />
            </div>
            Callistra
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Criar Nova Senha</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Defina uma nova senha segura para sua conta
                </p>
              </div>
              
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="password">Nova Senha <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input 
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua nova senha" 
                      {...form.register("password")}
                      className={form.formState.errors.password ? "border-red-500 pr-10" : "pr-10"}
                      disabled={loading}
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

                {/* Gerador de Senha */}
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGeneratePassword}
                    disabled={loading}
                    className="text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Gerar Senha Automaticamente
                  </Button>
                </div>

                {/* Requisitos da Senha */}
                {watchPassword && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Requisitos da senha:</p>
                    <RequirementItem 
                      met={passwordRequirements.minLength} 
                      text="Mínimo 8 caracteres" 
                    />
                    <RequirementItem 
                      met={passwordRequirements.hasLetters} 
                      text="Contém letras" 
                    />
                    <RequirementItem 
                      met={passwordRequirements.hasNumbers} 
                      text="Contém números" 
                    />
                    <RequirementItem 
                      met={passwordRequirements.hasSpecialChars} 
                      text="Contém caracteres especiais" 
                    />
                  </div>
                )}

                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha <span className="text-red-500">*</span></Label>
                  <div className="relative">
                    <Input 
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Digite novamente a nova senha" 
                      {...form.register("confirmPassword")}
                      className={form.formState.errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                      disabled={loading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Digite a mesma senha para confirmação
                  </p>
                  {form.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Salvando..." : "Salvar Nova Senha"}
                </Button>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-green-900">
                      Segurança da Senha
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>• Após salvar, você será automaticamente logado no sistema</p>
                      <p>• Use o gerador para criar uma senha segura automaticamente</p>
                      <p>• Sua nova senha deve ser única e não compartilhada</p>
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
