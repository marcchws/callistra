"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  X,
  Image as ImageIcon,
  FileText,
  Smile
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface MessageInputProps {
  onSendMessage: (content: string) => void
  onSendAudio: (audioBlob: Blob) => void
  onSendAttachment: (file: File) => void
  onTyping: (isTyping: boolean) => void
  isRecording: boolean
  setIsRecording: (isRecording: boolean) => void
}

export function MessageInput({
  onSendMessage,
  onSendAudio,
  onSendAttachment,
  onTyping,
  isRecording,
  setIsRecording
}: MessageInputProps) {
  const [message, setMessage] = useState("")
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Formatação do tempo de gravação
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Lidar com mudança de texto e indicador de digitação
  const handleMessageChange = (value: string) => {
    setMessage(value)

    // Enviar indicador de digitação
    if (value.length > 0) {
      onTyping(true)

      // Limpar timeout anterior
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      // Parar de digitar após 2 segundos
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false)
      }, 2000)
    } else {
      onTyping(false)
    }
  }

  // Enviar mensagem
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
      onTyping(false)
    }
  }

  // Lidar com tecla Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Selecionar arquivo
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Verificar tamanho do arquivo (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo permitido: 10MB")
        return
      }

      setAttachedFile(file)
    }
  }

  // Enviar arquivo anexado
  const handleSendAttachment = () => {
    if (attachedFile) {
      onSendAttachment(attachedFile)
      setAttachedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  // Remover arquivo anexado
  const handleRemoveAttachment = () => {
    setAttachedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Iniciar gravação de áudio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        onSendAudio(audioBlob)
        
        // Limpar
        stream.getTracks().forEach(track => track.stop())
        setRecordingTime(0)
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Iniciar contador de tempo
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.error("Erro ao acessar microfone:", error)
      toast.error("Não foi possível acessar o microfone")
    }
  }

  // Parar gravação de áudio
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  // Cancelar gravação
  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.onstop = () => {
        // Limpar sem enviar
        const stream = mediaRecorderRef.current?.stream
        stream?.getTracks().forEach(track => track.stop())
        setRecordingTime(0)
      }
      setIsRecording(false)

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
      if (mediaRecorderRef.current && isRecording) {
        cancelRecording()
      }
    }
  }, [])

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="border-t">
      {/* Arquivo anexado */}
      {attachedFile && (
        <div className="px-4 py-2 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getFileIcon(attachedFile)}
              <div>
                <p className="text-sm font-medium">{attachedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(attachedFile.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemoveAttachment}
              className="h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Gravação de áudio */}
      {isRecording && (
        <div className="px-4 py-3 bg-red-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse" />
                <div className="absolute inset-0 h-3 w-3 bg-red-500 rounded-full animate-ping" />
              </div>
              <span className="text-sm font-medium">Gravando áudio...</span>
              <span className="text-sm text-muted-foreground">
                {formatRecordingTime(recordingTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelRecording}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-700"
              >
                <MicOff className="h-4 w-4 mr-2" />
                Parar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input de mensagem */}
      <div className="p-4">
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="*/*"
          />

          {/* Botão de anexo */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isRecording}
                  className="shrink-0"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Anexar arquivo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Campo de texto */}
          <div className="flex-1">
            <Textarea
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => handleMessageChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isRecording || !!attachedFile}
              className={cn(
                "min-h-[40px] max-h-[120px] resize-none",
                "focus:ring-blue-500"
              )}
              rows={1}
            />
          </div>

          {/* Botões de ação */}
          {message.trim() || attachedFile ? (
            <Button
              size="icon"
              onClick={attachedFile ? handleSendAttachment : handleSendMessage}
              className="bg-blue-600 hover:bg-blue-700 shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isRecording ? "destructive" : "ghost"}
                    size="icon"
                    onClick={isRecording ? stopRecording : startRecording}
                    className="shrink-0"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRecording ? "Parar gravação" : "Gravar áudio"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  )
}