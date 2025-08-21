"use client"

import { useState } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, X, Plus, Upload } from "lucide-react"
import { useAgenda } from "../use-agenda"
import { NovoEvento, TipoEvento } from "../types"

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
  recorrencia: z.object({
    ativo: z.boolean().default(false),
    tipo: z.enum(["diario", "semanal", "mensal", "anual"]).optional(),
    intervalo: z.number().min(1).optional(),
    fimRecorrencia: z.string().optional()
  }).optional()
}).refine((data) => {
  const inicio = new Date(data.dataHoraInicio)
  const fim = new Date(data.dataHoraTermino)
  return fim > inicio
}, {
  message: "Data/hora de término deve ser posterior ao início",
  path: ["dataHoraTermino"]
})

type FormData = z.infer<typeof formSchema>

interface CriarEventoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CriarEventoDialog({ open, onOpenChange }: CriarEventoDialogProps) {
  const { criarEvento, loading } = useAgenda()
  const [novoParticipante, setNovoParticipante] = useState("")
  const [arquivos, setArquivos] = useState<File[]>([])

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
      recorrencia: {
        ativo: false,
        tipo: "semanal",
        intervalo: 1,
        fimRecorrencia: ""
      }
    }
  })

  const tipoSelecionado = form.watch("tipo")
  const recorrenciaAtiva = form.watch("recorrencia.ativo")

  const onSubmit = async (data: FormData) => {
    try {
      const novoEvento: NovoEvento = {
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
        anexos: arquivos,
        recorrencia: data.recorrencia?.ativo ? {
          tipo: data.recorrencia.tipo!,
          intervalo: data.recorrencia.intervalo!,
          fimRecorrencia: data.recorrencia.fimRecorrencia || undefined
        } : undefined
      }

      await criarEvento(novoEvento)
      
      // Reset form
      form.reset()
      setArquivos([])
      setNovoParticipante("")
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

  const handleArquivos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setArquivos(prev => [...prev, ...files])
  }

  const removerArquivo = (index: number) => {
    setArquivos(prev => prev.filter((_, i) => i !== index))
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
          <DialogTitle>Criar Novo Item</DialogTitle>
          <DialogDescription>
            Crie um novo evento, reunião, tarefa ou bloqueio de agenda.
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

            {/* Recorrência */}
            <Card>
              <CardContent className="p-4">
                <FormField
                  control={form.control}
                  name="recorrencia.ativo"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel>Evento Recorrente</FormLabel>
                        <FormDescription>
                          Repetir este evento periodicamente
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

                {recorrenciaAtiva && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="recorrencia.tipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequência</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="diario">Diário</SelectItem>
                                <SelectItem value="semanal">Semanal</SelectItem>
                                <SelectItem value="mensal">Mensal</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="recorrencia.intervalo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Intervalo</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                placeholder="1"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="recorrencia.fimRecorrencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fim da Recorrência</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              className="focus:ring-blue-500"
                            />
                          </FormControl>
                          <FormDescription>
                            Deixe em branco para recorrência indefinida
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Anexos */}
            {tipoSelecionado !== "bloqueio" && (
              <div className="space-y-2">
                <FormLabel>Anexos</FormLabel>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    onChange={handleArquivos}
                    className="hidden"
                    id="arquivo-upload"
                  />
                  <label htmlFor="arquivo-upload">
                    <Button type="button" variant="outline" className="gap-2" asChild>
                      <span>
                        <Upload className="h-4 w-4" />
                        Adicionar Arquivos
                      </span>
                    </Button>
                  </label>
                </div>
                
                {arquivos.length > 0 && (
                  <div className="space-y-2">
                    {arquivos.map((arquivo, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm">{arquivo.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removerArquivo(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
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
                {loading ? "Criando..." : "Criar Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
