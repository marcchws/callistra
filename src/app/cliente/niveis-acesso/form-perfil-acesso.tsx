"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Check, X } from "lucide-react"
import { 
  PerfilAcesso, 
  PerfilAcessoForm, 
  perfilAcessoSchema, 
  telasDisponiveis,
  permissaoLabels 
} from "./types"

interface FormPerfilAcessoProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: PerfilAcessoForm) => Promise<boolean>
  perfil?: PerfilAcesso
  loading?: boolean
}

export function FormPerfilAcesso({
  open,
  onClose,
  onSubmit,
  perfil,
  loading = false
}: FormPerfilAcessoProps) {
  const isEdit = !!perfil

  const form = useForm<PerfilAcessoForm>({
    resolver: zodResolver(perfilAcessoSchema),
    defaultValues: {
      nome: perfil?.nome || "",
      descricao: perfil?.descricao || "",
      status: perfil?.status || "ativo",
      permissoes: perfil?.permissoes || []
    }
  })

  const watchedPermissoes = form.watch("permissoes")

  // Função para selecionar/deselecionar todas as permissões
  const toggleTodasPermissoes = (selecionar: boolean) => {
    const novasPermissoes = telasDisponiveis.map(tela => {
      const permissoesObj: any = {}
      tela.permissoesDisponiveis.forEach(perm => {
        permissoesObj[perm] = selecionar
      })
      
      return {
        telaId: tela.id,
        telaNome: tela.nome,
        modulo: tela.modulo,
        permissoes: permissoesObj
      }
    })
    
    form.setValue("permissoes", novasPermissoes)
  }

  // Função para selecionar todas as permissões de um módulo
  const togglePermissoesModulo = (modulo: string, selecionar: boolean) => {
    const permissoesAtuais = [...watchedPermissoes]
    
    telasDisponiveis.forEach(tela => {
      if (tela.modulo === modulo) {
        const index = permissoesAtuais.findIndex(p => p.telaId === tela.id)
        const permissoesObj: any = {}
        
        tela.permissoesDisponiveis.forEach(perm => {
          permissoesObj[perm] = selecionar
        })

        const novaPermissao = {
          telaId: tela.id,
          telaNome: tela.nome,
          modulo: tela.modulo,
          permissoes: permissoesObj
        }

        if (index >= 0) {
          permissoesAtuais[index] = novaPermissao
        } else {
          permissoesAtuais.push(novaPermissao)
        }
      }
    })
    
    form.setValue("permissoes", permissoesAtuais)
  }

  // Função para alterar permissão específica
  const togglePermissao = (telaId: string, permissao: string, valor: boolean) => {
    const permissoesAtuais = [...watchedPermissoes]
    const index = permissoesAtuais.findIndex(p => p.telaId === telaId)
    const tela = telasDisponiveis.find(t => t.id === telaId)
    
    if (!tela) return

    if (index >= 0) {
      permissoesAtuais[index].permissoes = {
        ...permissoesAtuais[index].permissoes,
        [permissao]: valor
      }
    } else {
      const permissoesObj: any = {}
      tela.permissoesDisponiveis.forEach(perm => {
        permissoesObj[perm] = perm === permissao ? valor : false
      })

      permissoesAtuais.push({
        telaId: tela.id,
        telaNome: tela.nome,
        modulo: tela.modulo,
        permissoes: permissoesObj
      })
    }
    
    form.setValue("permissoes", permissoesAtuais)
  }

  // Função para verificar se permissão está marcada
  const isPermissaoMarcada = (telaId: string, permissao: string): boolean => {
    const permissaoTela = watchedPermissoes.find(p => p.telaId === telaId)
    return permissaoTela?.permissoes?.[permissao] || false
  }

  // Submeter formulário
  const handleSubmit = async (data: PerfilAcessoForm) => {
    const success = await onSubmit(data)
    if (success) {
      form.reset()
      onClose()
    }
  }

  // Agrupar telas por módulo
  const telasPorModulo = telasDisponiveis.reduce((acc, tela) => {
    if (!acc[tela.modulo]) {
      acc[tela.modulo] = []
    }
    acc[tela.modulo].push(tela)
    return acc
  }, {} as Record<string, typeof telasDisponiveis>)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isEdit ? "Editar Perfil de Acesso" : "Criar Novo Perfil de Acesso"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Dados básicos */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Nome do Perfil <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Administrador, Advogado Associado, Financeiro..." 
                        {...field}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Descrição do Perfil
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ex: Perfil para advogados parceiros com acesso limitado..."
                        rows={3}
                        {...field}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            {/* Permissionamento */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Permissões por Tela</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure as permissões específicas para cada tela do sistema
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTodasPermissoes(true)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Selecionar Todas
                  </Button>
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleTodasPermissoes(false)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Desmarcar Todas
                  </Button>
                </div>
              </div>

              {/* Permissões por módulo */}
              {Object.entries(telasPorModulo).map(([modulo, telas]) => (
                <Card key={modulo}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{modulo}</CardTitle>
                        <Badge variant="secondary">{telas.length} telas</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => togglePermissoesModulo(modulo, true)}
                        >
                          Selecionar Módulo
                        </Button>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => togglePermissoesModulo(modulo, false)}
                        >
                          Desmarcar Módulo
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {telas.map(tela => (
                      <div key={tela.id} className="space-y-2">
                        <h4 className="font-medium text-sm">{tela.nome}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                          {tela.permissoesDisponiveis.map(permissao => (
                            <div key={permissao} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${tela.id}-${permissao}`}
                                checked={isPermissaoMarcada(tela.id, permissao)}
                                onCheckedChange={(checked) => 
                                  togglePermissao(tela.id, permissao, checked as boolean)
                                }
                              />
                              <label 
                                htmlFor={`${tela.id}-${permissao}`}
                                className="text-sm cursor-pointer"
                              >
                                {permissaoLabels[permissao as keyof typeof permissaoLabels]}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Salvando..." : (isEdit ? "Atualizar Perfil" : "Criar Perfil")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
