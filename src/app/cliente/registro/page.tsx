"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2, Building, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { registroEscritorioSchema, type RegistroEscritorioData, type RegistroResponse } from "./types"

// Simulação de API call - AC7, AC8 (validação de duplicações)
async function registrarEscritorio(data: RegistroEscritorioData): Promise<RegistroResponse> {
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Simular validação de CNPJ duplicado (AC7)
  if (data.cnpj === "11.111.111/1111-11") {
    return {
      success: false,
      message: "CNPJ já cadastrado no sistema",
      error: {
        code: "CNPJ_DUPLICATE",
        details: "Este CNPJ já está associado a um escritório cadastrado."
      }
    }
  }
  
  // Simular validação de e-mail duplicado (AC8)
  if (data.email === "teste@existente.com") {
    return {
      success: false,
      message: "E-mail já cadastrado no sistema",
      error: {
        code: "EMAIL_DUPLICATE",
        details: "Este e-mail já está associado a um escritório cadastrado."
      }
    }
  }
  
  // Sucesso - AC9 (criar registro com status pendente)
  return {
    success: true,
    message: "Escritório registrado com sucesso!",
    escritorioId: "escritorio_" + Date.now()
  }
}

// Função para formatar CNPJ
function formatCNPJ(value: string) {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  return value
}

// Função para formatar telefone
function formatTelefone(value: string) {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }
  return value
}

export default function RegistroEscritorioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  // Form setup seguindo padrões estabelecidos
  const form = useForm<RegistroEscritorioData>({
    resolver: zodResolver(registroEscritorioSchema),
    defaultValues: {
      razaoSocial: "",
      cnpj: "",
      email: "",
      telefone: "",
    },
  })

  // Submit handler - implementa todos os cenários da Requirements Matrix
  async function onSubmit(data: RegistroEscritorioData) {
    try {
      setLoading(true)
      
      const response = await registrarEscritorio(data)
      
      if (response.success) {
        // Scenario 1: Registro bem-sucedido
        toast.success(response.message, {
          duration: 3000,
          position: "bottom-right"
        })
        
        // AC10: Redirecionar para seleção de plano após registro
        setTimeout(() => {
          router.push("/cliente/selecionar-plano")
        }, 1000)
      } else {
        // Scenario 3: CNPJ ou e-mail já cadastrado
        if (response.error?.code === "CNPJ_DUPLICATE") {
          toast.error(response.message, {
            duration: 4000,
            position: "bottom-right",
            action: {
              label: "Fazer Login",
              onClick: () => router.push("/sistema/auth/login")
            }
          })
        } else if (response.error?.code === "EMAIL_DUPLICATE") {
          toast.error(response.message, {
            duration: 4000,
            position: "bottom-right",
            action: {
              label: "Recuperar Senha",
              onClick: () => router.push("/sistema/auth/recuperar-senha")
            }
          })
        } else {
          toast.error(response.message, {
            duration: 3000,
            position: "bottom-right"
          })
        }
      }
    } catch (error) {
      toast.error("Erro interno do sistema. Tente novamente.", {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header seguindo typography hierarchy corporativa */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Registro de Escritório</h1>
        <p className="text-muted-foreground">
          Cadastre seu escritório no Callistra e comece a otimizar seus processos jurídicos
        </p>
      </div>

      {/* Form Layout seguindo Callistra-patterns.md */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-xl font-semibold">Dados do Escritório</CardTitle>
          </div>
          <CardDescription>
            Preencha as informações básicas do seu escritório para criar sua conta
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              {/* AC1: Razão Social */}
              <FormField
                control={form.control}
                name="razaoSocial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Razão Social <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite a razão social do escritório"
                        className="focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Nome oficial do escritório conforme registro
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AC2: CNPJ com validação AC5 */}
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      CNPJ <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00.000.000/0000-00"
                        className="focus:ring-blue-500"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatCNPJ(e.target.value)
                          field.onChange(formatted)
                        }}
                        maxLength={18}
                      />
                    </FormControl>
                    <FormDescription>
                      CNPJ do escritório no formato 00.000.000/0000-00
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AC3: E-mail com validação AC6 */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      E-mail do Responsável <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="responsavel@escritorio.com"
                        className="focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      E-mail do responsável pela conta do escritório
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AC4: Telefone */}
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Telefone <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="(00) 00000-0000"
                        className="focus:ring-blue-500"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatTelefone(e.target.value)
                          field.onChange(formatted)
                        }}
                        maxLength={15}
                      />
                    </FormControl>
                    <FormDescription>
                      Telefone principal do escritório
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </form>
          </Form>
        </CardContent>

        {/* Footer seguindo padrões button + gap-3 */}
        <CardFooter className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            disabled={loading}
          >
            Voltar
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Registrando..." : "Registrar Escritório"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>

      {/* Informações adicionais - corporativo/profissional */}
      <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 mt-1">
              <span className="text-sm font-bold text-white">i</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                Próximos passos
              </p>
              <p className="text-sm text-blue-700">
                Após o registro, você será direcionado para escolher o plano mais adequado 
                para seu escritório e poderá começar a usar o Callistra imediatamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
