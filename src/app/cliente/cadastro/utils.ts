/**
 * Utilitários para o módulo de Cadastro de Clientes
 * Funções auxiliares para formatação, validação e manipulação de dados
 */

/**
 * Formata CPF para exibição (000.000.000-00)
 */
export function formatarCPF(cpf: string): string {
  const apenasNumeros = cpf.replace(/\D/g, '')
  if (apenasNumeros.length !== 11) return cpf
  
  return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formata CNPJ para exibição (00.000.000/0000-00)
 */
export function formatarCNPJ(cnpj: string): string {
  const apenasNumeros = cnpj.replace(/\D/g, '')
  if (apenasNumeros.length !== 14) return cnpj
  
  return apenasNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Formata CEP para exibição (00000-000)
 */
export function formatarCEP(cep: string): string {
  const apenasNumeros = cep.replace(/\D/g, '')
  if (apenasNumeros.length !== 8) return cep
  
  return apenasNumeros.replace(/(\d{5})(\d{3})/, '$1-$2')
}

/**
 * Formata telefone para exibição ((00) 00000-0000)
 */
export function formatarTelefone(telefone: string): string {
  const apenasNumeros = telefone.replace(/\D/g, '')
  
  if (apenasNumeros.length === 10) {
    return apenasNumeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  
  return telefone
}

/**
 * Valida CPF usando algoritmo oficial
 */
export function validarCPF(cpf: string): boolean {
  const apenasNumeros = cpf.replace(/\D/g, '')
  
  if (apenasNumeros.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(apenasNumeros)) return false
  
  // Valida primeiro dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(apenasNumeros[i]) * (10 - i)
  }
  let resto = soma % 11
  let dv1 = resto < 2 ? 0 : 11 - resto
  
  if (parseInt(apenasNumeros[9]) !== dv1) return false
  
  // Valida segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(apenasNumeros[i]) * (11 - i)
  }
  resto = soma % 11
  let dv2 = resto < 2 ? 0 : 11 - resto
  
  return parseInt(apenasNumeros[10]) === dv2
}

/**
 * Valida CNPJ usando algoritmo oficial
 */
export function validarCNPJ(cnpj: string): boolean {
  const apenasNumeros = cnpj.replace(/\D/g, '')
  
  if (apenasNumeros.length !== 14) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(apenasNumeros)) return false
  
  // Valida primeiro dígito verificador
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  let soma = 0
  for (let i = 0; i < 12; i++) {
    soma += parseInt(apenasNumeros[i]) * pesos1[i]
  }
  let resto = soma % 11
  let dv1 = resto < 2 ? 0 : 11 - resto
  
  if (parseInt(apenasNumeros[12]) !== dv1) return false
  
  // Valida segundo dígito verificador
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  soma = 0
  for (let i = 0; i < 13; i++) {
    soma += parseInt(apenasNumeros[i]) * pesos2[i]
  }
  resto = soma % 11
  let dv2 = resto < 2 ? 0 : 11 - resto
  
  return parseInt(apenasNumeros[13]) === dv2
}

/**
 * Valida e-mail usando regex
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Formata valor monetário para exibição (R$ 1.234,56)
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor)
}

/**
 * Formata data para exibição brasileira (dd/mm/aaaa)
 */
export function formatarData(data: Date | string): string {
  const dateObj = typeof data === 'string' ? new Date(data) : data
  return dateObj.toLocaleDateString('pt-BR')
}

/**
 * Formata data e hora para exibição brasileira (dd/mm/aaaa hh:mm)
 */
export function formatarDataHora(data: Date | string): string {
  const dateObj = typeof data === 'string' ? new Date(data) : data
  return dateObj.toLocaleString('pt-BR')
}

/**
 * Gera endereço completo formatado
 */
export function formatarEnderecoCompleto(endereco: {
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}): string {
  const { rua, numero, complemento, bairro, cidade, estado, cep } = endereco
  
  const enderecoCompleto = [
    `${rua}, ${numero}`,
    complemento && complemento.trim() !== '' ? complemento : null,
    bairro,
    `${cidade}/${estado}`,
    `CEP: ${formatarCEP(cep)}`
  ].filter(Boolean).join(' - ')
  
  return enderecoCompleto
}

/**
 * Sanitiza string removendo caracteres especiais, mantendo apenas letras, números e espaços
 */
export function sanitizarString(str: string): string {
  return str.replace(/[^a-zA-Z0-9\sÀ-ÿ]/g, '').trim()
}

/**
 * Remove acentos de uma string para busca
 */
export function removerAcentos(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/**
 * Busca flexível que ignora acentos e case
 */
export function buscarFlexivel(termo: string, texto: string): boolean {
  const termoNormalizado = removerAcentos(termo.toLowerCase())
  const textoNormalizado = removerAcentos(texto.toLowerCase())
  return textoNormalizado.includes(termoNormalizado)
}

/**
 * Gera ID único simples para uso em desenvolvimento
 */
export function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Valida se um arquivo é do tipo permitido para anexos
 */
export function validarTipoArquivo(arquivo: File): boolean {
  const tiposPermitidos = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
  
  return tiposPermitidos.includes(arquivo.type)
}

/**
 * Formata tamanho de arquivo para exibição
 */
export function formatarTamanhoArquivo(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Debounce function para otimizar buscas
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Capitaliza primeira letra de cada palavra
 */
export function capitalizarNome(nome: string): string {
  return nome.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Máscara genérica para aplicar formatação em tempo real
 */
export function aplicarMascara(valor: string, mascara: string): string {
  let valorFormatado = ''
  let valorIndex = 0
  
  for (let i = 0; i < mascara.length && valorIndex < valor.length; i++) {
    if (mascara[i] === '#') {
      valorFormatado += valor[valorIndex]
      valorIndex++
    } else {
      valorFormatado += mascara[i]
    }
  }
  
  return valorFormatado
}

/**
 * Verifica se uma data é válida
 */
export function validarData(data: string): boolean {
  const dateObj = new Date(data)
  return dateObj instanceof Date && !isNaN(dateObj.getTime())
}

/**
 * Calcula idade baseada na data de nascimento
 */
export function calcularIdade(dataNascimento: string): number {
  const nascimento = new Date(dataNascimento)
  const hoje = new Date()
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  
  return idade
}