"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const nestjs_telegraf_1 = require("nestjs-telegraf");
process.on('uncaughtException', (err) => {
    console.error('⚠️ Uncaught Exception:', err.message);
    if (err.message?.includes('409') || err.message?.includes('Conflict')) {
        console.log('📱 Bot conflict xatosi - server ishlashda davom etadi');
    }
});
process.on('unhandledRejection', (reason) => {
    console.error('⚠️ Unhandled Rejection:', reason?.message || reason);
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Mafia O\'yini API')
        .setDescription('Telegram Web App Mafia o\'yini - ovozli hikoyachi bilan')
        .setVersion('1.0')
        .addTag('Users', 'Foydalanuvchilar')
        .addTag('Rooms', 'O\'yin xonalari')
        .addTag('Game', 'O\'yin jarayoni')
        .addTag('Audio', 'Ovozli hikoyachi')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    const port = process.env.PORT || 3000;
    await app.listen(port);
    const bot = app.get((0, nestjs_telegraf_1.getBotToken)());
    const isProduction = process.env.NODE_ENV === 'production';
    if (!isProduction) {
        const launchBot = async (retries = 5) => {
            for (let i = 0; i < retries; i++) {
                try {
                    console.log(`🤖 Telegram botga ulanmoqda... (urinish ${i + 1}/${retries})`);
                    try {
                        await bot.telegram.deleteWebhook({ drop_pending_updates: true });
                    }
                    catch (webhookErr) {
                        console.log('⚠️ Webhook o\'chirish xatosi (davom etamiz)');
                    }
                    await bot.launch({
                        dropPendingUpdates: true,
                        allowedUpdates: ['message', 'callback_query'],
                    });
                    console.log('✅ Telegram bot polling rejimida ishga tushdi!');
                    console.log('📱 Botga /start yuboring: https://t.me/MafiaVoiceUzBot');
                    return true;
                }
                catch (err) {
                    console.error(`❌ Telegram bot xatosi (urinish ${i + 1}):`, err.message);
                    if (err.message?.includes('409') || err.response?.error_code === 409) {
                        if (i < retries - 1) {
                            const waitTime = 30 + (i * 10);
                            console.log(`⏳ Boshqa bot instance to'xtashini kutamiz (${waitTime} soniya)...`);
                            await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
                        }
                    }
                    else if (i < retries - 1) {
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
        launchBot().catch(err => {
            console.error('Bot launch xatosi:', err.message);
            console.log('⏳ 10 daqiqadan keyin qayta uriniladi (logOut timeout)...');
            setTimeout(() => {
                console.log('🔄 Qayta urinish boshlanmoqda...');
                launchBot().catch(e => console.error('Qayta urinish xatosi:', e.message));
            }, 10 * 60 * 1000);
        });
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
//# sourceMappingURL=main.js.map