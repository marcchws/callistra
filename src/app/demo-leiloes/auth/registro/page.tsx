"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegistroPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: ""
  })
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!aceitouTermos) {
      toast.error("Aceite os termos de uso para continuar")
      setLoading(false)
      return
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem")
      setLoading(false)
      return
    }

    // Simulação de registro
    setTimeout(() => {
      if (formData.nome && formData.email && formData.senha) {
        // Salvar dados de usuário no localStorage (mock)
        const userData = {
          email: formData.email,
          nome: formData.nome,
          plano: "trial",
          dataAssinatura: new Date().toISOString(),
          diasRestantes: 7,
          ativo: true,
          dataCriacao: new Date().toISOString()
        }
        localStorage.setItem("maxleilao_user", JSON.stringify(userData))
        
        toast.success("Conta criada! 7 dias grátis ativados!")
        router.push("/demo-leiloes")
      } else {
        toast.error("Preencha todos os campos")
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/demo-leiloes/auth/login">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Login
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
            <CardTitle className="text-2xl">Criar sua conta</CardTitle>
            <div className="flex items-center justify-center gap-2 text-green-600">
              <Gift className="h-4 w-4" />
              <p className="font-medium">
                7 dias grátis inclusos!
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleRegistro} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="nome"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    placeholder="seu@email.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
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
                    value={formData.senha}
                    onChange={(e) => handleInputChange("senha", e.target.value)}
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

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmarSenha"
                    placeholder="••••••••"
                    type="password"
                    value={formData.confirmarSenha}
                    onChange={(e) => handleInputChange("confirmarSenha", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="termos" 
                  checked={aceitouTermos}
                  onCheckedChange={(checked) => setAceitouTermos(checked as boolean)}
                />
                <Label htmlFor="termos" className="text-sm">
                  Aceito os{" "}
                  <Link href="#" className="text-blue-600 hover:underline">
                    termos de uso
                  </Link>{" "}
                  e{" "}
                  <Link href="#" className="text-blue-600 hover:underline">
                    política de privacidade
                  </Link>
                </Label>
              </div>
              
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? "Criando conta..." : "Criar conta - Grátis por 7 dias"}
              </Button>
            </form>
            
            <Separator />
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Já tem uma conta?
              </p>
              <Link href="/demo-leiloes/auth/login">
                <Button variant="outline" className="w-full">
                  Fazer login
                </Button>
              </Link>
            </div>
            
            {/* Benefícios do Trial */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Seu trial de 7 dias inclui:</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Acesso a todos os leilões centralizados</li>
                <li>• Calculadora de investimento ilimitada</li>
                <li>• Sistema de favoritos</li>
                <li>• Alertas personalizados</li>
                <li>• Suporte por WhatsApp</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
