"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Phone, Mail, MessageCircle, Loader2, CheckCircle } from "lucide-react"
import { useContactForm } from "../use-contact-form"

// Componente Contact Form - Formulário de Contato
// Atende aos Requisitos: Critérios 6, 7, 8, 9
// Cenários de teste: 1, 2, 5, 6, 7, 10, 11, 15
export function ContactForm() {
  const { form, formState, onSubmit, handlePhoneChange, openWhatsApp, openEmail, openPhone } = useContactForm()

  // Configurações da empresa
  const companyConfig = {
    phone: "11999999999",
    whatsapp: "11999999999",
    email: "contato@callistra.com.br",
  }

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Título da Seção */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Entre em Contato
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha a melhor forma de falar conosco. Nossa equipe está pronta
            para atender você.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário de Contato */}
          <Card>
            <CardHeader>
              <CardTitle>Envie sua mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário e entraremos em contato em até 24 horas úteis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {formState.isSuccess ? (
                // Mensagem de sucesso (Cenário 1)
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Formulário enviado com sucesso!
                    </h3>
                    <p className="text-gray-600">
                      Recebemos sua mensagem e entraremos em contato em breve.
                    </p>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Nome */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome completo <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Seu nome"
                              {...field}
                              disabled={formState.isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email (Cenário 10) */}
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
                              disabled={formState.isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Telefone com máscara (Cenário 11) */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Telefone <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(11) 99999-9999"
                              {...field}
                              onChange={(e) => {
                                handlePhoneChange(e)
                                field.onChange(e.target.value.replace(/\D/g, ""))
                              }}
                              disabled={formState.isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Empresa/Escritório */}
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nome do Escritório <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Seu escritório"
                              {...field}
                              disabled={formState.isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Mensagem */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Mensagem <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Como podemos ajudar?"
                              className="min-h-[100px]"
                              {...field}
                              disabled={formState.isLoading}
                            />
                          </FormControl>
                          <FormDescription>
                            Mínimo de 10 caracteres
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Termos (LGPD) */}
                    <FormField
                      control={form.control}
                      name="acceptTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={formState.isLoading}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Aceito a{" "}
                              <a
                                href="/saas/landing/privacy-policy"
                                target="_blank"
                                className="text-blue-600 hover:underline"
                              >
                                Política de Privacidade
                              </a>{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Botão Submit (Cenário 2 - validação) */}
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={formState.isLoading}
                    >
                      {formState.isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {formState.isLoading ? "Enviando..." : "Enviar mensagem"}
                    </Button>

                    {/* Erro no envio */}
                    {formState.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{formState.error}</p>
                      </div>
                    )}
                  </form>
                </Form>
              )}
            </CardContent>
          </Card>

          {/* Outras formas de contato */}
          <div className="space-y-6">
            {/* Contato Direto */}
            <Card>
              <CardHeader>
                <CardTitle>Fale conosco agora</CardTitle>
                <CardDescription>
                  Escolha o canal de sua preferência para um atendimento imediato.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* WhatsApp (Cenário 5) */}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    openWhatsApp(
                      companyConfig.whatsapp,
                      "Olá! Gostaria de conhecer mais sobre o Callistra."
                    )
                  }
                >
                  <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
                  Conversar via WhatsApp
                </Button>

                {/* Email (Cenário 6) */}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    openEmail(
                      companyConfig.email,
                      "Informações sobre o Callistra",
                      "Olá, gostaria de receber mais informações sobre o sistema Callistra."
                    )
                  }
                >
                  <Mail className="mr-2 h-4 w-4 text-blue-600" />
                  Enviar e-mail
                </Button>

                {/* Telefone (Cenário 7) */}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => openPhone(companyConfig.phone)}
                >
                  <Phone className="mr-2 h-4 w-4 text-blue-600" />
                  Ligar agora
                </Button>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Telefone</p>
                  <p className="text-sm text-gray-600">(11) 9999-9999</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">E-mail</p>
                  <p className="text-sm text-gray-600">contato@callistra.com.br</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Horário de Atendimento
                  </p>
                  <p className="text-sm text-gray-600">
                    Segunda a Sexta: 9h às 18h
                  </p>
                  <p className="text-sm text-gray-600">Sábado: 9h às 13h</p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Rápido */}
            <Card>
              <CardHeader>
                <CardTitle>Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Posso testar antes de contratar?
                  </p>
                  <p className="text-sm text-gray-600">
                    Sim! Oferecemos 7 dias de teste grátis sem compromisso.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Como funciona a migração de dados?
                  </p>
                  <p className="text-sm text-gray-600">
                    Nossa equipe auxilia em todo o processo de migração, garantindo
                    que seus dados sejam transferidos com segurança.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">
                    Há fidelidade no contrato?
                  </p>
                  <p className="text-sm text-gray-600">
                    Não! Você pode cancelar a qualquer momento sem multas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
