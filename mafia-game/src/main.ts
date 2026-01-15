import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { getBotToken } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

// Uncaught exception handler - server crash qilmasligi uchun
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err.message);
  // Telegram 409 xatosi bo'lsa, server to'xtamasin
  if (err.message?.includes('409') || err.message?.includes('Conflict')) {
    console.log('📱 Bot conflict xatosi - server ishlashda davom etadi');
  }
});

process.on('unhandledRejection', (reason: any) => {
  console.error('⚠️ Unhandled Rejection:', reason?.message || reason);
});

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

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Telegram botni ishga tushirish (development rejimda polling)
  const bot = app.get<Telegraf>(getBotToken());
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    // Development rejimda polling ishlatamiz
    const launchBot = async (retries = 5) => {
      for (let i = 0; i < retries; i++) {
        try {
          console.log(`🤖 Telegram botga ulanmoqda... (urinish ${i + 1}/${retries})`);
          
          // Avval eski webhook va pending update larni tozalaymiz
          try {
            await bot.telegram.deleteWebhook({ drop_pending_updates: true });
          } catch (webhookErr) {
            console.log('⚠️ Webhook o\'chirish xatosi (davom etamiz)');
          }
          
          await bot.launch({
            dropPendingUpdates: true,
            allowedUpdates: ['message', 'callback_query'],
          });
          console.log('✅ Telegram bot polling rejimida ishga tushdi!');
          console.log('📱 Botga /start yuboring: https://t.me/MafiaVoiceUzBot');
          return true;
        } catch (err: any) {
          console.error(`❌ Telegram bot xatosi (urinish ${i + 1}):`, err.message);
          if (err.message?.includes('409') || err.response?.error_code === 409) {
            if (i < retries - 1) {
              const waitTime = 30 + (i * 10); // 30s, 40s, 50s, 60s, 70s
              console.log(`⏳ Boshqa bot instance to'xtashini kutamiz (${waitTime} soniya)...`);
              await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
            }
          } else if (i < retries - 1) {
            console.log('⏳ 5 soniyadan keyin qayta uriniladi...');
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }
      }
      console.error('⚠️ Telegram botga ulanib bo\'lmadi. logOut qilingan bo\'lishi mumkin.');
      console.log('📱 Server ishlayapti, API\'lar tayyor!');
      console.log('💡 Bot 10 daqiqadan keyin qayta ulanadi.');
      return false;
    };

    // Bot launch ni catch bilan o'raymiz - server crash qilmasligi uchun
    launchBot().catch(err => {
      console.error('Bot launch xatosi:', err.message);
      // 10 daqiqadan keyin qayta urinish (logOut timeout uchun)
      console.log('⏳ 10 daqiqadan keyin qayta uriniladi (logOut timeout)...');
      setTimeout(() => {
        console.log('🔄 Qayta urinish boshlanmoqda...');
        launchBot().catch(e => console.error('Qayta urinish xatosi:', e.message));
      }, 10 * 60 * 1000); // 10 daqiqa
    });

    // Graceful shutdown
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  }
  
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
