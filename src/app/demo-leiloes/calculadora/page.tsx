"use client"

import { useState } from "react"
import { Calculator, Plus, Trash2, DollarSign, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import Link from "next/link"

interface CustoManutencao {
  id: string
  descricao: string
  valor: number
}

interface CalculadoraData {
  nomeVeiculo: string
  valorCompra: number
  comissaoLeiloeiro: number
  custosManutencao: CustoManutencao[]
  precoVenda: number
}

const comissoesComuns = [
  { valor: 2, label: "2% - Baixa" },
  { valor: 5, label: "5% - Padrão" },
  { valor: 7, label: "7% - Alta" },
  { valor: 10, label: "10% - Premium" }
]

export default function CalculadoraInvestimento() {
  const [calculadoras, setCalculadoras] = useState<CalculadoraData[]>([])
  const [calculadoraAtual, setCalculadoraAtual] = useState<CalculadoraData>({
    nomeVeiculo: "",
    valorCompra: 0,
    comissaoLeiloeiro: 5,
    custosManutencao: [],
    precoVenda: 0
  })

  const adicionarCustoManutencao = () => {
    const novoCusto: CustoManutencao = {
      id: Date.now().toString(),
      descricao: "",
      valor: 0
    }
    setCalculadoraAtual(prev => ({
      ...prev,
      custosManutencao: [...prev.custosManutencao, novoCusto]
    }))
  }

  const removerCustoManutencao = (id: string) => {
    setCalculadoraAtual(prev => ({
      ...prev,
      custosManutencao: prev.custosManutencao.filter(custo => custo.id !== id)
    }))
  }

  const atualizarCustoManutencao = (id: string, campo: 'descricao' | 'valor', novoValor: string | number) => {
    setCalculadoraAtual(prev => ({
      ...prev,
      custosManutencao: prev.custosManutencao.map(custo =>
        custo.id === id ? { ...custo, [campo]: novoValor } : custo
      )
    }))
  }

  const calcularComissao = () => {
    return (calculadoraAtual.valorCompra * calculadoraAtual.comissaoLeiloeiro) / 100
  }

  const calcularTotalManutencao = () => {
    return calculadoraAtual.custosManutencao.reduce((total, custo) => total + custo.valor, 0)
  }

  const calcularCustoTotal = () => {
    return calculadoraAtual.valorCompra + calcularComissao() + calcularTotalManutencao()
  }

  const calcularMargemLucro = () => {
    return calculadoraAtual.precoVenda - calcularCustoTotal()
  }

  const calcularPercentualLucro = () => {
    const custoTotal = calcularCustoTotal()
    if (custoTotal === 0) return 0
    return ((calcularMargemLucro() / custoTotal) * 100)
  }

  const salvarCalculadora = () => {
    if (!calculadoraAtual.nomeVeiculo.trim()) {
      toast.error("Digite o nome do veículo")
      return
    }

    const novaCalculadora = { ...calculadoraAtual }
    setCalculadoras(prev => [...prev, novaCalculadora])
    setCalculadoraAtual({
      nomeVeiculo: "",
      valorCompra: 0,
      comissaoLeiloeiro: 5,
      custosManutencao: [],
      precoVenda: 0
    })
    toast.success("Calculadora salva com sucesso!")
  }

  const carregarCalculadora = (calculadora: CalculadoraData) => {
    setCalculadoraAtual({ ...calculadora })
    toast.info("Calculadora carregada")
  }

  const excluirCalculadora = (index: number) => {
    setCalculadoras(prev => prev.filter((_, i) => i !== index))
    toast.success("Calculadora removida")
  }

  const isLucroPositivo = calcularMargemLucro() > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/demo-leiloes">
            <Button className="flex items-center gap-2" variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Leilões
            </Button>
          </Link>
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            <Calculator className="inline h-10 w-10 text-green-600 mr-3" />
            Calculadora de Investimento
          </h1>
          <p className="text-gray-600 text-lg">Calcule a viabilidade do seu investimento em leilões</p>
          <div className="mt-4 p-4 bg-green-100 rounded-lg border-l-4 border-green-500">
            <p className="text-green-800 font-medium">Ferramenta mencionada pelo Vítor - para calcular ROI das compras</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário da Calculadora */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Nova Calculadora
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nome do Veículo */}
                <div>
                  <Label htmlFor="nomeVeiculo">Nome do Veículo</Label>
                  <Input
                    id="nomeVeiculo"
                    placeholder="Ex: Honda Civic 2019"
                    value={calculadoraAtual.nomeVeiculo}
                    onChange={(e) => setCalculadoraAtual(prev => ({ ...prev, nomeVeiculo: e.target.value }))}
                  />
                </div>

                {/* Valor da Compra */}
                <div>
                  <Label htmlFor="valorCompra">Valor da Compra no Leilão (R$)</Label>
                  <Input
                    id="valorCompra"
                    type="number"
                    placeholder="0"
                    value={calculadoraAtual.valorCompra || ""}
                    onChange={(e) => setCalculadoraAtual(prev => ({ 
                      ...prev, 
                      valorCompra: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>

                {/* Comissão do Leiloeiro */}
                <div>
                  <Label htmlFor="comissao">Comissão do Leiloeiro (%)</Label>
                  <div className="flex gap-2">
                    <Select 
                      value={calculadoraAtual.comissaoLeiloeiro.toString()} 
                      onValueChange={(value) => setCalculadoraAtual(prev => ({ 
                        ...prev, 
                        comissaoLeiloeiro: parseFloat(value) 
                      }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {comissoesComuns.map(comissao => (
                          <SelectItem key={comissao.valor} value={comissao.valor.toString()}>
                            {comissao.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      className="w-20"
                      value={calculadoraAtual.comissaoLeiloeiro}
                      onChange={(e) => setCalculadoraAtual(prev => ({ 
                        ...prev, 
                        comissaoLeiloeiro: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Comissão: R$ {calcularComissao().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                {/* Custos de Manutenção */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label>Custos de Manutenção</Label>
                    <Button onClick={adicionarCustoManutencao} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {calculadoraAtual.custosManutencao.map((custo) => (
                      <div key={custo.id} className="flex gap-2 items-end">
                        <div className="flex-1">
                          <Input
                            placeholder="Descrição (ex: Documentação)"
                            value={custo.descricao}
                            onChange={(e) => atualizarCustoManutencao(custo.id, 'descricao', e.target.value)}
                          />
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            placeholder="Valor"
                            value={custo.valor || ""}
                            onChange={(e) => atualizarCustoManutencao(custo.id, 'valor', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <Button 
                          onClick={() => removerCustoManutencao(custo.id)}
                          size="sm" 
                          variant="outline"
                          className="px-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {calculadoraAtual.custosManutencao.length === 0 && (
                      <p className="text-gray-500 text-sm italic">
                        Adicione custos como documentação, reparos, etc.
                      </p>
                    )}
                  </div>
                  
                  {calculadoraAtual.custosManutencao.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      Total manutenção: R$ {calcularTotalManutencao().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  )}
                </div>

                {/* Preço de Venda */}
                <div>
                  <Label htmlFor="precoVenda">Preço de Venda Estimado (R$)</Label>
                  <Input
                    id="precoVenda"
                    type="number"
                    placeholder="0"
                    value={calculadoraAtual.precoVenda || ""}
                    onChange={(e) => setCalculadoraAtual(prev => ({ 
                      ...prev, 
                      precoVenda: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>

                <Button onClick={salvarCalculadora} className="w-full" size="lg">
                  Salvar Calculadora
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Resultado em Tempo Real */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {isLucroPositivo ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  Resultado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor da Compra:</span>
                    <span className="font-medium">
                      R$ {calculadoraAtual.valorCompra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comissão ({calculadoraAtual.comissaoLeiloeiro}%):</span>
                    <span className="font-medium">
                      R$ {calcularComissao().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manutenção:</span>
                    <span className="font-medium">
                      R$ {calcularTotalManutencao().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Custo Total:</span>
                    <span className="font-bold">
                      R$ {calcularCustoTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Preço de Venda:</span>
                    <span className="font-medium">
                      R$ {calculadoraAtual.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-lg">Margem de Lucro:</span>
                      <Badge 
                        className={`text-white text-lg px-3 py-1 ${
                          isLucroPositivo ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        R$ {calcularMargemLucro().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Percentual:</span>
                      <Badge 
                        variant="outline"
                        className={`${
                          isLucroPositivo ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'
                        }`}
                      >
                        {calcularPercentualLucro().toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Calculadoras Salvas */}
        {calculadoras.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Calculadoras Salvas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calculadoras.map((calc, index) => {
                const custoTotal = calc.valorCompra + (calc.valorCompra * calc.comissaoLeiloeiro / 100) + 
                  calc.custosManutencao.reduce((total, custo) => total + custo.valor, 0)
                const lucro = calc.precoVenda - custoTotal
                const isPositivo = lucro > 0

                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{calc.nomeVeiculo}</CardTitle>
                        <Button
                          onClick={() => excluirCalculadora(index)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Compra:</span>
                          <span>R$ {calc.valorCompra.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Custo Total:</span>
                          <span>R$ {custoTotal.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Venda:</span>
                          <span>R$ {calc.precoVenda.toLocaleString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-medium">Lucro:</span>
                        <Badge 
                          className={`text-white ${
                            isPositivo ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          R$ {lucro.toLocaleString('pt-BR')}
                        </Badge>
                      </div>
                      
                      <Button 
                        onClick={() => carregarCalculadora(calc)}
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3"
                      >
                        Carregar
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Dicas */}
        <div className="mt-8 p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
          <h3 className="font-semibold text-yellow-900 mb-2">Dicas de Uso:</h3>
          <ul className="text-yellow-800 space-y-1 text-sm">
            <li>• Comissões variam por leiloeiro e tipo de veículo - verifique no site oficial</li>
            <li>• Inclua todos os custos: documentação, vistoria, transporte, reparos</li>
            <li>• Pesquise preços de mercado antes de estimar o valor de venda</li>
            <li>• Salve suas calculadoras para comparar diferentes oportunidades</li>
            <li>• Margem de lucro positiva = operação viável</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
