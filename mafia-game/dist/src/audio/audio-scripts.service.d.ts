import { AudioCategory } from '@prisma/client';
export interface AudioScript {
    category: AudioCategory;
    variant: number;
    textUz: string;
    textRu?: string;
}
export declare class AudioScriptsService {
    private readonly gameStartScripts;
    private readonly nightStartScripts;
    private readonly mafiaWakeScripts;
    private readonly sheriffWakeScripts;
    private readonly doctorWakeScripts;
    private readonly donWakeScripts;
    private readonly morningNoDeathScripts;
    private readonly morningDeathScripts;
    private readonly discussionScripts;
    private readonly votingScripts;
    private readonly eliminationScripts;
    private readonly winCiviliansScripts;
    private readonly winMafiaScripts;
    private readonly roleScripts;
    private readonly playerJoinedScripts;
    private readonly timerWarningScripts;
    getAllScripts(): AudioScript[];
    getScript(category: AudioCategory, variant?: number): AudioScript | undefined;
    getScriptsByCategory(category: AudioCategory): AudioScript[];
    fillTemplate(text: string, params: Record<string, string>): string;
}
