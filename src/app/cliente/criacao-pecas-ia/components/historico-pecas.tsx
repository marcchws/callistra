"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { History, FileText, Search, Bot, Eye, Calendar, User, Zap } from "lucide-react"
import { useState } from "react"
import type { PecaDocumento, TipoFuncionalidade } from "../types"

interface HistoricoPecasProps {
  pecas: PecaDocumento[]
  pecaAtual: PecaDocumento | null
  onSelecionarPeca: (peca: PecaDocumento) => void
  loading: boolean
}

export function HistoricoPecas({
  pecas,
  pecaAtual,
  onSelecionarPeca,
  loading
}: HistoricoPecasProps) {
  const [filtroTipo, setFiltroTipo] = useState<TipoFuncionalidade | "todos">("todos")
  const [ordenacao, setOrdenacao] = useState<"recente" | "antiga">("recente")

  // Filtrar e ordenar peças
  const pecasFiltradas = pecas
    .filter(peca => filtroTipo === "todos" || peca.tipo_funcionalidade === filtroTipo)
    .sort((a, b) => {
      if (ordenacao === "recente") {
        return new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime()
      } else {
        return new Date(a.data_criacao).getTime() - new Date(b.data_criacao).getTime()
      }
    })

  const getTipoLabel = (tipo: TipoFuncionalidade): string => {
    switch (tipo) {
      case "revisao_ortografica": return "Revisão Ortográfica"
      case "pesquisa_jurisprudencia": return "Pesquisa Jurisprudência"
      case "criacao_peca_juridica": return "Peça Jurídica"
      default: return tipo
    }
  }

  const getTipoIcon = (tipo: TipoFuncionalidade) => {
    switch (tipo) {
      case "revisao_ortografica": return <FileText className="h-4 w-4" />
      case "pesquisa_jurisprudencia": return <Search className="h-4 w-4" />
      case "criacao_peca_juridica": return <Bot className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getTipoColor = (tipo: TipoFuncionalidade): string => {
    switch (tipo) {
      case "revisao_ortografica": return "bg-blue-100 text-blue-700 border-blue-200"
      case "pesquisa_jurisprudencia": return "bg-green-100 text-green-700 border-green-200"
      case "criacao_peca_juridica": return "bg-purple-100 text-purple-700 border-purple-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            Histórico de Peças
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p>Carregando histórico...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            Histórico de Peças
          </CardTitle>
          <Badge variant="outline">
            {pecasFiltradas.length} {pecasFiltradas.length === 1 ? 'item' : 'itens'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros */}
        <div className="flex gap-3">
          <Select value={filtroTipo} onValueChange={(value) => setFiltroTipo(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="revisao_ortografica">Revisão Ortográfica</SelectItem>
              <SelectItem value="pesquisa_jurisprudencia">Pesquisa Jurisprudência</SelectItem>
              <SelectItem value="criacao_peca_juridica">Peça Jurídica</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={ordenacao} onValueChange={(value) => setOrdenacao(value as any)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recente">Mais recente</SelectItem>
              <SelectItem value="antiga">Mais antiga</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de peças */}
        {pecasFiltradas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma peça encontrada.</p>
            <p className="text-sm">Crie sua primeira peça usando as opções acima.</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] w-full">
            <div className="space-y-3">
              {pecasFiltradas.map((peca) => (
                <div 
                  key={peca.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    pecaAtual?.id === peca.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => onSelecionarPeca(peca)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      {/* Cabeçalho */}
                      <div className="flex items-center gap-2">
                        <Badge className={getTipoColor(peca.tipo_funcionalidade)}>
                          {getTipoIcon(peca.tipo_funcionalidade)}
                          <span className="ml-1">{getTipoLabel(peca.tipo_funcionalidade)}</span>
                        </Badge>
                        
                        {peca.lista_pecas_juridicas && (
                          <Badge variant="outline" className="text-xs">
                            {peca.lista_pecas_juridicas.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>

                      {/* Preview do conteúdo */}
                      <div className="text-sm text-muted-foreground line-clamp-2">
                        {peca.chat_peca_juridica.length > 0 
                          ? peca.chat_peca_juridica[0].conteudo.substring(0, 150) + "..."
                          : "Nenhum conteúdo disponível"
                        }
                      </div>

                      {/* Metadados */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {peca.data_criacao.toLocaleDateString('pt-BR')}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {peca.usuario_criador}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {peca.tokens_utilizados} tokens
                        </div>
                        
                        {peca.compartilhamento.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {peca.compartilhamento.length} compartilhado(s)
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Indicador de seleção */}
                    <div className="flex items-center gap-2">
                      {pecaAtual?.id === peca.id && (
                        <Badge variant="default" className="bg-blue-600">
                          Selecionada
                        </Badge>
                      )}
                      
                      {peca.dados_cliente_integrado && (
                        <Badge variant="outline" className="text-xs">
                          Cliente integrado
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Cliente integrado (se houver) */}
                  {peca.dados_cliente_integrado && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <div className="text-xs text-muted-foreground">
                        <strong>Cliente:</strong> {peca.dados_cliente_integrado.nome} 
                        ({peca.dados_cliente_integrado.documento})
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {/* Resumo estatístico */}
        {pecas.length > 0 && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-blue-600">
                  {pecas.filter(p => p.tipo_funcionalidade === "revisao_ortografica").length}
                </div>
                <div className="text-xs text-muted-foreground">Revisões</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {pecas.filter(p => p.tipo_funcionalidade === "pesquisa_jurisprudencia").length}
                </div>
                <div className="text-xs text-muted-foreground">Pesquisas</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-600">
                  {pecas.filter(p => p.tipo_funcionalidade === "criacao_peca_juridica").length}
                </div>
                <div className="text-xs text-muted-foreground">Peças</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}