#!/bin/bash

# ==============================================
# MAFIA O'YINI - VPS Deploy Script
# Ubuntu 24.04 uchun
# ==============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🎭 Mafia O'yini - Deploy Script${NC}"
echo "=================================="

# Variables - O'Z DOMENINGIZNI KIRITING!
DOMAIN="mafia.yourdomain.com"
EMAIL="your-email@example.com"
PROJECT_DIR="/opt/mafia-game"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Bu skriptni root sifatida ishga tushiring: sudo ./deploy.sh${NC}"
    exit 1
fi

# Step 1: Update system
echo -e "${YELLOW}📦 Tizimni yangilash...${NC}"
apt update && apt upgrade -y

# Step 2: Install Docker
echo -e "${YELLOW}🐳 Docker o'rnatish...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
fi

# Step 3: Install Docker Compose
echo -e "${YELLOW}🐳 Docker Compose o'rnatish...${NC}"
if ! command -v docker-compose &> /dev/null; then
    apt install -y docker-compose-plugin
fi

# Step 4: Create project directory
echo -e "${YELLOW}📁 Proekt papkasini yaratish...${NC}"
mkdir -p $PROJECT_DIR
cd $PROJECT_DIR

# Step 5: Clone or update repository
echo -e "${YELLOW}📥 Kodni yuklash...${NC}"
if [ -d ".git" ]; then
    git pull origin main
else
    echo -e "${YELLOW}⚠️ Proekt fayllarini qo'lda yuklang yoki git clone qiling${NC}"
fi

# Step 6: Create SSL directory
mkdir -p nginx/ssl

# Step 7: Get SSL certificate (first time only)
echo -e "${YELLOW}🔒 SSL sertifikat olish...${NC}"
if [ ! -f "nginx/ssl/live/$DOMAIN/fullchain.pem" ]; then
    # Temporary nginx for certbot
    docker run -d --name temp-nginx \
        -p 80:80 \
        -v $(pwd)/nginx/ssl:/etc/letsencrypt \
        -v $(pwd)/certbot:/var/www/certbot \
        nginx:alpine

    sleep 5

    # Get certificate
    docker run --rm \
        -v $(pwd)/nginx/ssl:/etc/letsencrypt \
        -v $(pwd)/certbot:/var/www/certbot \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN

    docker stop temp-nginx
    docker rm temp-nginx
fi

# Step 8: Update nginx config with actual domain
echo -e "${YELLOW}⚙️ Nginx konfiguratsiyasini yangilash...${NC}"
sed -i "s/mafia.yourdomain.com/$DOMAIN/g" nginx/nginx.conf

# Step 9: Create .env file
echo -e "${YELLOW}📝 .env faylini tekshirish...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env fayli topilmadi!${NC}"
    echo "Quyidagi buyruqni ishga tushiring va kerakli qiymatlarni kiriting:"
    echo "cp .env.production .env && nano .env"
    exit 1
fi

# Step 10: Build and start
echo -e "${YELLOW}🚀 Docker konteynerlarini ishga tushirish...${NC}"
docker compose down 2>/dev/null || true
docker compose build --no-cache
docker compose up -d

# Step 11: Wait for services
echo -e "${YELLOW}⏳ Servislar ishga tushishini kutish...${NC}"
sleep 30

# Step 12: Check status
echo -e "${YELLOW}📊 Servislar holati:${NC}"
docker compose ps

# Step 13: Run migrations
echo -e "${YELLOW}🗃️ Database migratsiyalari...${NC}"
docker compose exec -T backend npx prisma migrate deploy

echo ""
echo -e "${GREEN}✅ Deploy muvaffaqiyatli!${NC}"
echo ""
echo "🌐 Sayt: https://$DOMAIN"
echo "🤖 Telegram Bot: @MafiaVoiceUzBot"
echo ""
echo -e "${YELLOW}Foydali buyruqlar:${NC}"
echo "  docker compose logs -f          # Loglarni ko'rish"
echo "  docker compose restart           # Qayta ishga tushirish"
echo "  docker compose down              # To'xtatish"
echo "  docker compose up -d             # Ishga tushirish"
