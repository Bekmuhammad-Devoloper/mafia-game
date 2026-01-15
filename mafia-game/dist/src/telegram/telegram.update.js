"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramUpdate = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const telegram_service_1 = require("./telegram.service");
const rooms_service_1 = require("../rooms/rooms.service");
const config_1 = require("@nestjs/config");
let TelegramUpdate = class TelegramUpdate {
    telegramService;
    roomsService;
    configService;
    constructor(telegramService, roomsService, configService) {
        this.telegramService = telegramService;
        this.roomsService = roomsService;
        this.configService = configService;
    }
    async onStart(ctx) {
        const user = ctx.from;
        if (!user)
            return;
        await this.telegramService.getOrCreateUser(user);
        const webAppUrl = this.configService.get('TELEGRAM_WEBAPP_URL') || 'https://your-domain.com/app';
        const text = `
🎭 <b>Mafia O'yini - Ovozli Hikoyachi bilan</b>

Xush kelibsiz, ${user.first_name}! 

Bu Telegram'dagi eng immersiv Mafia o'yini. Professional ovozli hikoyachi har bir momentni maxsus va unutilmas qiladi!

📋 <b>Qanday o'ynash:</b>
1. 🎮 /newroom - Yangi xona yarating
2. 🏠 /join KODXXX - Mavjud xonaga qo'shiling
3. 🎲 O'yin boshlanishini kuting
4. 🎧 Ovozli hikoyachini eshiting va o'ynang!

📱 <b>Buyruqlar:</b>
/newroom - Yangi xona yaratish
/join [kod] - Xonaga qo'shilish
/rooms - Ochiq xonalar
/stats - Statistikangiz
/rules - O'yin qoidalari
/help - Yordam
    `.trim();
        if (webAppUrl.startsWith('https://')) {
            await this.telegramService.sendWebAppButton(user.id, text, webAppUrl);
        }
        else {
            await this.telegramService.sendMessage(user.id, text);
        }
    }
    async onHelp(ctx) {
        const text = `
🎭 <b>Mafia O'yini - Yordam</b>

📱 <b>Asosiy buyruqlar:</b>
/start - Botni boshlash
/play - O'yinga kirish
/stats - Statistikangiz
/rules - O'yin qoidalari
/settings - Sozlamalar

🎮 <b>O'yin haqida:</b>
Mafia - bu klassik ijtimoiy detektiv o'yini. O'yinchilar ikki jamoaga bo'linadi: Tinch aholi va Mafia.

🌙 <b>Tun:</b>
- Mafia birini o'ldiradi
- Komissar birini tekshiradi
- Doktor birini himoya qiladi

☀️ <b>Kun:</b>
- O'yinchilar muhokama qiladi
- Ovoz berish orqali birini chiqaradi

🏆 <b>G'alaba:</b>
- Tinch aholi: Barcha mafialarni yo'q qilish
- Mafia: Tinch aholi bilan teng bo'lish

❓ Savollar bo'lsa, @admin_username ga yozing.
    `.trim();
        await ctx.reply(text, { parse_mode: 'HTML' });
    }
    async onPlay(ctx) {
        const user = ctx.from;
        if (!user)
            return;
        const webAppUrl = this.configService.get('TELEGRAM_WEBAPP_URL') || 'https://your-domain.com/app';
        await this.telegramService.sendWebAppButton(user.id, '🎮 O\'yinga kirish uchun quyidagi tugmani bosing:', webAppUrl);
    }
    async onStats(ctx) {
        const user = ctx.from;
        if (!user)
            return;
        try {
            const dbUser = await this.telegramService.getOrCreateUser(user);
            const winRate = dbUser.gamesPlayed > 0
                ? ((dbUser.gamesWon / dbUser.gamesPlayed) * 100).toFixed(1)
                : '0';
            const text = `
📊 <b>${user.first_name} - Statistika</b>

🎮 <b>Umumiy:</b>
• O'ynalgan o'yinlar: ${dbUser.gamesPlayed}
• G'alabalar: ${dbUser.gamesWon}
• G'alaba foizi: ${winRate}%

👥 <b>Rollar bo'yicha:</b>
• Tinch aholi: ${dbUser.gamesAsCivilian}
• Mafia: ${dbUser.gamesAsMafia}
• Don: ${dbUser.gamesAsDon}
• Komissar: ${dbUser.gamesAsSheriff}
• Doktor: ${dbUser.gamesAsDoctor}

🏆 <b>Jamoa g'alabalari:</b>
• Tinch aholi sifatida: ${dbUser.civilianWins}
• Mafia sifatida: ${dbUser.mafiaWins}
      `.trim();
            await ctx.reply(text, { parse_mode: 'HTML' });
        }
        catch (error) {
            await ctx.reply('❌ Statistikani olishda xatolik yuz berdi.');
        }
    }
    async onRules(ctx) {
        const text = `
📜 <b>Mafia O'yini - Qoidalar</b>

🎭 <b>Rollar:</b>

👤 <b>Tinch aholi</b> - Mafialarni topish va ovoz berish orqali yo'q qilish.

🔫 <b>Mafia</b> - Har kecha tinch aholidan birini o'ldiradi. Kunduzi o'zini yashiradi.

🎩 <b>Don</b> - Mafia boshlig'i. Sheriffni topish uchun tekshiruv qiladi.

🔍 <b>Komissar</b> - Har kecha birini tekshiradi va u mafia yoki yo'qligini biladi.

💉 <b>Doktor</b> - Har kecha birini himoya qiladi. Agar uni mafia tanlagan bo'lsa, u sog' qoladi.

⏰ <b>O'yin jarayoni:</b>

🌙 <b>Tun:</b>
1. Mafia o'zaro kelishib qurbonni tanlaydi
2. Don sheriffni izlaydi
3. Komissar birini tekshiradi
4. Doktor birini himoya qiladi

☀️ <b>Kun:</b>
1. Hikoyachi tun natijasini e'lon qiladi
2. O'yinchilar muhokama qiladi
3. Ovoz berish - eng ko'p ovoz olgan chiqariladi

🏆 <b>G'alaba shartlari:</b>
• Tinch aholi - barcha mafialarni yo'q qilish
• Mafia - tinch aholi bilan teng yoki ko'p bo'lish
    `.trim();
        await ctx.reply(text, { parse_mode: 'HTML' });
    }
    async onSettings(ctx) {
        const text = `
⚙️ <b>Sozlamalar</b>

Hozircha bot orqali sozlash imkoniyati yo'q.
Web App ishga tushgandan so'ng sozlamalar mavjud bo'ladi.

📱 Buyruqlar:
/newroom - Yangi xona yaratish
/join [kod] - Xonaga qo'shilish
/rooms - Ochiq xonalar
/stats - Statistikangiz
    `.trim();
        await ctx.reply(text, { parse_mode: 'HTML' });
    }
    async onNewRoom(ctx) {
        const user = ctx.from;
        if (!user)
            return;
        try {
            const dbUser = await this.telegramService.getOrCreateUser(user);
            const room = await this.roomsService.create({
                name: `${user.first_name}ning xonasi`,
                hostId: dbUser.id,
                minPlayers: 6,
                maxPlayers: 12,
            });
            const text = `
🏠 <b>Yangi xona yaratildi!</b>

📋 <b>Xona ma'lumotlari:</b>
• Nomi: ${room.name}
• Kod: <code>${room.code}</code>
• O'yinchilar: 6-12 kishi

📤 <b>Do'stlaringizni taklif qiling:</b>
Ular quyidagi buyruqni yuborishlari kerak:
<code>/join ${room.code}</code>

Yoki ushbu xabarni ulashing!

🎮 Barcha o'yinchilar yig'ilgach, o'yin boshlash uchun /startgame buyrug'ini yuboring.
      `.trim();
            await ctx.reply(text, { parse_mode: 'HTML' });
        }
        catch (error) {
            console.error('Error creating room:', error);
            await ctx.reply('❌ Xona yaratishda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
        }
    }
    async onRooms(ctx) {
        try {
            const rooms = await this.roomsService.findAvailable();
            if (rooms.length === 0) {
                await ctx.reply(`
🏠 <b>Ochiq xonalar</b>

Hozircha ochiq xonalar yo'q.

📝 Yangi xona yaratish uchun /newroom buyrug'ini yuboring.
        `.trim(), { parse_mode: 'HTML' });
                return;
            }
            let text = '🏠 <b>Ochiq xonalar:</b>\n\n';
            for (const room of rooms) {
                const playersCount = await this.roomsService.getPlayersCount(room.id);
                text += `• <b>${room.name}</b>\n`;
                text += `  Kod: <code>${room.code}</code> | 👥 ${playersCount}/${room.maxPlayers}\n\n`;
            }
            text += `\n📝 Qo'shilish uchun: /join <kod>`;
            await ctx.reply(text, { parse_mode: 'HTML' });
        }
        catch (error) {
            console.error('Error fetching rooms:', error);
            await ctx.reply('❌ Xonalarni olishda xatolik yuz berdi.');
        }
    }
    async onStartGame(ctx) {
        const user = ctx.from;
        if (!user)
            return;
        await ctx.reply(`
🎮 <b>O'yinni boshlash</b>

⚠️ Bu funksiya hali tayyor emas.
O'yin boshlanishi uchun Web App kerak.

Tez orada qo'shiladi!
    `.trim(), { parse_mode: 'HTML' });
    }
    async onJoin(ctx) {
        const user = ctx.from;
        if (!user)
            return;
        const message = ctx.message;
        const args = message.text?.split(' ').slice(1);
        if (!args || args.length === 0) {
            await ctx.reply('❌ Xona kodini kiriting. Masalan: /join ABC123');
            return;
        }
        const roomCode = args[0].toUpperCase();
        try {
            const room = await this.roomsService.findByCode(roomCode);
            const playersCount = await this.roomsService.getPlayersCount(room.id);
            const dbUser = await this.telegramService.getOrCreateUser(user);
            await this.roomsService.addPlayer(room.id, dbUser.id);
            const text = `
✅ <b>Xonaga qo'shildingiz!</b>

🏠 <b>Xona:</b> ${room.name}
📋 <b>Kod:</b> <code>${room.code}</code>
👥 <b>O'yinchilar:</b> ${playersCount + 1}/${room.maxPlayers}

⏳ Boshqa o'yinchilarni kutamiz...
O'yin boshlanishi haqida xabar olasiz.

🚪 Chiqish uchun: /leave ${room.code}
      `.trim();
            await ctx.reply(text, { parse_mode: 'HTML' });
        }
        catch (error) {
            if (error.message?.includes('topilmadi')) {
                await ctx.reply(`❌ Xona topilmadi: ${roomCode}\n\n/rooms - ochiq xonalarni ko'rish`);
            }
            else {
                await ctx.reply(`❌ Xonaga qo'shilishda xatolik: ${error.message}`);
            }
        }
    }
    async onLeave(ctx) {
        const user = ctx.from;
        if (!user)
            return;
        const message = ctx.message;
        const args = message.text?.split(' ').slice(1);
        if (!args || args.length === 0) {
            await ctx.reply('❌ Xona kodini kiriting. Masalan: /leave ABC123');
            return;
        }
        const roomCode = args[0].toUpperCase();
        try {
            const room = await this.roomsService.findByCode(roomCode);
            const dbUser = await this.telegramService.getOrCreateUser(user);
            await this.roomsService.removePlayer(room.id, dbUser.id);
            await ctx.reply(`✅ Siz "${room.name}" xonasidan chiqdingiz.`);
        }
        catch (error) {
            await ctx.reply(`❌ Xatolik: ${error.message}`);
        }
    }
    async onWebAppData(ctx) {
        const webAppData = ctx.message?.web_app_data;
        if (webAppData) {
            try {
                const data = JSON.parse(webAppData.data);
                console.log('Web App Data:', data);
            }
            catch (error) {
                console.error('Error parsing web app data:', error);
            }
        }
    }
    async onRoomAction(ctx) {
        const callbackQuery = ctx.callbackQuery;
        const roomId = callbackQuery.data?.replace('room_', '');
        if (roomId) {
            const webAppUrl = this.configService.get('TELEGRAM_WEBAPP_URL') || 'https://your-domain.com/app';
            await ctx.answerCbQuery();
            await this.telegramService.sendWebAppButton(ctx.from.id, '🏠 Xonaga kirish:', `${webAppUrl}/room/${roomId}`);
        }
    }
};
exports.TelegramUpdate = TelegramUpdate;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onStart", null);
__decorate([
    (0, nestjs_telegraf_1.Help)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onHelp", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('play'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onPlay", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('stats'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onStats", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('rules'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onRules", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('settings'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onSettings", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('newroom'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onNewRoom", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('rooms'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onRooms", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('startgame'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onStartGame", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('join'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onJoin", null);
__decorate([
    (0, nestjs_telegraf_1.Command)('leave'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onLeave", null);
__decorate([
    (0, nestjs_telegraf_1.On)('web_app_data'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onWebAppData", null);
__decorate([
    (0, nestjs_telegraf_1.Action)(/room_(.+)/),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [telegraf_1.Context]),
    __metadata("design:returntype", Promise)
], TelegramUpdate.prototype, "onRoomAction", null);
exports.TelegramUpdate = TelegramUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService,
        rooms_service_1.RoomsService,
        config_1.ConfigService])
], TelegramUpdate);
//# sourceMappingURL=telegram.update.js.map