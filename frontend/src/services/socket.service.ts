import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(`${SOCKET_URL}/game`, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Re-attach listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach(callback => {
        this.socket?.on(event, callback as any);
      });
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  emit(event: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      this.socket.emit(event, data, (response: any) => {
        if (response?.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    this.socket?.on(event, callback as any);
  }

  off(event: string, callback?: Function) {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      this.socket?.off(event, callback as any);
    } else {
      this.listeners.delete(event);
      this.socket?.off(event);
    }
  }

  // Game specific methods
  joinRoom(roomId: string, userId: string, userName: string) {
    return this.emit('join_room', { roomId, userId, userName });
  }

  leaveRoom(roomId: string, userId: string) {
    return this.emit('leave_room', { roomId, userId });
  }

  startGame(roomId: string) {
    return this.emit('start_game', { roomId });
  }

  startNight(gameId: string, roomId: string) {
    return this.emit('start_night', { gameId, roomId });
  }

  mafiaAction(gameId: string, playerId: string, targetId: string) {
    return this.emit('mafia_action', { gameId, playerId, targetId });
  }

  sheriffAction(gameId: string, playerId: string, targetId: string) {
    return this.emit('sheriff_action', { gameId, playerId, targetId });
  }

  doctorAction(gameId: string, playerId: string, targetId: string) {
    return this.emit('doctor_action', { gameId, playerId, targetId });
  }

  donAction(gameId: string, playerId: string, targetId: string) {
    return this.emit('don_action', { gameId, playerId, targetId });
  }

  resolveNight(gameId: string, roomId: string, audioVariant: number) {
    return this.emit('resolve_night', { gameId, roomId, audioVariant });
  }

  startDiscussion(gameId: string, roomId: string, audioVariant: number, time: number) {
    return this.emit('start_discussion', { gameId, roomId, audioVariant, time });
  }

  startVoting(gameId: string, roomId: string, audioVariant: number) {
    return this.emit('start_voting', { gameId, roomId, audioVariant });
  }

  vote(gameId: string, fromPlayerId: string, toPlayerId: string) {
    return this.emit('vote', { gameId, fromPlayerId, toPlayerId });
  }

  resolveVoting(gameId: string, roomId: string, audioVariant: number) {
    return this.emit('resolve_voting', { gameId, roomId, audioVariant });
  }
}

export const socketService = new SocketService();
