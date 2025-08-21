"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Receipt, TrendingUp, TrendingDown } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

import { LancamentoAgrupado, LancamentoFinanceiro } from "../types"
import { LancamentosTable } from "./lancamentos-table"

interface AgrupamentoViewProps {
  grupos: LancamentoAgrupado[]
  tipoAgrupamento: "processo" | "beneficiario"
  loading: boolean
  onEditar: (lancamento: LancamentoFinanceiro) => void
  onRemover: (id: string) => void
  onRenegociar: (lancamento: LancamentoFinanceiro) => void
  onAnexar: (lancamentoId: string) => void
}

export function AgrupamentoView({
  grupos,
  tipoAgrupamento,
  loading,
  onEditar,
  onRemover,
  onRenegociar,
  onAnexar
}: AgrupamentoViewProps) {
  const [gruposExpandidos, setGruposExpandidos] = useState<Set<string>>(new Set())

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const toggleGrupo = (chave: string) => {
    const novosGrupos = new Set(gruposExpandidos)
    if (novosGrupos.has(chave)) {
      novosGrupos.delete(chave)
    } else {
      novosGrupos.add(chave)
    }
    setGruposExpandidos(novosGrupos)
  }

  const expandirTodos = () => {
    setGruposExpandidos(new Set(grupos.map(g => g.chave)))
  }

  const recolherTodos = () => {
    setGruposExpandidos(new Set())
  }

  // Separar pendentes e histórico para cada grupo
  const separarLancamentos = (lancamentos: LancamentoFinanceiro[]) => {
    const pendentes = lancamentos.filter(l => l.status === "pendente")
    const historico = lancamentos.filter(l => l.status === "historico")
    return { pendentes, historico }
  }

  // Calcular totais gerais
  const totaisGerais = grupos.reduce(
    (acc, grupo) => ({
      receitas: acc.receitas + grupo.totalReceitas,
      despesas: acc.despesas + grupo.totalDespesas,
      saldo: acc.saldo + grupo.saldo
    }),
    { receitas: 0, despesas: 0, saldo: 0 }
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-2">Carregando agrupamentos...</p>
        </div>
      </div>
    )
  }

  if (grupos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Nenhum lançamento encontrado para agrupar por {tipoAgrupamento}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Resumo Geral */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Resumo por {tipoAgrupamento === "processo" ? "Processo" : "Beneficiário"}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={expandirTodos}
                disabled={gruposExpandidos.size === grupos.length}
              >
                Expandir Todos
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={recolherTodos}
                disabled={gruposExpandidos.size === 0}
              >
                Recolher Todos
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatarMoeda(totaisGerais.receitas)}
              </div>
              <div className="text-sm text-muted-foreground">Total Receitas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatarMoeda(totaisGerais.despesas)}
              </div>
              <div className="text-sm text-muted-foreground">Total Despesas</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                totaisGerais.saldo >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatarMoeda(totaisGerais.saldo)}
              </div>
              <div className="text-sm text-muted-foreground">Saldo Geral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {grupos.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {tipoAgrupamento === "processo" ? "Processos" : "Beneficiários"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grupos */}
      <div className="space-y-4">
        {grupos.map((grupo) => {
          const { pendentes, historico } = separarLancamentos(grupo.lancamentos)
          const expandido = gruposExpandidos.has(grupo.chave)

          return (
            <Card key={grupo.chave}>
              <CardHeader className="pb-3">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleGrupo(grupo.chave)}
                >
                  <div className="flex items-center gap-3">
                    {expandido ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <CardTitle className="text-base font-medium">
                        {grupo.chave}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {grupo.lancamentos.length} lançamento{grupo.lancamentos.length > 1 ? 's' : ''}
                        </Badge>
                        {pendentes.length > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {pendentes.length} pendente{pendentes.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                        {historico.length > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {historico.length} pago{historico.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-medium">{formatarMoeda(grupo.totalReceitas)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Receitas</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-orange-600">
                        <TrendingDown className="h-4 w-4" />
                        <span className="font-medium">{formatarMoeda(grupo.totalDespesas)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Despesas</div>
                    </div>

                    <div className="text-center">
                      <div className={`font-medium ${
                        grupo.saldo >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatarMoeda(grupo.saldo)}
                      </div>
                      <div className="text-xs text-muted-foreground">Saldo</div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {expandido && (
                <CardContent>
                  {/* Separação por Status dentro do grupo */}
                  {pendentes.length > 0 && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-medium">Lançamentos Pendentes</h4>
                        <Badge variant="destructive" className="text-xs">
                          {pendentes.length}
                        </Badge>
                      </div>
                      <LancamentosTable
                        lancamentos={pendentes}
                        loading={false}
                        onEditar={onEditar}
                        onRemover={onRemover}
                        onRenegociar={onRenegociar}
                        onAnexar={onAnexar}
                      />
                    </div>
                  )}

                  {pendentes.length > 0 && historico.length > 0 && (
                    <Separator className="my-4" />
                  )}

                  {historico.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-medium">Histórico (Pagos)</h4>
                        <Badge variant="secondary" className="text-xs">
                          {historico.length}
                        </Badge>
                      </div>
                      <LancamentosTable
                        lancamentos={historico}
                        loading={false}
                        onEditar={onEditar}
                        onRemover={onRemover}
                        onRenegociar={onRenegociar}
                        onAnexar={onAnexar}
                      />
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
