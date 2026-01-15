"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const config_1 = require("@nestjs/config");
const telegram_service_1 = require("./telegram.service");
const telegram_update_1 = require("./telegram.update");
const users_module_1 = require("../users/users.module");
const rooms_module_1 = require("../rooms/rooms.module");
const https_proxy_agent_1 = require("https-proxy-agent");
let TelegramModule = class TelegramModule {
};
exports.TelegramModule = TelegramModule;
exports.TelegramModule = TelegramModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => {
                    const isProduction = configService.get('NODE_ENV') === 'production';
                    const proxyUrl = configService.get('TELEGRAM_PROXY_URL');
                    console.log('🤖 Telegram bot configuration:', {
                        isProduction,
                        tokenExists: !!configService.get('TELEGRAM_BOT_TOKEN'),
                        webAppUrl: configService.get('TELEGRAM_WEBAPP_URL'),
                        proxyEnabled: !!proxyUrl,
                    });
                    const telegrafOptions = {
                        token: configService.get('TELEGRAM_BOT_TOKEN') || '',
                    };
                    if (proxyUrl) {
                        const agent = new https_proxy_agent_1.HttpsProxyAgent(proxyUrl);
                        telegrafOptions.telegram = {
                            agent: agent,
                        };
                        console.log('🔄 Telegram proxy orqali ulanadi:', proxyUrl);
                    }
                    return telegrafOptions;
                },
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            rooms_module_1.RoomsModule,
        ],
        providers: [telegram_service_1.TelegramService, telegram_update_1.TelegramUpdate],
        exports: [telegram_service_1.TelegramService],
    })
], TelegramModule);
//# sourceMappingURL=telegram.module.js.map