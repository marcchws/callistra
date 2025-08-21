"use client"

import { User, MessageSquare, RefreshCw, AlertCircle, Paperclip } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { TicketInteraction, getInitials } from "../types"

interface TicketHistoryProps {
  interactions: TicketInteraction[]
}

export function TicketHistory({ interactions }: TicketHistoryProps) {
  const getInteractionIcon = (type: TicketInteraction['type']) => {
    switch (type) {
      case 'mensagem':
        return <MessageSquare className="h-4 w-4" />
      case 'mudanca_status':
        return <AlertCircle className="h-4 w-4" />
      case 'mudanca_responsavel':
        return <RefreshCw className="h-4 w-4" />
      case 'anexo':
        return <Paperclip className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getInteractionColor = (type: TicketInteraction['type']) => {
    switch (type) {
      case 'mensagem':
        return 'bg-blue-50 border-blue-200'
      case 'mudanca_status':
        return 'bg-yellow-50 border-yellow-200'
      case 'mudanca_responsavel':
        return 'bg-purple-50 border-purple-200'
      case 'anexo':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getAuthorColor = (role: TicketInteraction['authorRole']) => {
    switch (role) {
      case 'atendente':
        return 'bg-blue-600 text-white'
      case 'cliente':
        return 'bg-green-600 text-white'
      case 'sistema':
        return 'bg-gray-600 text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  if (interactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhuma interação registrada ainda</p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {interactions.map((interaction, index) => (
          <div key={interaction.id} className="relative">
            {/* Timeline line */}
            {index < interactions.length - 1 && (
              <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200" />
            )}
            
            {/* Interaction item */}
            <div className="flex gap-3">
              {/* Avatar */}
              <div className="relative z-10">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                  <AvatarFallback className={getAuthorColor(interaction.authorRole)}>
                    {interaction.author === 'Sistema' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      getInitials(interaction.author).slice(0, 2)
                    )}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Content */}
              <div className={`flex-1 rounded-lg border p-4 ${getInteractionColor(interaction.type)}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{interaction.author}</span>
                    {interaction.authorRole !== 'sistema' && (
                      <Badge variant="outline" className="text-xs">
                        {interaction.authorRole === 'atendente' ? 'Atendente' : 'Cliente'}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {getInteractionIcon(interaction.type)}
                    <time>
                      {new Date(interaction.createdAt).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(interaction.createdAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </time>
                  </div>
                </div>
                
                {/* Message */}
                <div className="text-sm">
                  {interaction.type === 'mudanca_status' ? (
                    <p className="text-yellow-800">{interaction.content}</p>
                  ) : interaction.type === 'mudanca_responsavel' ? (
                    <p className="text-purple-800">{interaction.content}</p>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">{interaction.content}</p>
                  )}
                </div>
                
                {/* Attachments */}
                {interaction.attachments && interaction.attachments.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {interaction.attachments.map(attachment => (
                      <div
                        key={attachment.id}
                        className="inline-flex items-center gap-2 px-2 py-1 bg-white rounded border text-xs"
                      >
                        <Paperclip className="h-3 w-3" />
                        {attachment.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}