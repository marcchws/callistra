"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Calendar, 
  Clock, 
  Users, 
  Link, 
  FileText, 
  Paperclip,
  Bell,
  Repeat,
  Loader2,
  X,
  Upload
} from "lucide-react"
import { 
  EventoAgenda,
  EventoFormData,
  EventoFormSchema,
  TipoItem,
  RecorrenciaTipo
} from "../types"
import { toast } from "sonner"

interface AgendaFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: EventoFormData) => Promise<void>
  evento?: EventoAgenda
  dataInicial?: Date
  conflitos?: EventoAgenda[]
}

// Mock de clientes e processos para seleção
const mockClientes = [
  { id: "cli1", nome: "Silva Empreendimentos" },
  { id: "cli2", nome: "Tech Solutions Ltda" },
  { id: "cli3", nome: "João Carlos Santos" },
]

const mockProcessos = [
  { id: "proc1", numero: "0001234-45.2024.8.26.0100", cliente: "Silva Empreendimentos" },
  { id: "proc2", numero: "0002345-56.2024.5.02.0001", cliente: "Tech Solutions Ltda" },
  { id: "proc3", numero: "0003456-67.2024.8.26.0200", cliente: "João Carlos Santos" },
]

const mockUsuarios = [
  { id: "u1", nome: "Maria Santos", email: "maria@escritorio.com" },
  { id: "u2", nome: "João Silva", email: "joao@escritorio.com" },
  { id: "u3", nome: "Ana Costa", email: "ana@escritorio.com" },
  { id: "u4", nome: "Pedro Oliveira", email: "pedro@escritorio.com" },
]

export function AgendaForm({
  open,
  onClose,
  onSubmit,
  evento,
  dataInicial,
  conflitos = []
}: AgendaFormProps) {
  const [loading, setLoading] = useState(false)
  const [participantesSelecionados, setParticipantesSelecionados] = useState<string[]>([])
  const [anexos, setAnexos] = useState<File[]>([])

  const form = useForm<EventoFormData>({
    resolver: zodResolver(EventoFormSchema),
    defaultValues: {
      titulo: "",
      tipoItem: TipoItem.EVENTO,
      participantes: [],
      dataHoraInicio: dataInicial || new Date(),
      dataHoraTermino: dataInicial ? new Date(dataInicial.getTime() + 60 * 60 * 1000) : new Date(),
      recorrencia: { tipo: RecorrenciaTipo.NENHUMA },
      respostaObrigatoria: false,
      linkVideoconferencia: "",
      clienteId: "",
      processoId: "",
      descricao: "",
      lembreteMinutos: 15
    }
  })

  // Preencher dados se for edição
  useEffect(() => {
    if (evento) {
      form.reset({
        titulo: evento.titulo,
        tipoItem: evento.tipoItem,
        participantes: evento.participantes.map(p => p.id),
        dataHoraInicio: evento.dataHoraInicio,
        dataHoraTermino: evento.dataHoraTermino,
        recorrencia: evento.recorrencia,
        respostaObrigatoria: evento.respostaObrigatoria,
        linkVideoconferencia: evento.linkVideoconferencia || "",
        clienteId: evento.clienteId || "",
        processoId: evento.processoId || "",
        descricao: evento.descricao || "",
        lembreteMinutos: evento.lembreteMinutos
      })
      setParticipantesSelecionados(evento.participantes.map(p => p.id))
    }
  }, [evento, form])

  const handleSubmit = async (data: EventoFormData) => {
    setLoading(true)
    try {
      // Verificar conflitos antes de salvar
      if (conflitos.length > 0 && data.tipoItem !== TipoItem.BLOQUEIO) {
        const confirmar = window.confirm(
          `Existem ${conflitos.length} evento(s) no mesmo horário. Deseja continuar?`
        )
        if (!confirmar) {
          setLoading(false)
          return
        }
      }

      await onSubmit({
        ...data,
        participantes: participantesSelecionados
      })
      
      form.reset()
      setParticipantesSelecionados([])
      setAnexos([])
      onClose()
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleParticipante = (userId: string) => {
    setParticipantesSelecionados(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAnexos(prev => [...prev, ...newFiles])
      toast.success(`${newFiles.length} arquivo(s) adicionado(s)`, { duration: 2000 })
    }
  }

  const removerAnexo = (index: number) => {
    setAnexos(prev => prev.filter((_, i) => i !== index))
  }

  const tipoItem = form.watch("tipoItem")

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {evento ? "Editar" : "Novo"} {tipoItem === TipoItem.BLOQUEIO ? "Bloqueio" : "Evento"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do {tipoItem === TipoItem.BLOQUEIO ? "bloqueio de agenda" : "evento"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <Tabs defaultValue="geral" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="geral">Geral</TabsTrigger>
                  <TabsTrigger value="participantes" disabled={tipoItem === TipoItem.BLOQUEIO}>
                    Participantes
                  </TabsTrigger>
                  <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                  <TabsTrigger value="anexos">Anexos</TabsTrigger>
                </TabsList>

                <TabsContent value="geral" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Título <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o título do evento"
                            {...field}
                            className="focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipoItem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tipo de Item <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-blue-500">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={TipoItem.EVENTO}>Evento</SelectItem>
                            <SelectItem value={TipoItem.REUNIAO}>Reunião</SelectItem>
                            <SelectItem value={TipoItem.TAREFA}>Tarefa</SelectItem>
                            <SelectItem value={TipoItem.BLOQUEIO}>Bloqueio de agenda</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="dataHoraInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Data/Hora de Início <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={field.value instanceof Date 
                                ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                                : field.value
                              }
                              className="focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dataHoraTermino"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Data/Hora de Término <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={field.value instanceof Date 
                                ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                                : field.value
                              }
                              className="focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="recorrencia.tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recorrência</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-blue-500">
                              <SelectValue placeholder="Selecione a recorrência" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={RecorrenciaTipo.NENHUMA}>Nenhuma</SelectItem>
                            <SelectItem value={RecorrenciaTipo.DIARIA}>Diária</SelectItem>
                            <SelectItem value={RecorrenciaTipo.SEMANAL}>Semanal</SelectItem>
                            <SelectItem value={RecorrenciaTipo.MENSAL}>Mensal</SelectItem>
                            <SelectItem value={RecorrenciaTipo.ANUAL}>Anual</SelectItem>
                            <SelectItem value={RecorrenciaTipo.PERSONALIZADA}>Personalizada</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {conflitos.length > 0 && (
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                      <div className="flex items-center gap-2 text-orange-700">
                        <Bell className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Conflitos de horário detectados:
                        </span>
                      </div>
                      <ul className="mt-2 space-y-1">
                        {conflitos.map(c => (
                          <li key={c.id} className="text-sm text-orange-600">
                            • {c.titulo} ({format(c.dataHoraInicio, "HH:mm")} - {format(c.dataHoraTermino, "HH:mm")})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="participantes" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="respostaObrigatoria"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Resposta obrigatória dos participantes
                          </FormLabel>
                          <FormDescription>
                            Os participantes devem confirmar presença
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <Label>Selecione os participantes</Label>
                    <ScrollArea className="h-[200px] rounded-lg border p-3">
                      <div className="space-y-2">
                        {mockUsuarios.map(usuario => (
                          <div
                            key={usuario.id}
                            className="flex items-center space-x-3"
                          >
                            <Checkbox
                              checked={participantesSelecionados.includes(usuario.id)}
                              onCheckedChange={() => toggleParticipante(usuario.id)}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium">{usuario.nome}</div>
                              <div className="text-xs text-muted-foreground">{usuario.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    {participantesSelecionados.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {participantesSelecionados.map(id => {
                          const usuario = mockUsuarios.find(u => u.id === id)
                          return usuario ? (
                            <Badge key={id} variant="secondary">
                              {usuario.nome}
                            </Badge>
                          ) : null
                        })}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="linkVideoconferencia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link de Videoconferência</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Link className="h-4 w-4 mt-3 text-gray-500" />
                            <Input
                              placeholder="https://meet.google.com/..."
                              {...field}
                              className="focus:ring-blue-500"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="detalhes" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clienteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-blue-500">
                              <SelectValue placeholder="Selecione um cliente (opcional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="todos">Nenhum</SelectItem>
                            {mockClientes.map(cliente => (
                              <SelectItem key={cliente.id} value={cliente.id}>
                                {cliente.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="processoId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Processo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="focus:ring-blue-500">
                              <SelectValue placeholder="Selecione um processo (opcional)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="todos">Nenhum</SelectItem>
                            {mockProcessos.map(processo => (
                              <SelectItem key={processo.id} value={processo.id}>
                                {processo.numero} - {processo.cliente}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="descricao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={tipoItem === TipoItem.BLOQUEIO 
                              ? "Motivo do bloqueio (opcional)"
                              : "Detalhes do evento (opcional)"
                            }
                            className="resize-none focus:ring-blue-500"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {1000 - (field.value?.length || 0)} caracteres restantes
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lembreteMinutos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lembrete</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))} 
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger className="focus:ring-blue-500">
                              <SelectValue placeholder="Selecione quando enviar lembrete" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">Sem lembrete</SelectItem>
                            <SelectItem value="5">5 minutos antes</SelectItem>
                            <SelectItem value="15">15 minutos antes</SelectItem>
                            <SelectItem value="30">30 minutos antes</SelectItem>
                            <SelectItem value="60">1 hora antes</SelectItem>
                            <SelectItem value="1440">1 dia antes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="anexos" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Anexos</Label>
                    <div className="rounded-lg border-2 border-dashed border-gray-200 p-6">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Clique para adicionar arquivos
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, DOC, DOCX, JPG, PNG até 10MB
                          </p>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                      </label>
                    </div>

                    {anexos.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <Label>Arquivos selecionados:</Label>
                        {anexos.map((arquivo, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border p-2"
                          >
                            <div className="flex items-center gap-2">
                              <Paperclip className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{arquivo.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(arquivo.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removerAnexo(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Salvando..." : evento ? "Atualizar" : "Criar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
