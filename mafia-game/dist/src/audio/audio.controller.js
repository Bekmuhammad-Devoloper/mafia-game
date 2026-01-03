"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const audio_service_1 = require("./audio.service");
const tts_service_1 = require("./tts.service");
const client_1 = require("@prisma/client");
let AudioController = class AudioController {
    audioService;
    ttsService;
    constructor(audioService, ttsService) {
        this.audioService = audioService;
        this.ttsService = ttsService;
    }
    async getAudio(category, variant, voiceType) {
        return this.audioService.getOrGenerateAudio(category, variant || 1, voiceType || client_1.VoiceType.MALE_1);
    }
    async getAudioPack(variant, voiceType) {
        return this.audioService.getGameAudioPack(variant, voiceType || client_1.VoiceType.MALE_1);
    }
    async getAudioFile(fileName, res) {
        const audioBuffer = await this.ttsService.getAudioFile(fileName);
        if (!audioBuffer) {
            return res.status(404).json({ error: 'Audio topilmadi' });
        }
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length,
        });
        return res.send(audioBuffer);
    }
    async getAtmosphereSounds(category) {
        return this.audioService.getAtmosphereSounds(category);
    }
    async seedScripts() {
        return this.audioService.seedScripts();
    }
    async generateAllAudios(voiceType) {
        return this.audioService.generateAllAudios(voiceType);
    }
};
exports.AudioController = AudioController;
__decorate([
    (0, common_1.Get)('script/:category'),
    (0, swagger_1.ApiOperation)({ summary: 'Kategoriya bo\'yicha audio olish' }),
    (0, swagger_1.ApiQuery)({ name: 'variant', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'voiceType', required: false, enum: client_1.VoiceType }),
    __param(0, (0, common_1.Param)('category')),
    __param(1, (0, common_1.Query)('variant')),
    __param(2, (0, common_1.Query)('voiceType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "getAudio", null);
__decorate([
    (0, common_1.Get)('pack/:variant'),
    (0, swagger_1.ApiOperation)({ summary: 'O\'yin uchun audio to\'plami' }),
    (0, swagger_1.ApiQuery)({ name: 'voiceType', required: false, enum: client_1.VoiceType }),
    __param(0, (0, common_1.Param)('variant')),
    __param(1, (0, common_1.Query)('voiceType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "getAudioPack", null);
__decorate([
    (0, common_1.Get)('file/:fileName'),
    (0, swagger_1.ApiOperation)({ summary: 'Audio faylni yuklab olish' }),
    __param(0, (0, common_1.Param)('fileName')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "getAudioFile", null);
__decorate([
    (0, common_1.Get)('atmosphere'),
    (0, swagger_1.ApiOperation)({ summary: 'Atmosfera tovushlari' }),
    (0, swagger_1.ApiQuery)({ name: 'category', required: false }),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "getAtmosphereSounds", null);
__decorate([
    (0, common_1.Post)('seed'),
    (0, swagger_1.ApiOperation)({ summary: 'Skriptlarni DB ga yuklash' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "seedScripts", null);
__decorate([
    (0, common_1.Post)('generate-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Barcha audiolarni generatsiya qilish' }),
    (0, swagger_1.ApiQuery)({ name: 'voiceType', required: true, enum: client_1.VoiceType }),
    __param(0, (0, common_1.Query)('voiceType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AudioController.prototype, "generateAllAudios", null);
exports.AudioController = AudioController = __decorate([
    (0, swagger_1.ApiTags)('Audio'),
    (0, common_1.Controller)('audio'),
    __metadata("design:paramtypes", [audio_service_1.AudioService,
        tts_service_1.TtsService])
], AudioController);
//# sourceMappingURL=audio.controller.js.map