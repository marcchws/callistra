"use client"

import { useState, useRef, useEffect } from "react"
import { Bold, Italic, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { TextBlock } from "../types"

interface TextBlockEditorProps {
  block: TextBlock
  isEditing: boolean
  onUpdate: (updates: Partial<TextBlock>) => void
  onStartEdit: () => void
  onEndEdit: () => void
}

export function TextBlockEditor({
  block,
  isEditing,
  onUpdate,
  onStartEdit,
  onEndEdit,
}: TextBlockEditorProps) {
  const [localContent, setLocalContent] = useState(block.content)
  const [selectedText, setSelectedText] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setLocalContent(block.content)
  }, [block.content])

  // Aplicar formatação
  const applyFormatting = (type: "bold" | "italic" | "bullet") => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = localContent
    const selectedText = text.substring(start, end)

    let newText = text
    let newCursorPos = end

    switch (type) {
      case "bold":
        if (selectedText) {
          newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end)
          newCursorPos = end + 4
        } else {
          newText = text.substring(0, start) + "****" + text.substring(end)
          newCursorPos = start + 2
        }
        break

      case "italic":
        if (selectedText) {
          newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end)
          newCursorPos = end + 2
        } else {
          newText = text.substring(0, start) + "**" + text.substring(end)
          newCursorPos = start + 1
        }
        break

      case "bullet":
        // Adicionar bullet no início da linha atual
        const lines = text.substring(0, start).split("\n")
        const currentLineStart = text.substring(0, start).lastIndexOf("\n") + 1
        const currentLineEnd = text.indexOf("\n", start)
        const currentLine = currentLineEnd === -1
          ? text.substring(currentLineStart)
          : text.substring(currentLineStart, currentLineEnd)

        if (!currentLine.startsWith("• ")) {
          newText = text.substring(0, currentLineStart) + "• " + text.substring(currentLineStart)
          newCursorPos = start + 2
        }
        break
    }

    setLocalContent(newText)
    
    // Restaurar posição do cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = newCursorPos
        textareaRef.current.selectionEnd = newCursorPos
        textareaRef.current.focus()
      }
    }, 0)
  }

  // Renderizar texto formatado para preview
  const renderFormattedText = (text: string) => {
    // Converter markdown simples para HTML
    let formatted = text
      .split("\n")
      .map(line => {
        // Bullets
        if (line.startsWith("• ")) {
          return `<li>${line.substring(2)}</li>`
        }
        return line
      })
      .join("\n")
      .replace(/\n(?!<li>)/g, "<br/>")

    // Bold
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    
    // Italic
    formatted = formatted.replace(/\*([^*]+)\*/g, "<em>$1</em>")

    // Wrap bullets in ul
    formatted = formatted.replace(/(<li>.*?<\/li>(\n|<br\/>)?)+/g, (match) => {
      return `<ul class="list-disc list-inside space-y-1">${match}</ul>`
    })

    return formatted
  }

  const handleSave = () => {
    onUpdate({ content: localContent })
    onEndEdit()
  }

  const handleCancel = () => {
    setLocalContent(block.content)
    onEndEdit()
  }

  if (!isEditing) {
    return (
      <div
        className={cn(
          "p-4 rounded-lg border-2 border-dashed border-transparent",
          "hover:border-blue-200 hover:bg-blue-50/50 cursor-pointer",
          "transition-all duration-200 group"
        )}
        onClick={onStartEdit}
      >
        {block.content ? (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderFormattedText(block.content) }}
          />
        ) : (
          <p className="text-muted-foreground italic">{block.placeholder || "Clique para editar"}</p>
        )}
        <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          Clique para editar este bloco de texto
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-lg border-2 border-blue-600 bg-blue-50/30 space-y-3">
      {/* Barra de formatação */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-md border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormatting("bold")}
          className="h-8 w-8 p-0"
          title="Negrito (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormatting("italic")}
          className="h-8 w-8 p-0"
          title="Itálico (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormatting("bullet")}
          className="h-8 w-8 p-0"
          title="Lista com marcadores"
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Área de edição */}
      <Textarea
        ref={textareaRef}
        value={localContent}
        onChange={(e) => setLocalContent(e.target.value)}
        placeholder={block.placeholder || "Digite o conteúdo aqui..."}
        className="min-h-[120px] resize-y font-mono text-sm"
        onKeyDown={(e) => {
          // Atalhos de teclado
          if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
              case "b":
                e.preventDefault()
                applyFormatting("bold")
                break
              case "i":
                e.preventDefault()
                applyFormatting("italic")
                break
            }
          }
        }}
      />

      {/* Dica de formatação */}
      <p className="text-xs text-muted-foreground">
        Use **texto** para negrito, *texto* para itálico, • para listas
      </p>

      {/* Botões de ação */}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          size="sm"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleSave}
        >
          Aplicar
        </Button>
      </div>
    </div>
  )
}
