# Technical Design Document: "Project Ancient"

## 1. Overview

"Project Ancient" is a web-based, 2D turn-based tactical strategy game. It features manual room-based multiplayer (1v1) with a strict authoritative server model to prevent cheating. The visual identity evokes nostalgic 16-bit J2ME flip-phone games: highly saturated colors, chunky pixel art, and high-contrast UI. The gameplay mechanics and rules are strictly inspired by the classic mobile game *Ancient Empires*.

## 2. Technology Stack

* **Frontend UI Shell:** Svelte 5 (utilizing Runes for reactivity and state management).
* **Frontend Styling:** Tailwind CSS (configured for retro/brutalist aesthetics).
* **Frontend Game Engine:** Phaser 3 (TypeScript) for canvas rendering, tilemaps, and animations.
* **Backend Server:** Node.js + Colyseus framework for authoritative state synchronization and WebSockets.
* **Shared Logic:** TypeScript. A `/shared` workspace will contain data models, grid math, terrain definitions, and pure functions for command validation used by both client and server.

## 3. Architecture & Data Flow

The game adheres to an **Authoritative Server Model**. The client is a "dumb" renderer that only displays the state and requests actions.

* **Decoupled Rooms:** The MVP starts with manual room creation/joining (e.g., Room code `XYZ`). The core game logic is entirely agnostic to how players enter the room, allowing for seamless integration of an automated Matchmaker later.
* **State Synchronization:** Colyseus maintains the master `GameState` (grid data, unit positions, health, turn order).
* **Action Flow (Command Pattern):**
1. Player clicks a unit and selects a target tile.
2. Svelte/Phaser client sends a `Command` payload (e.g., `MoveAttackCommand`) to Colyseus.
3. Server validates the command against the shared TypeScript rules (Is it their turn? Is the move valid? Is the target in range?).
4. If valid, the server executes the math, mutates the `GameState`, and broadcasts the changes.
5. Clients listen to state mutations, play the relevant animations (walk, attack, take damage), and update the UI.


* **Reconnection:** The server uses session IDs (not just ephemeral WebSocket connection IDs) so players can refresh their browser and instantly rejoin their active room.

## 4. UI/UX Design System (The "Royal Fantasy" Retro Theme)

The UI must evoke the chunky, tactile feel of 2005-era mobile gaming.

### Color Palette

| Role | Color Name | Hex Code | Usage Notes |
| --- | --- | --- | --- |
| **UI Background** | Deep Slate | `#1E1E24` | Menus, modals, and the outer web shell. |
| **UI Panels** | Aged Parchment | `#E8D8B0` | Inner dialog boxes, unit stat cards, and tooltips. |
| **Faction 1 (P1)** | Royal Blue | `#2B59C3` | P1 units, cursor highlights, and UI elements. |
| **Faction 2 (P2)** | Crimson | `#D92121` | P2 units and UI elements. High contrast against terrain. |
| **Accents/Borders** | Kingsgold | `#F2C94C` | Active buttons, selected unit borders, victory text. |
| **Outlines/Shadows** | Pure Black | `#000000` | Mandatory 1px black outline for all UI elements and sprites. |

### Styling Rules

* **Hard Shadows (Brutalism):** Disable modern soft/blurred shadows. Extend Tailwind theme to include a custom hard shadow: `box-shadow: 4px 4px 0px #000000;`.
* **Tactile Buttons:** Interactive buttons should simulate physical presses by translating down/right (`translate-x-1 translate-y-1`) and removing the shadow on active/click states.
* **9-Slice Scaling:** Use 9-slice techniques for retro UI panels with ornate corners.
* **Pixel-Perfect Canvas:** Apply `image-rendering: pixelated;` (or `crisp-edges`) to the Phaser canvas wrapper and HTML image elements to prevent browser anti-aliasing.
* **Typography:** Globally apply pixel-art bitmap web fonts (e.g., "Press Start 2P" or "VT323"). Font sizes must be multiples of the base pixel size.

## 5. Game Mechanics & Grid System

* **Grid Type:** 2D Orthogonal Square Grid. Separation of logical grid coordinates (e.g., x:2, y:3) and pixel rendering coordinates.
* **Pathfinding:** 4-way movement only (Up, Down, Left, Right). The shared logic must use **Manhattan Distance** combined with Dijkstra's or A* algorithm to calculate valid movement ranges based on dynamic terrain costs.

## 6. Terrain Dictionary

Terrain dictates movement cost (MP) and defensive mitigation.

| Terrain Type | Move Cost (MP) | Defense Bonus | Special Rules |
| --- | --- | --- | --- |
| **Plains/Grass** | 1 | 0% | Default terrain. |
| **Forest** | 2 | +15% |  |
| **Mountains** | 3 | +30% | Impassable for certain future unit types. |
| **House/Village** | 1 | +15% | Heals occupying unit by 20% at the start of their turn. |
| **Castle** | 1 | +30% | Heals occupying unit by 20%. Acts as spawn point. Tied to win condition. |

## 7. Unit Dictionary (MVP Phase)

All units have a strict maximum Health of 100.

| Unit Type | Max HP | Movement (MP) | Attack Range | Base Damage | Special Rules |
| --- | --- | --- | --- | --- | --- |
| **Hero** | 100 | 5 | 1 (Melee) | 45 | High survivability. Tied to win/loss condition. |
| **Soldier** | 100 | 4 | 1 (Melee) | 30 | Standard infantry. |
| **Archer** | 100 | 3 | 2 (Ranged) | 35 | Strict 2-range (cannot attack adjacent tiles). Takes no counter-attack damage from melee units when attacking. |

## 8. Combat Math & Turn Resolution

A unit's current health acts as a multiplier for its attack power (e.g., a unit at 50% health only deals 50% of its base damage). The server calculates combat using this strict flow:

1. **Calculate Attack Power:** `Attacker Base Damage * (Attacker Current HP / 100)`
2. **Apply Terrain Mitigation:** `Final Damage = Attack Power * (1 - Defender Terrain Defense %)`
3. **Execute Damage:** Subtract `Final Damage` from Defender's HP.
4. **Counter-Attack Resolution:** IF the Defender survives, AND is in valid range of the Attacker, AND is not a melee unit attacking an Archer at range, the Defender automatically counter-attacks. The counter-attack damage uses the Defender's *newly reduced HP* for step 1.

## 9. Win/Loss Condition

The server checks the board state at the end of every action.

* **Loss Condition:** A player is instantly eliminated if they control **0 Castles AND 0 Heroes**.
