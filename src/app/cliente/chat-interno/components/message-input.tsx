"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send, Paperclip, Mic, X, FileText, Image, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { messageSchema, MessageFormData } from "../types"
import { toast } from "sonner"

interface MessageInputProps {
  onSendMessage: (message: MessageFormData, file?: File) => Promise<void>
  disabled?: boolean
}

export function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const form = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
      type: "text"
    }
  })

  const handleSubmit = async (data: MessageFormData) => {
    if (!data.content.trim() && !selectedFile) return

    try {
      // Se há arquivo, simular progresso de upload
      if (selectedFile) {
        setUploadProgress(0)
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 100) {
              clearInterval(interval)
              return 100
            }
            return prev + 10
          })
        }, 100)
      }

      await onSendMessage(data, selectedFile || undefined)
      
      // Reset form
      form.reset()
      setSelectedFile(null)
      setUploadProgress(0)
      
      // Focus textarea
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    } catch (error) {
      setUploadProgress(0)
      toast.error("Erro ao enviar mensagem")
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tamanho do arquivo (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 10MB.")
      return
    }

    setSelectedFile(file)
    
    // Se for arquivo, definir conteúdo da mensagem
    if (file.type.startsWith('audio/')) {
      form.setValue('type', 'audio')
      form.setValue('content', 'Áudio')
    } else {
      form.setValue('type', 'file')
      form.setValue('content', file.name)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    form.setValue('type', 'text')
    form.setValue('content', "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type.startsWith('audio/')) return Music
    return FileText
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      form.handleSubmit(handleSubmit)()
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    // Em produção, iniciaria gravação de áudio real
    toast.success("Gravação iniciada")
    
    // Simular parada automática após 3 segundos
    setTimeout(() => {
      setIsRecording(false)
      
      // Simular arquivo de áudio
      const audioBlob = new Blob([], { type: 'audio/mp3' })
      const audioFile = new File([audioBlob], 'audio.mp3', { type: 'audio/mp3' })
      setSelectedFile(audioFile)
      form.setValue('type', 'audio')
      form.setValue('content', 'Áudio')
      
      toast.success("Gravação finalizada")
    }, 3000)
  }

  const currentValue = form.watch('content')
  const hasContent = currentValue?.trim() || selectedFile

  return (
    <div className="border-t bg-white p-4">
      {/* File Preview */}
      {selectedFile && (
        <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              {(() => {
                const Icon = getFileIcon(selectedFile)
                return <Icon className="h-5 w-5 text-blue-600" />
              })()}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-600">
                {formatFileSize(selectedFile.size)}
              </p>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <Progress value={uploadProgress} className="h-1 mt-1" />
              )}
            </div>
            
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={removeFile}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-3">
          <div className="flex gap-2">
            {/* Message Input */}
            <div className="flex-1">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        ref={textareaRef}
                        placeholder={selectedFile ? "Adicione uma mensagem (opcional)" : "Digite sua mensagem..."}
                        {...field}
                        onKeyPress={handleKeyPress}
                        disabled={disabled || uploadProgress > 0}
                        className="min-h-[80px] max-h-[120px] resize-none focus:ring-blue-500"
                        rows={2}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {/* Attach File Button */}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploadProgress > 0}
                className="h-10 w-10 p-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              {/* Record Audio Button */}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={startRecording}
                disabled={disabled || uploadProgress > 0 || isRecording}
                className={cn(
                  "h-10 w-10 p-0",
                  isRecording && "bg-red-100 border-red-300 text-red-600"
                )}
              >
                <Mic className={cn(
                  "h-4 w-4",
                  isRecording && "animate-pulse"
                )} />
              </Button>

              {/* Send Button */}
              <Button
                type="submit"
                size="sm"
                disabled={!hasContent || disabled || uploadProgress > 0}
                className="h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className="flex items-center gap-2 text-red-600">
              <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium">Gravando áudio...</span>
            </div>
          )}
        </form>
      </Form>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        accept="image/*,audio/*,.pdf,.doc,.docx,.txt"
      />
    </div>
  )
}