"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ContactFormData, contactFormSchema, FormState } from "./types"

// Hook customizado para gerenciar o formulário de contato
// Atende aos cenários de teste 1, 2, 10, 11
export function useContactForm() {
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    isSuccess: false,
    error: null,
  })

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      acceptTerms: false,
    },
  })

  // Máscara de telefone (Cenário 11)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove não-números
    const maskedValue = value
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .substring(0, 15) // Limita ao tamanho máximo
    
    form.setValue("phone", value) // Salva apenas números
    e.target.value = maskedValue // Exibe com máscara
  }

  // Enviar formulário (Cenários 1 e 2)
  const onSubmit = async (data: ContactFormData) => {
    setFormState({ isLoading: true, isSuccess: false, error: null })

    try {
      // Simula envio do formulário
      // Em produção, aqui seria feita a chamada à API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Log dos dados para verificação
      console.log("Formulário enviado:", data)

      // Sucesso (Cenário 1)
      setFormState({ isLoading: false, isSuccess: true, error: null })
      toast.success("Formulário enviado com sucesso!", {
        duration: 3000,
        position: "bottom-right",
      })

      // Limpa o formulário após sucesso
      form.reset()

      // Reseta o estado de sucesso após 5 segundos
      setTimeout(() => {
        setFormState((prev) => ({ ...prev, isSuccess: false }))
      }, 5000)

    } catch (error) {
      // Erro no envio
      setFormState({
        isLoading: false,
        isSuccess: false,
        error: "Erro ao enviar formulário. Tente novamente.",
      })
      
      toast.error("Erro ao enviar formulário. Tente novamente.", {
        duration: 3000,
        position: "bottom-right",
      })
    }
  }

  // Função para abrir WhatsApp (Cenário 5)
  const openWhatsApp = (phone: string, message?: string) => {
    const cleanPhone = phone.replace(/\D/g, "")
    const whatsappUrl = `https://wa.me/55${cleanPhone}${
      message ? `?text=${encodeURIComponent(message)}` : ""
    }`
    window.open(whatsappUrl, "_blank")
  }

  // Função para enviar email (Cenário 6)
  const openEmail = (email: string, subject?: string, body?: string) => {
    const mailtoUrl = `mailto:${email}${
      subject || body
        ? `?${subject ? `subject=${encodeURIComponent(subject)}` : ""}${
            subject && body ? "&" : ""
          }${body ? `body=${encodeURIComponent(body)}` : ""}`
        : ""
    }`
    window.location.href = mailtoUrl
  }

  // Função para fazer ligação (Cenário 7)
  const openPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "")
    window.location.href = `tel:+55${cleanPhone}`
  }

  return {
    form,
    formState,
    onSubmit,
    handlePhoneChange,
    openWhatsApp,
    openEmail,
    openPhone,
  }
}
