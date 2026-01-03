import { create } from 'zustand';

// Types
export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  voiceType: 'MALE_1' | 'MALE_2' | 'FEMALE_1' | 'FEMALE_2';
  voiceSpeed: number;
  volume: number;
  subtitlesEnabled: boolean;
  autoPlayEnabled: boolean;
  atmosphereEnabled: boolean;
  settings?: Record<string, any>;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  hostId: string;
  host: {
    id: string;
    firstName: string;
    lastName?: string;
    username?: string;
    avatarUrl?: string;
  };
  minPlayers: number;
  maxPlayers: number;
  discussionTime: number;
  votingTime: number;
  nightTime: number;
  storyVariant: string;
  status: 'WAITING' | 'STARTING' | 'IN_GAME' | 'FINISHED';
  currentPlayers?: number;
  playerIds?: string[];
  players: Array<{
    id: string;
    oderId?: string;
    userId: string;
    user?: {
      id: string;
      firstName: string;
      lastName?: string;
      username?: string;
    };
  }>;
}

export interface Player {
  id: string;
  oderId?: string;
  role?: 'CIVILIAN' | 'MAFIA' | 'DON' | 'SHERIFF' | 'DOCTOR';
  isAlive: boolean;
  user: {
    id: string;
    firstName: string;
    lastName?: string;
    username?: string;
    avatarUrl?: string;
  };
}

export interface Game {
  id: string;
  roomId: string;
  phase: 'ROLE_ASSIGNMENT' | 'NIGHT' | 'MAFIA_TURN' | 'SHERIFF_TURN' | 'DOCTOR_TURN' | 'DON_TURN' | 'MORNING' | 'DISCUSSION' | 'VOTING' | 'LAST_WORD' | 'GAME_OVER';
  dayNumber: number;
  audioVariant: number;
  winner?: 'MAFIA' | 'CIVILIAN';
  players: Player[];
  room: Room;
}

export interface AudioState {
  isPlaying: boolean;
  currentAudio?: {
    url: string;
    text: string;
    category: string;
  };
}

// User Store
interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  updateSettings: (settings: Partial<User>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null,
  })),
  updateSettings: (settings) => set((state) => ({
    user: state.user ? { ...state.user, ...settings } : null,
  })),
  clearUser: () => set({ user: null, isLoading: false }),
}));

// Room Store
interface RoomStore {
  room: Room | null;
  currentRoom: Room | null;
  players: string[];
  setRoom: (room: Room) => void;
  setCurrentRoom: (room: Room | null) => void;
  updateRoom: (updates: Partial<Room>) => void;
  setPlayers: (players: string[]) => void;
  addPlayer: (playerId: string) => void;
  removePlayer: (playerId: string) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  currentRoom: null,
  players: [],
  setRoom: (room) => set({ room, currentRoom: room }),
  setCurrentRoom: (room) => set({ currentRoom: room }),
  updateRoom: (updates) => set((state) => ({
    currentRoom: state.currentRoom ? { ...state.currentRoom, ...updates } : null,
    room: state.room ? { ...state.room, ...updates } : null,
  })),
  setPlayers: (players) => set({ players }),
  addPlayer: (playerId) => set((state) => ({
    players: [...state.players, playerId],
  })),
  removePlayer: (playerId) => set((state) => ({
    players: state.players.filter(id => id !== playerId),
  })),
  clearRoom: () => set({ room: null, currentRoom: null, players: [] }),
}));

// Game Store
interface GameStore {
  game: Game | null;
  myRole?: string;
  mafiaMembers: Player[];
  selectedTarget?: string;
  votes: Map<string, string>;
  
  setGame: (game: Game) => void;
  setMyRole: (role: string) => void;
  setMafiaMembers: (members: Player[]) => void;
  setSelectedTarget: (targetId?: string) => void;
  addVote: (fromId: string, toId: string) => void;
  clearVotes: () => void;
  updatePlayer: (playerId: string, data: Partial<Player>) => void;
  clearGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  game: null,
  myRole: undefined,
  mafiaMembers: [],
  selectedTarget: undefined,
  votes: new Map(),
  
  setGame: (game) => set({ game }),
  setMyRole: (role) => set({ myRole: role }),
  setMafiaMembers: (members) => set({ mafiaMembers: members }),
  setSelectedTarget: (targetId) => set({ selectedTarget: targetId }),
  addVote: (fromId, toId) => set((state) => {
    const newVotes = new Map(state.votes);
    newVotes.set(fromId, toId);
    return { votes: newVotes };
  }),
  clearVotes: () => set({ votes: new Map() }),
  updatePlayer: (playerId, data) => set((state) => {
    if (!state.game) return state;
    
    const players = state.game.players.map(p => 
      p.id === playerId ? { ...p, ...data } : p
    );
    
    return { game: { ...state.game, players } };
  }),
  clearGame: () => set({ 
    game: null, 
    myRole: undefined, 
    mafiaMembers: [], 
    selectedTarget: undefined,
    votes: new Map(),
  }),
}));

// Audio Store
interface AudioStore {
  audio: AudioState;
  volume: number;
  subtitlesEnabled: boolean;
  
  setPlaying: (isPlaying: boolean) => void;
  setCurrentAudio: (audio?: { url: string; text: string; category: string }) => void;
  setVolume: (volume: number) => void;
  setSubtitlesEnabled: (enabled: boolean) => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  audio: { isPlaying: false },
  volume: 80,
  subtitlesEnabled: true,
  
  setPlaying: (isPlaying) => set((state) => ({
    audio: { ...state.audio, isPlaying },
  })),
  setCurrentAudio: (currentAudio) => set((state) => ({
    audio: { ...state.audio, currentAudio, isPlaying: !!currentAudio },
  })),
  setVolume: (volume) => set({ volume }),
  setSubtitlesEnabled: (subtitlesEnabled) => set({ subtitlesEnabled }),
}));

// UI Store
interface UIStore {
  isLoading: boolean;
  error?: string;
  notification?: { type: 'success' | 'error' | 'info'; message: string };
  
  setLoading: (isLoading: boolean) => void;
  setError: (error?: string) => void;
  showNotification: (type: 'success' | 'error' | 'info', message: string) => void;
  clearNotification: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isLoading: false,
  error: undefined,
  notification: undefined,
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  showNotification: (type, message) => set({ notification: { type, message } }),
  clearNotification: () => set({ notification: undefined }),
}));
