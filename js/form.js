// form.js - Gerenciamento de formulários com backend real

// URLs da API (ajuste automático para produção/desenvolvimento)
const API_BASE_URL = window.location.origin;

// Inicializar formulários quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  console.log("🔧 Inicializando formulários...");
  initForms();
  initWhatsAppIntegration();
});

// Gerenciamento de formulários
function initForms() {
  // Formulário de contato principal
  const formContato = document.getElementById("formContato");
  if (formContato) {
    console.log("✅ Formulário de contato encontrado");
    formContato.addEventListener("submit", async function (e) {
      e.preventDefault();
      console.log("📨 Formulário de contato submetido");
      await handleFormSubmit(this);
    });
  } else {
    console.log("❌ Formulário de contato NÃO encontrado");
  }

  // Formulário de newsletter
  const formNewsletter = document.querySelector('form[data-type="newsletter"]');
  if (formNewsletter) {
    formNewsletter.addEventListener("submit", async function (e) {
      e.preventDefault();
      await handleNewsletterSubmit(this);
    });
  }

  // Formulário de agendamento rápido
  const formAgendamento = document.getElementById("formAgendamento");
  if (formAgendamento) {
    formAgendamento.addEventListener("submit", async function (e) {
      e.preventDefault();
      await handleAgendamentoSubmit(this);
    });
  }
}

// Processar formulário de contato
async function handleFormSubmit(form) {
  console.log("🔄 Processando formulário de contato...");

  // Validar formulário
  if (!validateForm(form)) {
    return;
  }

  // Coletar dados do formulário
  const formData = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    telefone: document.getElementById("telefone").value,
    assunto: document.getElementById("assunto").value,
    mensagem: document.getElementById("mensagem").value,
  };

  console.log("📊 Dados coletados:", formData);

  // Mostrar loading
  showLoading(form);

  try {
    console.log("🌐 Enviando para API:", `${API_BASE_URL}/api/contato`);

    const response = await fetch(`${API_BASE_URL}/api/contato`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    console.log("📡 Resposta da API:", response.status);

    const result = await response.json();
    console.log("📨 Resultado:", result);

    if (result.success) {
      showSuccessMessage(result.message);
      form.reset();

      // Tracking do Google Analytics (se configurado)
      if (typeof gtag !== "undefined") {
        gtag("event", "form_submission", {
          event_category: "contato",
          event_label: "formulario_contato",
        });
      }
    } else {
      showErrorMessage(result.message || "Erro ao enviar mensagem.");
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
    showErrorMessage(
      "Erro de conexão. Tente novamente ou entre em contato por telefone."
    );

    // Fallback: enviar por email usando mailto
    showFallbackOption(formData);
  } finally {
    hideLoading(form);
  }
}

// Processar newsletter
async function handleNewsletterSubmit(form) {
  const email = form.querySelector('input[type="email"]').value;

  if (!validateEmail(email)) {
    showErrorMessage("Por favor, insira um email válido.");
    return;
  }

  showLoading(form);

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showSuccessMessage("Inscrito com sucesso! Você receberá nossas novidades.");
    form.reset();
  } catch (error) {
    showErrorMessage("Erro ao realizar inscrição.");
  } finally {
    hideLoading(form);
  }
}

// Processar agendamento rápido
async function handleAgendamentoSubmit(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  if (!data.nome || !data.telefone) {
    showErrorMessage("Por favor, preencha nome e telefone.");
    return;
  }

  showLoading(form);

  try {
    const response = await fetch(`${API_BASE_URL}/api/whatsapp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      window.open(result.whatsappUrl, "_blank");
      showSuccessMessage("Redirecionando para WhatsApp...");
      form.reset();
    } else {
      showErrorMessage("Erro ao processar agendamento.");
    }
  } catch (error) {
    console.error("Erro:", error);
    const mensagem = `Olá! Gostaria de agendar uma consulta.\nNome: ${
      data.nome
    }\nTelefone: ${data.telefone}\nPreferência: ${
      data.preferencia || "Não informada"
    }`;
    window.open(
      `https://wa.me/551134567890?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  } finally {
    hideLoading(form);
  }
}

// Validação de formulário
function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll("[required]");

  console.log("🔍 Validando formulário...");

  // Resetar estilos de erro
  form.querySelectorAll(".form-control").forEach((field) => {
    field.style.borderColor = "#ddd";
  });

  // Validar campos obrigatórios
  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = "#dc3545";
      console.log(`❌ Campo obrigatório vazio: ${field.id}`);
    }
  });

  // Validação específica de email
  const emailField = form.querySelector('input[type="email"]');
  if (emailField && emailField.value && !validateEmail(emailField.value)) {
    isValid = false;
    emailField.style.borderColor = "#dc3545";
    showErrorMessage("Por favor, insira um email válido.");
    emailField.focus();
  }

  if (!isValid) {
    showErrorMessage("Por favor, preencha todos os campos obrigatórios.");
  } else {
    console.log("✅ Formulário validado com sucesso");
  }

  return isValid;
}

// Validação de email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Mostrar loading
function showLoading(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.setAttribute("data-original-text", submitBtn.innerHTML);
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
  }
}

// Esconder loading
function hideLoading(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    const originalText =
      submitBtn.getAttribute("data-original-text") || "Enviar Mensagem";
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

// Fallback para quando a API não estiver disponível
function showFallbackOption(data) {
  const fallbackDiv = document.createElement("div");
  fallbackDiv.className = "fallback-option";
  fallbackDiv.innerHTML = `
    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-top: 15px;">
      <p style="margin: 0 0 10px 0; color: #856404;">
        <i class="fas fa-exclamation-triangle"></i>
        Não foi possível enviar o formulário. 
        <a href="mailto:${
          process.env.CLINICA_EMAIL || "contato@odontoplus.com.br"
        }?subject=Contato Site&body=Nome: ${encodeURIComponent(
    data.nome
  )}%0AEmail: ${encodeURIComponent(
    data.email
  )}%0ATelefone: ${encodeURIComponent(
    data.telefone
  )}%0AAssunto: ${encodeURIComponent(
    data.assunto
  )}%0AMensagem: ${encodeURIComponent(data.mensagem)}" 
          style="color: #007bff; text-decoration: underline;">
          Clique aqui para enviar por email
        </a>
      </p>
    </div>
  `;

  const form = document.getElementById("formContato");
  if (form) {
    form.appendChild(fallbackDiv);

    // Remover após 30 segundos
    setTimeout(() => {
      if (fallbackDiv.parentElement) {
        fallbackDiv.remove();
      }
    }, 30000);
  }
}

// Integração com WhatsApp
function initWhatsAppIntegration() {
  // Botão flutuante do WhatsApp
  const whatsappBtn = document.querySelector(".whatsapp-float");
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const mensagem =
        "Olá! Gostaria de mais informações sobre os tratamentos.";
      window.open(
        `https://wa.me/551134567890?text=${encodeURIComponent(mensagem)}`,
        "_blank"
      );
    });
  }

  // Botões de WhatsApp em outros lugares da página
  document.querySelectorAll("[data-whatsapp]").forEach((btn) => {
    btn.addEventListener("click", function () {
      const service = this.getAttribute("data-service") || "informações";
      const mensagem = `Olá! Gostaria de saber mais sobre ${service}.`;
      window.open(
        `https://wa.me/551134567890?text=${encodeURIComponent(mensagem)}`,
        "_blank"
      );
    });
  });
}

// Sistema de notificações
function showSuccessMessage(message) {
  showNotification(message, "success");
}

function showErrorMessage(message) {
  showNotification(message, "error");
}

function showNotification(message, type) {
  // Remover notificações existentes
  document.querySelectorAll(".notification").forEach((notification) => {
    notification.remove();
  });

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${
      type === "success" ? "check-circle" : "exclamation-circle"
    }"></i>
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">&times;</button>
  `;

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: ${type === "success" ? "#28a745" : "#dc3545"};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Adicionar estilos CSS para animações
const style = document.createElement("style");
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .notification button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    margin-left: 10px;
  }
`;
document.head.appendChild(style);

// Exportar funções para uso global
window.FormHandler = {
  validateForm,
  showSuccessMessage,
  showErrorMessage,
  handleFormSubmit,
};

console.log("✅ form.js carregado com sucesso");
