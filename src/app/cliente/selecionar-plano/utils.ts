import { TipoPlano, PLANOS_DISPONIVEIS, CalculoUpgrade, PlanoInfo } from "./types"

// Função para formatar CNPJ
export function formatCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  return value
}

// Função para formatar telefone (DDI + DDD + Número)
export function formatTelefone(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 13) {
    if (numbers.length <= 12) {
      // +55 (00) 0000-0000
      return numbers.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1 ($2) $3-$4')
    } else {
      // +55 (00) 00000-0000
      return numbers.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4')
    }
  }
  return value
}

// Função para formatar cartão de crédito
export function formatCartao(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 16) {
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ')
  }
  return value
}

// Função para formatar CPF
export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return value
}

// Função para formatar CPF/CNPJ automaticamente
export function formatCPFCNPJ(value: string): string {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return formatCPF(value)
  } else {
    return formatCNPJ(value)
  }
}

// Função para obter informações do plano
export function getPlanoInfo(tipo: TipoPlano): PlanoInfo | undefined {
  return PLANOS_DISPONIVEIS.find(plano => plano.id === tipo)
}

// Função para calcular upgrade com regra prorata (AC9)
export function calcularUpgrade(
  planoAtual: TipoPlano,
  planoNovo: TipoPlano,
  diasRestantesNoCiclo: number = 15 // Default baseado no exemplo do documento
): CalculoUpgrade {
  const infoPlanoAtual = getPlanoInfo(planoAtual)
  const infoPlanoNovo = getPlanoInfo(planoNovo)
  
  if (!infoPlanoAtual || !infoPlanoNovo) {
    throw new Error("Plano não encontrado")
  }

  const valorAtual = infoPlanoAtual.preco
  const valorNovo = infoPlanoNovo.preco
  
  // Regra conforme especificação:
  // Diferença diária entre os planos
  const diferencaMensal = valorNovo - valorAtual
  const diferencaDiaria = diferencaMensal / 30
  
  // Valor proporcional para os dias restantes
  const valorProporcional = diasRestantesNoCiclo * diferencaDiaria
  
  return {
    planoAtual,
    planoNovo,
    valorAtual,
    valorNovo,
    diasRestantes: diasRestantesNoCiclo,
    valorProporcional: Math.round(valorProporcional * 100) / 100, // Arredondar para 2 decimais
    valorTotal: valorProporcional,
    acessoImediato: true // Conforme AC9: acesso imediato no upgrade
  }
}

// Função para verificar se é upgrade ou downgrade
export function tipoAlteracao(planoAtual: TipoPlano, planoNovo: TipoPlano): 'upgrade' | 'downgrade' | 'mesmo' {
  const infoAtual = getPlanoInfo(planoAtual)
  const infoNovo = getPlanoInfo(planoNovo)
  
  if (!infoAtual || !infoNovo) return 'mesmo'
  
  if (infoNovo.preco > infoAtual.preco) return 'upgrade'
  if (infoNovo.preco < infoAtual.preco) return 'downgrade'
  return 'mesmo'
}

// Função para validar CNPJ (validação básica)
export function validarCNPJ(cnpj: string): boolean {
  const numbers = cnpj.replace(/\D/g, '')
  
  if (numbers.length !== 14) return false
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false
  
  return true
}

// Função para validar CPF (validação básica)
export function validarCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '')
  
  if (numbers.length !== 11) return false
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(numbers)) return false
  
  return true
}

// Função para validar cartão de crédito (validação básica)
export function validarCartao(numero: string): boolean {
  const numbers = numero.replace(/\D/g, '')
  
  if (numbers.length !== 16) return false
  
  // Algoritmo de Luhn simplificado (validação básica)
  let sum = 0
  let isEven = false
  
  for (let i = numbers.length - 1; i >= 0; i--) {
    let digit = parseInt(numbers[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// Função para gerar ID de assinatura
export function gerarIdAssinatura(): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)
  return `ASS_${timestamp}_${random}`.toUpperCase()
}

// Função para formatar moeda brasileira
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

// Função para calcular desconto anual
export function calcularDescontoAnual(precoMensal: number, precoAnual: number): number {
  const precoMensalAnualizado = precoMensal * 12
  const desconto = ((precoMensalAnualizado - precoAnual) / precoMensalAnualizado) * 100
  return Math.round(desconto)
}

// Função para simular processamento de pagamento
export async function processarPagamento(dadosPagamento: any): Promise<{
  success: boolean
  message: string
  transactionId?: string
  error?: string
}> {
  // Simular delay de processamento
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  // Simular diferentes cenários baseados nos dados
  if (dadosPagamento.numeroCartao?.includes('0000')) {
    return {
      success: false,
      message: "Cartão inválido",
      error: "INVALID_CARD"
    }
  }
  
  if (dadosPagamento.cvv === '000') {
    return {
      success: false,
      message: "CVV inválido",
      error: "INVALID_CVV"
    }
  }
  
  // Sucesso
  return {
    success: true,
    message: "Pagamento aprovado com sucesso!",
    transactionId: `TXN_${Date.now()}`
  }
}

// Função para simular envio de e-mail
export async function enviarEmail(tipo: 'confirmacao' | 'analise' | 'aprovado' | 'recusado', email: string): Promise<boolean> {
  // Simular delay de envio
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  console.log(`E-mail de ${tipo} enviado para ${email}`)
  return true
}

// Função para gerar QR Code PIX (simulação)
export function gerarQRCodePIX(valor: number): {
  qrCode: string
  chave: string
  valor: number
} {
  return {
    qrCode: `data:image/svg+xml;base64,${btoa(`<svg>QR Code para R$ ${valor}</svg>`)}`,
    chave: "callistra@pagamentos.com.br",
    valor
  }
}

// Função para gerar boleto (simulação)
export function gerarBoleto(valor: number): {
  url: string
  codigoBarras: string
  dataVencimento: string
} {
  const dataVencimento = new Date()
  dataVencimento.setDate(dataVencimento.getDate() + 3) // 3 dias para vencimento
  
  return {
    url: `/boleto/download/${Date.now()}`,
    codigoBarras: `34191.79001 01043.510047 91020.150008 ${Math.floor(Math.random() * 10)} 91980000${valor.toString().padStart(8, '0')}`,
    dataVencimento: dataVencimento.toLocaleDateString('pt-BR')
  }
}
