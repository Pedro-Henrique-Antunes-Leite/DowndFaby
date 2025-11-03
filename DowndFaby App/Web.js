document.addEventListener('DOMContentLoaded', () => {
    // Inicialização do sistema de autenticação
    initializeAuthentication();
    
    // Inicialização do sistema de música
    initializeMusicPlayer();
    
    // Verificar se o usuário já está logado
    checkUserSession();
    
    // Inicializar navegação e interações
    initializeNavigation();
});

// Função para inicializar o sistema de autenticação
function initializeAuthentication() {
    const tabs = {
        login: document.getElementById('tab-login'),
        signup: document.getElementById('tab-signup'),
        recover: document.getElementById('tab-recover'),
    };

    const panels = {
        login: document.getElementById('login-panel'),
        signup: document.getElementById('signup-panel'),
        recover: document.getElementById('recover-panel'),
    };

    // Função para gerenciar a troca de abas
    function switchTab(activeTab) {
        // Esconde todos os painéis e remove a classe ativa de todas as abas
        Object.keys(tabs).forEach(key => {
            tabs[key].classList.remove('active');
            if (panels[key]) panels[key].setAttribute('hidden', true);
        });

        // Mostra o painel correto e adiciona a classe ativa na aba clicada
        tabs[activeTab].classList.add('active');
        if (panels[activeTab]) panels[activeTab].removeAttribute('hidden');
    }

    // Adiciona os eventos de clique nas abas
    if (tabs.login) tabs.login.addEventListener('click', () => switchTab('login'));
    if (tabs.signup) tabs.signup.addEventListener('click', () => switchTab('signup'));
    if (tabs.recover) tabs.recover.addEventListener('click', () => switchTab('recover'));
    
    // Link para recuperação de senha
    const forgotLink = document.getElementById('forgot-password-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('recover');
        });
    }

    // Botão para voltar ao login
    const voltarLoginBtn = document.getElementById('back-login');
    if (voltarLoginBtn) {
        voltarLoginBtn.addEventListener('click', () => {
            switchTab('login');
        });
    }

    // Formulário de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const loginMessage = document.getElementById('login-message');

            let foundUser = null;
            for (let key in localStorage) {
                if (key.startsWith('downdfabyUser-')) {
                    const user = JSON.parse(localStorage.getItem(key));
                    if (user.email === email && user.password === password) {
                        foundUser = user;
                        break;
                    }
                }
            }

            if (foundUser) {
                localStorage.setItem('downdfabySession', foundUser.username);
                showMainContent(foundUser.username);
                mostrarPerfil(foundUser);
            } else {
                if (loginMessage) {
                    loginMessage.textContent = 'Usuário ou senha incorretos.';
                    loginMessage.style.color = 'red';
                }
            }
        });
    }

    // Formulário de cadastro
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('signup-username').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value.trim();
            const confirm = document.getElementById('signup-confirm').value.trim();
            const signupMessage = document.getElementById('signup-message');

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!username || !email || !password || !confirm) {
                signupMessage.textContent = 'Preencha todos os campos.';
                signupMessage.style.color = 'red';
                return;
            }
            if (!emailRegex.test(email)) {
                signupMessage.textContent = 'Email inválido.';
                signupMessage.style.color = 'red';
                return;
            }
            if (password !== confirm) {
                signupMessage.textContent = 'As senhas não coincidem.';
                signupMessage.style.color = 'red';
                return;
            }

            for (let key in localStorage) {
                if (key.startsWith('downdfabyUser-')) {
                    const existingUser = JSON.parse(localStorage.getItem(key));
                    if (existingUser.email === email) {
                        signupMessage.textContent = 'Este email já está cadastrado.';
                        signupMessage.style.color = 'red';
                        return;
                    }
                }
            }

            const userData = { username, email, password, skin: 'padrão', modo: 'Battle Royale' };
            localStorage.setItem('downdfabyUser-' + username, JSON.stringify(userData));
            signupMessage.textContent = `Conta criada com sucesso para ${username}!`;
            signupMessage.style.color = 'lime';
            switchTab('login');
        });
    }

    // Recuperação de senha com segurança avançada
    const recoverButton = document.getElementById('recover-button');
    if (recoverButton) {
        recoverButton.addEventListener('click', () => {
            const email = document.getElementById('recover-email').value.trim();
            const message = document.getElementById('recover-message');
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                message.textContent = 'Email inválido. Por favor, verifique o formato.';
                message.style.color = 'red';
                return;
            }

            let foundUser = null;
            for (let key in localStorage) {
                if (key.startsWith('downdfabyUser-')) {
                    const user = JSON.parse(localStorage.getItem(key));
                    if (user.email === email) {
                        foundUser = user;
                        break;
                    }
                }
            }

            // Gerar código de verificação de 6 dígitos
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            const token = gerarToken();
            
            // Armazenar token com expiração (1 hora)
            localStorage.setItem('resetToken-' + email, JSON.stringify({
                token: token,
                code: verificationCode,
                expiration: Date.now() + 3600000,
                attempts: 0
            }));
            
            // Não revelar se o email existe (segurança)
            message.innerHTML = 'Se o email estiver cadastrado, você receberá as instruções de recuperação.<br>' +
                               '<div style="margin-top:10px;font-size:0.9em;color:#FFD700">' +
                               '⚠️ Por segurança, o código expira em 1 hora</div>';
            message.style.color = '#FFA500';
            
            // Apenas para simulação, mostrar o código (em produção seria enviado por email)
            if (foundUser) {
                const simulationDiv = document.createElement('div');
                simulationDiv.innerHTML = `
                    <div style="margin-top:15px;padding:10px;border:1px solid #444;background:#222;border-radius:5px">
                        <h4 style="margin:0;color:#FFD700">🔐 Simulação de Email Seguro</h4>
                        <p style="margin:5px 0">Para: ${email}</p>
                        <p style="margin:5px 0">Seu código de verificação: <strong>${verificationCode}</strong></p>
                        <p style="margin:5px 0;font-size:0.8em">Este código é válido por 1 hora.</p>
                        <p style="margin:5px 0;font-size:0.8em">Se você não solicitou esta recuperação, ignore este email.</p>
                    </div>
                    <div class="input-group" style="margin-top:15px">
                        <input type="text" id="verification-code" placeholder="Digite o código de verificação" maxlength="6">
                        <button id="verify-code" class="btn">Verificar</button>
                    </div>
                    <div id="verification-message" style="margin-top:5px;font-size:0.9em"></div>
                `;
                message.parentNode.insertBefore(simulationDiv, message.nextSibling);
                
                // Adicionar evento ao botão de verificação
                document.getElementById('verify-code').addEventListener('click', () => {
                    const inputCode = document.getElementById('verification-code').value.trim();
                    const verificationMessage = document.getElementById('verification-message');
                    
                    // Verificar se o token ainda é válido
                    const resetData = JSON.parse(localStorage.getItem('resetToken-' + email));
                    if (!resetData || Date.now() > resetData.expiration) {
                        verificationMessage.textContent = 'Código expirado. Solicite um novo código.';
                        verificationMessage.style.color = 'red';
                        return;
                    }
                    
                    // Verificar tentativas
                    if (resetData.attempts >= 5) {
                        verificationMessage.textContent = 'Muitas tentativas. Por segurança, solicite um novo código.';
                        verificationMessage.style.color = 'red';
                        localStorage.removeItem('resetToken-' + email);
                        return;
                    }
                    
                    // Incrementar tentativas
                    resetData.attempts++;
                    localStorage.setItem('resetToken-' + email, JSON.stringify(resetData));
                    
                    // Verificar código
                    if (inputCode === resetData.code.toString()) {
                        verificationMessage.textContent = 'Código verificado com sucesso!';
                        verificationMessage.style.color = 'lime';
                        
                        // Mostrar formulário de redefinição de senha
                        const resetForm = document.createElement('div');
                        resetForm.innerHTML = `
                            <div class="input-group" style="margin-top:15px">
                                <input type="password" id="new-password" placeholder="Nova senha">
                            </div>
                            <div class="input-group" style="margin-top:10px">
                                <input type="password" id="confirm-password" placeholder="Confirme a nova senha">
                            </div>
                            <button id="reset-password" class="btn" style="margin-top:10px">Redefinir Senha</button>
                            <div id="reset-message" style="margin-top:5px;font-size:0.9em"></div>
                        `;
                        verificationMessage.parentNode.insertBefore(resetForm, verificationMessage.nextSibling);
                        
                        // Adicionar evento ao botão de redefinição
                        document.getElementById('reset-password').addEventListener('click', () => {
                            const newPassword = document.getElementById('new-password').value;
                            const confirmPassword = document.getElementById('confirm-password').value;
                            const resetMessage = document.getElementById('reset-message');
                            
                            if (newPassword !== confirmPassword) {
                                resetMessage.textContent = 'As senhas não coincidem.';
                                resetMessage.style.color = 'red';
                                return;
                            }
                            
                            if (newPassword.length < 6) {
                                resetMessage.textContent = 'A senha deve ter pelo menos 6 caracteres.';
                                resetMessage.style.color = 'red';
                                return;
                            }
                            
                            // Atualizar senha
                            if (foundUser) {
                                foundUser.password = newPassword;
                                localStorage.setItem('downdfabyUser-' + foundUser.username, JSON.stringify(foundUser));
                                resetMessage.textContent = 'Senha redefinida com sucesso!';
                                resetMessage.style.color = 'lime';
                                
                                // Limpar token
                                localStorage.removeItem('resetToken-' + email);
                                
                                // Voltar para login após 2 segundos
                                setTimeout(() => {
                                    const loginTab = document.getElementById('tab-login');
                                    if (loginTab) loginTab.click();
                                }, 2000);
                            }
                        });
                    } else {
                        verificationMessage.textContent = 'Código incorreto. Tentativa ' + resetData.attempts + ' de 5.';
                        verificationMessage.style.color = 'red';
                    }
                });
            }
            
            console.log(`Simulação: Email enviado para ${email}` + (foundUser ? ` com código ${verificationCode}` : ''));
        });
    }

    // Logout
    const tabLogout = document.getElementById('tab-logout');
    if (tabLogout) {
        tabLogout.addEventListener('click', () => {
            localStorage.removeItem('downdfabySession');
            location.reload();
        });
    }
}

// Função para inicializar o player de música
function initializeMusicPlayer() {
    const audio = document.getElementById('bg-music');
    const musicButton = document.getElementById('toggle-music');

    if (audio && musicButton) {
        const syncIcon = () => {
            musicButton.textContent = audio.paused ? '🎵' : '🔇';
        };
        
        musicButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(console.error);
            } else {
                audio.pause();
            }
        });
        
        audio.onplay = syncIcon;
        audio.onpause = syncIcon;
        syncIcon();
    }
}

// Função para verificar se o usuário já está logado
function checkUserSession() {
    const currentUser = localStorage.getItem('downdfabySession');
    const loginSection = document.querySelector('.login-section');
    const mainContent = document.querySelector('main');
    const userNameEl = document.getElementById('user-name');
    
    if (currentUser) {
        if (loginSection) loginSection.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
        if (userNameEl) userNameEl.textContent = `• ${currentUser}`;
        
        // Mostrar perfil do usuário
        mostrarPerfil();
    } else {
        if (loginSection) loginSection.style.display = 'flex';
        if (mainContent && loginSection) mainContent.style.display = 'block';
    }
}

// Função para mostrar o perfil do usuário
function mostrarPerfil(user) {
    const currentUser = user ? user.username : localStorage.getItem('downdfabySession');
    if (!currentUser) return;
    
    let userData;
    if (user) {
        userData = user;
    } else {
        userData = JSON.parse(localStorage.getItem('downdfabyUser-' + currentUser));
    }
    
    if (!userData) return;

    const perfilNome = document.getElementById('perfil-nome');
    const perfilEmail = document.getElementById('perfil-email');
    const perfilSkin = document.getElementById('perfil-skin');
    const perfilModo = document.getElementById('perfil-modo');
    const perfilBox = document.getElementById('perfil-box');
    
    if (perfilNome) perfilNome.textContent = userData.username;
    if (perfilEmail) perfilEmail.textContent = userData.email;
    if (perfilSkin) perfilSkin.textContent = userData.skin;
    if (perfilModo) perfilModo.textContent = userData.modo;
    if (perfilBox) perfilBox.style.display = 'block';
    
    // Atualizar os selects de configuração
    const skinSelect = document.getElementById('skin-select');
    const modoSelect = document.getElementById('modo-select');
    
    if (skinSelect) skinSelect.value = userData.skin;
    if (modoSelect) modoSelect.value = userData.modo;
}

// Função para mostrar o conteúdo principal
function showMainContent(username) {
    const loginSection = document.querySelector('.login-section');
    const mainContent = document.querySelector('main');
    const userNameEl = document.getElementById('user-name');
    
    if (loginSection) loginSection.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    if (userNameEl) userNameEl.textContent = `• ${username}`;
}

// Função para gerar token de recuperação
function gerarToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Função para inicializar navegação e interações
function initializeNavigation() {
    // Botões da hero section
    const startGameBtn = document.getElementById('start-game');
    const watchTrailerBtn = document.getElementById('watch-trailer');
    
    // Configurações
    const configToggleBtn = document.getElementById('config-toggle');
    const saveConfigBtn = document.getElementById('save-config');
    
    // Adicionar eventos aos botões
    if (startGameBtn) {
        startGameBtn.addEventListener('click', () => {
            const currentUser = localStorage.getItem('downdfabySession');
            if (currentUser) {
                alert('Iniciando o jogo... Preparando para carregar DowndFaby!');
                // Aqui você pode redirecionar para a página do jogo
                // window.location.href = 'game.html';
            } else {
                alert('Você precisa fazer login para jogar!');
                document.querySelector('.login-section').style.display = 'flex';
            }
        });
    }
    
    if (watchTrailerBtn) {
        watchTrailerBtn.addEventListener('click', () => {
            // Criar modal para o trailer
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-button">&times;</span>
                    <h2>Trailer de DowndFaby</h2>
                    <div class="video-container">
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; 
                        gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Adicionar estilo ao modal
            const style = document.createElement('style');
            style.textContent = `
                .modal {
                    display: block;
                    position: fixed;
                    z-index: 1000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.8);
                }
                .modal-content {
                    background-color: #222;
                    margin: 10% auto;
                    padding: 20px;
                    border: 1px solid #444;
                    width: 80%;
                    max-width: 600px;
                    border-radius: 8px;
                }
                .close-button {
                    color: #aaa;
                    float: right;
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                }
                .close-button:hover {
                    color: white;
                }
                .video-container {
                    position: relative;
                    padding-bottom: 56.25%;
                    height: 0;
                    overflow: hidden;
                    max-width: 100%;
                }
                .video-container iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
            `;
            document.head.appendChild(style);
            
            // Fechar modal
            const closeButton = modal.querySelector('.close-button');
            closeButton.addEventListener('click', () => {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            });
        });
    }
    
    // Configurações
    if (configToggleBtn) {
        configToggleBtn.addEventListener('click', toggleConfiguracoes);
    }
    
    if (saveConfigBtn) {
        saveConfigBtn.addEventListener('click', salvarConfiguracoes);
    }
    
    // Navegação suave para as seções
    const sections = ['historia', 'modos', 'arsenal', 'novidades', 'capitulo-secreto'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            // Criar botão de navegação se não existir
            const navItem = document.createElement('a');
            navItem.href = `#${section}`;
            navItem.textContent = section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ');
            navItem.className = 'nav-item';
            
            // Adicionar à navbar se não existir
            const navbar = document.querySelector('.navbar');
            if (navbar && !document.querySelector(`.nav-item[href="#${section}"]`)) {
                navbar.appendChild(navItem);
            }
            
            // Adicionar evento de rolagem suave
            navItem.addEventListener('click', (e) => {
                e.preventDefault();
                element.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
}

// Função para alternar configurações
window.toggleConfiguracoes = function() {
    const box = document.getElementById('configuracoes');
    if (box) {
        box.style.display = box.style.display === 'block' ? 'none' : 'block';
        getSelection().removeAllRanges();
        document.activeElement.blur();
    }
};

// Função para salvar configurações
window.salvarConfiguracoes = function() {
    const skinSelect = document.getElementById('skin-select');
    const modoSelect = document.getElementById('modo-select');
    
    if (!skinSelect || !modoSelect) return;
    
    const skin = skinSelect.value;
    const modo = modoSelect.value;
    const currentUser = localStorage.getItem('downdfabySession');
    
    if (!currentUser) {
        alert('Você precisa estar logado para salvar configurações!');
        return;
    }
    
    const userData = JSON.parse(localStorage.getItem('downdfabyUser-' + currentUser));
    if (!userData) return;
    
    userData.skin = skin;
    userData.modo = modo;
    localStorage.setItem('downdfabyUser-' + currentUser, JSON.stringify(userData));
    
    // Aplicar tema se a skin for alterada
    if (skin === 'hotdog' || skin === 'baunilha' || skin === 'padrão') {
        applyTheme(skin);
    }
    
    alert('Configurações salvas!');
    mostrarPerfil();
};

// Função para aplicar tema
function applyTheme(theme) {
    const THEME_KEY = 'df-theme';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    
    const themeSelect = document.getElementById('theme-switcher');
    if (themeSelect) themeSelect.value = theme;
}

// Função para voltar ao login
window.voltarLogin = function() {
    const recoverPanel = document.getElementById('recover-panel');
    const loginPanel = document.getElementById('login-panel');
    
    if (recoverPanel) recoverPanel.hidden = true;
    if (loginPanel) loginPanel.hidden = false;
    
    const tabLogin = document.getElementById('tab-login');
    const tabRecover = document.getElementById('tab-recover');
    
    if (tabLogin) tabLogin.classList.add('active');
    if (tabRecover) tabRecover.classList.remove('active');
};

// Este código foi consolidado nas funções acima

// Já implementado na função voltarLogin acima

// Já implementado na função gerarToken acima
// Código já implementado nas funções acima