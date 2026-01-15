import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // API Prefix
  app.setGlobalPrefix('api');

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Mafia O\'yini API')
    .setDescription('Telegram Web App Mafia o\'yini - ovozli hikoyachi bilan')
    .setVersion('1.0')
    .addTag('Users', 'Foydalanuvchilar')
    .addTag('Rooms', 'O\'yin xonalari')
    .addTag('Game', 'O\'yin jarayoni')
    .addTag('Audio', 'Ovozli hikoyachi')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Manual Telegraf instance yaratish (nestjs-telegraf o'rniga)
  const configService = app.get(ConfigService);
  const token = configService.get('TELEGRAM_BOT_TOKEN');
  const webhookDomain = process.env.TELEGRAM_WEBHOOK_DOMAIN || 'https://mafiya.bekmuhammad.uz';
  const webhookPath = '/webhook/telegram';
  const webAppUrl = configService.get('TELEGRAM_WEBAPP_URL') || 'https://mafiya.bekmuhammad.uz';
  
  const bot = new Telegraf(token);
  
  // Bot command handler'lari
  bot.command('start', async (ctx) => {
    const user = ctx.from;
    if (!user) return;
    
    console.log('📨 /start buyrug\'i qabul qilindi:', user.first_name);
    
    const text = `
🎭 <b>Mafia O'yini - Ovozli Hikoyachi bilan</b>

Xush kelibsiz, ${user.first_name}! 

Bu Telegram'dagi eng immersiv Mafia o'yini. Professional ovozli hikoyachi har bir momentni maxsus va unutilmas qiladi!

📋 <b>Qanday o'ynash:</b>
1. 🎮 O'yinni ochish tugmasini bosing
2. 🏠 Xona yarating yoki mavjudiga qo'shiling
3. 🎲 O'yin boshlanishini kuting
4. 🎧 Ovozli hikoyachini eshiting va o'ynang!

📱 <b>Buyruqlar:</b>
/start - Botni boshlash
/help - Yordam
    `.trim();

    await ctx.replyWithHTML(text, {
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
  });

  bot.command('help', async (ctx) => {
    const text = `
🎭 <b>Mafia O'yini - Yordam</b>

📱 <b>Asosiy buyruqlar:</b>
/start - Botni boshlash
/help - Yordam

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
- Mafia: Tinch aholi soniga teng bo'lish
    `.trim();

    await ctx.replyWithHTML(text);
  });

  bot.on('message', async (ctx) => {
    console.log('📨 Xabar qabul qilindi:', {
      from: ctx.from?.username || ctx.from?.id,
      text: 'text' in ctx.message ? ctx.message.text : 'non-text message',
    });
  });
  
  // MUHIM: Webhook middleware'ni app.listen() dan OLDIN qo'shish kerak!
  app.use(bot.webhookCallback(webhookPath));
  
  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Webhook o'rnatish (server ishga tushgandan keyin)
  try {
    console.log('🤖 Telegram bot webhook rejimiga o\'rnatilmoqda...');
    
    const webhookUrl = `${webhookDomain}${webhookPath}`;
    
    await bot.telegram.setWebhook(webhookUrl, {
      drop_pending_updates: true,
      allowed_updates: ['message', 'callback_query'],
    });
    
    console.log(`✅ Telegram bot webhook rejimida ishga tushdi!`);
    console.log(`📡 Webhook URL: ${webhookUrl}`);
    console.log('📱 Botga /start yuboring: https://t.me/MafiaVoiceUzBot');
    
    const webhookInfo = await bot.telegram.getWebhookInfo();
    console.log('🔍 Webhook holati:', {
      url: webhookInfo.url,
      has_custom_certificate: webhookInfo.has_custom_certificate,
      pending_update_count: webhookInfo.pending_update_count,
    });
  } catch (err: any) {
    console.error('❌ Webhook o\'rnatish xatosi:', err.message);
  }
  
  // Graceful shutdown
  process.once('SIGINT', async () => {
    await bot.telegram.deleteWebhook();
  });
  process.once('SIGTERM', async () => {
    await bot.telegram.deleteWebhook();
  });

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🎭 MAFIA O'YINI - OVOZLI HIKOYACHI BILAN                  ║
║                                                              ║
║   Server: http://localhost:${port}                            ║
║   API Docs: http://localhost:${port}/docs                     ║
║   WebSocket: ws://localhost:${port}/game                      ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
}
bootstrap();
