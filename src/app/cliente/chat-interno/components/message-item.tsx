"use client"

import { useState } from "react"
import { Download, Play, Pause, FileText, Image, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ChatMessage } from "../types"

interface MessageItemProps {
  message: ChatMessage
  isOwn: boolean
  showAvatar?: boolean
}

export function MessageItem({ message, isOwn, showAvatar = true }: MessageItemProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return FileText
    
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return Image
    }
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')) {
      return Music
    }
    return FileText
  }

  const handleDownload = () => {
    // Em produção, faria download real do arquivo
    console.log('Download file:', message.fileName)
  }

  const handleAudioPlay = () => {
    setIsPlaying(!isPlaying)
    // Em produção, controlaria reprodução de áudio real
  }

  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isOwn ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      {showAvatar && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
            {message.senderName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div className={cn(
        "max-w-[70%] space-y-1",
        isOwn ? "items-end" : "items-start"
      )}>
        {/* Sender Name (apenas se não for própria mensagem) */}
        {!isOwn && showAvatar && (
          <p className="text-xs text-gray-600 font-medium px-1">
            {message.senderName}
          </p>
        )}

        {/* Message Bubble */}
        <div className={cn(
          "rounded-lg px-4 py-2 max-w-full break-words",
          isOwn 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-900"
        )}>
          {message.type === 'text' && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}

          {message.type === 'audio' && (
            <div className="flex items-center gap-3 min-w-[200px]">
              <Button
                size="sm"
                variant={isOwn ? "secondary" : "ghost"}
                onClick={handleAudioPlay}
                className="h-8 w-8 rounded-full p-0"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <div className="flex-1">
                <div className={cn(
                  "h-1 rounded-full",
                  isOwn ? "bg-blue-400" : "bg-gray-300"
                )}>
                  <div className={cn(
                    "h-full rounded-full transition-all",
                    isOwn ? "bg-white" : "bg-blue-600"
                  )} style={{ width: isPlaying ? "60%" : "0%" }} />
                </div>
              </div>
              
              <span className={cn(
                "text-xs",
                isOwn ? "text-blue-100" : "text-gray-600"
              )}>
                0:32
              </span>
            </div>
          )}

          {message.type === 'file' && (
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isOwn ? "bg-blue-500" : "bg-white"
              )}>
                {(() => {
                  const Icon = getFileIcon(message.fileName)
                  return <Icon className={cn(
                    "h-5 w-5",
                    isOwn ? "text-white" : "text-blue-600"
                  )} />
                })()}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  isOwn ? "text-white" : "text-gray-900"
                )}>
                  {message.fileName}
                </p>
                {message.fileSize && (
                  <p className={cn(
                    "text-xs",
                    isOwn ? "text-blue-100" : "text-gray-600"
                  )}>
                    {formatFileSize(message.fileSize)}
                  </p>
                )}
              </div>
              
              <Button
                size="sm"
                variant={isOwn ? "secondary" : "ghost"}
                onClick={handleDownload}
                className="h-8 w-8 p-0"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Timestamp and Read Status */}
        <div className={cn(
          "flex items-center gap-1 px-1",
          isOwn ? "justify-end" : "justify-start"
        )}>
          <span className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </span>
          
          {isOwn && (
            <span className="text-xs text-gray-500">
              {message.isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}