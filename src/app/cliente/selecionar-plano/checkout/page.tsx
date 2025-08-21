"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { 
  Loader2, 
  CreditCard, 
  QrCode, 
  FileText, 
  ArrowLeft, 
  Check, 
  Mail,
  Shield,
  Clock,
  AlertCircle
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

import { 
  TipoPlano, 
  FormaPagamento, 
  StatusPagamento,
  assinaturaSchema,
  dadosEscritorioSchema,
  dadosCartaoSchema,
  type DadosEscritorio,
  type DadosCartao,
  type AssinaturaData,
  PLANOS_DISPONIVEIS
} from "../types"
import { 
  formatCNPJ, 
  formatTelefone, 
  formatCartao, 
  formatCPFCNPJ,
  formatarMoeda,
  getPlanoInfo,
  processarPagamento,
  enviarEmail,
  gerarQRCodePIX,
  gerarBoleto,
  gerarIdAssinatura
} from "../utils"

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planoSelecionado = searchParams.get('plano') as TipoPlano
  
  // Estados do checkout (AC5)
  const [etapaAtual, setEtapaAtual] = useState<'dados' | 'pagamento' | 'processando' | 'sucesso' | 'erro'>('dados')
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>(FormaPagamento.CARTAO)
  const [loading, setLoading] = useState(false)
  const [statusPagamento, setStatusPagamento] = useState<StatusPagamento>(StatusPagamento.EM_ANALISE)
  const [assinaturaId, setAssinaturaId] = useState<string>()
  const [dadosPagamentoPIX, setDadosPagamentoPIX] = useState<any>()
  const [dadosPagamentoBoleto, setDadosPagamentoBoleto] = useState<any>()

  // Form para dados do escritório (AC3, AC11)
  const formDados = useForm<DadosEscritorio>({
    resolver: zodResolver(dadosEscritorioSchema),
    defaultValues: {
      nomeEscritorio: "",
      nomeContratante: "",
      emailContratante: "",
      cnpj: "",
      telefone: "",
      senha: ""
    }
  })

  // Form para dados do cartão (AC4)
  const formCartao = useForm<DadosCartao>({
    resolver: zodResolver(dadosCartaoSchema),
    defaultValues: {
      numeroCartao: "",
      validadeCartao: "",
      cvv: "",
      nomeTitular: "",
      parcelas: 1,
      cpfCnpjTitular: "",
      endereco: ""
    }
  })

  // Informações do plano selecionado
  const planoInfo = getPlanoInfo(planoSelecionado)

  useEffect(() => {
    if (!planoInfo) {
      toast.error("Plano não encontrado", {
        duration: 3000,
        position: "bottom-right"
      })
      router.push('/cliente/selecionar-plano')
    }
  }, [planoInfo, router])

  if (!planoInfo) return null

  // Scenario 3: Cadastro completo → Dados salvos com sucesso
  const handleContinuarDados = async (dados: DadosEscritorio) => {
    try {
      setLoading(true)
      
      // Simular salvamento dos dados
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Scenario 1: Selecionar plano free → Acesso liberado após cadastro
      if (planoSelecionado === TipoPlano.FREE) {
        // AC6: Criar acesso automaticamente
        const novaAssinatura = gerarIdAssinatura()
        setAssinaturaId(novaAssinatura)
        setStatusPagamento(StatusPagamento.APROVADO)
        
        // AC7: Enviar e-mail de confirmação de criação da conta
        await enviarEmail('confirmacao', dados.emailContratante)
        
        toast.success("Conta criada com sucesso!", {
          duration: 3000,
          position: "bottom-right"
        })
        
        setEtapaAtual('sucesso')
        return
      }
      
      // Scenario 2: Selecionar plano pago → Direcionamento para pagamento
      toast.success("Dados salvos com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
      setEtapaAtual('pagamento')
      
    } catch (error) {
      toast.error("Erro ao salvar dados. Tente novamente.", {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  // AC4: Processar diferentes formas de pagamento
  const handleProcessarPagamento = async () => {
    try {
      setLoading(true)
      setEtapaAtual('processando')
      
      const dadosEscritorio = formDados.getValues()
      const novaAssinatura = gerarIdAssinatura()
      setAssinaturaId(novaAssinatura)
      
      // AC8: Enviar e-mail sobre status da compra (em análise)
      await enviarEmail('analise', dadosEscritorio.emailContratante)
      
      if (formaPagamento === FormaPagamento.CARTAO) {
        // Scenario 4: Pagamento cartão → Pagamento aprovado
        // Scenario 5: Cartão inválido → Mensagem de erro
        const dadosCartao = formCartao.getValues()
        
        // Scenario 14: Campos obrigatórios → Mensagem de campo requerido
        const validationResult = formCartao.trigger()
        if (!validationResult) {
          setEtapaAtual('pagamento')
          toast.error("Preencha todos os campos obrigatórios", {
            duration: 3000,
            position: "bottom-right"
          })
          return
        }
        
        const resultado = await processarPagamento(dadosCartao)
        
        if (resultado.success) {
          setStatusPagamento(StatusPagamento.APROVADO)
          // AC8: Enviar e-mail de pagamento aprovado
          await enviarEmail('aprovado', dadosEscritorio.emailContratante)
          // AC7: Enviar e-mail de confirmação de conta
          await enviarEmail('confirmacao', dadosEscritorio.emailContratante)
          
          toast.success(resultado.message, {
            duration: 3000,
            position: "bottom-right"
          })
          setEtapaAtual('sucesso')
        } else {
          setStatusPagamento(StatusPagamento.RECUSADO)
          await enviarEmail('recusado', dadosEscritorio.emailContratante)
          
          toast.error(resultado.message, {
            duration: 4000,
            position: "bottom-right"
          })
          setEtapaAtual('erro')
        }
      } 
      else if (formaPagamento === FormaPagamento.PIX) {
        // Scenario 7: Gerar PIX → QR Code gerado com sucesso
        const dadosPIX = gerarQRCodePIX(planoInfo.preco)
        setDadosPagamentoPIX(dadosPIX)
        setStatusPagamento(StatusPagamento.EM_ANALISE)
        
        toast.success("QR Code PIX gerado com sucesso!", {
          duration: 3000,
          position: "bottom-right"
        })
        setEtapaAtual('sucesso')
      }
      else if (formaPagamento === FormaPagamento.BOLETO) {
        // Scenario 6: Gerar boleto → Boleto gerado com sucesso
        const dadosBoleto = gerarBoleto(planoInfo.preco)
        setDadosPagamentoBoleto(dadosBoleto)
        setStatusPagamento(StatusPagamento.EM_ANALISE)
        
        toast.success("Boleto gerado com sucesso!", {
          duration: 3000,
          position: "bottom-right"
        })
        setEtapaAtual('sucesso')
      }
      
    } catch (error) {
      setEtapaAtual('erro')
      toast.error("Erro ao processar pagamento. Tente novamente.", {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setLoading(false)
    }
  }

  // Scenario 12: Liberar acesso → Acesso liberado automaticamente
  // Scenario 15: Manter logado → Usuário mantido na sessão
  const handleAcessarPlataforma = () => {
    toast.success("Redirecionando para a plataforma...", {
      duration: 2000,
      position: "bottom-right"
    })
    
    // Simular login automático e redirecionamento
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
        </div>
        <p className="text-muted-foreground">
          Finalize sua assinatura do plano {planoInfo.nome}
        </p>
      </div>

      {/* Resumo do plano */}
      <Card className="max-w-2xl mx-auto bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Plano {planoInfo.nome}</h3>
              <p className="text-sm text-blue-700">{planoInfo.descricao}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">
                {planoInfo.preco === 0 ? "Gratuito" : formatarMoeda(planoInfo.preco)}
              </div>
              {planoInfo.preco > 0 && (
                <div className="text-sm text-blue-600">por mês</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Etapa: Dados do escritório */}
      {etapaAtual === 'dados' && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Dados do Escritório</CardTitle>
            <CardDescription>
              Preencha as informações do seu escritório para criar a conta
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <Form {...formDados}>
              <form onSubmit={formDados.handleSubmit(handleContinuarDados)} className="space-y-4">
                
                {/* Nome do Escritório */}
                <FormField
                  control={formDados.control}
                  name="nomeEscritorio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nome do Escritório <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome do escritório"
                          className="focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nome do Contratante */}
                <FormField
                  control={formDados.control}
                  name="nomeContratante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nome do Contratante <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu nome completo"
                          className="focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Pessoa responsável pela conta do escritório
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* E-mail */}
                  <FormField
                    control={formDados.control}
                    name="emailContratante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          E-mail <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="seu@email.com"
                            className="focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* CNPJ */}
                  <FormField
                    control={formDados.control}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Telefone */}
                  <FormField
                    control={formDados.control}
                    name="telefone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Telefone <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+55 (00) 00000-0000"
                            className="focus:ring-blue-500"
                            {...field}
                            onChange={(e) => {
                              const formatted = formatTelefone(e.target.value)
                              field.onChange(formatted)
                            }}
                            maxLength={20}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Senha */}
                  <FormField
                    control={formDados.control}
                    name="senha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Senha <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            className="focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Letras, números e caracteres especiais
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex justify-end">
            <Button 
              onClick={formDados.handleSubmit(handleContinuarDados)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Salvando..." : "Continuar"}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Etapa: Pagamento */}
      {etapaAtual === 'pagamento' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Seleção da forma de pagamento */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold">Forma de Pagamento</CardTitle>
              <CardDescription>
                Escolha como deseja realizar o pagamento
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <RadioGroup 
                value={formaPagamento} 
                onValueChange={(value) => setFormaPagamento(value as FormaPagamento)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value={FormaPagamento.CARTAO} id="cartao" />
                  <Label htmlFor="cartao" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    Cartão de Crédito
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value={FormaPagamento.PIX} id="pix" />
                  <Label htmlFor="pix" className="flex items-center gap-2 cursor-pointer">
                    <QrCode className="h-4 w-4" />
                    PIX
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value={FormaPagamento.BOLETO} id="boleto" />
                  <Label htmlFor="boleto" className="flex items-center gap-2 cursor-pointer">
                    <FileText className="h-4 w-4" />
                    Boleto Bancário
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Formulário de cartão de crédito */}
          {formaPagamento === FormaPagamento.CARTAO && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">Dados do Cartão</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Form {...formCartao}>
                  <form className="space-y-4">
                    
                    {/* Número do Cartão */}
                    <FormField
                      control={formCartao.control}
                      name="numeroCartao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Número do Cartão <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0000 0000 0000 0000"
                              className="focus:ring-blue-500"
                              {...field}
                              onChange={(e) => {
                                const formatted = formatCartao(e.target.value)
                                field.onChange(formatted)
                              }}
                              maxLength={19}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      {/* Validade */}
                      <FormField
                        control={formCartao.control}
                        name="validadeCartao"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Validade <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="MM/AA"
                                className="focus:ring-blue-500"
                                {...field}
                                maxLength={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* CVV */}
                      <FormField
                        control={formCartao.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              CVV <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="000"
                                className="focus:ring-blue-500"
                                {...field}
                                maxLength={4}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Parcelas */}
                      <FormField
                        control={formCartao.control}
                        name="parcelas"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium">
                              Parcelas <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="1x" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                                    {i + 1}x {i === 0 ? "à vista" : `de ${formatarMoeda(planoInfo.preco / (i + 1))}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Nome do Titular */}
                    <FormField
                      control={formCartao.control}
                      name="nomeTitular"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Nome do Titular <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Como está escrito no cartão"
                              className="focus:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* CPF/CNPJ do Titular */}
                    <FormField
                      control={formCartao.control}
                      name="cpfCnpjTitular"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            CPF/CNPJ do Titular <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="000.000.000-00 ou 00.000.000/0000-00"
                              className="focus:ring-blue-500"
                              {...field}
                              onChange={(e) => {
                                const formatted = formatCPFCNPJ(e.target.value)
                                field.onChange(formatted)
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Endereço */}
                    <FormField
                      control={formCartao.control}
                      name="endereco"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Endereço de Cobrança <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Rua, número, bairro, cidade, CEP"
                              className="focus:ring-blue-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Botão de pagamento */}
          <Card>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => setEtapaAtual('dados')}
              >
                Voltar
              </Button>
              <Button 
                onClick={handleProcessarPagamento}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Processando..." : `Pagar ${formatarMoeda(planoInfo.preco)}`}
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Etapa: Processando */}
      {etapaAtual === 'processando' && (
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-6 pb-6">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Processando Pagamento</h3>
                <p className="text-muted-foreground">
                  Aguarde enquanto processamos seu pagamento...
                </p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                <Clock className="h-3 w-3 mr-1" />
                Em Análise
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Etapa: Sucesso */}
      {etapaAtual === 'sucesso' && (
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-green-900">
                  {planoSelecionado === TipoPlano.FREE ? "Conta Criada!" : "Pagamento Processado!"}
                </h3>
                <p className="text-muted-foreground">
                  {statusPagamento === StatusPagamento.APROVADO 
                    ? "Seu pagamento foi aprovado e sua conta está ativa."
                    : "Seu pedido foi recebido e está sendo processado."
                  }
                </p>
              </div>

              {assinaturaId && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Número da assinatura: <span className="font-mono font-medium">{assinaturaId}</span>
                  </p>
                </div>
              )}

              {/* Informações específicas do meio de pagamento */}
              {dadosPagamentoPIX && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Finalize o pagamento via PIX</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Use o QR Code ou a chave PIX abaixo para concluir o pagamento
                    </p>
                    <div className="text-center space-y-2">
                      <div className="inline-block p-4 bg-white border-2 border-blue-300 rounded-lg">
                        <QrCode className="h-16 w-16 text-blue-600" />
                      </div>
                      <p className="text-sm">
                        <strong>Chave PIX:</strong> {dadosPagamentoPIX.chave}
                      </p>
                      <p className="text-sm">
                        <strong>Valor:</strong> {formatarMoeda(dadosPagamentoPIX.valor)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {dadosPagamentoBoleto && (
                <div className="space-y-4">
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-orange-900 mb-2">Boleto Gerado</h4>
                    <p className="text-sm text-orange-700 mb-3">
                      Seu boleto foi gerado. Efetue o pagamento até {dadosPagamentoBoleto.dataVencimento}
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Baixar Boleto
                      </Button>
                      <p className="text-xs text-gray-600 font-mono">
                        {dadosPagamentoBoleto.codigoBarras}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario 10, 11: E-mail confirmação → E-mail enviado com sucesso */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 justify-center text-blue-700">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">E-mail de confirmação enviado</span>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            {statusPagamento === StatusPagamento.APROVADO ? (
              <Button 
                onClick={handleAcessarPlataforma}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Acessar Plataforma
              </Button>
            ) : (
              <Button 
                variant="outline"
                onClick={() => router.push('/cliente/selecionar-plano')}
              >
                Voltar aos Planos
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Etapa: Erro */}
      {etapaAtual === 'erro' && (
        <Card className="max-w-2xl mx-auto text-center">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-red-900">Pagamento Recusado</h3>
                <p className="text-muted-foreground">
                  Houve um problema com seu pagamento. Tente novamente ou use outra forma de pagamento.
                </p>
              </div>

              <Badge variant="destructive">
                Pagamento Recusado
              </Badge>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center gap-3">
            <Button 
              variant="outline"
              onClick={() => setEtapaAtual('pagamento')}
            >
              Tentar Novamente
            </Button>
            <Button 
              onClick={() => router.push('/cliente/selecionar-plano')}
            >
              Voltar aos Planos
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
