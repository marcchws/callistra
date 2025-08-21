import { Processo, TRIBUNAIS_OPTIONS } from "./types"

// Utilitários específicos para gestão de processos

// Formatar número do processo CNJ
export function formatarNumeroProcesso(numero: string): string {
  // Remove caracteres não numéricos
  const apenasNumeros = numero.replace(/\D/g, '')
  
  // Formato CNJ: NNNNNNN-DD.AAAA.J.TR.OOOO
  if (apenasNumeros.length === 20) {
    return `${apenasNumeros.slice(0, 7)}-${apenasNumeros.slice(7, 9)}.${apenasNumeros.slice(9, 13)}.${apenasNumeros.slice(13, 14)}.${apenasNumeros.slice(14, 16)}.${apenasNumeros.slice(16, 20)}`
  }
  
  return numero
}

// Validar número do processo CNJ
export function validarNumeroProcesso(numero: string): boolean {
  const regex = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/
  return regex.test(numero)
}

// Gerar link automático do tribunal baseado na seleção
export function gerarLinkTribunal(tribunal: string, numeroProcesso?: string): string {
  const tribunalInfo = TRIBUNAIS_OPTIONS.find(t => t.value === tribunal)
  
  if (!tribunalInfo || !numeroProcesso) {
    return ""
  }

  // URLs base dos principais tribunais
  const urlsBase: Record<string, string> = {
    'tjsp': 'https://esaj.tjsp.jus.br/cpopg/show.do?processo.numero=',
    'tjrj': 'https://www3.tjrj.jus.br/ejud/ConsultaProcesso.aspx?N=',
    'tjmg': 'https://pje.tjmg.jus.br/pje/ConsultaPublica/DetalheProcessoConsultaPublica/listView.seam?ca=',
    'trf3': 'https://web.trf3.jus.br/consultas/Internet/ConsultaProcessual/Processo.php?trf3_captcha_id=',
    'tst': 'https://pje.tst.jus.br/consulta-processual/detalhe-processo/',
    'stj': 'https://scon.stj.jus.br/SCON/pesquisar.jsp?newsession=yes&tipo_visualizacao=RESUMO&b=ACOR&livre=',
    'stf': 'https://portal.stf.jus.br/processos/detalhe.asp?incidente='
  }

  const urlBase = urlsBase[tribunal]
  return urlBase ? `${urlBase}${numeroProcesso}` : ""
}

// Formatar valor monetário para exibição
export function formatarValor(valor?: number): string {
  if (!valor) return "R$ 0,00"
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

// Formatar data para exibição brasileira
export function formatarData(data?: Date): string {
  if (!data) return ""
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(data))
}

// Formatar data e hora para auditoria
export function formatarDataHora(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(new Date(data))
}

// Obter cor do badge baseado no nível de acesso
export function getCorAcesso(acesso: string): "default" | "destructive" | "secondary" {
  switch (acesso) {
    case 'privado':
      return 'destructive'
    case 'envolvidos':
      return 'secondary'
    default:
      return 'default'
  }
}

// Obter texto do nível de acesso
export function getTextoAcesso(acesso: string): string {
  switch (acesso) {
    case 'publico':
      return 'Público'
    case 'privado':
      return 'Privado'
    case 'envolvidos':
      return 'Restrito aos Envolvidos'
    default:
      return 'Público'
  }
}

// Truncar texto para exibição em tabelas
export function truncarTexto(texto: string, limite: number = 50): string {
  if (texto.length <= limite) return texto
  return `${texto.slice(0, limite)}...`
}

// Extrair iniciais do responsável para avatar
export function extrairIniciais(nome: string): string {
  const palavras = nome.trim().split(' ')
  if (palavras.length >= 2) {
    return `${palavras[0][0]}${palavras[palavras.length - 1][0]}`.toUpperCase()
  }
  return nome.slice(0, 2).toUpperCase()
}

// Validar se o usuário tem acesso ao processo (AC7)
export function temAcessoProcesso(processo: Processo, usuarioAtual: string): boolean {
  if (processo.acesso === 'publico') {
    return true
  }
  
  if (processo.acesso === 'privado') {
    // Apenas o responsável e quem criou tem acesso
    return processo.responsavel === usuarioAtual || processo.criadoPor === usuarioAtual
  }
  
  if (processo.acesso === 'envolvidos') {
    // Responsável, criador e envolvidos têm acesso
    return processo.responsavel === usuarioAtual || 
           processo.criadoPor === usuarioAtual ||
           processo.outrosEnvolvidos.includes(usuarioAtual)
  }
  
  return false
}

// Gerar texto de auditoria para histórico
export function gerarTextoAuditoria(
  acao: 'criacao' | 'edicao' | 'exclusao',
  usuario: string,
  dataHora: Date
): string {
  const data = formatarDataHora(dataHora)
  
  switch (acao) {
    case 'criacao':
      return `Processo criado por ${usuario} em ${data}`
    case 'edicao':
      return `Processo alterado por ${usuario} em ${data}`
    case 'exclusao':
      return `Processo excluído por ${usuario} em ${data}`
    default:
      return `Ação realizada por ${usuario} em ${data}`
  }
}

// Validar campos obrigatórios baseado no PRD
export function validarCamposObrigatorios(processo: Partial<Processo>): string[] {
  const erros: string[] = []
  
  if (!processo.nomeCliente?.trim()) {
    erros.push("Nome do Cliente é obrigatório")
  }
  
  if (!processo.qualificacaoCliente?.trim()) {
    erros.push("Qualificação do cliente é obrigatória")
  }
  
  if (!processo.outrosEnvolvidos?.trim()) {
    erros.push("Outros envolvidos é obrigatório")
  }
  
  if (!processo.qualificacaoEnvolvidos?.trim()) {
    erros.push("Qualificação dos envolvidos é obrigatória")
  }
  
  if (!processo.responsavel?.trim()) {
    erros.push("Responsável é obrigatório")
  }
  
  return erros
}

// Gerar sugestão de pasta baseado no ano e sequencial
export function gerarSugestaPasta(processos: Processo[]): string {
  const anoAtual = new Date().getFullYear()
  const processosDoAno = processos.filter(p => 
    p.pasta?.startsWith(`${anoAtual}/`)
  )
  
  const proximoNumero = processosDoAno.length + 1
  return `${anoAtual}/${proximoNumero.toString().padStart(3, '0')}`
}
