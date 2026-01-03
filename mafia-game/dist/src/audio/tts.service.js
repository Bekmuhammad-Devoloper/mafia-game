"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TtsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TtsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let TtsService = TtsService_1 = class TtsService {
    configService;
    logger = new common_1.Logger(TtsService_1.name);
    audioPath;
    constructor(configService) {
        this.configService = configService;
        this.audioPath = this.configService.get('AUDIO_STORAGE_PATH') || './storage/audio';
        this.ensureDirectory(this.audioPath);
    }
    ensureDirectory(dirPath) {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }
    async generateAudio(text, voiceType = 'MALE_1') {
        const fileName = `${Date.now()}_${voiceType}.mp3`;
        const filePath = path.join(this.audioPath, fileName);
        const apiKey = this.configService.get('ELEVENLABS_API_KEY');
        if (apiKey && apiKey !== 'your-elevenlabs-api-key') {
            try {
                const audioBuffer = await this.elevenLabsGenerate(text, voiceType, apiKey);
                fs.writeFileSync(filePath, audioBuffer);
                return fileName;
            }
            catch (error) {
                this.logger.error('ElevenLabs error:', error);
            }
        }
        this.logger.warn('Using mock TTS - no real audio generated');
        fs.writeFileSync(filePath, Buffer.from(''));
        return fileName;
    }
    async elevenLabsGenerate(text, voiceType, apiKey) {
        const voiceIds = {
            'MALE_1': 'pNInz6obpgDQGcFmaJgB',
            'MALE_2': '21m00Tcm4TlvDq8ikWAM',
            'FEMALE_1': 'EXAVITQu4vr4xnSDxMaL',
            'FEMALE_2': 'MF3mGyEYCl7XYWbV9V6O',
        };
        const voiceId = voiceIds[voiceType] || voiceIds['MALE_1'];
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
            },
            body: JSON.stringify({
                text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.5,
                    use_speaker_boost: true,
                },
            }),
        });
        if (!response.ok) {
            throw new Error(`ElevenLabs API error: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        return Buffer.from(arrayBuffer);
    }
    async googleTtsGenerate(text, voiceType) {
        throw new Error('Google TTS not implemented yet');
    }
    async getAudioFile(fileName) {
        const filePath = path.join(this.audioPath, fileName);
        if (fs.existsSync(filePath)) {
            return fs.readFileSync(filePath);
        }
        return null;
    }
    async deleteAudioFile(fileName) {
        const filePath = path.join(this.audioPath, fileName);
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                return true;
            }
        }
        catch (error) {
            this.logger.error('Error deleting audio file:', error);
        }
        return false;
    }
    getAudioUrl(fileName) {
        const baseUrl = this.configService.get('CDN_BASE_URL') || 'http://localhost:3000/audio';
        return `${baseUrl}/${fileName}`;
    }
};
exports.TtsService = TtsService;
exports.TtsService = TtsService = TtsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TtsService);
//# sourceMappingURL=tts.service.js.map