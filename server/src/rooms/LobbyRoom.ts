import { Room, Client } from "colyseus";
import { GameRoomState, PlayerSchema } from "./schema/GameState";
import { GameStateStatus } from "@ancient/shared";

interface LobbyOptions {
  name?: string;
}

export class LobbyRoom extends Room<GameRoomState> {
  private hostSessionId: string | null = null;

  onCreate() {
    this.maxClients = 2;
    this.setState(new GameRoomState());
  }

  onJoin(client: Client, options: LobbyOptions) {
    const player = new PlayerSchema();
    player.id = client.sessionId;
    player.name = options.name?.trim() || "WARRIOR";

    const playerIndex = this.state.players.size;
    player.factionColor = playerIndex === 0 ? "#2B59C3" : "#D92121";

    this.state.players.set(client.sessionId, player);

    if (!this.hostSessionId) {
      this.hostSessionId = client.sessionId;
      this.state.currentTurn = client.sessionId;
    }

    if (this.state.players.size === 2) {
      this.state.status = GameStateStatus.P1_TURN;
    } else {
      this.state.status = GameStateStatus.WAITING_FOR_PLAYERS;
    }
  }

  onLeave(client: Client) {
    this.state.players.delete(client.sessionId);

    if (client.sessionId === this.hostSessionId) {
      const remaining = Array.from(this.state.players.keys());
      this.hostSessionId = remaining[0] ?? null;
      if (this.hostSessionId) {
        this.state.currentTurn = this.hostSessionId;
      }
    }

    if (this.state.players.size < 2) {
      this.state.status = GameStateStatus.WAITING_FOR_PLAYERS;
    }
  }
}
