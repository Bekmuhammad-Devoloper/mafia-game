import { StoryVariant } from '@prisma/client';
export declare class CreateRoomDto {
    name: string;
    hostId: string;
    minPlayers?: number;
    maxPlayers?: number;
    discussionTime?: number;
    votingTime?: number;
    nightTime?: number;
    storyVariant?: StoryVariant;
}
export declare class JoinRoomDto {
    code: string;
    userId: string;
}
export declare class UpdateRoomDto {
    name?: string;
    minPlayers?: number;
    maxPlayers?: number;
    discussionTime?: number;
    votingTime?: number;
    nightTime?: number;
    storyVariant?: StoryVariant;
}
