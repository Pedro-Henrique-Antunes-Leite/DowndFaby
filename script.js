// 🎵 Música de fundo
const audio = document.getElementById("bg-music");
const musicButton = document.getElementById("toggle-music");
let isPlaying = false;

musicButton.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
    musicButton.textContent = "🎵";
  } else {
    audio.play();
    musicButton.textContent = "🔇";
  }
  isPlaying = !isPlaying;
});

// 🧃 Modos de Jogo
const gameModes = [
  {
    title: "Battle Royale Clássico",
    description: "100 jogadores, 1 vencedor. Sobreviva na arena de hotdogs!",
    icon: "🏆",
    color: "#06b6d4"
  },
  {
    title: "Modo Equipes",
    description: "Forme esquadrões de 4 e domine o campo de batalha",
    icon: "👥",
    color: "#ec4899"
  },
  {
    title: "Arena Relâmpago",
    description: "Partidas rápidas de 10 minutos com ação intensa",
    icon: "⚡",
    color: "#f97316"
  }
];

const gameModesContainer = document.getElementById("game-modes");
gameModes.forEach(mode => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div style="font-size: 32px; margin-bottom: 12px; color: ${mode.color}">${mode.icon}</div>
    <h3>${mode.title}</h3>
    <p>${mode.description}</p>
  `;
  gameModesContainer.appendChild(card);
});

// 🔫 Arsenal de Armas
const weapons = [
  {
    name: "Rifle de Hotdog",
    description: "Precisão mortal com salsicha em alta velocidade",
    type: "Rifle",
    rarity: "Lendário",
    image: "copo artístico com salsicha lendária.png"
  },
  {
    name: "Escopeta Cereal",
    description: "Explosão de cereais devastadores em área",
    type: "Escopeta",
    rarity: "Épico",
    image: "cereal em um copo épico.png"
  },
  {
    name: "Escopeta Baunilha",
    description: "Doçura letal em disparos de curta distância",
    type: "Escopeta",
    rarity: "Raro",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80"
  }
];

const weaponsContainer = document.getElementById("weapons");
weapons.forEach(weapon => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <img src="${weapon.image}" alt="${weapon.name}" />
    <h3>${weapon.name}</h3>
    <p><strong>${weapon.type}</strong> • ${weapon.rarity}</p>
    <p>${weapon.description}</p>
  `;
  weaponsContainer.appendChild(card);
});

// 📰 Novidades
const news = [
  {
    title: "Novo Mapa: Cidade Neon",
    description: "Explore a nova arena urbana com arranha-céus iluminados e batalhas verticais intensas!",
    icon: "🔥",
    badge: "Disponível Agora"
  },
  {
    title: "Sistema de Temporadas",
    description: "Temporada 1 começou! Desbloqueie skins exclusivas, emotes e recompensas únicas.",
    icon: "✨",
    badge: "Em Andamento"
  },
  {
    title: "Balanceamento de Armas",
    description: "Ajustes na Escopeta Cereal e melhorias no Rifle de Hotdog para gameplay mais equilibrado.",
    icon: "🎯",
    badge: "Patch 1.2.5"
  }
];

const newsContainer = document.getElementById("news");
news.forEach(item => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div style="font-size: 32px; margin-bottom: 12px;">${item.icon}</div>
    <h3>${item.title}</h3>
    <p>${item.description}</p>
    <span class="badge" style="display:inline-block; margin-top:12px;">${item.badge}</span>
  `;
  newsContainer.appendChild(card);

  
});


const Capitulo = [
  {
    title: "",
    description: "Mistério",
    icon: "✨",
    badge: "Não revelado"
  }
];

const DowndFabyContainer = document.getElementById("Capitulo");

Capitulo.forEach(item => {
  const card = document.createElement("div");
  card.className = "misterio-card";
  card.innerHTML = `
    <div style="font-size: 32px; margin-bottom: 12px;">${item.icon}</div>
    <h3>${item.title || "Capítulo Secreto"}</h3>
    <p>${item.description}</p>
    <span class="badge" style="display:inline-block; margin-top:12px;">${item.badge}</span>
  `;
  DowndFabyContainer.appendChild(card);
});

const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // Simulação de login (substitua por validação real)
  if (username === "admin" && password === "1234") {
    loginMessage.style.color = "#00ff5eff";
    loginMessage.textContent = "Login bem-sucedido! Bem-vindo ao DowndFaby.";
    // Aqui você pode redirecionar ou mostrar conteúdo
  } else {
    loginMessage.style.color = "#ff0000ff";
    loginMessage.textContent = "Usuário ou senha incorretos.";
  }
});