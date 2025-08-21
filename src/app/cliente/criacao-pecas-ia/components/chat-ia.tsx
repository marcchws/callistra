"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Bot, User, Clock, Zap } from "lucide-react"
import type { MensagemChat } from "../types"

interface ChatIAProps {
  mensagens: MensagemChat[]
  loading?: boolean
}

export function ChatIA({ mensagens, loading = false }: ChatIAProps) {
  if (mensagens.length === 0 && !loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Conversa com IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Nenhuma conversa iniciada ainda.</p>
            <p className="text-sm">Configure e envie uma solicitação para começar.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Conversa com IA
          </CardTitle>
          <Badge variant="outline">
            {mensagens.length} {mensagens.length === 1 ? 'mensagem' : 'mensagens'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="space-y-4">
            {mensagens.map((mensagem) => (
              <div key={mensagem.id} className="flex gap-3">
                {/* Avatar */}
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <div className={`h-full w-full flex items-center justify-center rounded-full ${
                    mensagem.tipo === 'user' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {mensagem.tipo === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                </Avatar>

                {/* Conteúdo da mensagem */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {mensagem.tipo === 'user' ? 'Você' : 'IA Jurídica'}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {mensagem.timestamp.toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    {mensagem.tokens_consumidos && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Zap className="h-3 w-3" />
                        {mensagem.tokens_consumidos} tokens
                      </div>
                    )}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    mensagem.tipo === 'user'
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className="text-sm leading-relaxed whitespace-pre-line">
                      {mensagem.conteudo}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {loading && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <div className="h-full w-full flex items-center justify-center rounded-full bg-green-100 text-green-600">
                    <Bot className="h-4 w-4" />
                  </div>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">IA Jurídica</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      agora
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce"></div>
                      </div>
                      Processando sua solicitação...
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
