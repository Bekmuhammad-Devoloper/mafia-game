import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';
import { UsersModule } from '../users/users.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        console.log('🤖 Telegram bot configuration:', {
          isProduction,
          tokenExists: !!configService.get('TELEGRAM_BOT_TOKEN'),
          webAppUrl: configService.get('TELEGRAM_WEBAPP_URL'),
        });
        
        return {
          token: configService.get('TELEGRAM_BOT_TOKEN') || '',
          launchOptions: isProduction
            ? {
                webhook: {
                  domain: configService.get('TELEGRAM_WEBHOOK_URL') || '',
                  hookPath: '/webhook',
                },
              }
            : {
                // Development rejimida polling ishlatiladi
                dropPendingUpdates: true,
              },
        };
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
