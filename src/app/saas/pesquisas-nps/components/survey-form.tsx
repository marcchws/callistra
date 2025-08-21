"use client"

import { useState, useEffect } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Survey, SurveySchema, Question, QuestionType, SurveyPeriodicity, SurveyStatus, UserProfile, User } from "../types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Trash2, ChevronUp, ChevronDown, Check, ChevronsUpDown, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SurveyFormProps {
  survey?: Survey
  profiles: UserProfile[]
  users: User[]
  onSubmit: (data: Survey) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function SurveyForm({ survey, profiles, users, onSubmit, onCancel, loading }: SurveyFormProps) {
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>(survey?.targetProfiles || [])
  const [selectedUsers, setSelectedUsers] = useState<string[]>(survey?.targetUsers || [])
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [openUserSelect, setOpenUserSelect] = useState(false)

  const form = useForm<Survey>({
    resolver: zodResolver(SurveySchema),
    defaultValues: survey || {
      name: "",
      questions: [{
        id: String(Date.now()),
        text: "",
        type: QuestionType.MULTIPLE_CHOICE,
        options: [""],
        required: true,
        order: 1
      }],
      periodicity: SurveyPeriodicity.ONCE,
      targetProfiles: [],
      targetUsers: [],
      startDate: new Date().toISOString().split('T')[0],
      status: SurveyStatus.DRAFT
    }
  })

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion, move: moveQuestion } = useFieldArray({
    control: form.control,
    name: "questions"
  })

  const watchPeriodicity = form.watch("periodicity")

  // Filter users based on selected profiles
  const filteredUsers = users.filter(user => 
    selectedProfiles.length === 0 || selectedProfiles.includes(user.profile)
  )

  // Filter users based on search
  const searchedUsers = filteredUsers.filter(user =>
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  )

  const handleSubmit = async (data: Survey) => {
    const submissionData = {
      ...data,
      targetProfiles: selectedProfiles,
      targetUsers: selectedUsers
    }
    await onSubmit(submissionData)
  }

  const addQuestion = () => {
    appendQuestion({
      id: String(Date.now()),
      text: "",
      type: QuestionType.MULTIPLE_CHOICE,
      options: [""],
      required: true,
      order: questionFields.length + 1
    })
  }

  const addOption = (questionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || []
    form.setValue(`questions.${questionIndex}.options`, [...currentOptions, ""])
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions = form.getValues(`questions.${questionIndex}.options`) || []
    form.setValue(
      `questions.${questionIndex}.options`, 
      currentOptions.filter((_, idx) => idx !== optionIndex)
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Informações da Pesquisa</CardTitle>
            <CardDescription>Configure os dados básicos da pesquisa NPS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Pesquisa <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Pesquisa de Satisfação Q1 2025" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Término</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>Opcional - deixe em branco para pesquisa sem prazo</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="periodicity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Periodicidade <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a periodicidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={SurveyPeriodicity.ONCE}>Resposta única</SelectItem>
                      <SelectItem value={SurveyPeriodicity.RECURRING}>Recorrente (a cada X meses)</SelectItem>
                      <SelectItem value={SurveyPeriodicity.ON_LOGIN}>Sempre após login</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchPeriodicity === SurveyPeriodicity.RECURRING && (
              <FormField
                control={form.control}
                name="recurringMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repetir a cada quantos meses? <span className="text-red-500">*</span></FormLabel>
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
                    <FormDescription>Entre 1 e 12 meses</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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
                      <SelectItem value={SurveyStatus.DRAFT}>Rascunho</SelectItem>
                      <SelectItem value={SurveyStatus.ACTIVE}>Ativa</SelectItem>
                      <SelectItem value={SurveyStatus.INACTIVE}>Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Pesquisas ativas serão enviadas automaticamente</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Perguntas */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Perguntas</CardTitle>
                <CardDescription>Configure as perguntas da pesquisa</CardDescription>
              </div>
              <Button type="button" onClick={addQuestion} className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Pergunta
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questionFields.map((question, questionIndex) => (
                <Card key={question.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => questionIndex > 0 && moveQuestion(questionIndex, questionIndex - 1)}
                            disabled={questionIndex === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => questionIndex < questionFields.length - 1 && moveQuestion(questionIndex, questionIndex + 1)}
                            disabled={questionIndex === questionFields.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="text-sm font-medium">Pergunta {questionIndex + 1}</span>
                      </div>
                      {questionFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(questionIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`questions.${questionIndex}.text`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto da Pergunta <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Digite a pergunta..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Pergunta</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={QuestionType.MULTIPLE_CHOICE}>Múltipla Escolha</SelectItem>
                                <SelectItem value={QuestionType.TEXT}>Discursiva</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`questions.${questionIndex}.required`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-8">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Resposta obrigatória
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>

                    {form.watch(`questions.${questionIndex}.type`) === QuestionType.MULTIPLE_CHOICE && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Opções de Resposta</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(questionIndex)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Adicionar Opção
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(form.watch(`questions.${questionIndex}.options`) || []).map((_, optionIndex) => (
                            <div key={optionIndex} className="flex gap-2">
                              <Input
                                placeholder={`Opção ${optionIndex + 1}`}
                                value={form.watch(`questions.${questionIndex}.options.${optionIndex}`)}
                                onChange={(e) => {
                                  const currentOptions = form.getValues(`questions.${questionIndex}.options`) || []
                                  currentOptions[optionIndex] = e.target.value
                                  form.setValue(`questions.${questionIndex}.options`, currentOptions)
                                }}
                              />
                              {(form.watch(`questions.${questionIndex}.options`)?.length || 0) > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(questionIndex, optionIndex)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Destinatários */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl font-semibold">Destinatários</CardTitle>
            <CardDescription>Selecione os perfis e usuários que receberão a pesquisa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Seleção de Perfis */}
            <div className="space-y-3">
              <Label>Perfis de Usuário <span className="text-red-500">*</span></Label>
              <div className="space-y-2">
                {profiles.map((profile) => (
                  <div key={profile.id} className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedProfiles.includes(profile.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedProfiles([...selectedProfiles, profile.id])
                        } else {
                          setSelectedProfiles(selectedProfiles.filter(p => p !== profile.id))
                        }
                      }}
                    />
                    <div className="flex-1">
                      <Label className="font-normal cursor-pointer">
                        {profile.name}
                      </Label>
                      {profile.description && (
                        <p className="text-sm text-muted-foreground">{profile.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {selectedProfiles.length === 0 && (
                <p className="text-sm text-red-500">Selecione pelo menos um perfil</p>
              )}
            </div>

            {/* Seleção de Usuários Específicos */}
            <div className="space-y-3">
              <Label>Usuários Específicos (Opcional)</Label>
              <Popover open={openUserSelect} onOpenChange={setOpenUserSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openUserSelect}
                    className="w-full justify-between"
                  >
                    {selectedUsers.length > 0
                      ? `${selectedUsers.length} usuário(s) selecionado(s)`
                      : "Buscar e selecionar usuários..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Buscar usuário..." 
                      value={userSearchQuery}
                      onValueChange={setUserSearchQuery}
                    />
                    <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-72">
                        {searchedUsers.map((user) => (
                          <CommandItem
                            key={user.id}
                            onSelect={() => {
                              if (selectedUsers.includes(user.id)) {
                                setSelectedUsers(selectedUsers.filter(u => u !== user.id))
                              } else {
                                setSelectedUsers([...selectedUsers, user.id])
                              }
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUsers.includes(user.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex-1">
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                            <Badge variant="outline">
                              {profiles.find(p => p.id === user.profile)?.name}
                            </Badge>
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map(userId => {
                    const user = users.find(u => u.id === userId)
                    return user ? (
                      <Badge key={userId} variant="secondary">
                        {user.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-2"
                          onClick={() => setSelectedUsers(selectedUsers.filter(u => u !== userId))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading || selectedProfiles.length === 0}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Salvando..." : survey ? "Atualizar Pesquisa" : "Criar Pesquisa"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
