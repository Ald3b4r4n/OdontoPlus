# 🦷 OdontoPlus - Site Institucional

Site completo para clínica odontológica com sistema de contato integrado, envio de emails automáticos e integração com WhatsApp.

## 📋 Índice
- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API](#-api)
- [Deploy](#-deploy)
- [Desenvolvimento](#-desenvolvimento)
- [Troubleshooting](#-troubleshooting)
- [Licença](#-licença)

## 🎯 Visão Geral

O OdontoPlus é um site institucional completo para clínicas odontológicas, desenvolvido com foco em experiência do usuário e funcionalidades práticas para captação de pacientes.

## ✨ Funcionalidades

### 🎨 Frontend
- **Design Responsivo**: Layout adaptável para desktop, tablet e mobile
- **Navegação Intuitiva**: Menu hamburger com animações suaves
- **Formulários Interativos**: Validação em tempo real e feedback visual
- **Integração WhatsApp**: Botão flutuante para contato direto
- **Animações CSS**: Transições suaves e efeitos modernos

### 🔧 Backend
- **Sistema de Email**: Envio automático para clínica e confirmação para cliente
- **Integração WhatsApp**: Geração de links personalizados
- **API RESTful**: Endpoints bem definidos para integrações
- **Middleware de Segurança**: CORS e validação de dados
- **Logs Detalhados**: Monitoramento completo das operações

### 📧 Sistema de Email
- **Email para Clínica**: Recebe todos os dados do formulário de contato
- **Email de Confirmação**: Confirmação automática para o paciente
- **Teste de Conexão**: Verificação da configuração do SMTP
- **Fallback**: Sistema alternativo caso o email falhe

## 🛠️ Tecnologias

### Frontend
- **HTML5**: Estrutura semântica
- **CSS3**: Estilos responsivos e animações
- **JavaScript**: Interatividade e manipulação DOM
- **Font Awesome**: Ícones profissionais

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **Nodemailer**: Envio de emails
- **CORS**: Middleware de segurança
- **dotenv**: Gerenciamento de variáveis de ambiente

### Ferramentas
- **ESLint**: Linting e qualidade de código
- **Nodemon**: Desenvolvimento com hot-reload
- **Git**: Controle de versão

## 📋 Pré-requisitos

- **Node.js** >= 14.0.0
- **npm** >= 6.0.0
- **Conta Gmail** para envio de emails
- **App Password** habilitado no Gmail

## 🚀 Instalação

1. **Clone o repositório**:
```bash
git clone https://github.com/Ald3b4r4n/OdontoPlus.git
cd OdontoPlus
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure as variáveis de ambiente**:
```bash
cp .env.example .env  # Se existir um arquivo exemplo
# Ou crie manualmente o arquivo .env
```

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto com:

```env
# Configuração do Email
EMAIL_USER=seu.email@gmail.com
EMAIL_PASS=seu_app_password_do_gmail
CLINICA_EMAIL=clinica@odontoplus.com

# Configuração do Servidor
PORT=3000
NODE_ENV=development

# Controle de Testes
ENABLE_EMAIL_TEST=false
```

### Configuração do Gmail

1. **Habilitar Autenticação de 2 Fatores** na sua conta Gmail
2. **Gerar App Password**:
   - Acesse https://myaccount.google.com/security
   - Em "Segurança", procure "Senhas de app"
   - Gere uma nova senha para "Email"
   - Use esta senha no campo `EMAIL_PASS`

## 🎯 Uso

### Desenvolvimento
```bash
npm run dev
```
Acesse: http://localhost:3000

### Produção
```bash
npm start
```

### Linting
```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
OdontoPlus/
├── 📄 index.html          # Página inicial
├── 📄 sobre.html          # Sobre a clínica
├── 📄 servicos.html       # Serviços oferecidos
├── 📄 equipe.html         # Equipe profissional
├── 📄 blog.html           # Blog/Artigos
├── 📄 contato.html        # Página de contato
├── 📂 css/                # Estilos
│   ├── style.css          # Estilos principais
│   └── responsive.css     # Media queries
├── 📂 js/                 # JavaScript
│   ├── main.js            # Funcionalidades gerais
│   └── form.js           # Gerenciamento de formulários
├── 📄 server.js           # Servidor Express
├── 📄 package.json        # Dependências e scripts
├── 📄 .env               # Variáveis de ambiente
├── 📄 eslint.config.js   # Configuração ESLint
└── 📄 vercel.json         # Configuração Vercel
```

## 🔌 API

### Endpoints Principais

#### POST /api/contato
Envia mensagem de contato para a clínica

**Body**:
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 99999-9999",
  "assunto": "Consulta de avaliação",
  "mensagem": "Gostaria de agendar uma consulta"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Mensagem enviada com sucesso!"
}
```

#### GET /api/test-email
Testa a configuração do email (requer autenticação)

**Response**:
```json
{
  "success": true,
  "message": "Email de teste enviado com sucesso!"
}
```

#### POST /api/whatsapp
Gera link personalizado para WhatsApp

**Body**:
```json
{
  "nome": "João Silva",
  "telefone": "11999999999",
  "preferencia": "Manhã"
}
```

**Response**:
```json
{
  "success": true,
  "whatsappUrl": "https://wa.me/551134567890?text=Olá..."
}
```

### Endpoints de Sistema

- `GET /api/health` - Status do servidor
- `GET /api/diagnostic` - Informações de diagnóstico
- `GET *` - Fallback para SPA (serve index.html)

## 🚀 Deploy

### Vercel (Recomendado)

1. **Conecte seu repositório** no Vercel
2. **Configure as variáveis de ambiente** no painel do Vercel
3. **Deploy automático** a cada push na main

**Configuração Vercel** (`vercel.json`):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    },
    {
      "src": "**/*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

### Variáveis de Ambiente no Vercel

- `EMAIL_USER`: Seu email Gmail
- `EMAIL_PASS`: App password do Gmail
- `CLINICA_EMAIL`: Email da clínica
- `NODE_ENV`: production

**Importante**: Não defina `ENABLE_EMAIL_TEST` em produção

## 💻 Desenvolvimento

### Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento com hot-reload
npm start        # Produção
npm run lint     # Verificação de código
```

### Estrutura de Desenvolvimento

1. **HTML**: Páginas estáticas na raiz
2. **CSS**: Estilos em `/css`
3. **JavaScript**: Lógica em `/js`
4. **Backend**: `server.js` com Express

### Convenções de Código

- **ESLint**: Configurado com regras de qualidade
- **Indentação**: 2 espaços
- **Strings**: Aspas simples
- **Semicolons**: Obrigatórios
- **Console**: Permitido apenas para desenvolvimento

## 🐛 Troubleshooting

### Problemas Comuns

#### Emails não são enviados
1. Verifique as credenciais do Gmail
2. Confirme se o App Password está correto
3. Verifique se a autenticação de 2 fatores está ativa

#### Erro de CORS
1. O middleware CORS já está configurado
2. Verifique se o frontend está na mesma origem

#### Porta já em uso
```bash
# Verifique processos na porta 3000
netstat -ano | findstr :3000

# Ou use outra porta
PORT=3001 npm run dev
```

### Logs de Depuração

O servidor fornece logs detalhados:
- Conexões de email
- Envios bem-sucedidos
- Erros detalhados
- Status das requisições

## 📧 Configuração de Email

### SMTP Gmail
- **Host**: smtp.gmail.com
- **Port**: 587
- **Secure**: false
- **Auth**: Requerida
- **TLS**: Habilitado

### Fluxo de Email

1. Cliente preenche formulário
2. Sistema valida os dados
3. Email é enviado para a clínica
4. Confirmação é enviada para o cliente
5. Fallback para WhatsApp se necessário

## 🔒 Segurança

### Medidas Implementadas

- **CORS**: Configurado para permitir requisições
- **Validação**: Todos os campos são validados
- **Sanitização**: Dados são sanitizados antes do processamento
- **Env Vars**: Credenciais protegidas por variáveis de ambiente

### Boas Práticas

1. **Nunca comite** o arquivo `.env`
2. **Use App Passwords** no lugar de senhas reais
3. **Mantenha as dependências** atualizadas
4. **Monitore os logs** regularmente

## 📊 Monitoramento

### Métricas Disponíveis

- Status do servidor (`/api/health`)
- Diagnóstico do sistema (`/api/diagnostic`)
- Logs de email em tempo real
- Estatísticas de uso

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### Guidelines

- Siga as convenções de código existentes
- Adicione testes quando possível
- Atualize a documentação
- Verifique o lint antes de commitar

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 🆘 Suporte

Para dúvidas e suporte:
- Abra uma issue no GitHub
- Consulte a documentação das tecnologias
- Verifique a seção de Troubleshooting

---

Desenvolvido com ❤️ para clínicas odontológicas