import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, X, User, UserCheck, Building, CheckCircle, Clock } from "lucide-react"
import { Signature } from "../types"

interface SignatureManagerProps {
  signatures: Signature[]
  onSignaturesChange: (signatures: Signature[]) => void
  disabled?: boolean
  cliente?: string
  responsavel?: string
}

export function SignatureManager({
  signatures,
  onSignaturesChange,
  disabled = false,
  cliente,
  responsavel
}: SignatureManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSignature, setNewSignature] = useState<Partial<Signature>>({
    nome: "",
    tipo: "terceiro",
    ordem: signatures.length + 1
  })

  const handleAddSignature = () => {
    if (!newSignature.nome?.trim()) return

    const signature: Signature = {
      id: `sig_${Date.now()}`,
      nome: newSignature.nome.trim(),
      tipo: newSignature.tipo || "terceiro",
      status: "pendente",
      ordem: newSignature.ordem || signatures.length + 1
    }

    onSignaturesChange([...signatures, signature])
    setNewSignature({
      nome: "",
      tipo: "terceiro",
      ordem: signatures.length + 2
    })
    setShowAddForm(false)
  }

  const handleRemoveSignature = (id: string) => {
    onSignaturesChange(signatures.filter(s => s.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    onSignaturesChange(signatures.map(s => 
      s.id === id ? { ...s, status: s.status === "pendente" ? "assinado" : "pendente" } : s
    ))
  }

  const getStatusBadge = (status: string) => {
    return status === "assinado" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Assinado
      </Badge>
    ) : (
      <Badge variant="secondary">
        <Clock className="h-3 w-3 mr-1" />
        Pendente
      </Badge>
    )
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "cliente":
        return <User className="h-4 w-4" />
      case "advogado":
        return <UserCheck className="h-4 w-4" />
      default:
        return <Building className="h-4 w-4" />
    }
  }

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "cliente":
        return "Cliente"
      case "advogado":
        return "Advogado"
      default:
        return "Terceiro"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Assinaturas <span className="text-red-500">*</span>
        </h3>
        <div className="text-xs text-muted-foreground">
          {signatures.length} signatário(s)
        </div>
      </div>
      
      <Separator />

      {/* Lista de Assinaturas */}
      <div className="space-y-2">
        {signatures.map((signature) => (
          <div key={signature.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{signature.ordem}º</span>
                {getTipoIcon(signature.tipo)}
              </div>
              <div>
                <p className="font-medium">{signature.nome}</p>
                <p className="text-xs text-muted-foreground">{getTipoLabel(signature.tipo)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStatus(signature.id)}
                disabled={disabled}
                className="h-7"
              >
                {signature.status === "pendente" ? "Marcar como Assinado" : "Marcar como Pendente"}
              </Button>
              {getStatusBadge(signature.status)}
              {!disabled && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveSignature(signature.id)}
                  disabled={signatures.length === 1}
                  className="h-7 w-7"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Botão para Adicionar Assinatura */}
      {!disabled && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Adicionar Assinatura
        </Button>
      )}

      {/* Formulário para Adicionar Nova Assinatura */}
      {showAddForm && (
        <Card className="border-2 border-dashed border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm">Nova Assinatura</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={newSignature.nome}
                  onChange={(e) => setNewSignature({ ...newSignature, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select
                  value={newSignature.tipo}
                  onValueChange={(value) => setNewSignature({ ...newSignature, tipo: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cliente">Cliente</SelectItem>
                    <SelectItem value="advogado">Advogado</SelectItem>
                    <SelectItem value="terceiro">Terceiro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleAddSignature}
                disabled={!newSignature.nome?.trim()}
                size="sm"
              >
                Adicionar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                size="sm"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sugestões Automáticas */}
      {!showAddForm && signatures.length === 0 && (
        <div className="text-sm text-muted-foreground">
          <p>Sugestões automáticas:</p>
          <div className="flex gap-2 mt-2">
            {cliente && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const clienteSignature: Signature = {
                    id: `sig_${Date.now()}`,
                    nome: cliente,
                    tipo: "cliente",
                    status: "pendente",
                    ordem: 1
                  }
                  onSignaturesChange([clienteSignature])
                }}
              >
                Adicionar cliente: {cliente}
              </Button>
            )}
            {responsavel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const responsavelSignature: Signature = {
                    id: `sig_${Date.now()}`,
                    nome: responsavel,
                    tipo: "advogado",
                    status: "pendente",
                    ordem: 2
                  }
                  onSignaturesChange([responsavelSignature])
                }}
              >
                Adicionar responsável: {responsavel}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

