"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Loader2, X, Plus, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAgenda } from "../use-agenda"
import { EventoAgenda, TipoEvento } from "../types"

const formSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  tipo: z.enum(["evento", "reuniao", "tarefa", "bloqueio"] as const),
  participantes: z.array(z.string().email("Email inválido")).default([]),
  dataHoraInicio: z.string().min(1, "Data/hora de início é obrigatória"),
  dataHoraTermino: z.string().min(1, "Data/hora de término é obrigatória"),
  respostaObrigatoria: z.boolean().default(false),
  linkVideoconferencia: z.string().url("URL inválida").optional().or(z.literal("")),
  clienteId: z.string().optional(),
  processoId: z.string().optional(),
  descricao: z.string().optional(),
}).refine((data) => {
  const inicio = new Date(data.dataHoraInicio)
  const fim = new Date(data.dataHoraTermino)
  return fim > inicio
}, {
  message: "Data/hora de término deve ser posterior ao início",
  path: ["dataHoraTermino"]
})

type FormData = z.infer<typeof formSchema>

interface EditarEventoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  evento: EventoAgenda
}

export function EditarEventoDialog({ open, onOpenChange, evento }: EditarEventoDialogProps) {
  const { editarEvento, removerEvento, loading } = useAgenda()
  const [novoParticipante, setNovoParticipante] = useState("")

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      tipo: "evento",
      participantes: [],
      dataHoraInicio: "",
      dataHoraTermino: "",
      respostaObrigatoria: false,
      linkVideoconferencia: "",
      clienteId: "",
      processoId: "",
      descricao: "",
    }
  })

  const tipoSelecionado = form.watch("tipo")

  // Carregar dados do evento quando o dialog abrir
  useEffect(() => {
    if (open && evento) {
      form.reset({
        titulo: evento.titulo,
        tipo: evento.tipo,
        participantes: evento.participantes.map(p => p.email),
        dataHoraInicio: evento.dataHoraInicio.slice(0, 16), // Format para datetime-local
        dataHoraTermino: evento.dataHoraTermino.slice(0, 16),
        respostaObrigatoria: evento.respostaObrigatoria,
        linkVideoconferencia: evento.linkVideoconferencia || "",
        clienteId: evento.clienteId || "",
        processoId: evento.processoId || "",
        descricao: evento.descricao || "",
      })
    }
  }, [open, evento, form])

  const onSubmit = async (data: FormData) => {
    try {
      await editarEvento(evento.id, {
        titulo: data.titulo,
        tipo: data.tipo,
        participantes: data.participantes,
        dataHoraInicio: data.dataHoraInicio,
        dataHoraTermino: data.dataHoraTermino,
        respostaObrigatoria: data.respostaObrigatoria,
        linkVideoconferencia: data.linkVideoconferencia || undefined,
        clienteId: data.clienteId || undefined,
        processoId: data.processoId || undefined,
        descricao: data.descricao || undefined,
        anexos: [] // Manter anexos existentes em produção
      })
      
      onOpenChange(false)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const handleRemover = async () => {
    try {
      await removerEvento(evento.id)
      onOpenChange(false)
    } catch (error) {
      // Erro já tratado no hook
    }
  }

  const adicionarParticipante = () => {
    if (novoParticipante && !form.getValues("participantes").includes(novoParticipante)) {
      const participantesAtuais = form.getValues("participantes")
      form.setValue("participantes", [...participantesAtuais, novoParticipante])
      setNovoParticipante("")
    }
  }

  const removerParticipante = (email: string) => {
    const participantesAtuais = form.getValues("participantes")
    form.setValue("participantes", participantesAtuais.filter(p => p !== email))
  }

  const getTipoLabel = (tipo: TipoEvento) => {
    switch (tipo) {
      case "evento": return "Evento"
      case "reuniao": return "Reunião"
      case "tarefa": return "Tarefa"
      case "bloqueio": return "Bloqueio de Agenda"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar {getTipoLabel(evento.tipo)}</DialogTitle>
          <DialogDescription>
            Faça alterações nos dados do item selecionado.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Título e Tipo */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Título <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do evento..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipo <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="evento">Evento</SelectItem>
                        <SelectItem value="reuniao">Reunião</SelectItem>
                        <SelectItem value="tarefa">Tarefa</SelectItem>
                        <SelectItem value="bloqueio">Bloqueio de Agenda</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Data/Hora */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataHoraInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Data/Hora Início <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
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
                name="dataHoraTermino"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Data/Hora Término <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="datetime-local" 
                        {...field} 
                        className="focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Participantes (apenas se não for bloqueio) */}
            {tipoSelecionado !== "bloqueio" && (
              <FormField
                control={form.control}
                name="participantes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participantes</FormLabel>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder="email@exemplo.com"
                          value={novoParticipante}
                          onChange={(e) => setNovoParticipante(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), adicionarParticipante())}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={adicionarParticipante}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {field.value.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((email) => (
                            <Badge key={email} variant="secondary" className="gap-1">
                              {email}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 hover:bg-transparent"
                                onClick={() => removerParticipante(email)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Opções especiais para eventos/reuniões */}
            {tipoSelecionado !== "bloqueio" && (
              <>
                <FormField
                  control={form.control}
                  name="respostaObrigatoria"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Resposta Obrigatória</FormLabel>
                        <FormDescription>
                          Exigir que participantes respondam ao convite
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkVideoconferencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link da Videoconferência</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://meet.google.com/..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cliente e Processo */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="clienteId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar cliente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="nenhum">Nenhum cliente</SelectItem>
                            <SelectItem value="cliente1">João Silva</SelectItem>
                            <SelectItem value="cliente2">Maria Santos</SelectItem>
                            <SelectItem value="cliente3">Empresa ABC</SelectItem>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar processo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="nenhum">Nenhum processo</SelectItem>
                            <SelectItem value="processo1">Processo 001/2024</SelectItem>
                            <SelectItem value="processo2">Processo 002/2024</SelectItem>
                            <SelectItem value="processo3">Processo 003/2024</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* Descrição */}
            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {tipoSelecionado === "bloqueio" ? "Motivo do Bloqueio" : "Descrição"}
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={tipoSelecionado === "bloqueio" ? "Motivo da indisponibilidade..." : "Detalhes do evento..."}
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Informações de Auditoria */}
            <div className="bg-muted p-3 rounded-lg text-sm space-y-1">
              <p><strong>Criado por:</strong> {evento.criadoPor}</p>
              <p><strong>Data de criação:</strong> {new Date(evento.criadoEm).toLocaleString("pt-BR")}</p>
              {evento.alteradoPor && (
                <>
                  <p><strong>Última alteração por:</strong> {evento.alteradoPor}</p>
                  <p><strong>Data da alteração:</strong> {new Date(evento.alteradoEm!).toLocaleString("pt-BR")}</p>
                </>
              )}
            </div>

            <DialogFooter className="gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    type="button" 
                    variant="destructive"
                    disabled={loading}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover este {getTipoLabel(evento.tipo).toLowerCase()}?
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemover}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Confirmar Remoção
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
