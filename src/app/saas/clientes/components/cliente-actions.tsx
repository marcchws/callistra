"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, UserCog, CreditCard, Power, Trash2, Eye, Loader2 } from "lucide-react"
import { Cliente, AlterarTitularidadeData, TrocarPlanoData, alterarTitularidadeSchema, trocarPlanoSchema, PlanoTipo, formatCurrency, formatTelefone } from "../types"

interface ClienteActionsProps {
  cliente: Cliente
  onEdit: () => void
  onDelete: () => Promise<void>
  onToggleStatus: () => Promise<void>
  onAlterarTitularidade: (data: AlterarTitularidadeData) => Promise<void>
  onTrocarPlano: (data: TrocarPlanoData) => Promise<void>
}

export function ClienteActions({ 
  cliente, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onAlterarTitularidade,
  onTrocarPlano
}: ClienteActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [titularidadeDialogOpen, setTitularidadeDialogOpen] = useState(false)
  const [planoDialogOpen, setPlanoDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form para alteração de titularidade
  const titularidadeForm = useForm<AlterarTitularidadeData>({
    resolver: zodResolver(alterarTitularidadeSchema),
    defaultValues: {
      novoNome: cliente.nomeContratante,
      novoEmail: cliente.emailContratante,
      novoTelefone: cliente.telefone
    }
  })

  // Form para troca de plano
  const planoForm = useForm<TrocarPlanoData>({
    resolver: zodResolver(trocarPlanoSchema),
    defaultValues: {
      novoPlano: cliente.nomePlano,
      novoValor: cliente.valorPlano,
      novaDescricao: cliente.descricaoPlano
    }
  })

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onDelete()
      setDeleteDialogOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    setLoading(true)
    try {
      await onToggleStatus()
      setStatusDialogOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleAlterarTitularidade = async (data: AlterarTitularidadeData) => {
    setLoading(true)
    try {
      await onAlterarTitularidade(data)
      setTitularidadeDialogOpen(false)
      titularidadeForm.reset()
    } finally {
      setLoading(false)
    }
  }

  const handleTrocarPlano = async (data: TrocarPlanoData) => {
    setLoading(true)
    try {
      await onTrocarPlano(data)
      setPlanoDialogOpen(false)
      planoForm.reset()
    } finally {
      setLoading(false)
    }
  }

  const handleTelefoneChange = (value: string) => {
    const formatted = formatTelefone(value)
    titularidadeForm.setValue('novoTelefone', formatted)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setDetailsDialogOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalhes
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setTitularidadeDialogOpen(true)}>
            <UserCog className="mr-2 h-4 w-4" />
            Alterar titularidade
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setPlanoDialogOpen(true)}>
            <CreditCard className="mr-2 h-4 w-4" />
            Trocar plano
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setStatusDialogOpen(true)}>
            <Power className="mr-2 h-4 w-4" />
            {cliente.status === 'ativa' ? 'Inativar' : 'Ativar'} cliente
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de Detalhes */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
            <DialogDescription>
              Informações completas do escritório cliente
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Dados do Escritório */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Dados do Escritório</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">ID:</span>
                  <span className="text-sm font-medium">{cliente.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nome:</span>
                  <span className="text-sm font-medium">{cliente.nomeEscritorio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">CNPJ:</span>
                  <span className="text-sm font-medium">{cliente.cnpj}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge className={`${
                    cliente.status === 'ativa' ? 'bg-green-100 text-green-800' :
                    cliente.status === 'inadimplente' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {cliente.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Dados do Contratante */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Dados do Contratante</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Nome:</span>
                  <span className="text-sm font-medium">{cliente.nomeContratante}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">E-mail:</span>
                  <span className="text-sm font-medium">{cliente.emailContratante}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Telefone:</span>
                  <span className="text-sm font-medium">{cliente.telefone}</span>
                </div>
              </div>
            </div>

            {/* Informações do Plano */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Informações do Plano</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Plano:</span>
                  <Badge className={`${
                    cliente.nomePlano === 'ENTERPRISE' ? 'bg-amber-100 text-amber-800' :
                    cliente.nomePlano === 'PREMIUM' ? 'bg-purple-100 text-purple-800' :
                    cliente.nomePlano === 'STANDARD' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {PlanoTipo[cliente.nomePlano]}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Valor:</span>
                  <span className="text-sm font-medium">{formatCurrency(cliente.valorPlano)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Vigência:</span>
                  <span className="text-sm font-medium">
                    {new Date(cliente.vigenciaPlano).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Forma de Pagamento:</span>
                  <span className="text-sm font-medium">{cliente.formaPagamento}</span>
                </div>
              </div>
            </div>

            {/* Uso de Recursos */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Uso de Recursos</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Usuários:</span>
                    <span className="text-sm font-medium">
                      {cliente.usuariosUsados} / {cliente.usuariosDisponiveis}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(cliente.usuariosUsados / cliente.usuariosDisponiveis) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Processos:</span>
                    <span className="text-sm font-medium">
                      {cliente.processosUsados} / {cliente.processosDisponiveis}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(cliente.processosUsados / cliente.processosDisponiveis) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Tokens IA:</span>
                    <span className="text-sm font-medium">
                      {cliente.tokensIAUsados} / {cliente.tokensIADisponiveis}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(cliente.tokensIAUsados / cliente.tokensIADisponiveis) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Descrição do Plano */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Descrição do Plano</h3>
              <p className="text-sm">{cliente.descricaoPlano}</p>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setDetailsDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Alteração de Titularidade */}
      <Dialog open={titularidadeDialogOpen} onOpenChange={setTitularidadeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Alterar Titularidade</DialogTitle>
            <DialogDescription>
              Altere os dados do administrador do escritório cliente
            </DialogDescription>
          </DialogHeader>
          
          <Form {...titularidadeForm}>
            <form onSubmit={titularidadeForm.handleSubmit(handleAlterarTitularidade)} className="space-y-4">
              <FormField
                control={titularidadeForm.control}
                name="novoNome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Novo Nome <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome completo" 
                        {...field} 
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={titularidadeForm.control}
                name="novoEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Novo E-mail <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="email@exemplo.com" 
                        {...field} 
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={titularidadeForm.control}
                name="novoTelefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Novo Telefone <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+55 (00) 00000-0000" 
                        {...field}
                        onChange={(e) => handleTelefoneChange(e.target.value)}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormDescription>
                      Formato: DDI+DDD+NÚMERO
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setTitularidadeDialogOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog de Troca de Plano */}
      <Dialog open={planoDialogOpen} onOpenChange={setPlanoDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Trocar Plano</DialogTitle>
            <DialogDescription>
              Altere o plano do escritório cliente
            </DialogDescription>
          </DialogHeader>
          
          <Form {...planoForm}>
            <form onSubmit={planoForm.handleSubmit(handleTrocarPlano)} className="space-y-4">
              <FormField
                control={planoForm.control}
                name="novoPlano"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Novo Plano <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-blue-500">
                          <SelectValue placeholder="Selecione o plano" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PlanoTipo).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={planoForm.control}
                name="novoValor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Novo Valor (R$) <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="0.00" 
                        {...field}
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={planoForm.control}
                name="novaDescricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Nova Descrição <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ex.: Plano Standard mensal para X usuários/mês" 
                        className="resize-none focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setPlanoDialogOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Salvando..." : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* AlertDialog de Confirmação de Status */}
      <AlertDialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {cliente.status === 'ativa' ? 'Inativar' : 'Ativar'} Cliente
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja {cliente.status === 'ativa' ? 'inativar' : 'ativar'} o cliente 
              <strong> {cliente.nomeEscritorio}</strong>?
              {cliente.status === 'ativa' && (
                <span className="block mt-2 text-red-600">
                  O cliente perderá acesso ao sistema imediatamente.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleStatus}
              className={cliente.status === 'ativa' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Processando..." : cliente.status === 'ativa' ? 'Inativar' : 'Ativar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog de Confirmação de Exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Cliente</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cliente <strong>{cliente.nomeEscritorio}</strong>? 
              Esta ação não pode ser desfeita e todos os dados serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}