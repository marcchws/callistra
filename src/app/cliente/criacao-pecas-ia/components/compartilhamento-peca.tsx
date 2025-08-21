"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Share2, Users, Loader2, Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import type { Compartilhamento } from "../types"

interface CompartilhamentoPecaProps {
  compartilhamentos: Compartilhamento[]
  onCompartilhar: (usuarioDestino: string) => Promise<void>
  onExcluirPeca?: () => Promise<void>
  loading: boolean
  loadingExclusao?: boolean
  isCreator: boolean
}

export function CompartilhamentoPeca({
  compartilhamentos,
  onCompartilhar,
  onExcluirPeca,
  loading,
  loadingExclusao = false,
  isCreator
}: CompartilhamentoPecaProps) {
  const [novoUsuario, setNovoUsuario] = useState("")
  const [dialogAberto, setDialogAberto] = useState(false)

  const handleCompartilhar = async () => {
    if (!novoUsuario.trim()) {
      toast.error("Digite o nome ou e-mail do usuário", { duration: 3000, position: "bottom-right" })
      return
    }

    await onCompartilhar(novoUsuario.trim())
    setNovoUsuario("")
    setDialogAberto(false)
  }

  const handleExcluir = async () => {
    if (onExcluirPeca) {
      await onExcluirPeca()
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-600" />
            Compartilhamento
          </CardTitle>
          <div className="flex items-center gap-2">
            {isCreator && (
              <>
                <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={loading}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Compartilhar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Compartilhar Peça</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="novo-usuario" className="text-sm font-medium">
                          Usuário destinatário <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="novo-usuario"
                          placeholder="Nome ou e-mail do usuário"
                          value={novoUsuario}
                          onChange={(e) => setNovoUsuario(e.target.value)}
                          className="focus:ring-blue-500"
                          disabled={loading}
                        />
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-blue-800 mb-1">Permissões concedidas:</div>
                        <ul className="text-xs text-blue-600 space-y-1">
                          <li>• Visualizar a peça jurídica</li>
                          <li>• Integrar com dados de cliente próprio</li>
                          <li>• Exportar documento final em DOCX</li>
                          <li>• Não pode editar o chat original</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setDialogAberto(false)}
                        disabled={loading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleCompartilhar}
                        disabled={loading || !novoUsuario.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Compartilhando..." : "Compartilhar"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {onExcluirPeca && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        disabled={loadingExclusao}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir esta peça? Esta ação não pode ser desfeita 
                          e a peça será removida para todos os usuários que têm acesso.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleExcluir}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {loadingExclusao && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {loadingExclusao ? "Excluindo..." : "Confirmar Exclusão"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {compartilhamentos.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Esta peça ainda não foi compartilhada.</p>
            {isCreator && (
              <p className="text-xs mt-1">Use o botão "Compartilhar" para dar acesso a outros usuários.</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">
              Compartilhado com {compartilhamentos.length} {compartilhamentos.length === 1 ? 'usuário' : 'usuários'}:
            </div>
            
            {compartilhamentos.map((compartilhamento) => (
              <div 
                key={compartilhamento.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {compartilhamento.usuario_destinatario}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Compartilhado em {compartilhamento.data_compartilhamento.toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {compartilhamento.pode_integrar_cliente && (
                    <Badge variant="outline" className="text-xs">
                      Pode integrar
                    </Badge>
                  )}
                  {compartilhamento.pode_exportar && (
                    <Badge variant="outline" className="text-xs">
                      Pode exportar
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isCreator && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="text-sm font-medium text-amber-800 mb-1">📋 Acesso Compartilhado</div>
            <div className="text-xs text-amber-700">
              Você tem acesso de visualização a esta peça. Pode integrar com seus clientes e exportar,
              mas não pode editar o conteúdo original ou excluir a peça.
            </div>
          </div>
        )}

        {isCreator && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-sm font-medium text-blue-800 mb-1">👑 Você é o Criador</div>
            <div className="text-xs text-blue-600">
              Como criador, você pode compartilhar a peça com outros usuários e excluí-la quando necessário.
              Apenas você pode realizar essas ações.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
