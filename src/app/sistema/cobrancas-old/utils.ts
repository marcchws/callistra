import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { StatusCobrancaAtraso, AcaoCobranca } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatação de valores monetários
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Formatação de datas
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  }).format(date)
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// Status badge classes específicas para cobranças em atraso
export function getStatusBadgeClass(status: StatusCobrancaAtraso): string {
  const baseClass = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
  
  switch (status) {
    case "vencida":
      return cn(baseClass, "bg-red-100 text-red-800")
    case "cobranca_enviada":
      return cn(baseClass, "bg-blue-100 text-blue-800") 
    case "aguardando_pago":
      return cn(baseClass, "bg-yellow-100 text-yellow-800")
    case "pago":
      return cn(baseClass, "bg-green-100 text-green-800")
    case "cancelada":
      return cn(baseClass, "bg-slate-100 text-slate-800")
    case "bloqueada":
      return cn(baseClass, "bg-red-100 text-red-800")
    default:
      return cn(baseClass, "bg-slate-100 text-slate-800")
  }
}

// Labels de status específicos para cobranças em atraso
export function getStatusLabel(status: StatusCobrancaAtraso): string {
  switch (status) {
    case "vencida":
      return "Vencida"
    case "cobranca_enviada":
      return "Cobrança Enviada"
    case "aguardando_pago":
      return "Aguardando Pagamento"
    case "pago":
      return "Pago"
    case "cancelada":
      return "Cancelada"
    case "bloqueada":
      return "Cliente Bloqueado"
    default:
      return "Status Desconhecido"
  }
}

// Labels de ações específicas para cobranças em atraso
export function getAcaoHistoricoLabel(acao: AcaoCobranca): string {
  switch (acao) {
    case "cobranca_identificada":
      return "Cobrança Identificada"
    case "boleto_gerado":
      return "Boleto Gerado"
    case "envio_automatico":
      return "Envio Automático"
    case "alerta_inadimplencia":
      return "Alerta de Inadimplência"
    case "reenvio_manual":
      return "Reenvio Manual"
    case "status_atualizado":
      return "Status Atualizado"
    case "pagamento_confirmado":
      return "Pagamento Confirmado"
    case "cliente_bloqueado":
      return "Cliente Bloqueado"
    case "cliente_liberado":
      return "Cliente Liberado"
    case "integracao_financeira":
      return "Integração Financeira"
    default:
      return "Ação Desconhecida"
  }
}

// Calcular dias de atraso a partir da data de vencimento
export function calcularDiasAtraso(dataVencimento: Date): number {
  const hoje = new Date()
  const vencimento = new Date(dataVencimento)
  
  if (hoje <= vencimento) return 0
  
  const diffTime = hoje.getTime() - vencimento.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

// Verificar se cliente deve ser bloqueado automaticamente (>= 15 dias de atraso)
export function deveBloquearCliente(diasAtraso: number): boolean {
  return diasAtraso >= 15
}

// Calcular valor atualizado com juros e multa (simplificado)
export function calcularValorAtualizado(valorOriginal: number, diasAtraso: number): number {
  if (diasAtraso <= 0) return valorOriginal
  
  // Multa de 2% + Juros de 1% ao mês (simplificado)
  const multa = valorOriginal * 0.02
  const jurosMensal = valorOriginal * 0.01
  const mesesAtraso = Math.ceil(diasAtraso / 30)
  const juros = jurosMensal * mesesAtraso
  
  return valorOriginal + multa + juros
}

// Determinar o tipo de alerta baseado nos dias de atraso
export function determinarTipoAlerta(diasAtraso: number, alertasAnteriores: number): string {
  if (diasAtraso <= 5 && alertasAnteriores === 0) {
    return "primeira_cobranca"
  } else if (diasAtraso <= 10 && alertasAnteriores <= 1) {
    return "segunda_cobranca"
  } else if (diasAtraso >= 10 && diasAtraso < 15) {
    return "pre_bloqueio"
  } else if (diasAtraso >= 15) {
    return "cliente_bloqueado"
  }
  return "primeira_cobranca"
}

// Gerar código de boleto mock específico para cobrança em atraso
export function gerarCodigoBoletoAtraso(cobrancaId: string): string {
  const banco = "23793"
  const agencia = "38286" 
  const conta = cobrancaId.substr(-5).padStart(5, "0")
  const nossoNumero = (Date.now() % 1000000).toString().padStart(6, "0")
  const dv = "7" // Dígito verificador mock
  
  return `${banco}.${agencia}.${conta}.${nossoNumero}.${dv}`
}

// Gerar link de pagamento específico para cobrança em atraso
export function gerarLinkPagamentoAtraso(cobrancaId: string): string {
  return `https://pagamento.callistra.com.br/atraso/${cobrancaId}`
}

// Classificar gravidade do atraso
export function classificarGravidadeAtraso(diasAtraso: number): {
  level: "low" | "medium" | "high" | "critical"
  label: string
  color: string
} {
  if (diasAtraso <= 7) {
    return {
      level: "low",
      label: "Baixo",
      color: "yellow"
    }
  } else if (diasAtraso <= 15) {
    return {
      level: "medium", 
      label: "Médio",
      color: "orange"
    }
  } else if (diasAtraso <= 30) {
    return {
      level: "high",
      label: "Alto", 
      color: "red"
    }
  } else {
    return {
      level: "critical",
      label: "Crítico",
      color: "red"
    }
  }
}

// Calcular próxima ação automática do sistema
export function calcularProximaAcao(diasAtraso: number, ultimoEnvio?: Date): {
  acao: string
  quando: string
  automatica: boolean
} {
  if (diasAtraso >= 15) {
    return {
      acao: "Bloquear cliente automaticamente",
      quando: "Imediato",
      automatica: true
    }
  } else if (diasAtraso >= 10) {
    return {
      acao: "Enviar alerta de pré-bloqueio",
      quando: "Próximo processamento",
      automatica: true
    }
  } else if (diasAtraso >= 5 && !ultimoEnvio) {
    return {
      acao: "Enviar primeira cobrança",
      quando: "Próximo processamento", 
      automatica: true
    }
  } else if (diasAtraso >= 8 && ultimoEnvio) {
    return {
      acao: "Enviar segunda cobrança",
      quando: "Próximo processamento",
      automatica: true
    }
  }
  
  return {
    acao: "Aguardar vencimento adicional",
    quando: "Monitoramento contínuo",
    automatica: true
  }
}

// Validar se cobrança está elegível para ação específica
export function validarAcaoCobranca(
  acao: "emitir_boleto" | "enviar_cobranca" | "bloquear_cliente" | "confirmar_pagamento",
  cobranca: any
): { valida: boolean; motivo?: string } {
  switch (acao) {
    case "emitir_boleto":
      if (cobranca.boletoAtualizado) {
        return { valida: false, motivo: "Boleto já foi emitido" }
      }
      if (cobranca.status === "pago") {
        return { valida: false, motivo: "Cobrança já foi paga" }
      }
      return { valida: true }
      
    case "enviar_cobranca":
      if (cobranca.status === "pago") {
        return { valida: false, motivo: "Cobrança já foi paga" }
      }
      if (!cobranca.boletoAtualizado) {
        return { valida: false, motivo: "Boleto deve ser gerado primeiro" }
      }
      return { valida: true }
      
    case "bloquear_cliente":
      if (cobranca.clienteBloqueado) {
        return { valida: false, motivo: "Cliente já está bloqueado" }
      }
      if (cobranca.diasAtraso < 15) {
        return { valida: false, motivo: "Bloqueio automático só ocorre após 15 dias" }
      }
      return { valida: true }
      
    case "confirmar_pagamento":
      if (cobranca.status === "pago") {
        return { valida: false, motivo: "Pagamento já foi confirmado" }
      }
      return { valida: true }
      
    default:
      return { valida: false, motivo: "Ação não reconhecida" }
  }
}

// Debounce para busca
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Truncar texto
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

// Verificar se é data válida
export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}