<script lang="ts">
  import { Client, type Room } from "colyseus.js";

  let playerName = $state("");
  let roomCode = $state("");
  let statusMessage = $state("");
  let statusTone = $state<"info" | "error" | "success">("info");
  let connected = $state(false);
  let playersCount = $state(0);

  let activeRoom: Room | null = null;

  function getClient() {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return new Client(`${protocol}://${window.location.host}`);
  }

  function updateStatus(message: string, tone: "info" | "error" | "success" = "info") {
    statusMessage = message;
    statusTone = tone;
  }

  function attachRoomHandlers(room: Room) {
    room.onStateChange((state: any) => {
      playersCount = state?.players?.size ?? 0;
    });
    room.onLeave(() => {
      connected = false;
      playersCount = 0;
      updateStatus("Disconnected from room.", "error");
    });
  }

  async function handleCreate() {
    if (!playerName.trim()) {
      updateStatus("Enter your name, warrior!", "error");
      return;
    }
    if (connected) {
      updateStatus("You are already in a room.", "info");
      return;
    }

    updateStatus(`Creating room for ${playerName}…`);
    try {
      const client = getClient();
      activeRoom = await client.create("lobby", { name: playerName.trim() });
      connected = true;
      roomCode = activeRoom.id;
      attachRoomHandlers(activeRoom);
      updateStatus(`Room created: ${activeRoom.id}`, "success");
    } catch (error) {
      updateStatus("Failed to create room. Try again.", "error");
      console.error(error);
    }
  }

  async function handleJoin() {
    if (!playerName.trim()) {
      updateStatus("Enter your name, warrior!", "error");
      return;
    }
    if (!roomCode.trim()) {
      updateStatus("Enter a room code!", "error");
      return;
    }
    if (connected) {
      updateStatus("You are already in a room.", "info");
      return;
    }

    updateStatus(`Joining room ${roomCode.toUpperCase()}…`);
    try {
      const client = getClient();
      activeRoom = await client.joinById(roomCode.trim(), { name: playerName.trim() });
      connected = true;
      attachRoomHandlers(activeRoom);
      updateStatus(`Joined room: ${activeRoom.id}`, "success");
    } catch (error) {
      updateStatus("Failed to join room. Check the code.", "error");
      console.error(error);
    }
  }

  async function handleLeave() {
    if (!activeRoom) {
      updateStatus("Not connected to a room.", "info");
      return;
    }
    await activeRoom.leave();
    activeRoom = null;
    connected = false;
    playersCount = 0;
    updateStatus("Left the room.", "info");
  }
</script>

<main>
  <div class="title-block">
    <h1 class="game-title">⚔️ Project<br/>Ancient</h1>
    <p class="subtitle">Turn-Based Tactical Strategy</p>
  </div>

  <div class="panel lobby-panel">
    <div class="field">
      <label for="player-name">Your Name</label>
      <input
        id="player-name"
        type="text"
        placeholder="WARRIOR"
        maxlength="12"
        bind:value={playerName}
      />
    </div>

    <div class="button-group">
      <button class="primary" onclick={handleCreate} disabled={connected}>
        Create Room
      </button>
    </div>

    <div class="divider">── or join ──</div>

    <div class="field">
      <label for="room-code">Room Code</label>
      <input
        id="room-code"
        type="text"
        placeholder="ABC123"
        maxlength="9"
        bind:value={roomCode}
      />
    </div>

    <div class="button-group">
      <button class="secondary" onclick={handleJoin} disabled={connected}>
        Join Room
      </button>
    </div>

    {#if statusMessage}
      <p class={`status ${statusTone}`}>{statusMessage}</p>
    {/if}
  </div>

  {#if connected}
    <div class="panel status-panel">
      <h3>Room Status</h3>
      <p>Code: <strong>{roomCode}</strong></p>
      <p>Players: {playersCount}/2</p>
      <button class="gold" onclick={handleLeave}>Leave Room</button>
    </div>
  {/if}

  <footer class="version-footer">
    v0.1.0 MVP &middot; Colyseus + Svelte 5 + Phaser 3
  </footer>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem 1rem;
  }

  .title-block {
    text-align: center;
  }

  .game-title {
    font-size: 2.2rem;
    color: var(--kingsgold);
    text-shadow: 4px 4px 0px var(--pure-black);
    letter-spacing: 2px;
  }

  .subtitle {
    font-size: 0.7rem;
    color: var(--aged-parchment);
    margin-top: 0.5rem;
    opacity: 0.8;
  }

  .lobby-panel {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .field label {
    font-size: 0.65rem;
    text-align: left;
  }

  .field input {
    width: 100%;
  }

  .button-group {
    display: flex;
    justify-content: center;
  }

  .button-group button {
    width: 100%;
  }

  .divider {
    font-size: 0.6rem;
    text-align: center;
    opacity: 0.5;
    padding: 0.3rem 0;
  }

  .status {
    font-size: 0.6rem;
    text-align: center;
    margin: 0;
    padding-top: 0.5rem;
    background: none;
  }

  .status.info {
    color: var(--kingsgold);
  }

  .status.success {
    color: var(--royal-blue);
  }

  .status.error {
    color: var(--crimson);
  }

  .status-panel {
    width: 100%;
    max-width: 320px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .version-footer {
    font-size: 0.5rem;
    opacity: 0.4;
    margin-top: 1rem;
  }
</style>
