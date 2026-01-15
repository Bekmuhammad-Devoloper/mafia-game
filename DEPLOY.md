# 🎭 Mafia O'yini - VPS Deploy Yo'riqnomasi

## 📋 Talablar

- Ubuntu 24.04 VPS (minimum 1GB RAM, 1 CPU)
- Domen nomi (masalan: mafia.yourdomain.com)
- DNS sozlangan (A record VPS IP ga yo'naltirilgan)

## 🚀 Deploy qadamlari

### 1. Serverga ulanish

```bash
ssh root@your-server-ip
```

### 2. Proektni yuklash

```bash
# Proekt papkasini yaratish
mkdir -p /opt/mafia-game
cd /opt/mafia-game

# Git orqali yuklash (agar repo public bo'lsa)
git clone https://github.com/Bekmuhammad-Devoloper/mafia-game.git .

# YOKI SCP orqali yuklash (lokal kompyuterdan)
# scp -r * root@your-server-ip:/opt/mafia-game/
```

### 3. .env faylini sozlash

```bash
# .env faylini yaratish
cp .env.production .env
nano .env
```

Quyidagilarni o'zgartiring:
- `DB_PASSWORD` - kuchli parol
- `TELEGRAM_BOT_TOKEN` - BotFather dan olingan token
- `TELEGRAM_WEBAPP_URL` - sizning domeningiz (https://mafia.yourdomain.com)
- `VITE_WS_URL` - WebSocket URL (wss://mafia.yourdomain.com)

### 4. Nginx config ni yangilash

```bash
# Domenni o'zgartirish
sed -i 's/mafia.yourdomain.com/mafia.SIZNING_DOMEN.com/g' nginx/nginx.conf
```

### 5. Deploy ishga tushirish

```bash
chmod +x deploy.sh
./deploy.sh
```

### 6. SSL sertifikat olish (birinchi marta)

Agar skript SSL xato bersa, qo'lda:

```bash
# Docker o'rnatish
curl -fsSL https://get.docker.com | sh

# Certbot bilan SSL olish
docker run -it --rm \
  -v /opt/mafia-game/nginx/ssl:/etc/letsencrypt \
  -v /opt/mafia-game/certbot:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  -d mafia.yourdomain.com \
  --email your@email.com \
  --agree-tos \
  --no-eff-email
```

### 7. Konteynerlarni ishga tushirish

```bash
cd /opt/mafia-game
docker compose up -d
```

## 🔧 Foydali buyruqlar

```bash
# Loglarni ko'rish
docker compose logs -f

# Faqat backend loglarini ko'rish
docker compose logs -f backend

# Qayta ishga tushirish
docker compose restart

# To'liq qayta build
docker compose down
docker compose build --no-cache
docker compose up -d

# Database migratsiyalari
docker compose exec backend npx prisma migrate deploy

# Database Prisma Studio
docker compose exec backend npx prisma studio
```

## 🐛 Muammolar va yechimlar

### 1. 502 Bad Gateway
```bash
docker compose logs backend
# Backend ishga tushmagan bo'lishi mumkin
docker compose restart backend
```

### 2. Database ulanish xatosi
```bash
docker compose logs postgres
# Postgres ishga tushganini tekshiring
docker compose restart postgres
sleep 10
docker compose restart backend
```

### 3. SSL xatosi
```bash
# Sertifikatni tekshiring
ls -la nginx/ssl/live/mafia.yourdomain.com/

# Qayta olish
docker compose down
certbot renew --force-renewal
docker compose up -d
```

### 4. Bot 409 Conflict xatosi
Bu boshqa joyda bot ishlayotganini bildiradi:
1. BotFather dan `/revoke` qiling
2. Yangi tokenni `.env` ga qo'shing
3. `docker compose restart backend`

## 📊 Monitoring

### Disk joy tekshirish
```bash
df -h
docker system df
```

### Eski image/container tozalash
```bash
docker system prune -af
```

### RAM va CPU
```bash
htop
docker stats
```

## 🔄 Yangilash

```bash
cd /opt/mafia-game
git pull origin main
docker compose build --no-cache
docker compose up -d
```

## 📞 Yordam

Muammo bo'lsa, loglarni tekshiring:
```bash
docker compose logs --tail=100
```
