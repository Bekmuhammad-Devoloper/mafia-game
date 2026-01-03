import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { GameModule } from './game/game.module';
import { AudioModule } from './audio/audio.module';
import { TelegramModule } from './telegram/telegram.module';
import { GatewayModule } from './gateway/gateway.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Static files (audio)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage', 'audio'),
      serveRoot: '/audio',
    }),
    
    // Database
    PrismaModule,
    
    // Feature modules
    UsersModule,
    RoomsModule,
    GameModule,
    AudioModule,
    TelegramModule, // Telegram bot yoqildi
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
