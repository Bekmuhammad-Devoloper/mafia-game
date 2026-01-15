import { Update, Ctx, Start, Help, On, Command, Action } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { TelegramService } from './telegram.service';
import { RoomsService } from '../rooms/rooms.service';
import { ConfigService } from '@nestjs/config';

@Update()
export class TelegramUpdate {
  constructor(
    private telegramService: TelegramService,
    private roomsService: RoomsService,
    private configService: ConfigService,
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    // Foydalanuvchini yaratish/yangilash
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

    // HTTPS bo'lsa Web App tugmasi, aks holda oddiy xabar
    if (webAppUrl.startsWith('https://')) {
      await this.telegramService.sendWebAppButton(user.id, text, webAppUrl);
    } else {
      await this.telegramService.sendMessage(user.id, text);
    }
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {
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

  @Command('play')
  async onPlay(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    const webAppUrl = this.configService.get('TELEGRAM_WEBAPP_URL') || 'https://your-domain.com/app';

    await this.telegramService.sendWebAppButton(
      user.id,
      '🎮 O\'yinga kirish uchun quyidagi tugmani bosing:',
      webAppUrl,
    );
  }

  @Command('stats')
  async onStats(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

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
    } catch (error) {
      await ctx.reply('❌ Statistikani olishda xatolik yuz berdi.');
    }
  }

  @Command('rules')
  async onRules(@Ctx() ctx: Context) {
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

  @Command('settings')
  async onSettings(@Ctx() ctx: Context) {
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

  @Command('newroom')
  async onNewRoom(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    try {
      // Foydalanuvchini olish yoki yaratish
      const dbUser = await this.telegramService.getOrCreateUser(user);
      
      // Yangi xona yaratish
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
    } catch (error) {
      console.error('Error creating room:', error);
      await ctx.reply('❌ Xona yaratishda xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    }
  }

  @Command('rooms')
  async onRooms(@Ctx() ctx: Context) {
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
    } catch (error) {
      console.error('Error fetching rooms:', error);
      await ctx.reply('❌ Xonalarni olishda xatolik yuz berdi.');
    }
  }

  @Command('startgame')
  async onStartGame(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    await ctx.reply(`
🎮 <b>O'yinni boshlash</b>

⚠️ Bu funksiya hali tayyor emas.
O'yin boshlanishi uchun Web App kerak.

Tez orada qo'shiladi!
    `.trim(), { parse_mode: 'HTML' });
  }

  @Command('join')
  async onJoin(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    const message = ctx.message as any;
    const args = message.text?.split(' ').slice(1);
    
    if (!args || args.length === 0) {
      await ctx.reply('❌ Xona kodini kiriting. Masalan: /join ABC123');
      return;
    }

    const roomCode = args[0].toUpperCase();
    
    try {
      const room = await this.roomsService.findByCode(roomCode);
      const playersCount = await this.roomsService.getPlayersCount(room.id);
      
      // Foydalanuvchini xonaga qo'shish
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
    } catch (error: any) {
      if (error.message?.includes('topilmadi')) {
        await ctx.reply(`❌ Xona topilmadi: ${roomCode}\n\n/rooms - ochiq xonalarni ko'rish`);
      } else {
        await ctx.reply(`❌ Xonaga qo'shilishda xatolik: ${error.message}`);
      }
    }
  }

  @Command('leave')
  async onLeave(@Ctx() ctx: Context) {
    const user = ctx.from;
    if (!user) return;

    const message = ctx.message as any;
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
    } catch (error: any) {
      await ctx.reply(`❌ Xatolik: ${error.message}`);
    }
  }

  @On('web_app_data')
  async onWebAppData(@Ctx() ctx: Context) {
    // Web App'dan kelgan ma'lumotlarni qayta ishlash
    const webAppData = (ctx.message as any)?.web_app_data;
    
    if (webAppData) {
      try {
        const data = JSON.parse(webAppData.data);
        // Handle web app data
        console.log('Web App Data:', data);
      } catch (error) {
        console.error('Error parsing web app data:', error);
      }
    }
  }

  @Action(/room_(.+)/)
  async onRoomAction(@Ctx() ctx: Context) {
    const callbackQuery = ctx.callbackQuery as any;
    const roomId = callbackQuery.data?.replace('room_', '');
    
    if (roomId) {
      const webAppUrl = this.configService.get('TELEGRAM_WEBAPP_URL') || 'https://your-domain.com/app';
      
      await ctx.answerCbQuery();
      await this.telegramService.sendWebAppButton(
        ctx.from!.id,
        '🏠 Xonaga kirish:',
        `${webAppUrl}/room/${roomId}`,
      );
    }
  }
}
