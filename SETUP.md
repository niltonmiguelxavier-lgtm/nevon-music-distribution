# 🎵 Nevon Music Distribution - Guia de Instalação e Uso

## 🚀 Como Começar

### 1. Instalação de Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
- `JWT_SECRET` - Chave secreta para JWT (altere em produção!)
- `STREAM_VALUE` - Valor por stream (padrão: 0.002 USD)
- `MIN_WITHDRAWAL` - Saldo mínimo para levantamento (padrão: 25 USD)

### 3. Iniciar o Servidor

```bash
npm start
```

Ou para desenvolvimento com recarregamento automático:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
nevon-music-distribution/
├── backend/
│   ├── config/
│   │   └── database.js          # Configuração SQLite
│   ├── middleware/
│   │   ├── auth.js              # JWT e autenticação
│   │   └── upload.js            # Multer para uploads
│   ├── routes/
│   │   ├── auth.js              # Autenticação (login/registro)
│   │   ├── music.js             # Gerenciamento de músicas
│   │   ├── streams.js           # Streams e estatísticas
│   │   ├── wallet.js            # Carteira e levantamentos
│   │   └── admin.js             # Painel administrativo
│   ├── uploads/                 # Arquivos de música enviados
│   └── server.js                # Servidor Express principal
├── frontend/
│   ├── index.html               # Página HTML
│   ├── styles.css               # Estilos CSS
│   └── app.js                   # Aplicação JavaScript
├── database/
│   ├── init.sql                 # Schema do banco de dados
│   └── nevon.db                 # Banco SQLite (criado automaticamente)
├── package.json                 # Dependências Node.js
├── .env.example                 # Variáveis de ambiente (exemplo)
└── README.md                    # Documentação
```

## 🔑 Funcionalidades Principais

### ✅ Autenticação
- Registro de artistas
- Login/Logout
- JWT tokens
- Senhas criptografadas com bcrypt

### 🎵 Upload de Músicas
- Upload de MP3/WAV
- Armazenamento em servidor
- Múltiplos estados: pending, approved, rejected
- Limite de 100MB por arquivo

### 📊 Sistema de Streams
- Simular streams via API
- Registrar ganhos automáticos
- $0.002 USD por stream (configurável)
- Histórico de streams

### 💰 Sistema de Royalties
- Saldo automático atualizado por stream
- Histórico de ganhos detalhado
- Carteira digital por utilizador

### 🏦 Levantamentos
- Solicitar levantamento de dinheiro
- Saldo mínimo de $25 USD
- Estados: pending, completed, rejected
- Reembolso automático se rejeitado

### 🛡️ Painel Admin
- Aprovação/Rejeição de músicas
- Visualizar utilizadores
- Estatísticas globais
- Gerenciar levantamentos

## 🌐 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo artista
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/profile` - Obter perfil (requer token)

### Músicas
- `POST /api/music/upload` - Upload de música (requer auth)
- `GET /api/music/list` - Listar minhas músicas (requer auth)
- `GET /api/music/approved` - Listar músicas aprovadas (público)
- `GET /api/music/:id` - Obter detalhes da música
- `GET /api/music/admin/pending` - Músicas pendentes (admin)
- `PUT /api/music/:id/approve` - Aprovar música (admin)
- `PUT /api/music/:id/reject` - Rejeitar música (admin)
- `GET /api/music/:id/download` - Download de música

### Streams
- `POST /api/stream/:id` - Adicionar stream (simular) (requer auth)
- `GET /api/stream/:id/history` - Histórico de streams
- `GET /api/stream/my/stats` - Minhas estatísticas (requer auth)

### Carteira
- `GET /api/wallet/balance` - Saldo da carteira (requer auth)
- `GET /api/wallet/history` - Histórico de ganhos (requer auth)
- `POST /api/wallet/withdraw` - Solicitar levantamento (requer auth)
- `GET /api/wallet/withdrawals` - Meus levantamentos (requer auth)
- `GET /api/wallet/admin/pending-withdrawals` - Levantamentos pendentes (admin)
- `PUT /api/wallet/admin/complete/:id` - Completar levantamento (admin)
- `PUT /api/wallet/admin/reject/:id` - Rejeitar levantamento (admin)

### Admin
- `GET /api/admin/users` - Listar utilizadores (admin)
- `GET /api/admin/stats` - Estatísticas globais (admin)
- `GET /api/admin/songs` - Listar todas as músicas (admin)
- `GET /api/admin/withdrawals` - Listar levantamentos (admin)

## 🧪 Testar a Aplicação

### 1. Abrir no Navegador
```
http://localhost:3000
```

### 2. Registrar como Artista
- Clique em "Registrar"
- Preencha os dados
- Será redirecionado para o dashboard

### 3. Upload de Música
- Vá para "Upload"
- Selecione um arquivo MP3 ou WAV
- Aguarde aprovação do admin

### 4. Simular Streams (Testar Ganhos)
- Use a API para adicionar streams:
```bash
curl -X POST http://localhost:3000/api/stream/1 \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json"
```

### 5. Ver Ganhos
- Vá para "Carteira"
- Visualize saldo e histórico

### 6. Admin
- Crie um utilizador admin no banco de dados
- Login como admin
- Clique em "Admin"
- Aprove/Rejeite músicas
- Gerencie levantamentos

## 📝 Notas Importantes

### Segurança
- Sempre altere o `JWT_SECRET` em produção!
- Use HTTPS em produção
- Valide os uploads de arquivo no backend
- Implemente rate limiting

### Desenvolvimento
- O banco SQLite é criado automaticamente em `database/nevon.db`
- Os uploads são salvos em `backend/uploads/user-{userId}/`
- CORS está habilitado para localhost

### Produção
- Use um banco de dados robusto (PostgreSQL, MySQL)
- Configure variáveis de ambiente adequadamente
- Use um reverse proxy (Nginx)
- Implemente backups do banco de dados

## 🐛 Troubleshooting

### Porta já está em uso
```bash
# Mude a porta em .env
PORT=3001
```

### Erro ao conectar com banco de dados
```bash
# Verifique as permissões da pasta database/
chmod 755 database/
```

### Uploads não funcionam
```bash
# Crie a pasta de uploads
mkdir -p backend/uploads
chmod 755 backend/uploads
```

## 📞 Contato e Suporte

Para reportar problemas ou sugestões, abra uma issue no repositório.

---

**Desenvolvido com ❤️ por Nilton Miguel Xavier**

🎵 Happy Music Distribution! 🎵
