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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const tts_service_1 = require("./tts.service");
const audio_scripts_service_1 = require("./audio-scripts.service");
const client_1 = require("@prisma/client");
let AudioService = class AudioService {
    prisma;
    ttsService;
    scriptsService;
    constructor(prisma, ttsService, scriptsService) {
        this.prisma = prisma;
        this.ttsService = ttsService;
        this.scriptsService = scriptsService;
    }
    async getOrGenerateAudio(category, variant, voiceType, params) {
        const existingAudio = await this.prisma.audioScript.findUnique({
            where: {
                category_variant: { category, variant },
            },
        });
        const voiceField = this.getVoiceField(voiceType);
        if (existingAudio && existingAudio[voiceField]) {
            return {
                audioUrl: this.ttsService.getAudioUrl(existingAudio[voiceField]),
                text: params
                    ? this.scriptsService.fillTemplate(existingAudio.textUz, params)
                    : existingAudio.textUz,
                duration: existingAudio.duration,
            };
        }
        const script = this.scriptsService.getScript(category, variant);
        if (!script) {
            throw new common_1.NotFoundException(`Script topilmadi: ${category} - ${variant}`);
        }
        const text = params
            ? this.scriptsService.fillTemplate(script.textUz, params)
            : script.textUz;
        const audioFileName = await this.ttsService.generateAudio(text, voiceType);
        await this.prisma.audioScript.upsert({
            where: {
                category_variant: { category, variant },
            },
            create: {
                category,
                variant,
                textUz: script.textUz,
                [voiceField]: audioFileName,
            },
            update: {
                [voiceField]: audioFileName,
            },
        });
        return {
            audioUrl: this.ttsService.getAudioUrl(audioFileName),
            text,
            duration: null,
        };
    }
    async getGameAudioPack(variant, voiceType) {
        const categories = [
            client_1.AudioCategory.GAME_START,
            client_1.AudioCategory.NIGHT_START,
            client_1.AudioCategory.MAFIA_WAKE,
            client_1.AudioCategory.SHERIFF_WAKE,
            client_1.AudioCategory.DOCTOR_WAKE,
            client_1.AudioCategory.DON_WAKE,
            client_1.AudioCategory.MORNING_NO_DEATH,
            client_1.AudioCategory.MORNING_DEATH,
            client_1.AudioCategory.DISCUSSION,
            client_1.AudioCategory.VOTING,
            client_1.AudioCategory.ELIMINATION,
            client_1.AudioCategory.WIN_CIVILIANS,
            client_1.AudioCategory.WIN_MAFIA,
        ];
        const audioPack = {};
        for (const category of categories) {
            try {
                audioPack[category] = await this.getOrGenerateAudio(category, variant, voiceType);
            }
            catch (error) {
                audioPack[category] = null;
            }
        }
        return audioPack;
    }
    async seedScripts() {
        const scripts = this.scriptsService.getAllScripts();
        for (const script of scripts) {
            await this.prisma.audioScript.upsert({
                where: {
                    category_variant: {
                        category: script.category,
                        variant: script.variant,
                    },
                },
                create: {
                    category: script.category,
                    variant: script.variant,
                    textUz: script.textUz,
                    textRu: script.textRu,
                },
                update: {
                    textUz: script.textUz,
                    textRu: script.textRu,
                },
            });
        }
        return { seeded: scripts.length };
    }
    async generateAllAudios(voiceType) {
        const scripts = await this.prisma.audioScript.findMany({
            where: { isActive: true },
        });
        const voiceField = this.getVoiceField(voiceType);
        let generated = 0;
        for (const script of scripts) {
            if (!script[voiceField]) {
                const audioFileName = await this.ttsService.generateAudio(script.textUz, voiceType);
                await this.prisma.audioScript.update({
                    where: { id: script.id },
                    data: { [voiceField]: audioFileName },
                });
                generated++;
            }
        }
        return { generated, total: scripts.length };
    }
    getVoiceField(voiceType) {
        const mapping = {
            [client_1.VoiceType.MALE_1]: 'audioMale1',
            [client_1.VoiceType.MALE_2]: 'audioMale2',
            [client_1.VoiceType.FEMALE_1]: 'audioFemale1',
            [client_1.VoiceType.FEMALE_2]: 'audioFemale2',
        };
        return mapping[voiceType];
    }
    async getAtmosphereSounds(category) {
        const where = category ? { category: category } : {};
        return this.prisma.atmosphereSound.findMany({
            where: { ...where, isActive: true },
        });
    }
};
exports.AudioService = AudioService;
exports.AudioService = AudioService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tts_service_1.TtsService,
        audio_scripts_service_1.AudioScriptsService])
], AudioService);
//# sourceMappingURL=audio.service.js.map