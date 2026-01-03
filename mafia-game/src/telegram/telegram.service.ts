import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    @InjectBot() private bot: Telegraf<Context>,
    private usersService: UsersService,
  ) {}

  /**
   * Web App tugmasini ko'rsatish
   */
  async sendWebAppButton(chatId: number, text: string, webAppUrl: string) {
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

  /**
   * Oddiy xabar yuborish
   */
  async sendMessage(chatId: number, text: string) {
    await this.bot.telegram.sendMessage(chatId, text, {
      parse_mode: 'HTML',
    });
  }

  /**
   * Inline tugmalar bilan xabar
   */
  async sendMessageWithButtons(
    chatId: number,
    text: string,
    buttons: { text: string; callback_data: string }[][],
  ) {
    await this.bot.telegram.sendMessage(chatId, text, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: buttons,
      },
    });
  }

  /**
   * O'yinchiga role xabari yuborish
   */
  async sendRoleNotification(
    chatId: number,
    role: string,
    gameId: string,
  ) {
    const roleNames: Record<string, string> = {
      CIVILIAN: '👤 Tinch aholi',
      MAFIA: '🔫 Mafia',
      DON: '🎩 Don (Mafia boshlig\'i)',
      SHERIFF: '🔍 Komissar',
      DOCTOR: '💉 Doktor',
    };

    const roleDescriptions: Record<string, string> = {
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

  /**
   * O'yin natijasini yuborish
   */
  async sendGameResult(
    chatId: number,
    winner: 'MAFIA' | 'CIVILIAN',
    userRole: string,
    isWinner: boolean,
  ) {
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

  /**
   * Telegram foydalanuvchi ma'lumotlaridan user yaratish
   */
  async getOrCreateUser(telegramUser: {
    id: number;
    username?: string;
    first_name: string;
    last_name?: string;
  }) {
    return this.usersService.findOrCreateByTelegramId({
      telegramId: String(telegramUser.id),
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
    });
  }
}
