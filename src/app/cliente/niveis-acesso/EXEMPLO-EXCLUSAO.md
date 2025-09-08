# Exemplo de Exclusão de Perfis - Níveis de Acesso

## Problema Original
- Não era possível excluir perfis com usuários ativos
- Desativar um perfil não liberava a opção de exclusão
- Não havia transferência automática de usuários

## Solução Implementada

### 1. Novas Regras de Exclusão
- **Perfis Ativos com Usuários**: Não podem ser excluídos diretamente
- **Perfis Inativos**: Podem ser excluídos (usuários já foram transferidos)
- **Perfis sem Usuários**: Podem ser excluídos independente do status

### 2. Transferência Automática de Usuários
Quando um perfil ativo com usuários é desativado:
- Os usuários são automaticamente transferidos para o perfil "Administrador" (ID: "1")
- O contador de usuários do perfil desativado é zerado
- Uma mensagem informa quantos usuários foram transferidos

### 3. Fluxo de Exclusão

#### Cenário 1: Perfil Ativo com Usuários
1. **Desativar primeiro**: O perfil é desativado e usuários transferidos
2. **Depois excluir**: O perfil inativo sem usuários pode ser excluído

#### Cenário 2: Perfil Ativo sem Usuários
1. **Desativar**: Perfil fica inativo
2. **Excluir**: Pode ser excluído imediatamente

#### Cenário 3: Perfil Inativo
1. **Excluir diretamente**: Pode ser excluído se não tiver usuários

### 4. Perfis de Exemplo Incluídos

#### Perfil "Perfil Teste Inativo" (ID: 4)
- **Status**: Inativo
- **Usuários**: 0
- **Ação**: Pode ser excluído diretamente

#### Perfil "Perfil Vazio" (ID: 5)
- **Status**: Ativo
- **Usuários**: 0
- **Ação**: Pode ser desativado e depois excluído

#### Perfis com Usuários (IDs: 1, 2, 3)
- **Status**: Ativos
- **Usuários**: 5, 3, 8 respectivamente
- **Ação**: Devem ser desativados primeiro

### 5. Interface Atualizada

#### Dropdown de Ações
- **Excluir**: Desabilitado para perfis ativos com usuários
- **Excluir**: Habilitado para perfis inativos ou sem usuários

#### Diálogo de Confirmação
- **Mensagem específica**: Explica por que não pode excluir
- **Sugestão**: Orienta a desativar primeiro
- **Botão**: Só aparece quando exclusão é permitida

### 6. Teste do Exemplo

1. **Acesse a página de Níveis de Acesso**
2. **Teste o perfil "Perfil Teste Inativo"**:
   - Clique em "Excluir" → Deve funcionar
3. **Teste o perfil "Perfil Vazio"**:
   - Desative primeiro → Usuários = 0
   - Depois exclua → Deve funcionar
4. **Teste um perfil com usuários**:
   - Tente excluir → Deve ser bloqueado
   - Desative primeiro → Usuários transferidos
   - Depois exclua → Deve funcionar

### 7. Benefícios da Solução

- **Segurança**: Evita perda de acesso de usuários
- **Automatização**: Transferência automática de usuários
- **Flexibilidade**: Permite exclusão após desativação
- **UX**: Interface clara sobre o que pode/não pode ser feito
- **Auditoria**: Rastreamento de transferências de usuários

### 8. Implementação Técnica

#### Hook `useNiveisAcesso`
- **`deleteProfile`**: Validação baseada em status + usuários
- **`toggleProfileStatus`**: Transferência automática de usuários
- **Mock data**: Inclui perfis de teste para demonstração

#### Componente Principal
- **Condições de UI**: Baseadas nas novas regras
- **Mensagens**: Explicativas sobre o processo
- **Estados**: Gerenciamento correto dos diálogos

