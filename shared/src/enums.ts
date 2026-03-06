/**
 * Terrain types available on the game grid.
 * @see TDD Section 6 – Terrain Dictionary
 */
export enum TerrainType {
  PLAINS = "PLAINS",
  FOREST = "FOREST",
  MOUNTAINS = "MOUNTAINS",
  HOUSE = "HOUSE",
  CASTLE = "CASTLE",
}

/**
 * Unit archetypes available in the MVP.
 * @see TDD Section 7 – Unit Dictionary
 */
export enum UnitType {
  HERO = "HERO",
  SOLDIER = "SOLDIER",
  ARCHER = "ARCHER",
}

/**
 * High-level game-room lifecycle states.
 */
export enum GameStateStatus {
  WAITING_FOR_PLAYERS = "WAITING_FOR_PLAYERS",
  P1_TURN = "P1_TURN",
  P2_TURN = "P2_TURN",
  GAME_OVER = "GAME_OVER",
}
