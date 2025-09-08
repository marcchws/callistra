import { CategoriaInfo } from "./types"

// Categorias de Receitas e Despesas conforme especificação
export const categoriasReceitas: CategoriaInfo[] = [
  {
    nome: "Honorários Advocatícios",
    subcategorias: [
      "Consultoria Jurídica",
      "Contencioso Cível",
      "Contencioso Trabalhista",
      "Contencioso Tributário",
      "Contencioso Criminal",
      "Contratos",
      "Due Diligence",
      "Mediação e Arbitragem",
      "Outros Honorários"
    ]
  },
  {
    nome: "Honorários de Êxito",
    subcategorias: [
      "Cível",
      "Trabalhista",
      "Tributário",
      "Criminal",
      "Administrativo",
      "Outros Êxitos"
    ]
  },
  {
    nome: "Custas Processuais Reembolsadas",
    subcategorias: [
      "Custas Judiciais",
      "Emolumentos",
      "Perícias",
      "Traduções",
      "Outros Reembolsos"
    ]
  },
  {
    nome: "Receitas Financeiras",
    subcategorias: [
      "Rendimentos de Aplicações",
      "Juros Recebidos",
      "Multas Contratuais Recebidas",
      "Outras Receitas Financeiras"
    ]
  },
  {
    nome: "Outras Receitas",
    subcategorias: [
      "Palestras e Cursos",
      "Pareceres",
      "Publicações",
      "Parcerias",
      "Receitas Diversas"
    ]
  }
]

export const categoriasDespesas: CategoriaInfo[] = [
  {
    nome: "Pessoal",
    subcategorias: [
      "Salários e Ordenados",
      "13º Salário",
      "Férias",
      "INSS",
      "FGTS",
      "Vale Transporte",
      "Vale Refeição",
      "Plano de Saúde",
      "Seguro de Vida",
      "Treinamentos",
      "Outras Despesas com Pessoal"
    ]
  },
  {
    nome: "Infraestrutura",
    subcategorias: [
      "Aluguel",
      "Condomínio",
      "IPTU",
      "Energia Elétrica",
      "Água e Esgoto",
      "Internet",
      "Telefonia",
      "Manutenção Predial",
      "Segurança",
      "Limpeza",
      "Outras Despesas de Infraestrutura"
    ]
  },
  {
    nome: "Tecnologia",
    subcategorias: [
      "Software e Licenças",
      "Hardware",
      "Manutenção de TI",
      "Cloud e Servidores",
      "Desenvolvimento de Sistemas",
      "Outras Despesas de TI"
    ]
  },
  {
    nome: "Administrativas",
    subcategorias: [
      "Material de Escritório",
      "Material de Limpeza",
      "Correios e Entregas",
      "Cartório",
      "Despesas Bancárias",
      "Seguros",
      "Contabilidade",
      "Consultoria",
      "Marketing e Publicidade",
      "Outras Despesas Administrativas"
    ]
  },
  {
    nome: "Custas Processuais",
    subcategorias: [
      "Custas Judiciais",
      "Emolumentos",
      "Perícias",
      "Traduções",
      "Diligências",
      "Outras Custas"
    ]
  },
  {
    nome: "Impostos e Taxas",
    subcategorias: [
      "ISS",
      "PIS",
      "COFINS",
      "IRPJ",
      "CSLL",
      "Taxas Municipais",
      "Taxas Estaduais",
      "Taxas Federais",
      "Outros Impostos e Taxas"
    ]
  },
  {
    nome: "Despesas Financeiras",
    subcategorias: [
      "Juros",
      "Multas",
      "IOF",
      "Tarifas Bancárias",
      "Outras Despesas Financeiras"
    ]
  },
  {
    nome: "Viagens e Deslocamentos",
    subcategorias: [
      "Passagens Aéreas",
      "Hospedagem",
      "Alimentação",
      "Transporte Local",
      "Combustível",
      "Estacionamento",
      "Pedágios",
      "Outras Despesas de Viagem"
    ]
  },
  {
    nome: "Outras Despesas",
    subcategorias: [
      "Eventos e Confraternizações",
      "Doações",
      "Despesas Diversas"
    ]
  }
]

// Função auxiliar para obter subcategorias
export function getSubcategorias(tipo: "RECEITA" | "DESPESA", categoria: string): string[] {
  const categorias = tipo === "RECEITA" ? categoriasReceitas : categoriasDespesas
  const cat = categorias.find(c => c.nome === categoria)
  return cat?.subcategorias || []
}