import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import {
  TerrainType,
  UnitType,
  GameStateStatus,
  MAX_UNIT_HEALTH,
} from "@ancient/shared";

// ─── PlayerSchema ───────────────────────────────────────────

/**
 * Network-synchronized player identity.
 */
export class PlayerSchema extends Schema {
  @type("string") id: string = "";
  @type("string") name: string = "";
  @type("string") factionColor: string = "";
}

// ─── TileSchema ─────────────────────────────────────────────

/**
 * A single cell on the game grid.
 * `terrainType` is stored as a string enum value so Colyseus can serialize it.
 */
export class TileSchema extends Schema {
  @type("uint8") x: number = 0;
  @type("uint8") y: number = 0;
  @type("string") terrainType: string = TerrainType.PLAINS;
}

// ─── UnitSchema ─────────────────────────────────────────────

/**
 * A single unit on the board.
 * Health defaults to MAX_UNIT_HEALTH (100) as required by the TDD.
 */
export class UnitSchema extends Schema {
  @type("string") id: string = "";
  @type("string") ownerId: string = "";
  @type("string") unitType: string = UnitType.SOLDIER;
  @type("uint8") x: number = 0;
  @type("uint8") y: number = 0;
  @type("uint8") health: number = MAX_UNIT_HEALTH; // Strict 100
  @type("boolean") hasMovedThisTurn: boolean = false;
}

// ─── GameState ──────────────────────────────────────────────

/**
 * Root Colyseus state that is synchronized to every connected client.
 *
 * - `players`     → MapSchema keyed by session ID
 * - `tiles`       → ArraySchema representing the flat grid
 * - `units`       → ArraySchema of all living units
 * - `currentTurn` → session ID of the player whose turn it is
 * - `status`      → high-level game lifecycle phase
 */
export class GameRoomState extends Schema {
  @type({ map: PlayerSchema }) players = new MapSchema<PlayerSchema>();
  @type([TileSchema]) tiles = new ArraySchema<TileSchema>();
  @type([UnitSchema]) units = new ArraySchema<UnitSchema>();
  @type("string") currentTurn: string = "";
  @type("string") status: string = GameStateStatus.WAITING_FOR_PLAYERS;
}
