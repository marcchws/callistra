"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { 
  ProcessoFormData, 
  ProcessoSchema, 
  Processo,
  QUALIFICACOES_OPTIONS,
  INSTANCIAS_OPTIONS,
  TRIBUNAIS_OPTIONS,
  ACESSO_OPTIONS
} from "../types"
import { gerarLinkTribunal, gerarSugestaPasta } from "../utils"

interface ProcessoFormProps {
  processo?: Processo
  onSubmit: (data: ProcessoFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  processos?: Processo[]
}

export function ProcessoForm({ 
  processo, 
  onSubmit, 
  onCancel, 
  loading = false,
  processos = []
}: ProcessoFormProps) {
  const isEdit = !!processo
  
  const form = useForm<ProcessoFormData>({
    resolver: zodResolver(ProcessoSchema),
    defaultValues: {
      pasta: processo?.pasta || gerarSugestaPasta(processos),
      nomeCliente: processo?.nomeCliente || "",
      qualificacaoCliente: processo?.qualificacaoCliente || "",
      outrosEnvolvidos: processo?.outrosEnvolvidos || "",
      qualificacaoEnvolvidos: processo?.qualificacaoEnvolvidos || "",
      tituloProcesso: processo?.tituloProcesso || "",
      instancia: processo?.instancia || "",
      numero: processo?.numero || "",
      juizo: processo?.juizo || "",
      vara: processo?.vara || "",
      foro: processo?.foro || "",
      acao: processo?.acao || "",
      tribunal: processo?.tribunal || "",
      linkTribunal: processo?.linkTribunal || "",
      objeto: processo?.objeto || "",
      valorCausa: processo?.valorCausa || undefined,
      distribuidoEm: processo?.distribuidoEm || undefined,
      valorCondenacao: processo?.valorCondenacao || undefined,
      observacoes: processo?.observacoes || "",
      responsavel: processo?.responsavel || "",
      honorarios: processo?.honorarios || [],
      acesso: processo?.acesso || "publico"
    }
  })

  const handleSubmit = async (data: ProcessoFormData) => {
    await onSubmit(data)
  }

  // Gerar link do tribunal automaticamente quando tribunal e número são preenchidos
  const watchTribunal = form.watch("tribunal")
  const watchNumero = form.watch("numero")
  
  if (watchTribunal && watchNumero && !form.getValues("linkTribunal")) {
    const linkGerado = gerarLinkTribunal(watchTribunal, watchNumero)
    if (linkGerado) {
      form.setValue("linkTribunal", linkGerado)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold">
          {isEdit ? "Editar Processo" : "Novo Processo"}
        </CardTitle>
        <CardDescription>
          {isEdit 
            ? "Altere os dados do processo conforme necessário" 
            : "Preencha os dados do novo processo. Campos marcados com * são obrigatórios"
          }
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            
            {/* Seção: Identificação */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Identificação do Processo</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="pasta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pasta</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 2024/001" {...field} />
                      </FormControl>
                      <FormDescription>
                        Código interno da pasta do processo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tituloProcesso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Processo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Ação de Cobrança" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nome para identificação rápida
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Processo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0000000-00.0000.0.00.0000" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Número CNJ do processo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instancia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instância</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar instância" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INSTANCIAS_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                  name="acao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ação</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Ação de Cobrança" {...field} />
                      </FormControl>
                      <FormDescription>
                        Tipo de ação judicial
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção: Partes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Partes Envolvidas</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nomeCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Nome do Cliente <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo do cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qualificacaoCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Qualificação do Cliente <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar qualificação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {QUALIFICACOES_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="outrosEnvolvidos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Outros Envolvidos <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nomes das outras partes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qualificacaoEnvolvidos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Qualificação <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar qualificação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {QUALIFICACOES_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção: Tribunal e Jurisdição */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Tribunal e Jurisdição</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="tribunal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tribunal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar tribunal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRIBUNAIS_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                  name="linkTribunal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link do Tribunal</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="URL gerada automaticamente" 
                          {...field} 
                          readOnly
                        />
                      </FormControl>
                      <FormDescription>
                        Gerado automaticamente baseado no tribunal
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="juizo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Juízo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 1ª Vara Cível" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vara"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vara</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: 1ª Vara Cível" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="foro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foro</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Foro Central" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção: Valores e Datas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Valores e Datas</h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="valorCausa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Causa</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0,00" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valorCondenacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Condenação</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0,00" 
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="distribuidoEm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distribuído em</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy", { locale: ptBR })
                              ) : (
                                <span>Selecionar data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção: Responsabilidade e Acesso */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Responsabilidade e Acesso</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="responsavel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Responsável <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do advogado responsável" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acesso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nível de Acesso</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar nível" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ACESSO_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Controla quem pode visualizar este processo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção: Detalhes */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Detalhes</h3>
              
              <FormField
                control={form.control}
                name="objeto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objeto do Processo</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição detalhada do objeto do processo"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Anotações adicionais sobre o processo"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

          </CardContent>
          
          <CardFooter className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Salvando..." : (isEdit ? "Atualizar" : "Criar Processo")}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
