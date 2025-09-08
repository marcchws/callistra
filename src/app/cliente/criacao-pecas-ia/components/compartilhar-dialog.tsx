"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Share2, 
  Users,
  AlertCircle,
  Download,
  FileText,
  UserCheck
} from "lucide-react"
import { PecaJuridica, TIPOS_PECAS_INFO } from "../types"
import { toast } from "sonner"

interface CompartilharDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  peca: PecaJuridica | null
  onCompartilhar: (pecaId: string, usuarioId: string) => Promise<void>
}

// Mock de usuários disponíveis para compartilhamento
const USUARIOS_DISPONIVEIS = [
  { id: "user2", nome: "Dra. Maria Santos", email: "maria@escritorio.com" },
  { id: "user3", nome: "Dr. Carlos Oliveira", email: "carlos@escritorio.com" },
  { id: "user4", nome: "Dra. Ana Costa", email: "ana@escritorio.com" },
  { id: "user5", nome: "Dr. Pedro Silva", email: "pedro@escritorio.com" },
]

export function CompartilharDialog({ 
  open, 
  onOpenChange,
  peca,
  onCompartilhar
}: CompartilharDialogProps) {
  const [usuarioSelecionado, setUsuarioSelecionado] = useState("")
  const [permissoes, setPermissoes] = useState({
    podeExportar: true,
    podeIntegrarCliente: true
  })
  const [compartilhando, setCompartilhando] = useState(false)

  if (!peca) return null

  const handleCompartilhar = async () => {
    if (!usuarioSelecionado) {
      toast.error("Selecione um usuário para compartilhar")
      return
    }
    
    setCompartilhando(true)
    await onCompartilhar(peca.id, usuarioSelecionado)
    setCompartilhando(false)
    
    onOpenChange(false)
    setUsuarioSelecionado("")
    setPermissoes({
      podeExportar: true,
      podeIntegrarCliente: true
    })
  }

  // Filtrar usuários que já têm acesso
  const usuariosParaCompartilhar = USUARIOS_DISPONIVEIS.filter(
    u => !peca.compartilhamentos.some(c => c.usuarioDestinoId === u.id)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            Compartilhar Peça
          </DialogTitle>
          <DialogDescription>
            Compartilhe esta peça com outros usuários do escritório
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Informações da peça */}
          <div className="p-3 bg-gray-50 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <p className="font-medium text-sm">{peca.titulo}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {peca.tipoPeca && TIPOS_PECAS_INFO[peca.tipoPeca].label}
              </Badge>
              <span>•</span>
              <span>Criada em {peca.dataCriacao.toLocaleDateString("pt-BR")}</span>
            </div>
          </div>

          {/* Usuários já compartilhados */}
          {peca.compartilhamentos.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">Já compartilhado com:</Label>
              <ScrollArea className="h-24">
                <div className="space-y-1">
                  {peca.compartilhamentos.map((compartilhamento) => (
                    <div 
                      key={compartilhamento.id}
                      className="flex items-center justify-between p-2 bg-blue-50 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-3 w-3 text-blue-600" />
                        <span className="text-sm">{compartilhamento.usuarioDestinoNome}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {compartilhamento.dataCompartilhamento.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Seleção de usuário */}
          <div className="space-y-2">
            <Label htmlFor="usuario">Compartilhar com *</Label>
            <Select value={usuarioSelecionado} onValueChange={setUsuarioSelecionado}>
              <SelectTrigger id="usuario">
                <SelectValue placeholder="Selecione um usuário..." />
              </SelectTrigger>
              <SelectContent>
                {usuariosParaCompartilhar.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    Já compartilhado com todos os usuários
                  </div>
                ) : (
                  usuariosParaCompartilhar.map((usuario) => (
                    <SelectItem key={usuario.id} value={usuario.id}>
                      <div className="flex flex-col">
                        <span>{usuario.nome}</span>
                        <span className="text-xs text-muted-foreground">
                          {usuario.email}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Permissões */}
          <div className="space-y-3">
            <Label className="text-sm">Permissões</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="exportar"
                  checked={permissoes.podeExportar}
                  onCheckedChange={(checked) => 
                    setPermissoes(prev => ({ ...prev, podeExportar: checked as boolean }))
                  }
                />
                <Label
                  htmlFor="exportar"
                  className="text-sm font-normal cursor-pointer flex items-center gap-2"
                >
                  <Download className="h-3 w-3" />
                  Pode exportar documento
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="integrar"
                  checked={permissoes.podeIntegrarCliente}
                  onCheckedChange={(checked) => 
                    setPermissoes(prev => ({ ...prev, podeIntegrarCliente: checked as boolean }))
                  }
                />
                <Label
                  htmlFor="integrar"
                  className="text-sm font-normal cursor-pointer flex items-center gap-2"
                >
                  <Users className="h-3 w-3" />
                  Pode integrar com dados de clientes
                </Label>
              </div>
            </div>
          </div>

          {/* Aviso */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              O usuário selecionado poderá visualizar a peça mas não poderá editar o 
              conteúdo ou o chat original. Apenas o criador pode excluir a peça.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={compartilhando}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCompartilhar}
            disabled={!usuarioSelecionado || compartilhando || usuariosParaCompartilhar.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Compartilhar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}