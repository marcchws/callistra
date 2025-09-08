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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { 
  Processo, 
  ProcessoSchema,
  QualificacaoEnum,
  QualificacaoLabels,
  InstanciaLabels,
  NivelAcessoLabels,
  TribunalLabels,
  HonorariosLabels,
  TribunalUrls
} from "../types"
import { useState, useEffect } from "react"

interface ProcessoFormProps {
  defaultValues?: Partial<Processo>
  onSubmit: (data: Processo) => Promise<{ success: boolean; error?: string }>
  onCancel: () => void
  isEditing?: boolean
}

export function ProcessoForm({ defaultValues, onSubmit, onCancel, isEditing = false }: ProcessoFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<Processo>({
    resolver: zodResolver(ProcessoSchema),
    defaultValues: {
      pasta: "",
      nomeCliente: "",
      qualificacaoCliente: "autor",
      outrosEnvolvidos: "",
      qualificacaoOutros: "reu",
      titulo: "",
      instancia: "1_grau",
      numero: "",
      juizo: "",
      vara: "",
      foro: "",
      acao: "",
      tribunal: undefined,
      linkTribunal: "",
      objeto: "",
      valorCausa: "",
      distribuidoEm: "",
      valorCondenacao: "",
      observacoes: "",
      responsavel: "",
      honorarios: [],
      acesso: "publico",
      ...defaultValues
    }
  })

  // Auto-preencher link do tribunal quando tribunal for selecionado
  const watchTribunal = form.watch("tribunal")
  
  useEffect(() => {
    if (watchTribunal && TribunalUrls[watchTribunal]) {
      form.setValue("linkTribunal", TribunalUrls[watchTribunal])
    }
  }, [watchTribunal, form])

  const handleSubmit = async (data: Processo) => {
    setLoading(true)
    const result = await onSubmit(data)
    setLoading(false)
    return result
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">
              {isEditing ? "Editar Processo" : "Novo Processo"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Seção: Identificação */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Identificação</h3>
              <Separator />
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="pasta"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Pasta <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 2024/001" 
                          {...field}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormDescription>
                        Identificador da pasta do processo
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título do Processo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Ação Trabalhista" 
                          {...field}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
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
                          placeholder="Padrão CNJ" 
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
                  name="instancia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instância</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(InstanciaLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
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
                      <FormLabel>Tipo de Ação</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Reclamação Trabalhista" 
                          {...field}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção: Partes Envolvidas */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Partes Envolvidas</h3>
              <Separator />
              
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nomeCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nome do Cliente <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome completo" 
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
                  name="qualificacaoCliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Qualificação do Cliente <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(QualificacaoLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
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
                      <FormLabel>
                        Outros Envolvidos <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nomes das outras partes" 
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
                  name="qualificacaoOutros"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Qualificação dos Outros <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(QualificacaoLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
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

            {/* Seção: Jurisdição */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Jurisdição</h3>
              <Separator />
              
              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="juizo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Juízo</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome do juízo" 
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
                  name="vara"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vara</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: 1ª Vara Cível" 
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
                  name="foro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Foro/Comarca</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ex: Foro Central" 
                          {...field}
                          className="focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="tribunal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tribunal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="focus:ring-blue-500">
                            <SelectValue placeholder="Selecione o tribunal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(TribunalLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
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
                          placeholder="URL para consulta" 
                          {...field}
                          className="focus:ring-blue-500"
                          readOnly={!!watchTribunal}
                        />
                      </FormControl>
                      <FormDescription>
                        {watchTribunal ? "Preenchido automaticamente" : "URL para consulta do processo"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção: Detalhes do Processo */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Detalhes do Processo</h3>
              <Separator />
              
              <FormField
                control={form.control}
                name="objeto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objeto</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descrição detalhada do objeto do processo"
                        className="min-h-[100px] focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="valorCausa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Causa</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="R$ 0,00" 
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
                  name="valorCondenacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da Condenação</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="R$ 0,00" 
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
                  name="distribuidoEm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Distribuição</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
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
                name="observacoes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Anotações adicionais sobre o processo"
                        className="min-h-[100px] focus:ring-blue-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Seção: Responsabilidade e Honorários */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Responsabilidade e Honorários</h3>
              <Separator />
              
              <FormField
                control={form.control}
                name="responsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Advogado Responsável <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nome do advogado responsável" 
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
                name="honorarios"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Honorários</FormLabel>
                    <FormDescription>
                      Selecione os tipos de honorários aplicáveis
                    </FormDescription>
                    <div className="space-y-2 mt-2">
                      {Object.entries(HonorariosLabels).map(([value, label]) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(value as any)}
                            onCheckedChange={(checked) => {
                              const current = field.value || []
                              if (checked) {
                                field.onChange([...current, value])
                              } else {
                                field.onChange(current.filter((v) => v !== value))
                              }
                            }}
                          />
                          <label className="text-sm cursor-pointer">{label}</label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Seção: Controle de Acesso */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Controle de Acesso</h3>
              <Separator />
              
              <FormField
                control={form.control}
                name="acesso"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nível de Acesso <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-blue-500">
                          <SelectValue placeholder="Selecione o nível de acesso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(NivelAcessoLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Público: Todos podem ver | Privado: Apenas responsável e admin | Envolvidos: Apenas partes do processo
                    </FormDescription>
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
              {loading ? "Salvando..." : (isEditing ? "Atualizar" : "Cadastrar")}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}