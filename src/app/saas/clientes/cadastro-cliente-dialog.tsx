"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { ClienteFormSchema, ClienteFormData } from "./types"
import { useClientes } from "./use-clientes"

interface CadastroClienteDialogProps {
  open: boolean
  onClose: () => void
}

export function CadastroClienteDialog({ open, onClose }: CadastroClienteDialogProps) {
  const { criarCliente, loading } = useClientes()
  const [step, setStep] = useState(1)

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(ClienteFormSchema),
    defaultValues: {
      nomeEscritorio: "",
      nomeContratante: "",
      emailContratante: "",
      cnpj: "",
      telefone: "",
      nomePlano: "",
      vigenciaPlano: "",
      valorPlano: 0,
      formaPagamento: "",
      descricaoPlano: "",
      status: "ativa"
    }
  })

  const onSubmit = async (data: ClienteFormData) => {
    const result = await criarCliente(data)
    if (result.success) {
      form.reset()
      setStep(1)
      onClose()
    }
  }

  const handleClose = () => {
    form.reset()
    setStep(1)
    onClose()
  }

  const nextStep = () => {
    // Validar campos do step atual antes de avançar
    const fieldsStep1 = ['nomeEscritorio', 'nomeContratante', 'emailContratante', 'cnpj', 'telefone'] as const
    const fieldsStep2 = ['nomePlano', 'vigenciaPlano', 'valorPlano', 'formaPagamento', 'descricaoPlano'] as const
    
    if (step === 1) {
      form.trigger(fieldsStep1).then(isValid => {
        if (isValid) setStep(2)
      })
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  // Função para formatar CNPJ
  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }

  // Função para formatar telefone
  const formatTelefone = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length === 13) {
      return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 9)}-${cleaned.slice(9)}`
    }
    return value
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
          <DialogDescription>
            Preencha as informações do escritório cliente. Step {step} de 2.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nomeEscritorio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nome do Escritório <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Silva & Associados Advocacia" 
                          {...field}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nomeContratante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Nome do Contratante <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nome completo" 
                            {...field}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emailContratante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          E-mail do Contratante <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="email@escritorio.com.br" 
                            {...field}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          CNPJ <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="XX.XXX.XXX/XXXX-XX"
                            value={field.value}
                            onChange={(e) => {
                              const formatted = formatCNPJ(e.target.value)
                              field.onChange(formatted)
                            }}
                            maxLength={18}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Telefone <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+XX XX XXXXX-XXXX"
                            value={field.value}
                            onChange={(e) => {
                              const formatted = formatTelefone(e.target.value)
                              field.onChange(formatted)
                            }}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormDescription>
                          Formato: DDI + DDD + Número
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nomePlano"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Plano <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um plano" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Free">Free</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                            <SelectItem value="Premium">Premium</SelectItem>
                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vigenciaPlano"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Vigência do Plano <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date"
                            {...field}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="valorPlano"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Valor do Plano (R$) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={field.value || ""}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="formaPagamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Forma de Pagamento <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Mensal, cartão de crédito">Mensal, cartão de crédito</SelectItem>
                            <SelectItem value="Mensal, à vista">Mensal, à vista</SelectItem>
                            <SelectItem value="Anual, à vista">Anual, à vista</SelectItem>
                            <SelectItem value="Anual, 12x no cartão">Anual, 12x no cartão</SelectItem>
                            <SelectItem value="Gratuito">Gratuito</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="descricaoPlano"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Descrição do Plano <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Plano Standard mensal para até 10 usuários com todas as funcionalidades básicas"
                          className="resize-none focus:ring-blue-500"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Descreva o que foi adquirido no plano
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status Inicial</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ativa">Ativa</SelectItem>
                          <SelectItem value="inativa">Inativa</SelectItem>
                          <SelectItem value="inadimplente">Inadimplente</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter className="gap-2">
              {step === 1 ? (
                <>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Próximo
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Voltar
                  </Button>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? "Cadastrando..." : "Cadastrar Cliente"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
