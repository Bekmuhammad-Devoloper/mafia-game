# 🎭 Mafia O'yini - Telegram Web App

O'zbek tilida ovozli hikoyachi bilan Mafia o'yini Telegram Web App.

## 📋 Loyiha haqida

Bu loyiha Telegram platformasida ishlash uchun mo'ljallangan Mafia o'yini. O'yinda:
- 🎙️ Ovozli hikoyachi (50+ ta turli audio variant)
- 👥 5-12 o'yinchi bilan real-time o'yin
- 🌙 Tun/Kun fazalari
- 🗳️ Ovoz berish tizimi
- 💬 O'yinchilar chati

## 🛠️ Texnologiyalar

### Backend
- **NestJS** - Node.js framework
- **PostgreSQL** - Ma'lumotlar bazasi
- **Prisma** - ORM
- **Socket.io** - Real-time kommunikatsiya
- **Telegraf** - Telegram Bot API

### Frontend
- **React** + **TypeScript** - UI
- **Vite** - Build tool
- **Zustand** - State management
- **Socket.io-client** - WebSocket

### TTS (Text-to-Speech)
- **ElevenLabs** - Asosiy TTS provider
- **Google Cloud TTS** - Zaxira
- **Amazon Polly** - Zaxira

## 🚀 O'rnatish

### Talab qilinadigan dasturlar
- Node.js 20+
- PostgreSQL 15+
- npm yoki yarn

### 1. Repositoriyani klonlash
```bash
git clone https://github.com/your-username/mafia-game.git
cd mafia-game
```

### 2. Backend sozlash
```bash
cd backend
npm install

# .env faylini yaratish
cp .env.example .env
# .env faylini to'ldiring

# Prisma migratsiya
npx prisma generate
npx prisma migrate dev

# Serverni ishga tushirish
npm run start:dev
```

### 3. Frontend sozlash
```bash
cd frontend
npm install

# .env faylini yaratish
cp .env.example .env

# Serverni ishga tushirish
npm run dev
```

### 4. Docker bilan ishga tushirish
```bash
# Root papkada
docker-compose up -d
```

## ⚙️ Sozlamalar

### Backend .env
```env
DATABASE_URL="postgresql://user:password@localhost:5432/mafia_game"
TELEGRAM_BOT_TOKEN="your-bot-token"
ELEVENLABS_API_KEY="your-api-key"
```

### Frontend .env
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## 📁 Loyiha strukturasi

```
mafia-game/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── audio/          # Audio/TTS servislari
│   │   ├── game/           # O'yin logikasi
│   │   ├── gateway/        # Socket.io gateway
│   │   ├── prisma/         # Database servisi
│   │   ├── rooms/          # Xonalar boshqaruvi
│   │   ├── telegram/       # Telegram bot
│   │   └── users/          # Foydalanuvchilar
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React komponentlar
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Sahifalar
│   │   ├── services/       # API/Socket servislari
│   │   └── store/          # Zustand store
│   └── package.json
└── docker-compose.yml
```

## 🎮 O'yin qoidalari

### Rollar
- **👤 Tinch aholi** - Mafiyani topish
- **🔫 Mafiya** - Tinch aholini yo'q qilish
- **👑 Don** - Mafiya boshlig'i
- **🔍 Sherif** - Mafiyani aniqlash
- **💉 Shifokor** - O'yinchilarni himoya qilish

### O'yin jarayoni
1. **🌙 Tun fazasi**
   - Mafiya qurbonni tanlaydi
   - Sherif tekshiradi
   - Shifokor himoya qiladi

2. **☀️ Kun fazasi**
   - Voqea e'lon qilinadi
   - Muhokama
   - Ovoz berish

3. **🏆 G'alaba sharti**
   - Tinch aholi: Barcha mafiyalar yo'q qilingan
   - Mafiya: Mafiya soni >= Tinch aholi soni

## 📡 API Endpoints

### Users
- `POST /api/users` - Yangi foydalanuvchi
- `GET /api/users/:id` - Foydalanuvchi ma'lumoti

### Rooms
- `POST /api/rooms` - Yangi xona
- `GET /api/rooms` - Xonalar ro'yxati
- `GET /api/rooms/:id` - Xona ma'lumoti

### Game
- `POST /api/game/start/:roomId` - O'yinni boshlash
- `GET /api/game/:id` - O'yin holati

### Audio
- `POST /api/audio/generate` - Audio generatsiya
- `GET /api/audio/:id` - Audio faylni olish

## 🔌 Socket Events

### Client → Server
- `joinRoom` - Xonaga qo'shilish
- `leaveRoom` - Xonadan chiqish
- `startGame` - O'yinni boshlash
- `playerAction` - O'yinchi harakati
- `vote` - Ovoz berish

### Server → Client
- `roomJoined` - Xonaga qo'shildi
- `playerJoined` - Yangi o'yinchi
- `gameStarted` - O'yin boshlandi
- `phaseChange` - Faza o'zgardi
- `playAudio` - Audio ijro etish

## 🤝 Hissa qo'shish

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/amazing`)
3. Commit qiling (`git commit -m 'Add amazing feature'`)
4. Push qiling (`git push origin feature/amazing`)
5. Pull Request oching

## 📄 Litsenziya

MIT License - batafsil [LICENSE](LICENSE) faylida.

## 👨‍💻 Muallif

Mafia Game UZ Team

---

⭐ Agar loyiha yoqsa, yulduzcha qo'ying!
