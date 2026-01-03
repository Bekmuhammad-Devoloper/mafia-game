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
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const telegraf_1 = require("telegraf");
const users_service_1 = require("../users/users.service");
let TelegramService = TelegramService_1 = class TelegramService {
    bot;
    usersService;
    logger = new common_1.Logger(TelegramService_1.name);
    constructor(bot, usersService) {
        this.bot = bot;
        this.usersService = usersService;
    }
    async sendWebAppButton(chatId, text, webAppUrl) {
        await this.bot.telegram.sendMessage(chatId, text, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: '🎮 O\'yinni ochish',
                            web_app: { url: webAppUrl },
                        },
                    ],
                ],
            },
        });
    }
    async sendMessage(chatId, text) {
        await this.bot.telegram.sendMessage(chatId, text, {
            parse_mode: 'HTML',
        });
    }
    async sendMessageWithButtons(chatId, text, buttons) {
        await this.bot.telegram.sendMessage(chatId, text, {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard: buttons,
            },
        });
    }
    async sendRoleNotification(chatId, role, gameId) {
        const roleNames = {
            CIVILIAN: '👤 Tinch aholi',
            MAFIA: '🔫 Mafia',
            DON: '🎩 Don (Mafia boshlig\'i)',
            SHERIFF: '🔍 Komissar',
            DOCTOR: '💉 Doktor',
        };
        const roleDescriptions = {
            CIVILIAN: 'Sizning vazifangiz - mafialarni topish va ovoz berish orqali ularni yo\'q qilish.',
            MAFIA: 'Siz mafia a\'zosisiz. Har kecha tinch aholidan birini o\'ldiring va kunduzi o\'zingizni yashiring.',
            DON: 'Siz mafia boshlig\'isiz. Mafia vazifasi bilan birga, sheriffni topish uchun tekshiruv qilasiz.',
            SHERIFF: 'Siz komissarsiz. Har kecha birini tekshiring - u mafia yoki yo\'qligini bilasiz.',
            DOCTOR: 'Siz doktorsiz. Har kecha birini tanlang - agar uni mafia o\'ldirmoqchi bo\'lsa, u sog\' qoladi.',
        };
        const text = `
🎭 <b>Sizning rolingiz:</b>

${roleNames[role] || role}

📋 <b>Vazifa:</b>
${roleDescriptions[role] || 'Noma\'lum rol'}

🎮 O'yin ID: <code>${gameId}</code>

⚠️ Rolingizni hech kimga aytmang!
    `.trim();
        await this.sendMessage(chatId, text);
    }
    async sendGameResult(chatId, winner, userRole, isWinner) {
        const winnerText = winner === 'MAFIA'
            ? '🔫 Mafia g\'alaba qozondi!'
            : '👥 Tinch aholi g\'alaba qozondi!';
        const resultText = isWinner
            ? '🏆 Tabriklaymiz! Siz g\'olib bo\'ldingiz!'
            : '😢 Afsuski, siz yutqazdingiz.';
        const text = `
🎮 <b>O'yin tugadi!</b>

${winnerText}

${resultText}

📋 Sizning rolingiz: ${userRole}
    `.trim();
        await this.sendMessage(chatId, text);
    }
    async getOrCreateUser(telegramUser) {
        return this.usersService.findOrCreateByTelegramId({
            telegramId: String(telegramUser.id),
            username: telegramUser.username,
            firstName: telegramUser.first_name,
            lastName: telegramUser.last_name,
        });
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_telegraf_1.InjectBot)()),
    __metadata("design:paramtypes", [telegraf_1.Telegraf,
        users_service_1.UsersService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map