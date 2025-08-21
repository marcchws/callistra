'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Upload, X, Eye, EyeOff, FileText, User, Building, Lock, MapPin, CreditCard } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

import { 
  Cliente, 
  ClienteFormData, 
  TipoCliente, 
  StatusCliente, 
  ClienteSchema,
  PessoaFisicaSchema,
  PessoaJuridicaSchema 
} from '../types'

interface ClienteFormProps {
  cliente?: Cliente | null
  loading?: boolean
  onSubmit: (dados: ClienteFormData) => Promise<boolean>
  onCancel: () => void
}

export function ClienteForm({ cliente, loading = false, onSubmit, onCancel }: ClienteFormProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false)
  const [anexos, setAnexos] = useState(cliente?.anexos || [])
  
  const isEdicao = !!cliente
  
  // Determinar schema baseado no tipo de cliente
  const getSchema = (tipoCliente: TipoCliente) => {
    return tipoCliente === TipoCliente.PESSOA_FISICA 
      ? PessoaFisicaSchema 
      : PessoaJuridicaSchema
  }

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(
      isEdicao 
        ? getSchema(cliente.tipoCliente)
        : ClienteSchema
    ),
    defaultValues: {
      tipoCliente: cliente?.tipoCliente || TipoCliente.PESSOA_FISICA,
      nome: cliente?.nome || '',
      cpf: cliente?.cpf || '',
      dataNascimento: cliente?.dataNascimento || '',
      razaoSocial: cliente?.razaoSocial || '',
      cnpj: cliente?.cnpj || '',
      responsavel: cliente?.responsavel || '',
      telefone: cliente?.telefone || '',
      email: cliente?.email || '',
      banco: cliente?.banco || '',
      agencia: cliente?.agencia || '',
      contaCorrente: cliente?.contaCorrente || '',
      chavePix: cliente?.chavePix || '',
      cep: cliente?.cep || '',
      rua: cliente?.rua || '',
      numero: cliente?.numero || '',
      complemento: cliente?.complemento || '',
      bairro: cliente?.bairro || '',
      cidade: cliente?.cidade || '',
      estado: cliente?.estado || '',
      confidencial: cliente?.confidencial || false,
      status: cliente?.status || StatusCliente.ATIVO,
      login: cliente?.login || '',
      senha: '', // Sempre vazio para edição
      confirmarSenha: '',
      anexos: cliente?.anexos || []
    }
  })

  const tipoClienteAtual = form.watch('tipoCliente')

  const handleSubmit = async (dados: ClienteFormData) => {
    const sucesso = await onSubmit({
      ...dados,
      anexos
    })
    
    if (sucesso) {
      form.reset()
      setAnexos([])
    }
  }

  const handleAnexar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const novoAnexo = {
        id: Date.now().toString(),
        nome: file.name,
        tipo: file.type,
        url: URL.createObjectURL(file),
        dataUpload: new Date()
      }
      setAnexos(prev => [...prev, novoAnexo])
    }
  }

  const removerAnexo = (anexoId: string) => {
    setAnexos(prev => prev.filter(a => a.id !== anexoId))
  }

  const formatarCEP = (valor: string) => {
    return valor.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  const formatarCPF = (valor: string) => {
    return valor.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatarCNPJ = (valor: string) => {
    return valor.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  const formatarTelefone = (valor: string) => {
    return valor.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {tipoClienteAtual === TipoCliente.PESSOA_FISICA ? (
              <User className="h-5 w-5 text-blue-600" />
            ) : (
              <Building className="h-5 w-5 text-blue-600" />
            )}
            {isEdicao ? 'Editar Cliente' : 'Cadastrar Cliente'}
          </DialogTitle>
          <DialogDescription>
            {isEdicao 
              ? 'Edite as informações do cliente. Campos com * são obrigatórios.'
              : 'Preencha os dados para cadastrar um novo cliente. Campos com * são obrigatórios.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-6">
              
              {/* Tipo de Cliente */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Tipo de Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="tipoCliente"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex flex-row space-x-8"
                            disabled={isEdicao} // Não permite alterar tipo em edição
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={TipoCliente.PESSOA_FISICA} id="pf" />
                              <Label htmlFor="pf" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Pessoa Física
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value={TipoCliente.PESSOA_JURIDICA} id="pj" />
                              <Label htmlFor="pj" className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                Pessoa Jurídica
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Dados Pessoais/Empresariais */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">
                    {tipoClienteAtual === TipoCliente.PESSOA_FISICA 
                      ? 'Dados Pessoais' 
                      : 'Dados Empresariais'
                    }
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tipoClienteAtual === TipoCliente.PESSOA_FISICA ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>
                              Nome Completo <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Digite o nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              CPF <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="000.000.000-00"
                                value={field.value}
                                onChange={(e) => field.onChange(formatarCPF(e.target.value))}
                                maxLength={14}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
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
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="razaoSocial"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>
                              Razão Social <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Digite a razão social" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
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
                                placeholder="00.000.000/0000-00"
                                value={field.value}
                                onChange={(e) => field.onChange(formatarCNPJ(e.target.value))}
                                maxLength={18}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="responsavel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Responsável <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do responsável" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contato */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                              placeholder="(00) 00000-0000"
                              value={field.value}
                              onChange={(e) => field.onChange(formatarTelefone(e.target.value))}
                              maxLength={15}
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
                            <Input type="email" placeholder="email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            CEP <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="00000-000"
                              value={field.value}
                              onChange={(e) => field.onChange(formatarCEP(e.target.value))}
                              maxLength={9}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rua"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>
                            Rua <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da rua" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="numero"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Número <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="123" {...field} />
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
                            <Input placeholder="Apto, sala..." {...field} />
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
                            <Input placeholder="Bairro" {...field} />
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
                            <Input placeholder="Cidade" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Estado <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="SP" maxLength={2} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Dados Bancários */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Dados Bancários (Opcional)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="banco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Banco</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do banco" {...field} />
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
                            <Input placeholder="0000" {...field} />
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
                            <Input placeholder="00000-0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="chavePix"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chave Pix</FormLabel>
                        <FormControl>
                          <Input placeholder="CPF, e-mail, telefone ou chave aleatória" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Acesso do Cliente */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Acesso do Cliente
                  </CardTitle>
                  <CardDescription>
                    Dados para acesso do cliente ao sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="login"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Login <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="login.cliente" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="senha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {isEdicao ? 'Nova Senha (deixe vazio para manter)' : 'Senha'} 
                            {!isEdicao && <span className="text-red-500"> *</span>}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={mostrarSenha ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                              >
                                {mostrarSenha ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmarSenha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Confirmar Senha 
                            {!isEdicao && <span className="text-red-500"> *</span>}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                type={mostrarConfirmarSenha ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                              >
                                {mostrarConfirmarSenha ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Configurações */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium">Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <FormLabel>Cliente Confidencial</FormLabel>
                      <FormDescription>
                        Marque se este cliente possui informações confidenciais.
                        {isEdicao && ' Alterar esta configuração gerará um alerta automático.'}
                      </FormDescription>
                    </div>
                    <FormField
                      control={form.control}
                      name="confidencial"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Status <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={StatusCliente.ATIVO}>Ativo</SelectItem>
                            <SelectItem value={StatusCliente.INATIVO}>Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Anexos */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documentos
                  </CardTitle>
                  <CardDescription>
                    Anexe documentos do cliente (identidade, comprovante de residência, CNPJ, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="anexo" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
                        <Upload className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-600">Anexar Documento</span>
                      </div>
                    </Label>
                    <Input
                      id="anexo"
                      type="file"
                      className="hidden"
                      onChange={handleAnexar}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                  
                  {anexos.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Documentos anexados:</Label>
                      <div className="space-y-2">
                        {anexos.map((anexo) => (
                          <div key={anexo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">{anexo.nome}</span>
                              <Badge variant="secondary" className="text-xs">
                                {new Date(anexo.dataUpload).toLocaleDateString()}
                              </Badge>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removerAnexo(anexo.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Salvando...' : (isEdicao ? 'Atualizar' : 'Cadastrar')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}