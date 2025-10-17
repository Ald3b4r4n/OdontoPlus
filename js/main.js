// main.js - Arquivo principal JavaScript para o site OdontoPlus

// Inicialização quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  initApp();
});

// Inicializar aplicação
function initApp() {
  // Menu Mobile Toggle
  initMobileMenu();

  // Scroll suave para âncoras
  initSmoothScroll();

  // Destacar menu ativo
  highlightActiveMenu();

  // Inicializar máscaras de formulário
  initFormMasks();

  // Inicializar formulários
  initForms();

  // Inicializar animações
  initAnimations();
}

// Menu Mobile
function initMobileMenu() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  // console.log("Inicializando menu mobile...", { navToggle, navMenu });

  if (navToggle && navMenu) {
    // Adicionar múltiplos event listeners para garantir que funcione
    const toggleMenu = () => {
      navMenu.classList.toggle("active");
      // Alterar ícone do toggle
      const icon = navToggle.querySelector("i");
      if (navMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-times");
      } else {
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    };

    // Event listener principal
    navToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleMenu();
    });

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll(".nav-menu a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        const icon = navToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      });
    });

    // Fechar menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
        const icon = navToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  } else {
    // console.error("Elementos do menu não encontrados:", { navToggle, navMenu });
  }
}

// Scroll suave para âncoras
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      // Se for âncora na mesma página (#home, #servicos, etc)
      if (href !== "#" && href.startsWith("#")) {
        e.preventDefault();

        const targetId = href;
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          const headerHeight = document.querySelector("header").offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}

// Destacar menu ativo baseado na página atual
function highlightActiveMenu() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const menuLinks = document.querySelectorAll(".nav-menu a");

  // Remover active de todos os links primeiro
  menuLinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Adicionar active ao link correspondente à página atual
  menuLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");

    // Para a página inicial
    if (
      currentPage === "index.html" &&
      (linkHref === "index.html" || linkHref === "./" || linkHref === "/")
    ) {
      link.classList.add("active");
    }
    // Para outras páginas
    else if (linkHref === currentPage) {
      link.classList.add("active");
    }
    // Para links que são a página atual sem .html
    else if (linkHref === currentPage.replace(".html", "")) {
      link.classList.add("active");
    }
  });
}

// Máscaras para formulários
function initFormMasks() {
  // Máscara para telefone
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  phoneInputs.forEach((input) => {
    input.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");

      // Limitar a 11 dígitos
      if (value.length > 11) {
        value = value.substring(0, 11);
      }

      // Aplicar máscara
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
      } else {
        value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
      }

      e.target.value = value;
    });
  });
}

// Gerenciamento de formulários
function initForms() {
  // Formulário de contato
  const formContato = document.getElementById("formContato");
  if (formContato) {
    formContato.addEventListener("submit", function (e) {
      e.preventDefault();
      handleFormSubmit(
        this,
        "Obrigado pelo seu contato! Entraremos em contato em breve."
      );
    });
  }

  // Formulário de newsletter (se existir)
  const formNewsletter = document.querySelector('form[action*="newsletter"]');
  if (formNewsletter) {
    formNewsletter.addEventListener("submit", function (e) {
      e.preventDefault();
      handleFormSubmit(this, "Obrigado por se cadastrar em nossa newsletter!");
    });
  }
}

// Processar envio de formulários
function handleFormSubmit(form, successMessage) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Validar campos obrigatórios
  if (!validateForm(form)) {
    return;
  }

  // Mostrar loading
  showLoading(form);

  // Simular envio (substituir por AJAX real)
  setTimeout(() => {
    hideLoading(form);
    showSuccessMessage(successMessage);
    form.reset();

    // Redirecionar para WhatsApp se for agendamento
    if (form.id === "formContato" && data.assunto === "agendamento") {
      openWhatsApp("Olá! Gostaria de agendar uma consulta na OdontoPlus.");
    }
  }, 2000);
}

// Validar formulário
function validateForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll("[required]");

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      isValid = false;
      field.style.borderColor = "#dc3545";

      // Remover o estilo de erro quando o usuário começar a digitar
      field.addEventListener("input", function () {
        this.style.borderColor = "#ddd";
      });
    }
  });

  if (!isValid) {
    showErrorMessage("Por favor, preencha todos os campos obrigatórios.");
  }

  return isValid;
}

// Mostrar loading
function showLoading(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
  }
}

// Esconder loading
function hideLoading(form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = "Enviar Mensagem";
    submitBtn.disabled = false;
  }
}

// Mostrar mensagem de sucesso
function showSuccessMessage(message) {
  // Criar elemento de notificação
  const notification = document.createElement("div");
  notification.className = "notification success";
  notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

  // Estilos para a notificação
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #28a745;
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

  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Mostrar mensagem de erro
function showErrorMessage(message) {
  // Criar elemento de notificação
  const notification = document.createElement("div");
  notification.className = "notification error";
  notification.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

  // Estilos para a notificação
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #dc3545;
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

  // Remover automaticamente após 5 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Integração com WhatsApp
function openWhatsApp(message = "Olá! Gostaria de agendar uma consulta.") {
  const phone = "551134567890"; // Substituir pelo número real
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank");
}

// Animações
function initAnimations() {
  // Animação de entrada para elementos
  const animateOnScroll = () => {
    const elements = document.querySelectorAll(
      ".service-card, .team-member, .blog-card"
    );

    elements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const elementVisible = 150;

      if (elementTop < window.innerHeight - elementVisible) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    });
  };

  // Configurar elementos inicialmente
  const animatedElements = document.querySelectorAll(
    ".service-card, .team-member, .blog-card"
  );
  animatedElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(30px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  });

  // Executar na carga inicial
  setTimeout(animateOnScroll, 100);

  // Executar no scroll
  window.addEventListener("scroll", animateOnScroll);
}

// Contador de estatísticas (se houver na página)
function initCounters() {
  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const increment = target / 200;
    let current = 0;

    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.innerText = Math.ceil(current);
        setTimeout(updateCounter, 10);
      } else {
        counter.innerText = target;
      }
    };

    // Iniciar quando o elemento estiver visível
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          updateCounter();
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(counter);
  });
}

// Modal para imagens (se necessário)
function initImageModals() {
  const images = document.querySelectorAll(
    ".service-img img, .member-img img, .blog-img img"
  );

  images.forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", function () {
      // Criar modal
      const modal = document.createElement("div");
      modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                cursor: pointer;
            `;

      const modalImg = document.createElement("img");
      modalImg.src = this.src;
      modalImg.alt = this.alt;
      modalImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
            `;

      modal.appendChild(modalImg);
      document.body.appendChild(modal);

      // Fechar modal ao clicar
      modal.addEventListener("click", function () {
        document.body.removeChild(modal);
      });

      // Fechar com ESC
      document.addEventListener("keydown", function closeModal(e) {
        if (e.key === "Escape") {
          document.body.removeChild(modal);
          document.removeEventListener("keydown", closeModal);
        }
      });
    });
  });
}

// Inicializar componentes quando a página carregar
window.addEventListener("load", function () {
  // Inicializar contadores se existirem
  if (document.querySelector(".counter")) {
    initCounters();
  }

  // Inicializar modais de imagem
  initImageModals();
});

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
    
    /* Melhorar a aparência do scroll suave */
    html {
        scroll-behavior: smooth;
    }
    
    /* Efeito de hover nos cards */
    .service-card, .team-member, .blog-card {
        transition: all 0.3s ease;
    }
    
    .service-card:hover, .team-member:hover, .blog-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
`;
document.head.appendChild(style);

// Exportar funções para uso global (se necessário)
window.OdontoPlus = {
  openWhatsApp,
  showSuccessMessage,
  showErrorMessage,
};
