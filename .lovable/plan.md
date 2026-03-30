
# Plano de Implementacao — Chatbot IA + Admin + Stripe

## Visao Geral

Tres grandes funcionalidades a serem implementadas em etapas:

1. **Chatbot de IA** — Widget flutuante no site que apresenta servicos e, quando o cliente escolher, envia notificacao para a empresa
2. **Painel Admin** — Area restrita para admins visualizarem orcamentos, projetos e conversas dos clientes
3. **Stripe** — Planos de assinatura com webhooks para atualizar status

---

## Etapa 1: Chatbot de IA

### Banco de Dados
Nova tabela `chat_messages`:
- `id` (uuid PK)
- `user_id` (uuid, nullable — visitantes anonimos podem usar)
- `session_id` (text NOT NULL — identificador de sessao do chat)
- `role` (text — 'user' ou 'assistant')
- `content` (text NOT NULL)
- `created_at` (timestamptz)

Nova tabela `contact_requests` (quando cliente escolhe um servico):
- `id` (uuid PK)
- `session_id` (text)
- `user_id` (uuid, nullable)
- `service_type` (text NOT NULL)
- `customer_name` (text)
- `customer_phone` (text)
- `customer_email` (text)
- `message` (text)
- `status` (text default 'pending')
- `company_phone` (text) — numero da empresa para onde enviar
- `created_at` (timestamptz)

RLS: chat_messages e contact_requests acessiveis por authenticated (e anon para INSERT no chat).

### Edge Function: `chat`
- Recebe `messages` (historico) e `session_id`
- Usa o Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`) com `LOVABLE_API_KEY` (ja configurado)
- System prompt personalizado apresentando os 4 servicos da VincereTech
- Quando o modelo detectar que o cliente escolheu um servico, orienta a coletar nome e contato
- Streaming via SSE para resposta em tempo real
- Modelo: `google/gemini-3-flash-preview`

### Frontend: Widget Flutuante
- Componente `ChatWidget.tsx` — botao flutuante no canto inferior direito
- Ao clicar, abre painel de chat com historico de mensagens
- Streaming token-a-token com visual de "digitando"
- Quando o cliente confirmar servico + dados de contato, salva em `contact_requests`
- Placeholder para numero da empresa (configuravel depois)
- Adicionado em `Index.tsx` e potencialmente em todas as paginas

### config.toml
```text
[functions.chat]
verify_jwt = false
```

---

## Etapa 2: Painel Admin

### Banco de Dados
Nova tabela `user_roles` (seguindo as melhores praticas de seguranca):
- `id` (uuid PK)
- `user_id` (uuid FK auth.users, NOT NULL, UNIQUE com role)
- `role` (app_role enum: 'admin', 'moderator', 'user')

Funcao `has_role(uuid, app_role)` — SECURITY DEFINER para verificar roles sem recursao RLS.

Novas politicas RLS:
- Admins podem ver TODOS os orcamentos, projetos, contact_requests e chat_messages
- Politicas adicionais nas tabelas existentes: `SELECT FOR admin USING (has_role(auth.uid(), 'admin'))`

### Frontend: `/admin`
- Nova pagina `src/pages/Admin.tsx`
- Rota protegida que verifica role admin via `has_role`
- Abas:
  - **Orcamentos** — Lista todos os orcamentos de todos os usuarios com filtros por status
  - **Projetos** — Lista todos os projetos com opcao de alterar status
  - **Solicitacoes de Contato** — Lista contact_requests vindos do chatbot
  - **Conversas** — Visualizar historico de chat dos clientes
- Cada item mostra nome do cliente (join com profiles)
- Botao no Navbar visivel apenas para admins

### Hook `useIsAdmin`
- Consulta `user_roles` para verificar se usuario logado e admin
- Usado no Navbar e no ProtectedRoute do admin

---

## Etapa 3: Stripe

### Abordagem
- Habilitar Stripe via ferramenta integrada do Lovable
- Apos habilitado, implementar:
  - Edge Function `create-checkout` para criar sessoes de checkout
  - Edge Function `stripe-webhook` para processar eventos
  - Tabela `subscriptions` para rastrear status
  - Pagina de precos/planos no site

**Nota:** Esta etapa sera detalhada apos habilitar o Stripe, pois novas ferramentas e contexto ficarao disponiveis.

---

## Arquivos a Criar/Editar

| Acao   | Arquivo |
|--------|---------|
| SQL    | Migracao: chat_messages + contact_requests + user_roles + has_role + RLS |
| Criar  | `supabase/functions/chat/index.ts` |
| Criar  | `src/components/ChatWidget.tsx` |
| Criar  | `src/pages/Admin.tsx` |
| Criar  | `src/hooks/useIsAdmin.ts` |
| Editar | `supabase/config.toml` (adicionar funcao chat) |
| Editar | `src/App.tsx` (rota /admin) |
| Editar | `src/components/Navbar.tsx` (link admin condicional) |
| Editar | `src/pages/Index.tsx` (adicionar ChatWidget) |

---

## Ordem de Implementacao

1. Migracao SQL (todas as tabelas novas + roles + RLS)
2. Edge Function `chat` com Lovable AI Gateway
3. Componente ChatWidget + integracao no site
4. Hook useIsAdmin + pagina Admin
5. Atualizar Navbar e rotas
6. Habilitar e configurar Stripe (etapa separada)

---

## Detalhes Tecnicos

- O `LOVABLE_API_KEY` ja esta configurado como secret do Supabase — nenhuma configuracao adicional necessaria para IA
- O numero da empresa para notificacoes sera armazenado como variavel configuravel (pode ser adicionado depois como secret ou na tabela de configuracao)
- Roles sao armazenados em tabela separada (`user_roles`), nunca na tabela profiles, para prevenir ataques de escalacao de privilegios
- A funcao `has_role` usa SECURITY DEFINER para evitar problemas de recursao com RLS
- O primeiro admin precisara ser inserido manualmente via SQL Editor do Supabase
