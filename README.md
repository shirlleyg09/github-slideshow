# Pulsari Desk

Central inteligente de chamados e suporte técnico da Agência Pulsari.

## Stack

- Next.js + React + TypeScript
- Tailwind CSS, componentes internos no padrão shadcn/ui e Lucide Icons
- Prisma ORM + PostgreSQL
- Auth.js/NextAuth com login por credenciais
- Upload local preparado para evolução futura para storage externo

## Como rodar localmente

1. Instale as dependências:

```bash
npm install
```

2. Copie as variáveis de ambiente:

```bash
cp .env.example .env
```

3. Suba um PostgreSQL local e ajuste `DATABASE_URL` no `.env`.

4. Execute migration e seed:

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

5. Rode a aplicação:

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Usuários seed

Todos usam a senha local `Pulsari@123`.

- Admin Pulsari: `admin@pulsari.com.br`
- Técnico Pulsari: `tecnico@pulsari.com.br`
- Cliente exemplo: `cliente@empresa.com.br`

## Módulos implementados no MVP inicial

- Login protegido por Auth.js.
- Layout base responsivo com sidebar, topbar, light/dark mode e identidade Pulsari.
- Schema Prisma completo para clientes, sistemas, chamados, comentários, anexos, histórico, planos, contratos, saldo, extrato de horas, base de conhecimento, notificações e auditoria.
- Seed com usuários, planos, cliente NP Assessoria, sistemas e chamados fictícios.
- Dashboard da equipe com indicadores e resumo por status.
- Clientes com cadastro, listagem e detalhe.
- Sistemas vinculados com cadastro e cards.
- Chamados em lista, detalhe, comentários públicos/internos, alteração de status/prioridade e registro de horas.
- Kanban por status.
- Planos de suporte.
- Banco de horas com saldos, alertas e extrato.
- Relatório mensal simples por cliente com estrutura para exportação.
- Área do cliente com dashboard, abertura de chamado em linguagem simples, chamados, sistemas e horas.

## Próximas etapas preparadas

- Upload real de anexos em storage externo.
- Regras avançadas de SLA e permissões por rota.
- Exportação PDF/Excel.
- Notificações por e-mail/WhatsApp.
- API pública para abertura de chamados por sistemas Pulsari.
- Evolução futura para SaaS comercial multiempresa.

## Fluxo recomendado agora

1. Resolver acesso ao registry npm do ambiente e rodar `npm install` para gerar um `package-lock.json` atualizado.
2. Executar `npx prisma generate` e `npx prisma migrate dev --name init` contra um PostgreSQL local.
3. Rodar `npm run prisma:seed` e entrar com `admin@pulsari.com.br` / `Pulsari@123`.
4. Validar manualmente os fluxos críticos: abrir chamado como cliente, responder como equipe, adicionar nota interna, mudar status e registrar horas.
5. Na próxima iteração, priorizar upload real de anexos, CRUD completo de planos/usuários/base de conhecimento e testes automatizados.

## Regras de segurança já cobertas no MVP inicial

- Rotas da equipe exigem perfil `ADMIN` ou `TECHNICIAN`.
- Rotas do cliente exigem perfil `CLIENT_MANAGER` ou `CLIENT_USER` com `companyId`.
- Server actions validam escopo da empresa antes de criar chamados, comentar ou registrar horas.
- Comentários internos só podem ser criados pela equipe Pulsari e não são carregados na tela de detalhe do cliente.
- Cliente inativo, suspenso ou inexistente não pode abrir novo chamado.
- Registro descontável não permite saldo negativo; quando não houver saldo, a atuação deve ser lançada como hora extra ou passar por aprovação.
