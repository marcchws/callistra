"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { 
  Cliente, 
  ClienteFormData, 
  TipoCliente, 
  StatusCliente,
  clientePFSchema,
  clientePJSchema,
  formatarCpfCnpj, 
  formatarTelefone, 
  formatarCep 
} from "../types"

interface ClienteFormProps {
  cliente?: Cliente
  onSubmit: (data: ClienteFormData) => Promise<void>
  onCancel: () => void
  onBuscarCep?: (cep: string) => Promise<any>
}

export function ClienteForm({ cliente, onSubmit, onCancel, onBuscarCep }: ClienteFormProps) {
  const [loading, setLoading] = useState(false)
  const [tipo, setTipo] = useState<TipoCliente>(cliente?.tipo || "pessoa_fisica")
  const [showConfidentialAlert, setShowConfidentialAlert] = useState(false)
  const [pendingConfidentialChange, setPendingConfidentialChange] = useState(false)

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(tipo === "pessoa_fisica" ? clientePFSchema : clientePJSchema),
    defaultValues: {
      tipo: tipo,
      nome: cliente?.nome || "",
      cpfCnpj: cliente?.cpfCnpj || "",
      dataNascimento: cliente?.dataNascimento || "",
      responsavel: cliente?.responsavel || "",
      telefone: cliente?.telefone || "",
      email: cliente?.email || "",
      banco: cliente?.banco || "",
      agencia: cliente?.agencia || "",
      contaCorrente: cliente?.contaCorrente || "",
      chavePix: cliente?.chavePix || "",
      cep: cliente?.cep || "",
      rua: cliente?.rua || "",
      numero: cliente?.numero || "",
      complemento: cliente?.complemento || "",
      bairro: cliente?.bairro || "",
      cidade: cliente?.cidade || "",
      estado: cliente?.estado || "",
      confidencial: cliente?.confidencial || false,
      status: cliente?.status || "ativo",
      login: cliente?.login || "",
      senha: ""
    }
  })

  // Atualizar validação quando tipo mudar
  useEffect(() => {
    form.setValue("tipo", tipo)
  }, [tipo, form])

  // Buscar CEP
  const handleBuscarCep = async () => {
    const cep = form.getValues("cep")
    if (!cep || !onBuscarCep) return

    try {
      setLoading(true)
      const dados = await onBuscarCep(cep)
      
      form.setValue("rua", dados.rua)
      form.setValue("bairro", dados.bairro)
      form.setValue("cidade", dados.cidade)
      form.setValue("estado", dados.estado)
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setLoading(false)
    }
  }

  // Verificar mudança de confidencialidade
  const handleConfidentialChange = (checked: boolean) => {
    if (cliente?.confidencial && !checked) {
      setPendingConfidentialChange(true)
      setShowConfidentialAlert(true)
    } else {
      form.setValue("confidencial", checked)
    }
  }

  const confirmConfidentialChange = () => {
    form.setValue("confidencial", false)
    setPendingConfidentialChange(false)
    setShowConfidentialAlert(false)
  }

  const cancelConfidentialChange = () => {
    form.setValue("confidencial", true)
    setPendingConfidentialChange(false)
    setShowConfidentialAlert(false)
  }

  const handleSubmit = async (data: ClienteFormData) => {
    try {
      setLoading(true)
      await onSubmit(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">
            {cliente ? "Editar Cliente" : "Cadastrar Cliente"}
          </CardTitle>
          <CardDescription>
            {cliente 
              ? "Atualize as informações do cliente" 
              : "Preencha os dados para cadastrar um novo cliente"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Tipo de Cliente */}
              {!cliente && (
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tipo de Cliente <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value: TipoCliente) => {
                          field.onChange(value)
                          setTipo(value)
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pessoa_fisica">Pessoa Física</SelectItem>
                          <SelectItem value="pessoa_juridica">Pessoa Jurídica</SelectItem>
                          <SelectItem value="parceiro">Parceiro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Tabs defaultValue="dados" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
                  <TabsTrigger value="endereco">Endereço</TabsTrigger>
                  <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                  <TabsTrigger value="acesso">Acesso</TabsTrigger>
                </TabsList>

                {/* Dados Pessoais */}
                <TabsContent value="dados" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {tipo === "pessoa_juridica" ? "Razão Social" : "Nome Completo"}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={tipo === "pessoa_juridica" ? "Digite a razão social" : "Digite o nome completo"} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cpfCnpj"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {tipo === "pessoa_juridica" ? "CNPJ" : "CPF"}
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder={tipo === "pessoa_juridica" ? "00.000.000/0000-00" : "000.000.000-00"}
                              onChange={(e) => {
                                const formatted = formatarCpfCnpj(e.target.value)
                                field.onChange(e.target.value.replace(/\D/g, ""))
                              }}
                              disabled={!!cliente}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {tipo === "pessoa_fisica" && (
                      <FormField
                        control={form.control}
                        name="dataNascimento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Data de Nascimento <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {tipo === "pessoa_juridica" && (
                      <FormField
                        control={form.control}
                        name="responsavel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Responsável <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Nome do responsável" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

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
                              {...field} 
                              placeholder="(00) 00000-0000"
                              onChange={(e) => {
                                const formatted = formatarTelefone(e.target.value)
                                field.onChange(e.target.value.replace(/\D/g, ""))
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            E-mail <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" {...field} placeholder="email@exemplo.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Endereço */}
                <TabsContent value="endereco" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            CEP <span className="text-red-500">*</span>
                          </FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input 
                                {...field} 
                                placeholder="00000-000"
                                onChange={(e) => {
                                  const formatted = formatarCep(e.target.value)
                                  field.onChange(e.target.value.replace(/\D/g, ""))
                                }}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={handleBuscarCep}
                              disabled={loading}
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rua"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Rua <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome da rua" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Número <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Número" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complemento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complemento</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Apartamento, sala, etc." />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bairro"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Bairro <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome do bairro" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cidade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Cidade <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome da cidade" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Estado <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="UF" maxLength={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Financeiro */}
                <TabsContent value="financeiro" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="banco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banco</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Nome do banco" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agência</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="0000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contaCorrente"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Conta Corrente</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="00000-0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="chavePix"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chave PIX</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Chave PIX" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Acesso e Configurações */}
                <TabsContent value="acesso" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="login"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Login <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="usuario.cliente" />
                          </FormControl>
                          <FormDescription>
                            Login de acesso do cliente ao sistema
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Senha {!cliente && <span className="text-red-500">*</span>}
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              {...field} 
                              placeholder={cliente ? "Deixe em branco para manter a atual" : "Mínimo 6 caracteres"}
                            />
                          </FormControl>
                          <FormDescription>
                            {cliente ? "Deixe em branco para manter a senha atual" : "Senha de acesso do cliente"}
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
                          <FormLabel>
                            Status <span className="text-red-500">*</span>
                          </FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ativo">Ativo</SelectItem>
                              <SelectItem value="inativo">Inativo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confidencial"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Cliente Confidencial</FormLabel>
                            <FormDescription>
                              Marcar como confidencial restringe o acesso
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={handleConfidentialChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            onClick={form.handleSubmit(handleSubmit)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? (cliente ? "Atualizando..." : "Salvando...") : (cliente ? "Atualizar" : "Salvar")}
          </Button>
        </CardFooter>
      </Card>

      {/* Alerta de Confidencialidade */}
      <AlertDialog open={showConfidentialAlert} onOpenChange={setShowConfidentialAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Confidencialidade</AlertDialogTitle>
            <AlertDialogDescription>
              Você está removendo a restrição de confidencialidade deste cliente. 
              Um alerta será enviado aos administradores sobre esta alteração. 
              Deseja continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelConfidentialChange}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmConfidentialChange}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Confirmar e enviar alerta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}