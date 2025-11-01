document.addEventListener("DOMContentLoaded", () => {
  // 🎵 Música de Fundo
  const audio = document.getElementById("bg-music");
  const musicButton = document.getElementById("toggle-music");

  if (audio && musicButton) {
    const syncIcon = () => {
      musicButton.textContent = audio.paused ? "🎵" : "🔇";
    };
    musicButton.addEventListener("click", () => {
      audio.paused ? audio.play().catch(console.error) : audio.pause();
    });
    audio.onplay = syncIcon;
    audio.onpause = syncIcon;
    syncIcon();
  }

  // 🔐 Autenticação
  const tabLogin = document.getElementById("tab-login");
  const tabSignup = document.getElementById("tab-signup");
  const loginPanel = document.getElementById("login-panel");
  const signupPanel = document.getElementById("signup-panel");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");
  const loginMessage = document.getElementById("login-message");
  const signupMessage = document.getElementById("signup-message");
  const loginSection = document.querySelector(".login-section");
  const mainContent = document.querySelector("main");
  const userNameEl = document.getElementById("user-name");

  function activateTab(tab) {
    const isLogin = tab === "login";
    tabLogin.classList.toggle("active", isLogin);
    tabSignup.classList.toggle("active", !isLogin);
    loginPanel.hidden = !isLogin;
    signupPanel.hidden = isLogin;
  }

  tabLogin.addEventListener("click", () => activateTab("login"));
  tabSignup.addEventListener("click", () => activateTab("signup"));

  signupForm.addEventListener("submit", e => {
    e.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirm = document.getElementById("signup-confirm").value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!username || !email || !password || !confirm) {
      signupMessage.textContent = "Preencha todos os campos.";
      signupMessage.style.color = "red";
      return;
    }
    if (!emailRegex.test(email)) {
      signupMessage.textContent = "Email inválido.";
      signupMessage.style.color = "red";
      return;
    }
    if (password !== confirm) {
      signupMessage.textContent = "As senhas não coincidem.";
      signupMessage.style.color = "red";
      return;
    }

    for (let key in localStorage) {
      if (key.startsWith("downdfabyUser-")) {
        const existingUser = JSON.parse(localStorage.getItem(key));
        if (existingUser.email === email) {
          signupMessage.textContent = "Este email já está cadastrado.";
          signupMessage.style.color = "red";
          return;
        }
      }
    }

    const userData = { username, email, password, skin: "padrão", modo: "Battle Royale" };
    localStorage.setItem("downdfabyUser-" + username, JSON.stringify(userData));
    signupMessage.textContent = `Conta criada com sucesso para ${username}!`;
    signupMessage.style.color = "lime";
    activateTab("login");
  });

  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    let foundUser = null;
    for (let key in localStorage) {
      if (key.startsWith("downdfabyUser-")) {
        const user = JSON.parse(localStorage.getItem(key));
        if (user.email === email && user.password === password) {
          foundUser = user;
          break;
        }
      }
    }

    if (foundUser) {
      localStorage.setItem("downdfabySession", foundUser.username);
      showMainContent(foundUser.username);
      mostrarPerfil();
    } else {
      loginMessage.textContent = "Usuário ou senha incorretos.";
      loginMessage.style.color = "red";
    }
  });

  function showMainContent(username) {
    loginSection.style.display = "none";
    mainContent.style.display = "block";
    userNameEl.textContent = `• ${username}`;
  }

  function mostrarPerfil() {
    const currentUser = localStorage.getItem("downdfabySession");
    if (!currentUser) return;
    const userData = JSON.parse(localStorage.getItem("downdfabyUser-" + currentUser));
    if (!userData) return;

    document.getElementById("perfil-nome").textContent = userData.username;
    document.getElementById("perfil-email").textContent = userData.email;
    document.getElementById("perfil-skin").textContent = userData.skin;
    document.getElementById("perfil-modo").textContent = userData.modo;
    document.getElementById("perfil-box").style.display = "block";
  }

  const currentUser = localStorage.getItem("downdfabySession");
  if (currentUser) {
    showMainContent(currentUser);
    mostrarPerfil();
  } else {
    loginSection.style.display = "flex";
    mainContent.style.display = "none";
  }

  // ⚙️ Configurações
  window.salvarConfiguracoes = function () {
    const skin = document.getElementById("skin-select").value;
    const modo = document.getElementById("modo-select").value;
    const currentUser = localStorage.getItem("downdfabySession");
    const userData = JSON.parse(localStorage.getItem("downdfabyUser-" + currentUser));

    userData.skin = skin;
    userData.modo = modo;
    localStorage.setItem("downdfabyUser-" + currentUser, JSON.stringify(userData));
    alert("Configurações salvas!");
    mostrarPerfil();
  };

  // 🎨 Tema persistente
  const THEME_KEY = "df-theme";
  const themeSelect = document.getElementById("theme-switcher");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    if (themeSelect) themeSelect.value = theme;
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme || document.documentElement.getAttribute("data-theme") || "hotdog");

  if (themeSelect) {
    themeSelect.addEventListener("change", e => {
      applyTheme(e.target.value);
    });
  }

  
});

document.getElementById("forgot-password-link").addEventListener("click", () => {
  document.getElementById("login-panel").hidden = true;
  document.getElementById("recover-panel").hidden = false;
});

function voltarLogin() {
  document.getElementById("recover-panel").hidden = true;
  document.getElementById("login-panel").hidden = false;
}
document.getElementById("recover-button").addEventListener("click", () => {
  const email = document.getElementById("recover-email").value.trim();
  const message = document.getElementById("recover-message");

  let foundUser = null;
  for (let key in localStorage) {
    if (key.startsWith("downdfabyUser-")) {
      const user = JSON.parse(localStorage.getItem(key));
      if (user.email === email) {
        foundUser = user;
        break;
      }
    }
  }

  if (foundUser) {
    const token = gerarToken();
    localStorage.setItem("resetToken-" + email, token); // salva token local

    emailjs.send("service_20gdrqc", "template_password_reset", {
      to_email: foundUser.email,
      username: foundUser.username,
      link: `https://downdfaby.com/reset?token=${token}`
    }, "47xCr0mUlBTizaNYO")
    .then(() => {
      message.textContent = "Email de recuperação enviado!";
      message.style.color = "lime";
    })
    .catch(() => {
      message.textContent = "Erro ao enviar email.";
      message.style.color = "red";
    });
  } else {
    message.textContent = "Email não encontrado.";
    message.style.color = "red";
  }
});

function gerarToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

const token = gerarToken();
const resetLink = `https://downdfaby.com/reset?token=${token}`;
emailjs.send("service_20gdrqc", "template_password_reset", {
  to_email: user.email,
  username: user.username,
  link: resetLink
}, "47xCr0mUlBTizaNYO")
.then(() => {
  alert("Email enviado com sucesso!");
})
.catch((error) => {
  console.error("Erro ao enviar email:", error);
});
const loginPanel = document.getElementById("login-panel");
const signupPanel = document.getElementById("signup-panel");
const recoverPanel = document.getElementById("recover-panel");

const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const tabRecover = document.getElementById("tab-recover");
const forgotLink = document.getElementById("forgot-password-link");

function activateTab(tab) {
  loginPanel.hidden = tab !== "login";
  signupPanel.hidden = tab !== "signup";
  recoverPanel.hidden = tab !== "recover";

  tabLogin.classList.toggle("active", tab === "login");
  tabSignup.classList.toggle("active", tab === "signup");
  tabRecover.classList.toggle("active", tab === "recover");
}

tabLogin.addEventListener("click", () => activateTab("login"));
tabSignup.addEventListener("click", () => activateTab("signup"));
tabRecover.addEventListener("click", () => activateTab("recover"));
forgotLink.addEventListener("click", (e) => {
  e.preventDefault();
  activateTab("recover");
});

function mostrarPerfil(user) {
  document.getElementById("perfil-nome").textContent = user.username;
  document.getElementById("perfil-email").textContent = user.email;
  document.getElementById("perfil-skin").textContent = user.skin;
  document.getElementById("perfil-modo").textContent = user.modoFavorito;

  document.querySelector(".login-section").style.display = "none";
  document.getElementById("perfil-box").style.display = "block";
}

window.toggleConfiguracoes = function () {
  const box = document.getElementById("configuracoes");
  box.style.display = box.style.display === "block" ? "none" : "block";
};
