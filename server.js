const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Servir arquivos estáticos da raiz

// Teste de conexão com email ao iniciar o servidor
async function testEmailConnection() {
  console.log("🧪 Testando conexão com Gmail...");
  console.log("📧 Email User:", process.env.EMAIL_USER);
  console.log(
    "🔑 Email Pass:",
    process.env.EMAIL_PASS ? "Definida" : "Não definida"
  );
  console.log("🏥 Clinica Email:", process.env.CLINICA_EMAIL);

  try {
    const testTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await testTransporter.verify();
    console.log("✅ Conexão com Gmail: OK");

    // Teste de envio
    const testResult = await testTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.CLINICA_EMAIL,
      subject: "Teste de Email - OdontoPlus",
      text: "Este é um email de teste do sistema OdontoPlus.",
    });

    console.log("✅ Email de teste enviado:", testResult.messageId);
    return true;
  } catch (error) {
    console.error("❌ Erro na conexão com Gmail:");
    console.error("Mensagem:", error.message);
    console.error("Código:", error.code);
    return false;
  }
}

// Executar teste ao iniciar (apenas em desenvolvimento e quando habilitado)
if (
  (process.env.NODE_ENV || "development") === "development" &&
  process.env.ENABLE_EMAIL_TEST === "true"
) {
  testEmailConnection();
} else {
  console.log(
    "⏭️ Teste automático de e-mail desativado (habilite com ENABLE_EMAIL_TEST=true em desenvolvimento)."
  );
}

// Rota raiz - servir o index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Rotas para outras páginas HTML
app.get("/sobre", (req, res) => {
  res.sendFile(path.join(__dirname, "sobre.html"));
});

app.get("/servicos", (req, res) => {
  res.sendFile(path.join(__dirname, "servicos.html"));
});

app.get("/equipe", (req, res) => {
  res.sendFile(path.join(__dirname, "equipe.html"));
});

app.get("/blog", (req, res) => {
  res.sendFile(path.join(__dirname, "blog.html"));
});

app.get("/contato", (req, res) => {
  res.sendFile(path.join(__dirname, "contato.html"));
});

// Servir arquivos CSS e JS estáticos
app.use("/css", express.static(path.join(__dirname, "css")));
app.use("/js", express.static(path.join(__dirname, "js")));

// Rota para testar email manualmente
app.get("/api/test-email", async (req, res) => {
  console.log("🧪 Rota de teste de email acionada");

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("📧 Enviando email de teste...");

    const result = await transporter.sendMail({
      from: {
        name: "OdontoPlus Teste",
        address: process.env.EMAIL_USER,
      },
      to: process.env.CLINICA_EMAIL,
      subject: "Teste Manual - OdontoPlus",
      html: `
        <h1>Teste bem-sucedido!</h1>
        <p>O sistema de email está funcionando corretamente.</p>
        <p><strong>Data:</strong> ${new Date().toLocaleString("pt-BR")}</p>
        <p><strong>Ambiente:</strong> ${
          process.env.NODE_ENV || "development"
        }</p>
      `,
    });

    console.log("✅ Email de teste enviado com sucesso:", result.messageId);

    res.json({
      success: true,
      message: "Email de teste enviado com sucesso!",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("❌ Erro ao enviar email de teste:", error.message);

    res.status(500).json({
      success: false,
      message: "Erro ao enviar email de teste",
      error: error.message,
      code: error.code,
    });
  }
});

// Rota para processar formulário de contato
app.post("/api/contato", async (req, res) => {
  console.log("📨 Recebida requisição de contato:", req.body);

  try {
    const { nome, email, telefone, assunto, mensagem } = req.body;

    // Validação básica
    if (!nome || !email || !mensagem) {
      console.log("❌ Campos obrigatórios faltando");
      return res.status(400).json({
        success: false,
        message: "Por favor, preencha todos os campos obrigatórios.",
      });
    }

    console.log("✅ Dados válidos recebidos");
    console.log("📧 Preparando envio para:", email);

    // Configuração do transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    console.log("🔧 Transporter configurado");

    // Configurar email para a clínica
    const mailOptions = {
      from: {
        name: "OdontoPlus Site",
        address: process.env.EMAIL_USER,
      },
      to: process.env.CLINICA_EMAIL,
      subject: `Nova mensagem do site - ${assunto || "Contato"}`,
      html: `
        <h2>Nova mensagem do site OdontoPlus</h2>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${telefone || "Não informado"}</p>
        <p><strong>Assunto:</strong> ${assunto || "Não especificado"}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem}</p>
        <hr>
        <p><em>Enviado em: ${new Date().toLocaleString("pt-BR")}</em></p>
        <p><em>Ambiente: ${process.env.NODE_ENV || "development"}</em></p>
      `,
    };

    console.log("🔄 Tentando enviar email para a clínica...");

    // Enviar email
    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email para clínica enviado:", result.messageId);

    // Email de confirmação para o cliente
    const confirmacaoMail = {
      from: {
        name: "OdontoPlus Clínica",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Confirmação de recebimento - OdontoPlus",
      html: `
        <h2>Olá ${nome}!</h2>
        <p>Recebemos sua mensagem e entraremos em contato em breve.</p>
        <p><strong>Resumo do seu contato:</strong></p>
        <p>Assunto: ${assunto || "Contato"}</p>
        <p>Mensagem: ${mensagem.substring(0, 100)}...</p>
        <hr>
        <p><strong>OdontoPlus Clínica Odontológica</strong></p>
        <p>Telefone: (11) 3456-7890</p>
        <p>Email: contato@odontoplus.com.br</p>
        <p><em>Este é um email automático, por favor não responda.</em></p>
      `,
    };

    console.log("🔄 Enviando email de confirmação...");
    const resultConfirmacao = await transporter.sendMail(confirmacaoMail);
    console.log(
      "✅ Email de confirmação enviado:",
      resultConfirmacao.messageId
    );

    res.json({
      success: true,
      message: "Mensagem enviada com sucesso! Entraremos em contato em breve.",
    });
  } catch (error) {
    console.error("❌ ERRO DETALHADO no formulário de contato:");
    console.error("Mensagem:", error.message);
    console.error("Código:", error.code);
    console.error("Stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Erro ao enviar mensagem. Tente novamente.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Rota para agendamento rápido via WhatsApp
app.post("/api/whatsapp", (req, res) => {
  const { nome, telefone, preferencia } = req.body;

  const mensagemWhatsApp = `Olá! Gostaria de agendar uma consulta.\nNome: ${nome}\nTelefone: ${telefone}\nPreferência: ${preferencia}`;

  res.json({
    success: true,
    whatsappUrl: `https://wa.me/551134567890?text=${encodeURIComponent(
      mensagemWhatsApp
    )}`,
  });
});

// Rota de saúde da API
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    message: "Servidor OdontoPlus está funcionando",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    emailConfigured: !!process.env.EMAIL_USER,
  });
});

// Rota de diagnóstico do sistema
app.get("/api/diagnostic", (req, res) => {
  res.json({
    environment: process.env.NODE_ENV || "development",
    emailUser: process.env.EMAIL_USER ? "Configurado" : "Não configurado",
    emailPass: process.env.EMAIL_PASS ? "Configurado" : "Não configurado",
    clinicaEmail: process.env.CLINICA_EMAIL ? "Configurado" : "Não configurado",
    nodeVersion: process.version,
    platform: process.platform,
    timestamp: new Date().toISOString(),
  });
});

// Rota de fallback para páginas não encontradas
app.get("*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor OdontoPlus rodando na porta ${PORT}`);
  console.log(`🌐 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log(`📧 Email: ${process.env.EMAIL_USER || "Não configurado"}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}`);
});
