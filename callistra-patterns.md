# 🎨 CALLISTRA PATTERNS
> Padrões visuais obrigatórios para todas as funcionalidades

## 🎯 VISUAL IDENTITY
**Project Name:** Callistra
**Primary Color:** blue-600 (ex: blue-600)
**Personality:** Corporativo/Sério (ambiente jurídico profissional)
**Density:** Balanceada (equilibrar informação/espaço para dados complexos)
**Navigation:** Sidebar fixa
**Feedback Style:** Toast discreto (profissional, não intrusivo)
**Table Style:** Table tradicional (maior densidade para dados jurídicos)

## 📐 LAYOUT TEMPLATES

### Global Layout Structure (OBRIGATÓRIO)
```tsx
// ESTRUTURA GLOBAL - SEMPRE USAR
<div className="flex h-screen bg-background">
  <Sidebar />
  <main className="flex-1 overflow-y-auto">
    <div className="container py-6">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  </main>
</div>
```

### Dashboard Layout
```tsx
// BASEADO NA DENSIDADE BALANCEADA
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/* Stats Cards */}
</div>
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
  <Card className="col-span-4">{/* Main Chart */}</Card>
  <Card className="col-span-3">{/* Side Content */}</Card>
</div>
```

### Form Layout
```tsx
// BASEADO NA PERSONALIDADE CORPORATIVA E DENSIDADE BALANCEADA
<Card className="max-w-2xl mx-auto">
  <CardHeader className="pb-3">
    <CardTitle className="text-xl font-semibold">{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <Form>
      <div className="space-y-4">
        {/* Form fields */}
      </div>
    </Form>
  </CardContent>
  <CardFooter className="flex justify-end gap-3">
    <Button variant="outline">Cancelar</Button>
    <Button type="submit">Salvar</Button>
  </CardFooter>
</Card>
```

### Table Layout
```tsx
// BASEADO NO TABLE STYLE TRADICIONAL (dados jurídicos complexos)
<Card>
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        Adicionar
      </Button>
    </div>
  </CardHeader>
  <CardContent>
    <Table>
      {/* Traditional table implementation para maior densidade de dados */}
      <TableHeader>
        <TableRow>
          {/* Table headers */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* Table rows */}
      </TableBody>
    </Table>
  </CardContent>
</Card>
```

### Modal/Dialog Layout
```tsx
<Dialog>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    <div className="py-4">
      {/* Modal content */}
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>Cancelar</Button>
      <Button onClick={onConfirm}>Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## 🎨 COMPONENT STANDARDS

### Colors (baseado na primary blue-600)
```tsx
// SEMPRE usar essas variações da cor primária: blue-600
primary: "blue-600"           // Botões principais, links ativos
primary-foreground: "white"   // Texto em botões primários  
muted: "blue-50"             // Backgrounds sutis
muted-foreground: "blue-600" // Texto secundário
border: "blue-200"           // Bordas padrão
accent: "blue-100"           // Destaques sutis
ring: "blue-500"             // Focus rings
```

### Spacing Standards (baseado na densidade balanceada)
```tsx
// SPACING BASEADO NA DENSIDADE BALANCEADA

section-spacing: "space-y-6"      // Entre seções
card-padding: "p-6"               // Padding interno cards
form-spacing: "space-y-4"         // Entre campos de form
button-gap: "gap-3"               // Entre botões
header-spacing: "pb-3"            // Header de cards
```

### Typography Hierarchy (baseado na personalidade corporativa)
```tsx
// TYPOGRAPHY BASEADO NA PERSONALIDADE CORPORATIVA

page-title: "text-3xl font-bold tracking-tight"
section-title: "text-xl font-semibold"
card-title: "text-lg font-medium"
description: "text-sm text-muted-foreground"
label: "text-sm font-medium"
body: "text-base"
```

## ⚡ INTERACTION PATTERNS

### Toast Usage (baseado no feedback style discreto)
```tsx
import { toast } from 'sonner'

// Posição: bottom-right, duração menor, menos intrusivo
toast.success("Operação realizada com sucesso!", { 
  duration: 2000,
  position: "bottom-right"
})
toast.error("Erro ao realizar operação.", { 
  duration: 3000,
  position: "bottom-right"
})
```

### Button Patterns
```tsx
// SEMPRE usar primary color blue-600
<Button className="bg-blue-600 hover:bg-blue-700">
  Ação Principal
</Button>

<Button variant="outline">Ação Secundária</Button>

<Button variant="destructive">Ação Destrutiva</Button>

// Loading states OBRIGATÓRIOS
<Button disabled={loading}>
  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {loading ? "Salvando..." : "Salvar"}
</Button>
```

### Form Validation Patterns
```tsx
// PADRÃO OBRIGATÓRIO para TODOS os forms
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm font-medium">
        Nome do Campo {required && <span className="text-red-500">*</span>}
      </FormLabel>
      <FormControl>
        <Input 
          placeholder="Digite aqui..." 
          {...field} 
          className="focus:ring-blue-500"
        />
      </FormControl>
      <FormDescription>
        Texto de ajuda se necessário
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Navigation Patterns
```tsx
// SIDEBAR FIXA - Padrão estabelecido
// Implementar sempre sidebar com:
// - Logo/nome "Callistra" no topo
// - Menu items baseados nos módulos jurídicos
// - Item ativo destacado com blue-600
// - Ícones apropriados para cada funcionalidade jurídica
// - Hover states consistentes
// - Responsive behavior (collapse em mobile se necessário)
```

## ✅ MANDATORY CHECKLIST FOR EVERY COMPONENT

### Visual Consistency
□ Usa primary color blue-600 consistently
□ Segue spacing standards baseados na densidade balanceada (space-y-6, p-6, etc.)
□ Aplica typography hierarchy corporativa (text-3xl font-bold, text-xl font-semibold, etc.)
□ Usa layout template apropriado (Global, Form, Table, Modal)
□ Implementa sidebar navigation corretamente

### Interaction Standards  
□ Toast discreto funcionando (bottom-right, duração 2-3s)
□ Loading states em TODOS os botões/ações
□ Error handling discreto (toast + inline quando apropriado)
□ Disabled states apropriados durante loading
□ Form validation patterns aplicados consistentemente

### Responsive Behavior
□ Mobile-first approach implementado
□ Breakpoints md/lg/xl funcionais
□ Touch targets adequados (mínimo 44px)
□ Sidebar behavior responsivo
□ Table tradicional responsivo (scroll horizontal se necessário)

### Accessibility
□ Keyboard navigation funcional
□ Focus indicators visíveis com blue-600
□ Alt texts em imagens quando aplicável
□ Labels apropriados em todos os form fields
□ Color contrast adequado (WCAG AA)
□ ARIA labels quando necessário

### Performance
□ Imports otimizados (tree shaking)
□ Loading states não bloqueantes
□ Lazy loading quando apropriado
□ Otimização de re-renders

### Jurídico/Corporativo Specific
□ Linguagem formal e profissional em todos os textos
□ Campos obrigatórios claramente marcados (*)
□ Validações rigorosas para dados jurídicos
□ Confirmações para ações críticas (exclusões, alterações de processo)
□ Auditoria visual clara (quem fez, quando fez)
□ Tratamento cuidadoso de dados sensíveis (LGPD compliance)