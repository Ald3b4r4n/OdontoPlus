# OdontoPlus

Site da clínica OdontoPlus com backend em Node.js/Express para envio de emails e integração com WhatsApp.

## Pré-requisitos

- `Node.js >= 14`
- `npm`

## Instalação

```bash
npm install
```

## Desenvolvimento

- Iniciar servidor local:

```bash
npm run dev
```

- Produção/local:

```bash
npm start
```

## Lint

- Configurado com ESLint v9 (flat config):

```bash
npm run lint
```

## Variáveis de Ambiente (`.env`)

- `EMAIL_USER`: usuário do Gmail (email) utilizado para envio.
- `EMAIL_PASS`: senha/app password do Gmail.
- `CLINICA_EMAIL`: email da clínica que recebe contatos.
- `PORT`: porta do servidor (opcional, padrão `3000`).
- `ENABLE_EMAIL_TEST`: defina `true` para habilitar envio de teste apenas em `NODE_ENV=development`.
- `NODE_ENV`: ambiente (`development` ou `production`).

## Rotas Principais

- `GET /` — página inicial.
- `GET /contato` — página de contato.
- `POST /api/contato` — envia email para a clínica e confirmação ao cliente.
- `GET /api/test-email` — envia um email de teste manual (não é chamado automaticamente).
- `POST /api/whatsapp` — gera URL para contato via WhatsApp.

## Deploy (Vercel)

- O projeto contém `vercel.json`. Para evitar disparo de emails de teste em cada execução:
  - Não defina `ENABLE_EMAIL_TEST` em produção (ou defina como `false`).
  - A rota `/api/test-email` deve ser chamada manualmente se necessário.

## Observações

- O envio automático de email de teste na inicialização foi desativado por padrão e só ocorre com `ENABLE_EMAIL_TEST=true` em desenvolvimento.
- Caso ocorra erro de envio, verifique as credenciais do Gmail e se o App Password está habilitado.