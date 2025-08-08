"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertConfiguration, AlertType, AlertChannel, alertTypeLabels, alertChannelLabels } from "../types"
import { Settings, Mail, Monitor, Smartphone } from "lucide-react"

interface AlertConfigurationProps {
  configurations: AlertConfiguration[]
  onUpdateConfiguration: (alertType: AlertType, channel: AlertChannel, enabled: boolean) => void
  loading: boolean
}

export function AlertConfigurationComponent({ 
  configurations, 
  onUpdateConfiguration, 
  loading 
}: AlertConfigurationProps) {
  const [expandedTypes, setExpandedTypes] = useState<AlertType[]>([])

  const toggleExpanded = (type: AlertType) => {
    setExpandedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const getChannelIcon = (channel: AlertChannel) => {
    switch (channel) {
      case "sistema":
        return <Monitor className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "ambos":
        return <Smartphone className="h-4 w-4" />
    }
  }

  const getChannelBadgeVariant = (channel: AlertChannel) => {
    switch (channel) {
      case "sistema":
        return "default"
      case "email":
        return "secondary"
      case "ambos":
        return "outline"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle className="text-xl font-semibold">Configurações de Alertas</CardTitle>
            <CardDescription>
              Configure como deseja receber cada tipo de alerta
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {configurations.map((config, index) => (
          <div key={config.alertType}>
            <div className="flex items-center justify-between py-3">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Label className="text-sm font-medium">
                    {alertTypeLabels[config.alertType]}
                  </Label>
                  <Badge 
                    variant={getChannelBadgeVariant(config.channel)}
                    className="flex items-center gap-1"
                  >
                    {getChannelIcon(config.channel)}
                    {alertChannelLabels[config.channel]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {config.enabled ? "Ativo" : "Inativo"}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Select
                  value={config.channel}
                  onValueChange={(value: AlertChannel) => 
                    onUpdateConfiguration(config.alertType, value, config.enabled)
                  }
                  disabled={loading || !config.enabled}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sistema">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Sistema
                      </div>
                    </SelectItem>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        E-mail
                      </div>
                    </SelectItem>
                    <SelectItem value="ambos">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4" />
                        Ambos
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(enabled) => 
                    onUpdateConfiguration(config.alertType, config.channel, enabled)
                  }
                  disabled={loading}
                />
              </div>
            </div>
            
            {index < configurations.length - 1 && <Separator />}
          </div>
        ))}
        
        <div className="pt-4 space-y-3 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Monitor className="h-4 w-4" />
            <span><strong>Sistema:</strong> Notificações dentro da plataforma</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span><strong>E-mail:</strong> Enviado para seu e-mail cadastrado</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="h-4 w-4" />
            <span><strong>Ambos:</strong> Sistema + E-mail simultaneamente</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
