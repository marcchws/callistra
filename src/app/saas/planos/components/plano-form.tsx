"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlanoFormData, PlanoFormSchema, Plano } from "../types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface PlanoFormProps {
  plano?: Plano | null
  onSubmit: (data: PlanoFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  title: string
  description: string
}

// COMPONENTE SEGUINDO FORM LAYOUT DO CALLISTRA-PATTERNS.MD
export function PlanoForm({ plano, onSubmit, onCancel, loading = false, title, description }: PlanoFormProps) {
  const [showPreview, setShowPreview] = useState(false)
  
  // FORM SETUP COM ZOD VALIDATION
  const form = useForm<PlanoFormData>({
    resolver: zodResolver(PlanoFormSchema),
    defaultValues: plano ? {
      nome: plano.nome,
      descricao: plano.descricao,
      precoMensal: plano.precoMensal,
      precoAnual: plano.precoAnual,
      ativo: plano.ativo,
      limitacoes: plano.limitacoes,
      recursos: plano.recursos
    } : {
      nome: "",
      descricao: "",
      precoMensal: 0,
      precoAnual: 0,
      ativo: true,
      limitacoes: {
        maxUsuarios: 1,
        maxProcessos: 1,
        storageGB: 1
      },
      recursos: {
        gestaoUsuarios: true,
        gestaoClientes: true,
        gestaoProcessos: true,
        agenda: false,
        contratos: false,
        tarefas: false,
        chatInterno: false,
        helpdesk: false,
        financeiro: false,
        relatorios: false
      }
    }
  })

  const handleSubmit = async (data: PlanoFormData) => {
    await onSubmit(data)
  }

  const handlePreview = () => {
    const formData = form.getValues()
    setShowPreview(true)
  }

  // CALCULAR ECONOMIA ANUAL
  const calcularEconomiaAnual = (mensal: number, anual: number) => {
    const anualizadoMensal = mensal * 12
    return anualizadoMensal - anual
  }

  const formData = form.watch()

  return (
    <>
      {/* SEGUINDO FORM LAYOUT PATTERN OBRIGATÓRIO */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              
              {/* INFORMAÇÕES BÁSICAS */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Básicas</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Nome do Plano <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Plano Básico" 
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
                    name="ativo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Plano Ativo</FormLabel>
                          <FormDescription>
                            Planos ativos ficam disponíveis para contratação
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Descrição <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva as características do plano..."
                          className="min-h-20 focus:ring-blue-500"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Descrição que será exibida aos clientes
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* PREÇOS */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preços</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="precoMensal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Preço Mensal (R$) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="precoAnual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Preço Anual (R$) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        {formData.precoMensal > 0 && formData.precoAnual > 0 && (
                          <FormDescription>
                            Economia anual: R$ {calcularEconomiaAnual(formData.precoMensal, formData.precoAnual).toFixed(2)}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* LIMITAÇÕES */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Limitações</h3>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="limitacoes.maxUsuarios"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Máx. Usuários <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="limitacoes.maxProcessos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Máx. Processos <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="limitacoes.storageGB"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Storage (GB) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* RECURSOS INCLUSOS */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recursos Inclusos</h3>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="recursos.gestaoUsuarios"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Gestão de Usuários</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recursos.gestaoClientes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Gestão de Clientes</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recursos.gestaoProcessos"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Gestão de Processos</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recursos.agenda"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Agenda</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recursos.contratos"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Contratos</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recursos.tarefas"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Tarefas</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recursos.chatInterno"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Chat Interno</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recursos.helpdesk"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Helpdesk</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recursos.financeiro"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Financeiro</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="recursos.relatorios"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm font-medium">Relatórios</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
        
        {/* SEGUINDO CARDFOOTER PATTERN */}
        <CardFooter className="flex justify-between gap-3">
          <Button 
            variant="outline" 
            onClick={handlePreview}
            disabled={loading}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            Visualizar
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* MODAL DE PREVIEW */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Preview do Plano</DialogTitle>
            <DialogDescription>
              Visualização do plano como será exibido aos clientes
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">{formData.nome}</h3>
              <p className="text-muted-foreground">{formData.descricao}</p>
              <div className="flex items-center justify-center gap-2">
                <Badge variant={formData.ativo ? "default" : "secondary"}>
                  {formData.ativo ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </div>
            
            <div className="text-center space-y-1">
              <div className="text-3xl font-bold">R$ {formData.precoMensal?.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">por mês</div>
              <div className="text-sm">ou R$ {formData.precoAnual?.toFixed(2)} por ano</div>
              {formData.precoMensal > 0 && formData.precoAnual > 0 && (
                <div className="text-sm text-green-600">
                  Economize R$ {calcularEconomiaAnual(formData.precoMensal, formData.precoAnual).toFixed(2)} por ano
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Limitações:</h4>
              <ul className="text-sm space-y-1">
                <li>• Até {formData.limitacoes.maxUsuarios} usuários</li>
                <li>• Até {formData.limitacoes.maxProcessos} processos</li>
                <li>• {formData.limitacoes.storageGB} GB de armazenamento</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium">Recursos inclusos:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(formData.recursos).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    gestaoUsuarios: "Gestão de Usuários",
                    gestaoClientes: "Gestão de Clientes", 
                    gestaoProcessos: "Gestão de Processos",
                    agenda: "Agenda",
                    contratos: "Contratos",
                    tarefas: "Tarefas",
                    chatInterno: "Chat Interno",
                    helpdesk: "Helpdesk",
                    financeiro: "Financeiro",
                    relatorios: "Relatórios"
                  }
                  
                  return (
                    <div key={key} className={`flex items-center gap-2 ${value ? "text-green-600" : "text-gray-400"}`}>
                      <span>{value ? "✓" : "✗"}</span>
                      <span>{labels[key]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
