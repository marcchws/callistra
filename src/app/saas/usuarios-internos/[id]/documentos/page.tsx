"use client"

// Página de Documentos do Usuário
// Gerenciamento completo de documentos anexados

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  ArrowLeft, 
  FileText, 
  Upload, 
  Download, 
  Trash2,
  Eye,
  Plus,
  Search,
  Filter
} from "lucide-react"
import { 
  UsuarioInterno, 
  DocumentoAnexo,
  STATUS_LABELS,
  TIPOS_DOCUMENTO 
} from "@/lib/usuarios-internos/types"
import { mockUsuarios } from "@/lib/usuarios-internos/mock-data"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { toast } from "sonner"

export default function DocumentosUsuarioPage() {
  const params = useParams()
  const router = useRouter()
  const [usuario, setUsuario] = useState<UsuarioInterno | null>(null)
  const [documentos, setDocumentos] = useState<DocumentoAnexo[]>([])
  const [documentosFiltrados, setDocumentosFiltrados] = useState<DocumentoAnexo[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [uploadTipo, setUploadTipo] = useState<string>("")
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  useEffect(() => {
    // Buscar dados do usuário e documentos
    const user = mockUsuarios.find(u => u.id === params.id)
    if (user) {
      setUsuario(user)
      setDocumentos(user.documentosAnexos || [])
      setDocumentosFiltrados(user.documentosAnexos || [])
    }
    setLoading(false)
  }, [params.id])

  useEffect(() => {
    // Aplicar filtros
    let filtered = [...documentos]
    
    if (busca) {
      filtered = filtered.filter(doc => 
        doc.nome.toLowerCase().includes(busca.toLowerCase())
      )
    }
    
    if (filtroTipo !== "todos") {
      filtered = filtered.filter(doc => doc.tipo === filtroTipo)
    }
    
    setDocumentosFiltrados(filtered)
  }, [busca, filtroTipo, documentos])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validação
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Arquivo deve ter no máximo 10MB")
      return
    }

    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!validTypes.includes(file.type)) {
      toast.error("Formato inválido. Use: PDF, JPG, PNG, DOC ou DOCX")
      return
    }

    setUploadFile(file)
  }

  const handleUploadSubmit = () => {
    if (!uploadFile || !uploadTipo) {
      toast.error("Selecione um arquivo e o tipo de documento")
      return
    }

    // Simular upload
    const novoDoc: DocumentoAnexo = {
      id: Date.now().toString(),
      nome: uploadFile.name,
      tipo: uploadTipo as any,
      url: URL.createObjectURL(uploadFile),
      tamanho: uploadFile.size,
      uploadEm: new Date(),
      uploadPor: 'Usuário Atual'
    }

    setDocumentos([...documentos, novoDoc])
    setShowUploadDialog(false)
    setUploadFile(null)
    setUploadTipo("")
    toast.success("Documento anexado com sucesso")
  }

  const handleDelete = (docId: string) => {
    setDocumentos(documentos.filter(d => d.id !== docId))
    toast.success("Documento removido com sucesso")
  }

  const handleDownload = (doc: DocumentoAnexo) => {
    // Simular download
    const link = document.createElement('a')
    link.href = doc.url
    link.download = doc.nome
    link.click()
    toast.success("Download iniciado")
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando documentos...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!usuario) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Usuário não encontrado</h2>
            <p className="text-muted-foreground mt-2">O usuário solicitado não existe.</p>
            <Button 
              className="mt-4"
              onClick={() => router.push('/saas/usuarios-internos')}
            >
              Voltar para a lista
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        <div className="container py-6">
          <div className="space-y-6">
            {/* Header com navegação */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/saas/usuarios-internos/${usuario.id}`)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    Documentos
                  </h1>
                  <p className="text-muted-foreground">
                    Gerencie os documentos anexados do usuário
                  </p>
                </div>
              </div>
              
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4" />
                    Anexar Documento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Anexar Novo Documento</DialogTitle>
                    <DialogDescription>
                      Faça upload de um documento para o usuário
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tipo de Documento</Label>
                      <Select value={uploadTipo} onValueChange={setUploadTipo}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TIPOS_DOCUMENTO).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Arquivo</Label>
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={handleFileUpload}
                      />
                      {uploadFile && (
                        <p className="text-sm text-muted-foreground">
                          {uploadFile.name} ({formatFileSize(uploadFile.size)})
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleUploadSubmit}>
                      <Upload className="mr-2 h-4 w-4" />
                      Fazer Upload
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Card de informações do usuário */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={usuario.fotoPerfil} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getInitials(usuario.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{usuario.nome}</h3>
                    <p className="text-sm text-muted-foreground">{usuario.cargo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{documentos.length}</p>
                    <p className="text-sm text-muted-foreground">
                      documento{documentos.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filtros */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome do arquivo..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      {Object.entries(TIPOS_DOCUMENTO).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Grid de documentos */}
            {documentosFiltrados.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documentosFiltrados.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <FileText className="h-8 w-8 text-blue-600" />
                        <Badge variant="secondary">
                          {TIPOS_DOCUMENTO[doc.tipo as keyof typeof TIPOS_DOCUMENTO]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="font-medium truncate" title={doc.nome}>
                          {doc.nome}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(doc.tamanho)}
                        </p>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        <p>Enviado em {format(new Date(doc.uploadEm), "dd/MM/yyyy", { locale: ptBR })}</p>
                        <p>Por {doc.uploadPor}</p>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="mr-2 h-3 w-3" />
                          Baixar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {busca || filtroTipo !== "todos" 
                      ? "Nenhum documento encontrado com os filtros aplicados"
                      : "Nenhum documento anexado para este usuário"
                    }
                  </p>
                  {!busca && filtroTipo === "todos" && (
                    <Button 
                      className="mt-4"
                      onClick={() => setShowUploadDialog(true)}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Anexar Primeiro Documento
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}