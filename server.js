const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // Servir arquivos estáticos

// Teste de conexão com email ao iniciar o servidor
console.log("🧪 Testando conexão com Gmail...");
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

testTransporter.verify(function (error, success) {
  if (error) {
    console.log("❌ FALHA NA CONEXÃO COM GMAIL:");
    console.log("Erro:", error.message);
    console.log("Código:", error.code);
    console.log("Detalhes completos:", error);
  } else {
    console.log("✅ Conexão com Gmail estabelecida com sucesso!");
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
    console.log("📧 Preparando para enviar email...");

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
    console.error("❌ ERRO DETALHADO:");
    console.error("Mensagem:", error.message);
    console.error("Código:", error.code);
    console.error("Stack:", error.stack);

    res.status(500).json({
      success: false,
      message: "Erro ao enviar mensagem. Tente novamente.",
    });
  }
});

// Rota para agendamento rápido via WhatsApp
app.post("/api/whatsapp", (req, res) => {
  const { nome, telefone, preferencia } = req.body;

  // Aqui você pode salvar no banco de dados ou enviar email
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
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📧 Email configurado: ${process.env.EMAIL_USER}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});
