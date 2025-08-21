"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { 
  LoginFormData, 
  RecoverPasswordFormData, 
  NewPasswordFormData, 
  AuthResponse, 
  PasswordRecoveryResponse, 
  AuthState, 
  PasswordRequirements 
} from "./types"

export function useAuth() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    loading: false,
    error: null,
    user: null
  })

  // Simulated API calls - In real implementation, these would be actual API calls
  const login = async (data: LoginFormData): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Simulate different scenarios based on requirements
      if (!data.email || !data.password) {
        throw new Error("Preencha todos os campos obrigatórios")
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        throw new Error("Credenciais inválidas")
      }

      // Simulate different user scenarios
      if (data.email === "inativo@test.com") {
        throw new Error("Usuário desativado. Entre em contato com o administrador")
      }

      if (data.email === "admin@callistra.com" && data.password === "Admin123!") {
        const response: AuthResponse = {
          success: true,
          message: "Login realizado com sucesso",
          user: {
            id: "1",
            email: data.email,
            name: "Administrador",
            role: "admin",
            active: true
          }
        }

        setAuthState(prev => ({ 
          ...prev, 
          loading: false, 
          user: response.user 
        }))

        toast.success(response.message, { 
          duration: 2000,
          position: "bottom-right"
        })

        router.push("/dashboard")
        return
      }

      throw new Error("Credenciais inválidas")

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor"
      
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }))

      toast.error(errorMessage, { 
        duration: 3000,
        position: "bottom-right"
      })
    }
  }

  const recoverPassword = async (data: RecoverPasswordFormData): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(data.email)) {
        throw new Error("E-mail não cadastrado no sistema")
      }

      // Simulate email check
      if (data.email === "notfound@test.com") {
        throw new Error("E-mail não cadastrado no sistema")
      }

      const response: PasswordRecoveryResponse = {
        success: true,
        message: "Link de recuperação enviado para seu e-mail",
        token: "recovery-token-123"
      }

      setAuthState(prev => ({ ...prev, loading: false }))

      toast.success(response.message, { 
        duration: 3000,
        position: "bottom-right"
      })

      // Simulate redirect to check email message or next step
      setTimeout(() => {
        router.push(`/sistema/auth/nova-senha?token=${response.token}`)
      }, 2000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor"
      
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }))

      toast.error(errorMessage, { 
        duration: 3000,
        position: "bottom-right"
      })
    }
  }

  const resetPassword = async (data: NewPasswordFormData, token: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validate token (simulate expiration)
      if (token === "expired-token") {
        throw new Error("Link expirado. Solicite um novo link de recuperação")
      }

      // Validate password requirements
      const requirements = validatePassword(data.password)
      if (!requirements.minLength || !requirements.hasLetters || !requirements.hasNumbers || !requirements.hasSpecialChars) {
        throw new Error("A senha deve ter no mínimo 8 caracteres, incluindo letras, números e caracteres especiais")
      }

      // Validate password confirmation
      if (data.password !== data.confirmPassword) {
        throw new Error("As senhas não conferem")
      }

      setAuthState(prev => ({ 
        ...prev, 
        loading: false,
        user: {
          id: "1",
          email: "user@callistra.com",
          name: "Usuário",
          role: "user",
          active: true
        }
      }))

      toast.success("Senha alterada com sucesso", { 
        duration: 2000,
        position: "bottom-right"
      })

      // Auto-login after password reset
      router.push("/dashboard")

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro interno do servidor"
      
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }))

      toast.error(errorMessage, { 
        duration: 3000,
        position: "bottom-right"
      })
    }
  }

  const validatePassword = (password: string): PasswordRequirements => {
    return {
      minLength: password.length >= 8,
      hasLetters: /[a-zA-Z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }
  }

  const generatePassword = (): string => {
    const length = 12
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    const special = "!@#$%^&*"
    
    let password = ""
    
    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += special[Math.floor(Math.random() * special.length)]
    
    // Fill the rest randomly
    const allChars = lowercase + uppercase + numbers + special
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }

  return {
    ...authState,
    login,
    recoverPassword,
    resetPassword,
    validatePassword,
    generatePassword
  }
}
