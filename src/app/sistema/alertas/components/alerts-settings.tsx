"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Settings, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

import { AlertPreferences, AlertPreferencesSchema, ALERT_TYPE_LABELS, ALERT_CHANNEL_LABELS } from "../types"

interface AlertsSettingsProps {
  preferences: AlertPreferences
  onSave: (preferences: AlertPreferences) => Promise<void>
  loading: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AlertsSettings({
  preferences,
  onSave,
  loading,
  open,
  onOpenChange
}: AlertsSettingsProps) {
  const form = useForm<AlertPreferences>({
    resolver: zodResolver(AlertPreferencesSchema),
    defaultValues: preferences
  })

  const onSubmit = async (data: AlertPreferences) => {
    await onSave(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações de Alertas
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Configure como deseja receber cada tipo de alerta. As configurações são aplicadas imediatamente.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-medium text-slate-700 mb-3">Preferências por Tipo de Alerta</h4>
                  <div className="space-y-4">
                    {Object.entries(ALERT_TYPE_LABELS).map(([key, label]) => (
                      <FormField
                        key={key}
                        control={form.control}
                        name={key as keyof AlertPreferences}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <FormLabel className="text-sm font-medium text-slate-700">
                                  {label}
                                </FormLabel>
                                <FormDescription className="text-xs text-slate-500">
                                  {getAlertDescription(key)}
                                </FormDescription>
                              </div>
                              <div className="w-48">
                                <FormControl>
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="border-slate-300 focus:border-slate-500 focus:ring-slate-500">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Object.entries(ALERT_CHANNEL_LABELS).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                          {label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </div>
                            </div>
                            <FormMessage className="text-xs text-red-600" />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-slate-700 font-medium">Sobre as notificações:</p>
                      <ul className="text-slate-600 mt-1 space-y-1">
                        <li>• <strong>Sistema:</strong> Alertas visíveis apenas dentro da plataforma</li>
                        <li>• <strong>E-mail:</strong> Notificações enviadas para seu e-mail cadastrado</li>
                        <li>• <strong>Ambos:</strong> Alertas no sistema e e-mail simultaneamente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={loading}
            className="bg-slate-600 hover:bg-slate-700"
          >
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configurações
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function getAlertDescription(alertType: string): string {
  const descriptions: Record<string, string> = {
    confidencialidade: "Alterações de confidencialidade em clientes ou processos",
    contas_vencer: "Lembretes de contas próximas do vencimento",
    movimentacao_processos: "Atualizações e movimentações nos processos",
    chat_interno: "Mensagens do chat interno entre usuários",
    chat_cliente: "Mensagens de clientes nos chats",
    prazos_atividades: "Lembretes de prazos de atividades importantes",
    agendas: "Lembretes de compromissos e eventos agendados"
  }
  
  return descriptions[alertType] || "Configuração de alerta"
}