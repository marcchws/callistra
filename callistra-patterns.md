# 🎨 CALLISTRA PATTERNS
> Padrões visuais obrigatórios para todas as funcionalidades

## 🎯 VISUAL IDENTITY
**Primary Color:** slate-600
**Personality:** Profissional/Advocacia (clássico, conservador, confiável)
**Density:** Balanceada (equilíbrio info/espaço)
**Navigation Style:** Sidebar fixa (menu lateral sempre visível)
**Feedback Style:** Toast discreto (canto da tela, menos intrusivo)
**Table Style:** Table tradicional (mais densidade, funcional)

## 📐 LAYOUT TEMPLATES

### Page Structure Standard
```tsx
// PADRÃO OBRIGATÓRIO PARA TODAS AS PÁGINAS
<div className="min-h-screen bg-background">
  {/* Sidebar Navigation Pattern */}
  <div className="flex">
    <aside className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold text-slate-700">Callistra</h2>
      </div>
      <nav className="p-4">
        {/* Navigation items */}
      </nav>
    </aside>
    
    {/* Main Content Pattern */}
    <main className="flex-1">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-6">
          <div className="flex items-center gap-4">
            {/* Breadcrumbs always visible */}
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              {/* Breadcrumb items */}
            </nav>
          </div>
        </div>
      </header>
      
      <div className="container py-6">
        <div className="space-y-6">
          {/* Page Title Pattern */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          {/* Content Area */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  </div>
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
// BASEADO NA PERSONALIDADE PROFISSIONAL
<Card className="max-w-2xl mx-auto">
  <CardHeader className="pb-6">
    <CardTitle className="text-xl font-semibold text-slate-800">{title}</CardTitle>
    <CardDescription className="text-slate-600">{description}</CardDescription>
  </CardHeader>
  <CardContent className="p-6">
    <Form>
      <div className="space-y-4">
        {/* Form fields */}
      </div>
    </Form>
  </CardContent>
  <CardFooter className="flex justify-end gap-3 pt-6">
    <Button variant="outline">Cancelar</Button>
    <Button type="submit">Salvar</Button>
  </CardFooter>
</Card>
```

### Table Layout
```tsx
// BASEADO NO TABLE STYLE TRADICIONAL
<Card>
  <CardHeader className="pb-3">
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-xl font-semibold text-slate-800">{title}</CardTitle>
        <CardDescription className="text-slate-600">{description}</CardDescription>
      </div>
      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        Adicionar
      </Button>
    </div>
  </CardHeader>
  <CardContent>
    <Table>
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
  <DialogContent className="sm:max-w-[525px]">
    <DialogHeader>
      <DialogTitle className="text-xl font-semibold text-slate-800">{title}</DialogTitle>
      <DialogDescription className="text-slate-600">{description}</DialogDescription>
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

### Colors (baseado na primary slate-600)
```tsx
// SEMPRE usar essas variações da cor primária
primary: "slate-600"             // Botões principais, links ativos
primary-foreground: "white"      // Texto em botões primários  
muted: "slate-50"               // Backgrounds sutis
muted-foreground: "slate-600"    // Texto secundário
border: "slate-200"             // Bordas padrão
accent: "slate-100"             // Destaques sutis
text-primary: "slate-800"       // Títulos principais
text-secondary: "slate-600"     // Textos secundários
```

### Spacing Standards (baseado na densidade balanceada)
```tsx
// BASEADO NA DENSIDADE BALANCEADA
section-spacing: "space-y-6"      // Entre seções
card-padding: "p-6"               // Padding interno cards
form-spacing: "space-y-4"         // Entre campos de form
button-gap: "gap-3"               // Entre botões
header-spacing: "pb-6"            // Spacing em headers
content-spacing: "py-6"           // Padding vertical em content
```

### Typography Hierarchy (baseado na personalidade profissional)
```tsx
// BASEADO NA PERSONALIDADE PROFISSIONAL/ADVOCACIA
page-title: "text-3xl font-bold tracking-tight text-slate-800"
section-title: "text-xl font-semibold text-slate-800"
card-title: "text-lg font-medium text-slate-800"
subsection-title: "text-base font-medium text-slate-700"
description: "text-sm text-slate-600"
label: "text-sm font-medium text-slate-700"
help-text: "text-xs text-slate-500"
```

## ⚡ INTERACTION PATTERNS

### Toast Usage (baseado no feedback style discreto)
```tsx
import { toast } from 'sonner'

// Toast Discreto - Posição: bottom-right, duração menor
toast.success("Ação realizada com sucesso!", { duration: 2000 })
toast.error("Erro ao realizar ação", { duration: 3000 })
toast.warning("Atenção: verifique os dados", { duration: 2500 })
toast.info("Informação importante", { duration: 2000 })
```

### Button Patterns
```tsx
// Primary actions (usando primary color)
<Button className="bg-slate-600 hover:bg-slate-700">Salvar</Button>

// Secondary actions  
<Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">Cancelar</Button>

// Destructive actions
<Button variant="destructive">Excluir</Button>

// Loading states
<Button disabled={loading} className="bg-slate-600 hover:bg-slate-700">
  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {loading ? "Salvando..." : "Salvar"}
</Button>
```

### Form Validation Patterns
```tsx
// PADRÃO OBRIGATÓRIO para forms
<FormField
  control={form.control}
  name="field"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="text-sm font-medium text-slate-700">Campo obrigatório *</FormLabel>
      <FormControl>
        <Input 
          placeholder="Digite aqui..." 
          className="border-slate-300 focus:border-slate-500 focus:ring-slate-500" 
          {...field} 
        />
      </FormControl>
      <FormDescription className="text-xs text-slate-500">Texto de ajuda se necessário</FormDescription>
      <FormMessage className="text-xs text-red-600" />
    </FormItem>
  )}
/>
```

### Navigation Patterns (baseado no navigation style sidebar)
```tsx
// Sidebar Navigation Pattern
<nav className="p-4 space-y-2">
  <div className="space-y-1">
    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Gestão</h3>
    <Button 
      variant="ghost" 
      className="w-full justify-start text-slate-700 hover:bg-slate-100"
    >
      <Icon className="mr-2 h-4 w-4" />
      Menu Item
    </Button>
  </div>
</nav>

// Breadcrumb sempre visível
<nav className="flex items-center space-x-2 text-sm text-slate-500">
  <span>Dashboard</span>
  <ChevronRight className="h-4 w-4" />
  <span>Processos</span>
  <ChevronRight className="h-4 w-4" />
  <span className="text-slate-800 font-medium">Novo Processo</span>
</nav>
```

### Table Patterns (baseado no table style tradicional)
```tsx
// Table tradicional com alta densidade de informação
<Table>
  <TableHeader>
    <TableRow className="border-slate-200">
      <TableHead className="text-slate-700 font-medium">Coluna</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="border-slate-200 hover:bg-slate-50">
      <TableCell className="text-slate-800">Dados</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## ✅ MANDATORY CHECKLIST FOR EVERY COMPONENT

```
### Visual Consistency
□ Usa primary color slate-600
□ Segue spacing standards balanceados (space-y-6, p-6, etc.)
□ Aplica typography hierarchy profissional (text-3xl font-bold para títulos)
□ Usa layout template com sidebar fixa
□ Implementa breadcrumbs sempre visíveis

### Interaction Standards  
□ Toast discreto funcionando (bottom-right, 2-3s duration)
□ Loading states em botões/ações
□ Error handling com FormMessage
□ Disabled states com slate-400
□ Form validation patterns aplicados

### Color Compliance
□ Títulos em slate-800
□ Textos secundários em slate-600  
□ Backgrounds sutis em slate-50
□ Bordas em slate-200
□ Estados hover/focus apropriados

### Navigation & Layout
□ Sidebar navigation implementada
□ Breadcrumbs funcionais
□ Table tradicional para listagens
□ Cards para formulários e detalhes
□ Headers consistentes em todas as páginas

### Professional Standards
□ Typography hierarchy respeitada
□ Espaçamentos balanceados aplicados
□ Densidade de informação adequada
□ Feedback discreto e profissional
□ Interface clássica e conservadora
```