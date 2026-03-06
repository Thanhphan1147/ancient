import type { TerrainType, UnitType, GameStateStatus } from "./enums";

// ── Geometry ────────────────────────────────────────────────

/** Logical grid coordinate (column, row). */
export interface Position {
  x: number;
  y: number;
}

// ── Player ──────────────────────────────────────────────────

/** Minimal player identity synchronized by Colyseus. */
export interface Player {
  /** Colyseus session ID. */
  id: string;
  /** Display name chosen by the player. */
  name: string;
  /** Faction colour hex, e.g. "#2B59C3" (Royal Blue) or "#D92121" (Crimson). */
  factionColor: string;
}

// ── Terrain ─────────────────────────────────────────────────

/** Static definition of a terrain type from the TDD terrain dictionary. */
export interface TerrainDefinition {
  type: TerrainType;
  /** Movement-point cost to traverse this terrain. */
  moveCost: number;
  /** Defensive damage-mitigation percentage (0–1, e.g. 0.15 = 15%). */
  defenseBonus: number;
  /** If true, heals an occupying unit by 20% at the start of its owner's turn. */
  heals: boolean;
}

// ── Units ───────────────────────────────────────────────────

/** Static definition of a unit archetype from the TDD unit dictionary. */
export interface UnitDefinition {
  type: UnitType;
  /** Maximum (and starting) health. Always 100 in the MVP. */
  maxHp: number;
  /** Movement points per turn. */
  mp: number;
  /** Attack range in Manhattan-distance tiles. */
  range: number;
  /** Base damage before HP-scaling and terrain mitigation. */
  baseDamage: number;
}

// ── Tile ────────────────────────────────────────────────────

/** Runtime state of a single grid tile. */
export interface Tile {
  x: number;
  y: number;
  terrainType: TerrainType;
}

// ── Unit (runtime) ──────────────────────────────────────────

/** Runtime state of a single unit on the board. */
export interface Unit {
  id: string;
  ownerId: string;
  unitType: UnitType;
  x: number;
  y: number;
  health: number;
  hasMovedThisTurn: boolean;
}

// ── Game State (logical) ────────────────────────────────────

/** High-level snapshot used by shared pure-functions (not the Colyseus schema). */
export interface GameState {
  status: GameStateStatus;
  currentTurn: string;
  players: Record<string, Player>;
  tiles: Tile[];
  units: Unit[];
}
