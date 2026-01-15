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

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Manual Telegraf instance yaratish (nestjs-telegraf o'rniga)
  const configService = app.get(ConfigService);
  const token = configService.get('TELEGRAM_BOT_TOKEN');
  const bot = new Telegraf(token);
  
  const webhookDomain = process.env.TELEGRAM_WEBHOOK_DOMAIN || 'https://mafiya.bekmuhammad.uz';
  const webhookPath = '/webhook/telegram';
  
  try {
    console.log('🤖 Telegram bot webhook rejimiga o\'rnatilmoqda...');
    
    // Webhook URL
    const webhookUrl = `${webhookDomain}${webhookPath}`;
    
    // Webhook o'rnatish
    await bot.telegram.setWebhook(webhookUrl, {
      drop_pending_updates: true,
      allowed_updates: ['message', 'callback_query'],
    });
    
    console.log(`✅ Telegram bot webhook rejimida ishga tushdi!`);
    console.log(`📡 Webhook URL: ${webhookUrl}`);
    console.log('📱 Botga /start yuboring: https://t.me/MafiaVoiceUzBot');
    
    // Webhook verify
    const webhookInfo = await bot.telegram.getWebhookInfo();
    console.log('🔍 Webhook holati:', {
      url: webhookInfo.url,
      has_custom_certificate: webhookInfo.has_custom_certificate,
      pending_update_count: webhookInfo.pending_update_count,
    });
  } catch (err: any) {
    console.error('❌ Webhook o\'rnatish xatosi:', err.message);
    console.log('📱 Server ishlayapti, API\'lar tayyor!');
  }
  
  // Webhook endpoint
  app.use(bot.webhookCallback(webhookPath));
  
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
