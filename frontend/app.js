// API Base URL
const API_URL = 'http://localhost:3000/api';

// Application State
let currentUser = null;
let currentPage = 'home';
const token = localStorage.getItem('token');

if (token) {
    currentUser = JSON.parse(localStorage.getItem('user'));
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderApp();
    setupEventListeners();
});

// Render Main App
function renderApp() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <header>
            <div class="logo">🎵 Nevon Music</div>
            <nav>
                ${currentUser ? `
                    <a onclick="setPage('dashboard')">Dashboard</a>
                    <a onclick="setPage('upload')">Upload</a>
                    <a onclick="setPage('wallet')">Carteira</a>
                    ${currentUser.role === 'admin' ? `<a onclick="setPage('admin')">Admin</a>` : ''}
                ` : ''}
            </nav>
            <div class="auth-buttons">
                ${currentUser ? `
                    <span>${currentUser.artist_name}</span>
                    <button class="btn-secondary" onclick="logout()">Logout</button>
                ` : `
                    <button class="btn-secondary" onclick="setPage('login')">Login</button>
                    <button class="btn-primary" onclick="setPage('register')">Registrar</button>
                `}
            </div>
        </header>
        <div class="container">
            <div id="page-content"></div>
        </div>
        <footer>
            <p>&copy; 2026 Nevon Music Distribution. Todos os direitos reservados.</p>
        </footer>
    `;
    
    renderPage();
}

// Render Current Page
function renderPage() {
    const pageContent = document.getElementById('page-content');
    
    if (!currentUser && currentPage !== 'login' && currentPage !== 'register' && currentPage !== 'home') {
        setPage('home');
        return;
    }
    
    switch(currentPage) {
        case 'home':
            renderHome(pageContent);
            break;
        case 'login':
            renderLogin(pageContent);
            break;
        case 'register':
            renderRegister(pageContent);
            break;
        case 'dashboard':
            renderDashboard(pageContent);
            break;
        case 'upload':
            renderUpload(pageContent);
            break;
        case 'wallet':
            renderWallet(pageContent);
            break;
        case 'admin':
            renderAdmin(pageContent);
            break;
        default:
            renderHome(pageContent);
    }
}

// Set Current Page
function setPage(page) {
    currentPage = page;
    renderApp();
}

// HOME PAGE
function renderHome(container) {
    container.innerHTML = `
        <div class="hero">
            <h1>🎵 Nevon Music Distribution</h1>
            <p>Distribua sua música para o mundo inteiro e ganhe dinheiro com cada stream</p>
            ${!currentUser ? `
                <button class="btn-primary" onclick="setPage('register')" style="padding: 1rem 2rem; font-size: 1.1rem;">Começar Agora</button>
            ` : ''}
        </div>
        
        <div class="dashboard">
            <div class="card">
                <h3>📊 Plataforma Completa</h3>
                <p>Upload de músicas, acompanhamento de streams e royalties automáticos.</p>
            </div>
            <div class="card">
                <h3>💰 Ganhe Dinheiro</h3>
                <p>Cada stream gera US$ 0.002 em royalties para sua conta.</p>
            </div>
            <div class="card">
                <h3>🏦 Levantamentos Fáceis</h3>
                <p>Solicite levantamentos de forma segura com saldo mínimo de US$ 25.</p>
            </div>
        </div>
    `;
}

// LOGIN PAGE
function renderLogin(container) {
    container.innerHTML = `
        <div class="form-container">
            <h2>Login</h2>
            <div id="login-alert"></div>
            <form onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="login-email" required>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Login</button>
            </form>
            <p style="text-align: center; margin-top: 1rem;">
                Não tem conta? <a onclick="setPage('register')" style="color: var(--primary); cursor: pointer;">Registre-se</a>
            </p>
        </div>
    `;
}

// REGISTER PAGE
function renderRegister(container) {
    container.innerHTML = `
        <div class="form-container">
            <h2>Registrar</h2>
            <div id="register-alert"></div>
            <form onsubmit="handleRegister(event)">
                <div class="form-group">
                    <label>Username:</label>
                    <input type="text" id="register-username" required>
                </div>
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="register-email" required>
                </div>
                <div class="form-group">
                    <label>Nome do Artista:</label>
                    <input type="text" id="register-artist" required>
                </div>
                <div class="form-group">
                    <label>Password:</label>
                    <input type="password" id="register-password" required>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Registrar</button>
            </form>
            <p style="text-align: center; margin-top: 1rem;">
                Já tem conta? <a onclick="setPage('login')" style="color: var(--primary); cursor: pointer;">Faça login</a>
            </p>
        </div>
    `;
}

// DASHBOARD PAGE
function renderDashboard(container) {
    container.innerHTML = `
        <h1>Dashboard</h1>
        <div id="dashboard-alert"></div>
        <div id="dashboard-content"><div class="spinner"></div></div>
    `;
    
    loadDashboard();
}

async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/stream/my/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        const stats = data.stats || {};
        const music = data.music || [];
        
        let html = `
            <div class="dashboard">
                <div class="card">
                    <h3>🎵 Músicas</h3>
                    <div class="card-value">${stats.total_songs || 0}</div>
                    <div class="card-label">Total enviadas</div>
                </div>
                <div class="card">
                    <h3>📊 Streams</h3>
                    <div class="card-value">${stats.total_streams || 0}</div>
                    <div class="card-label">Total de reproduções</div>
                </div>
                <div class="card">
                    <h3>💵 Ganhos</h3>
                    <div class="card-value">$${(stats.total_earnings || 0).toFixed(2)}</div>
                    <div class="card-label">Total ganho</div>
                </div>
            </div>
            
            <h2 style="margin-top: 3rem;">Minhas Músicas</h2>
            <div class="music-list">
        `;
        
        if (music.length > 0) {
            music.forEach(m => {
                html += `
                    <div class="music-card">
                        <div class="music-cover">🎵</div>
                        <div class="music-info">
                            <div class="music-title">${m.title}</div>
                            <div class="music-artist">${m.artist_name}</div>
                            <div class="music-stats">
                                <span>📊 ${m.streams} streams</span>
                                <span>💰 $${m.total_earnings.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
        } else {
            html += '<p>Nenhuma música enviada ainda.</p>';
        }
        
        html += '</div>';
        document.getElementById('dashboard-content').innerHTML = html;
    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.getElementById('dashboard-alert').innerHTML = `
            <div class="alert alert-error">Erro ao carregar dashboard</div>
        `;
    }
}

// UPLOAD PAGE
function renderUpload(container) {
    container.innerHTML = `
        <div class="form-container" style="max-width: 600px;">
            <h2>Upload de Música</h2>
            <div id="upload-alert"></div>
            <form onsubmit="handleUpload(event)">
                <div class="form-group">
                    <label>Título da Música:</label>
                    <input type="text" id="upload-title" required>
                </div>
                <div class="form-group">
                    <label>Nome do Artista:</label>
                    <input type="text" id="upload-artist" required>
                </div>
                <div class="form-group">
                    <label>Descrição:</label>
                    <textarea id="upload-description" rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label>Ficheiro de Música (MP3/WAV):</label>
                    <input type="file" id="upload-file" accept="audio/*" required>
                </div>
                <button type="submit" class="btn-primary" style="width: 100%;">Upload</button>
            </form>
        </div>
    `;
}

// WALLET PAGE
function renderWallet(container) {
    container.innerHTML = `
        <h1>Carteira</h1>
        <div id="wallet-alert"></div>
        <div id="wallet-content"><div class="spinner"></div></div>
    `;
    
    loadWallet();
}

async function loadWallet() {
    try {
        const walletResponse = await fetch(`${API_URL}/wallet/balance`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const wallet = await walletResponse.json();
        
        const historyResponse = await fetch(`${API_URL}/wallet/history`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const history = await historyResponse.json();
        
        let html = `
            <div class="dashboard">
                <div class="card">
                    <h3>💰 Saldo</h3>
                    <div class="card-value">$${wallet.balance.toFixed(2)}</div>
                </div>
                <div class="card">
                    <h3>📈 Total Ganho</h3>
                    <div class="card-value">$${wallet.total_earnings.toFixed(2)}</div>
                </div>
            </div>
            
            <div style="margin-top: 2rem;">
                <button class="btn-primary" onclick="showWithdrawForm()">Solicitar Levantamento</button>
            </div>
            
            <h2 style="margin-top: 3rem;">Histórico de Ganhos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Música</th>
                        <th>Montante</th>
                        <th>Tipo</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        if (history.length > 0) {
            history.forEach(h => {
                const date = new Date(h.created_at).toLocaleDateString('pt-PT');
                html += `
                    <tr>
                        <td>${h.music_title || 'N/A'}</td>
                        <td>$${h.amount.toFixed(2)}</td>
                        <td>${h.type}</td>
                        <td>${date}</td>
                    </tr>
                `;
            });
        } else {
            html += '<tr><td colspan="4">Nenhum ganho registrado</td></tr>';
        }
        
        html += '</tbody></table>';
        document.getElementById('wallet-content').innerHTML = html;
    } catch (error) {
        console.error('Error loading wallet:', error);
        document.getElementById('wallet-alert').innerHTML = `
            <div class="alert alert-error">Erro ao carregar carteira</div>
        `;
    }
}

// ADMIN PAGE
function renderAdmin(container) {
    container.innerHTML = `
        <h1>Painel de Admin</h1>
        <div id="admin-alert"></div>
        <div style="margin-bottom: 2rem;">
            <button class="btn-primary" onclick="loadAdminStats()">Estatísticas</button>
            <button class="btn-primary" onclick="loadPendingMusic()">Músicas Pendentes</button>
            <button class="btn-primary" onclick="loadWithdrawals()">Levantamentos</button>
        </div>
        <div id="admin-content"></div>
    `;
    
    loadAdminStats();
}

async function loadAdminStats() {
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const stats = await response.json();
        
        let html = `
            <h2>Estatísticas Globais</h2>
            <div class="dashboard">
                <div class="card">
                    <h3>👥 Utilizadores</h3>
                    <div class="card-value">${stats.total_users.count}</div>
                </div>
                <div class="card">
                    <h3>🎤 Artistas</h3>
                    <div class="card-value">${stats.total_artists.count}</div>
                </div>
                <div class="card">
                    <h3>🎵 Músicas</h3>
                    <div class="card-value">${stats.total_songs.count}</div>
                </div>
                <div class="card">
                    <h3>✅ Aprovadas</h3>
                    <div class="card-value">${stats.approved_songs.count}</div>
                </div>
                <div class="card">
                    <h3>⏳ Pendentes</h3>
                    <div class="card-value">${stats.pending_songs.count}</div>
                </div>
                <div class="card">
                    <h3>📊 Total Streams</h3>
                    <div class="card-value">${stats.total_streams.total}</div>
                </div>
                <div class="card">
                    <h3>💰 Total Ganhos</h3>
                    <div class="card-value">$${stats.total_earnings.total.toFixed(2)}</div>
                </div>
                <div class="card">
                    <h3>💳 Carteiras</h3>
                    <div class="card-value">$${stats.total_wallet_balance.total.toFixed(2)}</div>
                </div>
            </div>
        `;
        
        document.getElementById('admin-content').innerHTML = html;
    } catch (error) {
        console.error('Error loading admin stats:', error);
        document.getElementById('admin-alert').innerHTML = `
            <div class="alert alert-error">Erro ao carregar estatísticas</div>
        `;
    }
}

async function loadPendingMusic() {
    try {
        const response = await fetch(`${API_URL}/music/admin/pending`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const music = await response.json();
        
        let html = '<h2>Músicas Pendentes de Aprovação</h2>';
        
        if (music.length > 0) {
            html += '<table><thead><tr><th>Título</th><th>Artista</th><th>Utilizador</th><th>Data</th><th>Ações</th></tr></thead><tbody>';
            music.forEach(m => {
                const date = new Date(m.created_at).toLocaleDateString('pt-PT');
                html += `
                    <tr>
                        <td>${m.title}</td>
                        <td>${m.artist_name}</td>
                        <td>${m.username}</td>
                        <td>${date}</td>
                        <td>
                            <button class="btn-primary" onclick="approveMusic(${m.id})">Aprovar</button>
                            <button class="btn-secondary" onclick="rejectMusicForm(${m.id})">Rejeitar</button>
                        </td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
        } else {
            html += '<p>Nenhuma música pendente</p>';
        }
        
        document.getElementById('admin-content').innerHTML = html;
    } catch (error) {
        console.error('Error loading pending music:', error);
        document.getElementById('admin-alert').innerHTML = `
            <div class="alert alert-error">Erro ao carregar músicas pendentes</div>
        `;
    }
}

async function loadWithdrawals() {
    try {
        const response = await fetch(`${API_URL}/wallet/admin/pending-withdrawals`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const withdrawals = await response.json();
        
        let html = '<h2>Levantamentos Pendentes</h2>';
        
        if (withdrawals.length > 0) {
            html += '<table><thead><tr><th>Artista</th><th>Email</th><th>Montante</th><th>Método</th><th>Data</th><th>Ações</th></tr></thead><tbody>';
            withdrawals.forEach(w => {
                const date = new Date(w.requested_at).toLocaleDateString('pt-PT');
                html += `
                    <tr>
                        <td>${w.artist_name}</td>
                        <td>${w.email}</td>
                        <td>$${w.amount.toFixed(2)}</td>
                        <td>${w.payment_method}</td>
                        <td>${date}</td>
                        <td>
                            <button class="btn-primary" onclick="completeWithdrawal(${w.id})">Completar</button>
                            <button class="btn-secondary" onclick="rejectWithdrawalForm(${w.id})">Rejeitar</button>
                        </td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
        } else {
            html += '<p>Nenhum levantamento pendente</p>';
        }
        
        document.getElementById('admin-content').innerHTML = html;
    } catch (error) {
        console.error('Error loading withdrawals:', error);
        document.getElementById('admin-alert').innerHTML = `
            <div class="alert alert-error">Erro ao carregar levantamentos</div>
        `;
    }
}

// EVENT HANDLERS

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            setPage('dashboard');
        } else {
            document.getElementById('login-alert').innerHTML = `
                <div class="alert alert-error">${data.message}</div>
            `;
        }
    } catch (error) {
        console.error('Login error:', error);
        document.getElementById('login-alert').innerHTML = `
            <div class="alert alert-error">Erro ao fazer login</div>
        `;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const artist_name = document.getElementById('register-artist').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, artist_name, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            setPage('dashboard');
        } else {
            document.getElementById('register-alert').innerHTML = `
                <div class="alert alert-error">${data.message || 'Erro ao registrar'}</div>
            `;
        }
    } catch (error) {
        console.error('Register error:', error);
        document.getElementById('register-alert').innerHTML = `
            <div class="alert alert-error">Erro ao registrar</div>
        `;
    }
}

async function handleUpload(e) {
    e.preventDefault();
    const title = document.getElementById('upload-title').value;
    const artist_name = document.getElementById('upload-artist').value;
    const description = document.getElementById('upload-description').value;
    const file = document.getElementById('upload-file').files[0];
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist_name', artist_name);
    formData.append('description', description);
    formData.append('music', file);
    
    try {
        const response = await fetch(`${API_URL}/music/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('upload-alert').innerHTML = `
                <div class="alert alert-success">Música enviada com sucesso! Aguardando aprovação.</div>
            `;
            setTimeout(() => setPage('dashboard'), 2000);
        } else {
            document.getElementById('upload-alert').innerHTML = `
                <div class="alert alert-error">${data.message}</div>
            `;
        }
    } catch (error) {
        console.error('Upload error:', error);
        document.getElementById('upload-alert').innerHTML = `
            <div class="alert alert-error">Erro ao fazer upload</div>
        `;
    }
}

async function approveMusic(musicId) {
    try {
        const response = await fetch(`${API_URL}/music/${musicId}/approve`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            document.getElementById('admin-alert').innerHTML = `
                <div class="alert alert-success">Música aprovada com sucesso!</div>
            `;
            loadPendingMusic();
        }
    } catch (error) {
        console.error('Approve error:', error);
    }
}

async function completeWithdrawal(withdrawalId) {
    try {
        const response = await fetch(`${API_URL}/wallet/admin/complete/${withdrawalId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes: 'Levantamento completado' })
        });
        
        if (response.ok) {
            document.getElementById('admin-alert').innerHTML = `
                <div class="alert alert-success">Levantamento completado com sucesso!</div>
            `;
            loadWithdrawals();
        }
    } catch (error) {
        console.error('Complete withdrawal error:', error);
    }
}

function rejectMusicForm(musicId) {
    const reason = prompt('Motivo da rejeição:');
    if (reason) {
        rejectMusic(musicId, reason);
    }
}

async function rejectMusic(musicId, reason) {
    try {
        const response = await fetch(`${API_URL}/music/${musicId}/reject`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rejection_reason: reason })
        });
        
        if (response.ok) {
            document.getElementById('admin-alert').innerHTML = `
                <div class="alert alert-success">Música rejeitada com sucesso!</div>
            `;
            loadPendingMusic();
        }
    } catch (error) {
        console.error('Reject error:', error);
    }
}

function rejectWithdrawalForm(withdrawalId) {
    const notes = prompt('Motivo da rejeição:');
    if (notes) {
        rejectWithdrawal(withdrawalId, notes);
    }
}

async function rejectWithdrawal(withdrawalId, notes) {
    try {
        const response = await fetch(`${API_URL}/wallet/admin/reject/${withdrawalId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ notes })
        });
        
        if (response.ok) {
            document.getElementById('admin-alert').innerHTML = `
                <div class="alert alert-success">Levantamento rejeitado e montante reembolsado!</div>
            `;
            loadWithdrawals();
        }
    } catch (error) {
        console.error('Reject withdrawal error:', error);
    }
}

function showWithdrawForm() {
    const amount = prompt('Montante para levantar (mínimo $25):');
    if (amount) {
        const method = prompt('Método de pagamento (ex: Transferência Bancária):');
        if (method) {
            const account = prompt('Dados bancários:');
            if (account) {
                requestWithdrawal(parseFloat(amount), method, account);
            }
        }
    }
}

async function requestWithdrawal(amount, method, account) {
    try {
        const response = await fetch(`${API_URL}/wallet/withdraw`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount,
                payment_method: method,
                bank_account: account
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Levantamento solicitado com sucesso!');
            loadWallet();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Withdrawal error:', error);
        alert('Erro ao solicitar levantamento');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    setPage('home');
}

function setupEventListeners() {
    // Additional event listeners can be added here
}
