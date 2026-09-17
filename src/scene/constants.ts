export const GROUND_Y = -0.83;

export const SKY_TOP = 0x14102a;
export const SKY_HORIZON = 0x2c2648;
export const SKY_FOG = 0x1c1834;
export const AMBIENT_PURPLE = 0x7a6298;
export const HEMISPHERE_SKY = 0x6a5898;
export const MOON_LIGHT = 0xd8c4f8;
export const MOON_AMBIENT = 0x9a7ec0;
export const GROUND_TINT = 0x3a3228;

/** Dirección unitaria de la luna en cielo (compartida con cámara e iluminación). */
export const MOON_DIRECTION = {
  x: -0.42,
  y: 0.78,
  z: 0.36,
} as const;

export const PARTICLES_PER_FLAME = 120;
export const PARTICLES_PER_FLAME_DENSE = 22;
/** Partículas de humo por fuego activo. */
export const SMOKE_PER_FLAME = 56;
export const MAX_POINT_LIGHTS = 10;

export const BAMBOO_COUNT = 2100;
/** Anillo exterior de bambú para profundidad de horizonte. */
export const BAMBOO_RING_COUNT = 980;
export const BAMBOO_LEAF_COUNT = 9600;
export const BAMBOO_FALLEN_COUNT = 140;
/** Cañas caídas reservadas para escombros tras un rayo. */
export const BAMBOO_STRIKE_DEBRIS = 48;
/** Radio típico del claro que abre un impacto de rayo. */
export const STRIKE_CLEAR_RADIUS = 4.2;
/** Radio de la onda de choque sobre el bambú. */
export const BAMBOO_BLAST_RADIUS = 7.5;
/** Fuerza angular base de la explosión del rayo. */
export const BAMBOO_BLAST_FORCE = 9.5;
export const CLEARING_RADIUS = 0.55;
export const FOREST_INNER_RADIUS = 0.65;
/** Extensión del bosque principal. */
export const FOREST_OUTER_RADIUS = 56;
/** Anillo exterior (silueta / profundidad). */
export const FOREST_RING_INNER = 58;
export const FOREST_RING_OUTER = 88;

/** Vida de cada fuego encendido (6 minutos). */
export const FLAME_LIFETIME_SECONDS = 6 * 60;

/**
 * Foco de encuadre inicial de cámara (plano distant).
 * Los fuegos se anclan aquí para no salir de cuadro al empezar.
 */
export const CAMERA_START_FOCUS = {
  x: 0.15,
  z: 0.05,
} as const;

/**
 * Escenario de props a la derecha del hero (mitad derecha del viewport).
 * Desplazamiento ≈ cámara-right del preset `distant` (azimuth ~28°).
 */
export const PROP_STAGE_FOCUS = {
  x: CAMERA_START_FOCUS.x + 2.45,
  z: CAMERA_START_FOCUS.z - 1.35,
} as const;

/** Radio del claro de bambú alrededor del escenario de props. */
export const PROP_STAGE_CLEAR_RADIUS = 5.5;

/** Radio máximo del grupo de fuegos dentro del encuadre inicial. */
export const FLAME_FRAME_RADIUS = 2.35;

export function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/** Número áureo. */
export const PHI = 1.618033988749895;

/** Ángulo áureo en radianes (~137.5°). */
export const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Pool de fuegos reutilizables que pueden encender los rayos. */
export const LIGHTNING_FIRE_POOL = 20;

/** Máximo de fuegos encendidos a la vez. */
export const MAX_ACTIVE_FIRES = 14;

/** Entre 1 y 6 ranuras áureas iniciales (el resto del pool lo usan los rayos). */
export function pickFlameCount() {
  return Math.floor(randomRange(1, 7));
}

/** Segundos de transición entre planos de cámara. */
export const VIEW_TRANSITION_SECONDS = 20;

/** Segundos de pausa en cada plano antes del siguiente pan. */
export const VIEW_HOLD_SECONDS = 18;
