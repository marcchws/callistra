import { Lancamento, StatusLancamento, TipoLancamento, ResumoFinanceiro, LancamentoAgrupado } from "./types"

// Formatar valor em Real brasileiro
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(value)
}

// Formatar data
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-"
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("pt-BR").format(d)
}

// Verificar se uma conta está atrasada
export function isAtrasada(lancamento: Lancamento): boolean {
  if (lancamento.status !== StatusLancamento.PENDENTE) return false
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const vencimento = new Date(lancamento.dataVencimento)
  vencimento.setHours(0, 0, 0, 0)
  return vencimento < hoje
}

// Calcular dias de atraso
export function getDiasAtraso(lancamento: Lancamento): number {
  if (!isAtrasada(lancamento)) return 0
  const hoje = new Date()
  const vencimento = new Date(lancamento.dataVencimento)
  const diffTime = Math.abs(hoje.getTime() - vencimento.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Calcular resumo financeiro
export function calcularResumo(lancamentos: Lancamento[]): ResumoFinanceiro {
  const receitas = lancamentos.filter(l => l.tipo === TipoLancamento.RECEITA)
  const despesas = lancamentos.filter(l => l.tipo === TipoLancamento.DESPESA)

  const totalReceitas = receitas.reduce((acc, l) => acc + l.valor, 0)
  const totalDespesas = despesas.reduce((acc, l) => acc + l.valor, 0)

  const receitasPendentes = receitas
    .filter(l => l.status === StatusLancamento.PENDENTE)
    .reduce((acc, l) => acc + l.valor, 0)

  const despesasPendentes = despesas
    .filter(l => l.status === StatusLancamento.PENDENTE)
    .reduce((acc, l) => acc + l.valor, 0)

  const receitasRecebidas = receitas
    .filter(l => l.status === StatusLancamento.RECEBIDO)
    .reduce((acc, l) => acc + l.valor, 0)

  const despesasPagas = despesas
    .filter(l => l.status === StatusLancamento.PAGO)
    .reduce((acc, l) => acc + l.valor, 0)

  const saldo = receitasRecebidas - despesasPagas

  return {
    totalReceitas,
    totalDespesas,
    receitasPendentes,
    despesasPendentes,
    receitasRecebidas,
    despesasPagas,
    saldo
  }
}

// Agrupar lançamentos
export function agruparLancamentos(
  lancamentos: Lancamento[], 
  agrupamento: "processo" | "beneficiario" | null
): LancamentoAgrupado[] {
  if (!agrupamento) {
    return [{
      titulo: "Todos os Lançamentos",
      lancamentos,
      total: lancamentos.reduce((acc, l) => acc + l.valor, 0),
      totalPendente: lancamentos
        .filter(l => l.status === StatusLancamento.PENDENTE)
        .reduce((acc, l) => acc + l.valor, 0),
      totalPago: lancamentos
        .filter(l => l.status !== StatusLancamento.PENDENTE)
        .reduce((acc, l) => acc + l.valor, 0)
    }]
  }

  const grupos = new Map<string, Lancamento[]>()

  lancamentos.forEach(lancamento => {
    const chave = agrupamento === "processo" 
      ? lancamento.processo || "Sem processo"
      : lancamento.beneficiario || "Sem beneficiário"
    
    if (!grupos.has(chave)) {
      grupos.set(chave, [])
    }
    grupos.get(chave)!.push(lancamento)
  })

  return Array.from(grupos.entries()).map(([titulo, items]) => ({
    titulo,
    lancamentos: items,
    total: items.reduce((acc, l) => acc + l.valor, 0),
    totalPendente: items
      .filter(l => l.status === StatusLancamento.PENDENTE)
      .reduce((acc, l) => acc + l.valor, 0),
    totalPago: items
      .filter(l => l.status !== StatusLancamento.PENDENTE)
      .reduce((acc, l) => acc + l.valor, 0)
  }))
}

// Gerar ID único (mock)
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Formatar tamanho de arquivo
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i]
}

// Obter extensão do arquivo
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toUpperCase() || "FILE"
}

// Validar tipo de arquivo para anexo
export function isValidFileType(file: File): boolean {
  const validTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
  return validTypes.includes(file.type)
}

// Calcular valor com juros
export function calcularValorComJuros(valorOriginal: number, percentualJuros: number): number {
  return valorOriginal * (1 + percentualJuros / 100)
}