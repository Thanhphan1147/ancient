import { Server } from "colyseus";
import { WebSocketTransport } from "@colyseus/ws-transport";
import express from "express";
import path from "path";
import { createServer } from "http";
import { LobbyRoom } from "./rooms/LobbyRoom";

const app = express();
const PORT = Number(process.env.PORT) || 2567;

// ── Serve the Vite-built client as static files ─────────────
// In production the client build output lives at /app/client-dist
const clientDistPath = path.resolve(__dirname, "..", "client-dist");
app.use(express.static(clientDistPath));

// SPA fallback: any non-API, non-WS route serves index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

const httpServer = createServer(app);

// ── Colyseus game server ────────────────────────────────────
const gameServer = new Server({
  transport: new WebSocketTransport({ server: httpServer }),
});

gameServer.define("lobby", LobbyRoom);

httpServer.listen(PORT, () => {
  console.log(`⚔️  Project Ancient server listening on http://0.0.0.0:${PORT}`);
});
