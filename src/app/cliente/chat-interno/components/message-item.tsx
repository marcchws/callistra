"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  FileText,
  Download,
  Play,
  Pause,
  Check,
  CheckCheck,
  Clock,
  AlertCircle
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Message } from "../types"
import { useState, useRef, useEffect } from "react"

interface MessageItemProps {
  message: Message
  isMe: boolean
  showAvatar?: boolean
}

export function MessageItem({ message, isMe, showAvatar = false }: MessageItemProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioDuration, setAudioDuration] = useState<string>("0:00")
  const [audioProgress, setAudioProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getStatusIcon = () => {
    switch (message.status) {
      case "sending":
        return <Clock className="h-3 w-3 text-gray-400" />
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-600" />
      case "error":
        return <AlertCircle className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const handlePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleDownload = () => {
    if (message.attachmentUrl) {
      const link = document.createElement("a")
      link.href = message.attachmentUrl
      link.download = message.attachmentName || "download"
      link.click()
    }
  }

  useEffect(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    const handleLoadedMetadata = () => {
      const duration = audio.duration
      const minutes = Math.floor(duration / 60)
      const seconds = Math.floor(duration % 60)
      setAudioDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`)
    }

    const handleTimeUpdate = () => {
      const progress = (audio.currentTime / audio.duration) * 100
      setAudioProgress(progress)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setAudioProgress(0)
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [message.audioUrl])

  const renderContent = () => {
    switch (message.type) {
      case "text":
        return (
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )

      case "audio":
        return (
          <div className="flex items-center gap-3 min-w-[200px]">
            {message.audioUrl && (
              <audio ref={audioRef} src={message.audioUrl} className="hidden" />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <div className="flex-1">
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-100"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground mt-1 block">
                {audioDuration}
              </span>
            </div>
          </div>
        )

      case "attachment":
        return (
          <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg min-w-[200px]">
            <FileText className="h-8 w-8 text-gray-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {message.attachmentName}
              </p>
              {message.attachmentSize && (
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(message.attachmentSize)}
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={cn(
      "flex gap-2",
      isMe ? "justify-end" : "justify-start"
    )}>
      {showAvatar && !isMe && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
            {getInitials(message.senderName)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn(
        "max-w-[70%] space-y-1",
        isMe && "items-end"
      )}>
        {!isMe && (
          <span className="text-xs text-muted-foreground font-medium ml-2">
            {message.senderName}
          </span>
        )}

        <div className={cn(
          "rounded-2xl px-3 py-2 shadow-sm",
          isMe 
            ? "bg-blue-600 text-white" 
            : "bg-gray-100 text-gray-900",
          message.status === "error" && "opacity-70"
        )}>
          {renderContent()}
        </div>

        <div className={cn(
          "flex items-center gap-1 px-2",
          isMe ? "justify-end" : "justify-start"
        )}>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.timestamp), "HH:mm", { locale: ptBR })}
          </span>
          {isMe && getStatusIcon()}
          {message.status === "error" && (
            <span className="text-xs text-red-500">Erro ao enviar</span>
          )}
        </div>
      </div>

      {showAvatar && isMe && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-blue-600 text-white text-xs">
            {getInitials(message.senderName)}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}