"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  FileEdit, 
  Search, 
  FileText, 
  ArrowRight,
  Sparkles
} from "lucide-react"
import { TipoFuncionalidade } from "../types"

interface NovaPecaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectType: (tipo: TipoFuncionalidade) => void
}

export function NovaPecaDialog({ 
  open, 
  onOpenChange,
  onSelectType
}: NovaPecaDialogProps) {
  const [hoveredType, setHoveredType] = useState<TipoFuncionalidade | null>(null)

  const opcoes = [
    {
      tipo: "revisao_ortografica" as TipoFuncionalidade,
      titulo: "Revisão Ortográfica",
      descricao: "Revise e corrija erros ortográficos e gramaticais em documentos jurídicos",
      icone: FileEdit,
      cor: "blue",
      tokensEstimados: "~500 tokens"
    },
    {
      tipo: "pesquisa_jurisprudencia" as TipoFuncionalidade,
      titulo: "Pesquisa de Jurisprudência",
      descricao: "Encontre jurisprudências relevantes e decisões de tribunais sobre temas específicos",
      icone: Search,
      cor: "green",
      tokensEstimados: "~1000 tokens"
    },
    {
      tipo: "criacao_peca" as TipoFuncionalidade,
      titulo: "Criar Peça Jurídica",
      descricao: "Gere petições, contratos e outras peças jurídicas com auxílio de IA",
      icone: FileText,
      cor: "purple",
      tokensEstimados: "~1500 tokens"
    }
  ]

  const handleSelect = (tipo: TipoFuncionalidade) => {
    onSelectType(tipo)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Nova Criação com IA
          </DialogTitle>
          <DialogDescription>
            Escolha o tipo de funcionalidade que deseja utilizar
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {opcoes.map((opcao) => {
            const Icon = opcao.icone
            const isHovered = hoveredType === opcao.tipo
            
            return (
              <Card
                key={opcao.tipo}
                className={`p-4 cursor-pointer transition-all hover:shadow-md hover:border-blue-600 ${
                  isHovered ? 'border-blue-600 bg-blue-50/50' : ''
                }`}
                onClick={() => handleSelect(opcao.tipo)}
                onMouseEnter={() => setHoveredType(opcao.tipo)}
                onMouseLeave={() => setHoveredType(null)}
              >
                <div className="flex items-start gap-4">
                  <div className={`rounded-lg p-3 bg-${opcao.cor}-100`}>
                    <Icon className={`h-6 w-6 text-${opcao.cor}-600`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{opcao.titulo}</h3>
                      <ArrowRight className={`h-4 w-4 transition-transform ${
                        isHovered ? 'translate-x-1' : ''
                      }`} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {opcao.descricao}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uso estimado: {opcao.tokensEstimados}
                    </p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}