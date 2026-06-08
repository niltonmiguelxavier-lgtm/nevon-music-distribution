# Nevon Music Distribution

Uma plataforma completa de distribuição de música estilo DistroKid/TuneCore.

## Funcionalidades

- 🎵 Upload de músicas (MP3/WAV)
- 📊 Acompanhamento de streams
- 💰 Sistema de royalties automático
- 👤 Perfil de artista
- 🏦 Carteira digital e levantamentos
- 🛡️ Painel admin

## Stack Tecnológico

- **Backend**: Node.js + Express
- **Frontend**: HTML, CSS, JavaScript
- **Database**: SQLite
- **Autenticação**: JWT + bcrypt
- **Upload**: Multer

## Como Começar

### Instalação

```bash
npm install
```

### Configurar Environment

```bash
cp .env.example .env
```

### Iniciar o Servidor

```bash
npm start
```

Acesse em `http://localhost:3000`

## Estrutura do Projeto

```
nevon-music-distribution/
├── backend/
│   ├── server.js
│   ├── config/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── uploads/
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── database/
│   └── init.sql
└── package.json
```

## Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar novo artista
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout

### Músicas
- `POST /api/music/upload` - Upload de música
- `GET /api/music/list` - Listar minhas músicas
- `GET /api/music/admin/pending` - Músicas pendentes (admin)
- `PUT /api/music/:id/approve` - Aprovar música (admin)
- `PUT /api/music/:id/reject` - Rejeitar música (admin)

### Streams
- `POST /api/stream/:id` - Simular stream
- `GET /api/stats` - Minhas estatísticas

### Carteira
- `GET /api/wallet` - Saldo da carteira
- `GET /api/wallet/history` - Histórico de ganhos
- `POST /api/wallet/withdraw` - Solicitar levantamento

### Admin
- `GET /api/admin/users` - Listar usuários
- `GET /api/admin/stats` - Estatísticas globais
- `GET /api/admin/withdrawals` - Levantamentos pendentes

## Licença

MIT
