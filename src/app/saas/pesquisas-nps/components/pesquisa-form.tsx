"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Plus, Trash2, GripVertical, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { 
  Pesquisa, 
  PesquisaSchema, 
  TipoPergunta, 
  Periodicidade,
  StatusPesquisa,
  PerfilUsuario,
  Usuario 
} from "../types"
import { toast } from "sonner"

interface PesquisaFormProps {
  pesquisa?: Pesquisa
  perfis: PerfilUsuario[]
  usuarios: Usuario[]
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  searchUsuarios: (termo: string) => Usuario[]
}

// Schema extendido para o formulário
const FormSchema = PesquisaSchema.extend({
  perguntas: z.array(z.object({
    texto: z.string().min(1, "Texto da pergunta é obrigatório"),
    tipo: z.nativeEnum(TipoPergunta),
    opcoes: z.array(z.string()).optional(),
    obrigatoria: z.boolean().default(false),
  })).min(1, "Adicione pelo menos uma pergunta"),
})

export function PesquisaForm({ 
  pesquisa, 
  perfis, 
  usuarios,
  onSubmit, 
  onCancel,
  searchUsuarios 
}: PesquisaFormProps) {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsuarios, setSelectedUsuarios] = useState<string[]>(
    pesquisa?.usuariosEspecificos || []
  )
  const [showUsuarioSearch, setShowUsuarioSearch] = useState(false)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: pesquisa ? {
      nome: pesquisa.nome,
      descricao: pesquisa.descricao,
      perguntas: pesquisa.perguntas.map(p => ({
        texto: p.texto,
        tipo: p.tipo,
        opcoes: p.opcoes,
        obrigatoria: p.obrigatoria
      })),
      periodicidade: pesquisa.periodicidade,
      intervaloMeses: pesquisa.intervaloMeses,
      perfisAlvo: pesquisa.perfisAlvo,
      dataInicio: pesquisa.dataInicio,
      dataTermino: pesquisa.dataTermino,
      status: pesquisa.status,
    } : {
      nome: "",
      descricao: "",
      perguntas: [],
      periodicidade: Periodicidade.UNICA,
      perfisAlvo: [],
      dataInicio: new Date(),
      status: StatusPesquisa.RASCUNHO,
    }
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "perguntas",
  })

  const periodicidade = form.watch("periodicidade")
  const perguntas = form.watch("perguntas")

  // Cenário 3: Adicionar pergunta discursiva
  const adicionarPerguntaDiscursiva = () => {
    append({
      texto: "",
      tipo: TipoPergunta.DISCURSIVA,
      obrigatoria: false,
    })
  }

  // Cenário 4: Adicionar pergunta de múltipla escolha
  const adicionarPerguntaMultiplaEscolha = () => {
    append({
      texto: "",
      tipo: TipoPergunta.MULTIPLA_ESCOLHA,
      opcoes: ["", ""],
      obrigatoria: false,
    })
  }

  // Cenário 5: Filtrar usuários por nome
  const usuariosFiltrados = searchUsuarios(searchTerm)

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    setLoading(true)
    try {
      // Adicionar ordem às perguntas
      const perguntasOrdenadas = values.perguntas.map((p, idx) => ({
        ...p,
        ordem: idx + 1,
        id: pesquisa?.perguntas[idx]?.id || `p${Date.now()}_${idx}`
      }))

      await onSubmit({
        ...values,
        perguntas: perguntasOrdenadas,
        usuariosEspecificos: selectedUsuarios.length > 0 ? selectedUsuarios : undefined
      })

      toast.success(pesquisa ? "Pesquisa atualizada com sucesso!" : "Pesquisa criada com sucesso!")
    } catch (error) {
      toast.error("Erro ao salvar pesquisa")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Informações da Pesquisa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Pesquisa <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pesquisa de Satisfação Q1 2024" {...field} />
                  </FormControl>
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
                      placeholder="Descreva o objetivo desta pesquisa..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="dataInicio"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Início <span className="text-red-500">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              "Selecione uma data"
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dataTermino"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Término</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: ptBR })
                            ) : (
                              "Selecione uma data"
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const dataInicio = form.getValues("dataInicio")
                            return date <= dataInicio
                          }}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Deixe em branco para pesquisa sem prazo
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={StatusPesquisa.RASCUNHO}>Rascunho</SelectItem>
                      <SelectItem value={StatusPesquisa.ATIVA}>Ativa</SelectItem>
                      <SelectItem value={StatusPesquisa.INATIVA}>Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Configuração de Periodicidade - Cenário 2 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Periodicidade de Envio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="periodicidade"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Tipo de Periodicidade <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={Periodicidade.UNICA} />
                        <label htmlFor={Periodicidade.UNICA} className="cursor-pointer">
                          Resposta única
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={Periodicidade.RECORRENTE} />
                        <label htmlFor={Periodicidade.RECORRENTE} className="cursor-pointer">
                          Recorrente (a cada X meses)
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={Periodicidade.POR_LOGIN} />
                        <label htmlFor={Periodicidade.POR_LOGIN} className="cursor-pointer">
                          Sempre após login
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {periodicidade === Periodicidade.RECORRENTE && (
              <FormField
                control={form.control}
                name="intervaloMeses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intervalo em Meses <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="12"
                        placeholder="Ex: 3"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      A pesquisa será enviada a cada X meses
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
        </Card>

        {/* Segmentação de Usuários - Cenários 5 e 6 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Público-Alvo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cenário 6: Selecionar perfil de usuário */}
            <FormField
              control={form.control}
              name="perfisAlvo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perfis de Usuário <span className="text-red-500">*</span></FormLabel>
                  <div className="space-y-2">
                    {perfis.map((perfil) => (
                      <div key={perfil.id} className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value?.includes(perfil.id)}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...(field.value || []), perfil.id]
                              : field.value?.filter((id) => id !== perfil.id) || []
                            field.onChange(updatedValue)
                          }}
                        />
                        <label className="cursor-pointer flex-1">
                          <span className="font-medium">{perfil.nome}</span>
                          {perfil.descricao && (
                            <span className="text-sm text-muted-foreground ml-2">
                              - {perfil.descricao}
                            </span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cenário 5: Filtrar usuários por nome */}
            <div className="space-y-2">
              <FormLabel>Usuários Específicos (Opcional)</FormLabel>
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowUsuarioSearch(!showUsuarioSearch)}
                >
                  {selectedUsuarios.length > 0 ? (
                    <span>{selectedUsuarios.length} usuário(s) selecionado(s)</span>
                  ) : (
                    <span className="text-muted-foreground">Clique para selecionar usuários específicos</span>
                  )}
                </Button>
                
                {showUsuarioSearch && (
                  <Card className="absolute z-10 w-full mt-2 max-h-64 overflow-auto">
                    <CardContent className="p-2">
                      <Input
                        placeholder="Buscar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mb-2"
                      />
                      <div className="space-y-1">
                        {usuariosFiltrados.map((usuario) => (
                          <div key={usuario.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                            <Checkbox
                              checked={selectedUsuarios.includes(usuario.id)}
                              onCheckedChange={(checked) => {
                                setSelectedUsuarios(prev =>
                                  checked
                                    ? [...prev, usuario.id]
                                    : prev.filter(id => id !== usuario.id)
                                )
                              }}
                            />
                            <label className="cursor-pointer flex-1">
                              <div>
                                <span className="font-medium">{usuario.nome}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {usuario.perfil.nome}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">{usuario.email}</div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
              {selectedUsuarios.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUsuarios.map(id => {
                    const usuario = usuarios.find(u => u.id === id)
                    if (!usuario) return null
                    return (
                      <Badge key={id} variant="secondary" className="gap-1">
                        {usuario.nome}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setSelectedUsuarios(prev => prev.filter(uid => uid !== id))}
                        />
                      </Badge>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Perguntas - Cenários 3 e 4 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">
                Perguntas {fields.length > 0 && `(${fields.length})`}
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarPerguntaDiscursiva}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Discursiva
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={adicionarPerguntaMultiplaEscolha}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Múltipla Escolha
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma pergunta adicionada. Use os botões acima para adicionar perguntas.
              </div>
            )}

            {fields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                      <Badge variant="outline">
                        {field.tipo === TipoPergunta.DISCURSIVA ? "Discursiva" : "Múltipla Escolha"}
                      </Badge>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name={`perguntas.${index}.texto`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pergunta {index + 1} <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Digite a pergunta..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {perguntas[index]?.tipo === TipoPergunta.MULTIPLA_ESCOLHA && (
                    <div className="space-y-2">
                      <FormLabel>Opções de Resposta</FormLabel>
                      {perguntas[index]?.opcoes?.map((_, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2">
                          <FormField
                            control={form.control}
                            name={`perguntas.${index}.opcoes.${optionIndex}`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input 
                                    placeholder={`Opção ${optionIndex + 1}`} 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          {(perguntas[index]?.opcoes?.length || 0) > 2 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const opcoes = [...(perguntas[index].opcoes || [])]
                                opcoes.splice(optionIndex, 1)
                                form.setValue(`perguntas.${index}.opcoes`, opcoes)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const opcoes = [...(perguntas[index].opcoes || []), ""]
                          form.setValue(`perguntas.${index}.opcoes`, opcoes)
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Adicionar Opção
                      </Button>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name={`perguntas.${index}.obrigatoria`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 cursor-pointer">
                          Resposta obrigatória
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Salvando..." : pesquisa ? "Atualizar Pesquisa" : "Criar Pesquisa"}
          </Button>
        </div>
      </form>
    </Form>
  )
}