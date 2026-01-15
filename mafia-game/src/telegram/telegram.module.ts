import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const proxyUrl = configService.get('TELEGRAM_PROXY_URL');
        
        console.log('🤖 Telegram bot configuration:', {
          isProduction,
          tokenExists: !!configService.get('TELEGRAM_BOT_TOKEN'),
          webAppUrl: configService.get('TELEGRAM_WEBAPP_URL'),
          proxyEnabled: !!proxyUrl,
        });
        
        // Agar proxy URL berilgan bo'lsa, agent yaratamiz
        const telegrafOptions: any = {
          token: configService.get('TELEGRAM_BOT_TOKEN') || '',
          // launchOptions butunlay olib tashlandi - faqat main.ts'da manual webhook
        };

        if (proxyUrl) {
          const agent = new HttpsProxyAgent(proxyUrl);
          telegrafOptions.telegram = {
            agent: agent,
          };
          console.log('🔄 Telegram proxy orqali ulanadi:', proxyUrl);
        }
        
        return telegrafOptions;
      },
      inject: [ConfigService],
    }),
    UsersModule,
    RoomsModule,
  ],
  providers: [TelegramService, TelegramUpdate],
  exports: [TelegramService],
})
export class TelegramModule {}
