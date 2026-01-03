const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Users
  async getUser(id: string) {
    return this.request(`/users/${id}`);
  }

  async getUserStats(id: string) {
    return this.request(`/users/${id}/stats`);
  }

  async updateUserSettings(id: string, settings: any) {
    return this.request(`/users/${id}/settings`, {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  async getLeaderboard(period: string = 'all', limit = 20) {
    return this.request(`/users/leaderboard?period=${period}&limit=${limit}`);
  }

  // Rooms
  async createRoom(data: {
    name: string;
    hostId: string;
    minPlayers?: number;
    maxPlayers?: number;
    discussionTime?: number;
    votingTime?: number;
    nightTime?: number;
    storyVariant?: number | string;
  }) {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRoom(id: string) {
    return this.request(`/rooms/${id}`);
  }

  async getRoomByCode(code: string) {
    return this.request(`/rooms/code/${code}`);
  }

  async getAvailableRooms() {
    return this.request('/rooms/available');
  }

  async joinRoom(roomId: string, userId: string) {
    return this.request(`/rooms/${roomId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async leaveRoom(roomId: string, userId: string) {
    return this.request(`/rooms/${roomId}/leave`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Game
  async startGame(roomId: string) {
    return this.request('/game/start', {
      method: 'POST',
      body: JSON.stringify({ roomId }),
    });
  }

  async getGameState(gameId: string) {
    return this.request(`/game/${gameId}`);
  }

  async getPlayerRole(gameId: string, userId: string) {
    return this.request(`/game/${gameId}/role/${userId}`);
  }

  async getMafiaMembers(gameId: string, userId: string) {
    return this.request(`/game/${gameId}/mafia/${userId}`);
  }

  // Audio
  async getAudio(category: string, variant = 1, voiceType = 'MALE_1') {
    return this.request(`/audio/script/${category}?variant=${variant}&voiceType=${voiceType}`);
  }

  async getAudioPack(variant: number, voiceType = 'MALE_1') {
    return this.request(`/audio/pack/${variant}?voiceType=${voiceType}`);
  }

  async getAtmosphereSounds(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request(`/audio/atmosphere${query}`);
  }
}

export const apiService = new ApiService();
