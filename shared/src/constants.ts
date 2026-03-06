import { TerrainType, UnitType } from "./enums";
import type { TerrainDefinition, UnitDefinition } from "./types";

// ── Terrain Dictionary ──────────────────────────────────────
// @see TDD Section 6

export const TERRAIN_DICTIONARY: Readonly<Record<TerrainType, TerrainDefinition>> = {
  [TerrainType.PLAINS]: {
    type: TerrainType.PLAINS,
    moveCost: 1,
    defenseBonus: 0,
    heals: false,
  },
  [TerrainType.FOREST]: {
    type: TerrainType.FOREST,
    moveCost: 2,
    defenseBonus: 0.15,
    heals: false,
  },
  [TerrainType.MOUNTAINS]: {
    type: TerrainType.MOUNTAINS,
    moveCost: 3,
    defenseBonus: 0.30,
    heals: false,
  },
  [TerrainType.HOUSE]: {
    type: TerrainType.HOUSE,
    moveCost: 1,
    defenseBonus: 0.15,
    heals: true,
  },
  [TerrainType.CASTLE]: {
    type: TerrainType.CASTLE,
    moveCost: 1,
    defenseBonus: 0.30,
    heals: true,
  },
};

// ── Unit Dictionary ─────────────────────────────────────────
// @see TDD Section 7

export const UNIT_DICTIONARY: Readonly<Record<UnitType, UnitDefinition>> = {
  [UnitType.HERO]: {
    type: UnitType.HERO,
    maxHp: 100,
    mp: 5,
    range: 1,
    baseDamage: 45,
  },
  [UnitType.SOLDIER]: {
    type: UnitType.SOLDIER,
    maxHp: 100,
    mp: 4,
    range: 1,
    baseDamage: 30,
  },
  [UnitType.ARCHER]: {
    type: UnitType.ARCHER,
    maxHp: 100,
    mp: 3,
    range: 2,
    baseDamage: 35,
  },
};

/** Strict maximum health for all units in the MVP. */
export const MAX_UNIT_HEALTH = 100;

/** Healing percentage applied by House/Castle terrain at turn start. */
export const TERRAIN_HEAL_PERCENT = 0.20;
