"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulação de login
    setTimeout(() => {
      if (email && senha) {
        // Salvar dados de login no localStorage (mock)
        const userData = {
          email,
          nome: "Vítor Lima",
          plano: "trial",
          dataAssinatura: new Date().toISOString(),
          diasRestantes: 7,
          ativo: true
        }
        localStorage.setItem("maxleilao_user", JSON.stringify(userData))
        
        toast.success("Login realizado com sucesso!")
        router.push("/demo-leiloes")
      } else {
        toast.error("Preencha todos os campos")
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/demo-leiloes">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>

        <Card className="w-full">
          <CardHeader className="space-y-1 text-center">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                <span className="text-blue-600">Max</span> Leilão
              </h1>
            </div>
            <CardTitle className="text-2xl">Entrar na sua conta</CardTitle>
            <p className="text-gray-600">
              Acesse todos os leilões em um só lugar
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    placeholder="seu@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="senha"
                    placeholder="••••••••"
                    type={mostrarSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1 h-7 w-7 p-0"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                  >
                    {mostrarSenha ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Link href="/demo-leiloes/auth/recuperar-senha" className="text-sm text-blue-600 hover:underline">
                  Esqueci minha senha
                </Link>
              </div>
              
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            
            <Separator />
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Não tem uma conta?
              </p>
              <Link href="/demo-leiloes/auth/registro">
                <Button variant="outline" className="w-full">
                  Criar conta - 7 dias grátis
                </Button>
              </Link>
            </div>
            
            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-900 mb-2">Demo - Use qualquer credencial:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• E-mail: qualquer@email.com</li>
                <li>• Senha: qualquer senha</li>
                <li>• Funciona com qualquer dado para demonstração</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
