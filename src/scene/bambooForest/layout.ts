import { Color, Shape, ShapeGeometry } from 'three';
import {
  CLEARING_RADIUS,
  FOREST_INNER_RADIUS,
  FOREST_OUTER_RADIUS,
  FOREST_RING_INNER,
  FOREST_RING_OUTER,
  GROUND_Y,
  randomRange,
} from '../constants';
import type {
  BambooLeaf,
  BambooStalk,
  CheckerDensityField,
  CheckerFigure,
  CheckerFigureKind,
  FallenBamboo,
} from './types';

export const stalkPalette = [
  new Color(0x243822),
  new Color(0x2f472c),
  new Color(0x1c2e1a),
  new Color(0x354f32),
  new Color(0x2a3c28),
];

export const leafPalette = [
  new Color(0x5f9a4a),
  new Color(0x74b058),
  new Color(0x4e853c),
  new Color(0x88c466),
  new Color(0x6aaa50),
  new Color(0x9bc56e),
  new Color(0x3f6f32),
];

export const fallenPalette = [
  new Color(0x4a3f2a),
  new Color(0x3a3424),
  new Color(0x5c4e32),
  new Color(0x2e2a1c),
  new Color(0x6a5a38),
  new Color(0x453820),
  new Color(0x7a6a42),
];

export function createLeafShapeGeometry() {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.18, 0.05, 0.55, 0.02);
  shape.quadraticCurveTo(0.92, 0, 1.05, -0.02);
  shape.quadraticCurveTo(0.7, -0.08, 0.35, -0.07);
  shape.quadraticCurveTo(0.12, -0.05, 0, 0);
  const geometry = new ShapeGeometry(shape, 8);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

export function physicsForSize(sizeClass: BambooStalk['sizeClass']) {
  if (sizeClass === 'small') {
    return {
      integrity: randomRange(0.5, 0.72),
      mass: randomRange(0.35, 0.55),
      stiffness: randomRange(7, 10),
    };
  }
  if (sizeClass === 'medium') {
    return {
      integrity: randomRange(0.7, 0.9),
      mass: randomRange(0.6, 0.9),
      stiffness: randomRange(9, 12),
    };
  }
  if (sizeClass === 'large') {
    return {
      integrity: randomRange(0.85, 1),
      mass: randomRange(1, 1.4),
      stiffness: randomRange(11, 15),
    };
  }
  return {
    integrity: randomRange(0.92, 1),
    mass: randomRange(1.5, 2.2),
    stiffness: randomRange(13, 17),
  };
}

export function pickBambooSize() {
  const roll = Math.random();

  if (roll < 0.24) {
    return {
      sizeClass: 'small' as const,
      height: randomRange(3.2, 7.2),
      radius: randomRange(0.018, 0.042),
      flex: randomRange(0.55, 1.05),
      leafScale: randomRange(0.35, 0.65),
      speed: randomRange(0.65, 1.2),
    };
  }

  if (roll < 0.58) {
    return {
      sizeClass: 'medium' as const,
      height: randomRange(8, 15),
      radius: randomRange(0.04, 0.078),
      flex: randomRange(0.4, 0.85),
      leafScale: randomRange(0.7, 1.15),
      speed: randomRange(0.45, 1.0),
    };
  }

  if (roll < 0.86) {
    return {
      sizeClass: 'large' as const,
      height: randomRange(16, 26),
      radius: randomRange(0.075, 0.13),
      flex: randomRange(0.28, 0.65),
      leafScale: randomRange(1.1, 1.7),
      speed: randomRange(0.35, 0.8),
    };
  }

  return {
    sizeClass: 'enormous' as const,
    height: randomRange(28, 48),
    radius: randomRange(0.14, 0.24),
    flex: randomRange(0.18, 0.45),
    leafScale: randomRange(1.6, 2.6),
    speed: randomRange(0.22, 0.55),
  };
}

function pickFigureSpot(angleHint?: number) {
  const angle =
    angleHint === undefined
      ? Math.random() * Math.PI * 2
      : angleHint + randomRange(-0.28, 0.28);
  const dist = randomRange(FOREST_INNER_RADIUS + 2, FOREST_OUTER_RADIUS * 0.94);
  return {
    x: Math.cos(angle) * dist,
    z: Math.sin(angle) * dist,
  };
}

function createRandomFigure(angleHint?: number): CheckerFigure {
  const spot = pickFigureSpot(angleHint);
  const kinds: CheckerFigureKind[] = ['blob', 'rect', 'diamond', 'band'];
  const kind = kinds[Math.floor(Math.random() * kinds.length)];
  const scale = randomRange(14, 34);

  return {
    kind,
    x: spot.x,
    z: spot.z,
    width: kind === 'band' ? scale * randomRange(1.4, 2.6) : scale,
    depth:
      kind === 'band'
        ? randomRange(7, 16)
        : scale * randomRange(0.65, 1.25),
    yaw: Math.random() * Math.PI * 2,
    phase: Math.random() > 0.5 ? 1 : 0,
    dense: randomRange(0.94, 1),
    sparse: randomRange(0.01, 0.06),
  };
}

/** Damero global + muchas figuras repartidas en todo el anillo. */
export function createCheckerDensityField(): CheckerDensityField {
  const ringCount = 12 + Math.floor(Math.random() * 6);
  const extraCount = 8 + Math.floor(Math.random() * 7);
  const figures: CheckerFigure[] = [];

  for (let index = 0; index < ringCount; index += 1) {
    const angle = (index / ringCount) * Math.PI * 2;
    figures.push(createRandomFigure(angle));
  }

  for (let index = 0; index < extraCount; index += 1) {
    figures.push(createRandomFigure());
  }

  return {
    cellSize: randomRange(2.1, 3.2),
    originX: randomRange(-1.5, 1.5),
    originZ: randomRange(-1.5, 1.5),
    globalPhase: Math.random() > 0.5 ? 1 : 0,
    globalDense: randomRange(0.9, 1),
    globalSparse: randomRange(0.01, 0.07),
    figures,
  };
}

function toLocalAxes(figure: CheckerFigure, x: number, z: number) {
  const dx = x - figure.x;
  const dz = z - figure.z;
  const cos = Math.cos(-figure.yaw);
  const sin = Math.sin(-figure.yaw);
  return {
    localX: dx * cos - dz * sin,
    localZ: dx * sin + dz * cos,
  };
}

function figureContains(figure: CheckerFigure, x: number, z: number) {
  const { localX, localZ } = toLocalAxes(figure, x, z);
  const halfW = figure.width * 0.5;
  const halfD = figure.depth * 0.5;

  if (figure.kind === 'rect' || figure.kind === 'band') {
    return Math.abs(localX) <= halfW && Math.abs(localZ) <= halfD;
  }

  if (figure.kind === 'diamond') {
    return Math.abs(localX) / halfW + Math.abs(localZ) / halfD <= 1;
  }

  const nx = localX / halfW;
  const nz = localZ / halfD;
  return nx * nx + nz * nz <= 1;
}

export function densityAt(x: number, z: number, field: CheckerDensityField) {
  const cellX = Math.floor((x - field.originX) / field.cellSize);
  const cellZ = Math.floor((z - field.originZ) / field.cellSize);

  let active: CheckerFigure | null = null;
  for (let index = field.figures.length - 1; index >= 0; index -= 1) {
    const figure = field.figures[index];
    if (figureContains(figure, x, z)) {
      active = figure;
      break;
    }
  }

  const phase = active ? active.phase : field.globalPhase;
  const checkerOn = ((cellX + cellZ + phase) & 1) === 0;

  if (active) {
    return checkerOn ? active.dense : active.sparse;
  }

  return checkerOn ? field.globalDense : field.globalSparse;
}

function pickForestSpot(field: CheckerDensityField) {
  for (let attempt = 0; attempt < 28; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(
      randomRange(
        FOREST_INNER_RADIUS * FOREST_INNER_RADIUS,
        FOREST_OUTER_RADIUS * FOREST_OUTER_RADIUS,
      ),
    );
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const distance = Math.hypot(x, z);
    if (distance < FOREST_INNER_RADIUS) {
      continue;
    }

    const density = densityAt(x, z, field);
    if (Math.random() < density) {
      return { x, z, density };
    }
  }

  const fallbackAngle = Math.random() * Math.PI * 2;
  const fallbackRadius = randomRange(
    FOREST_INNER_RADIUS + 1,
    FOREST_OUTER_RADIUS * 0.7,
  );
  return {
    x: Math.cos(fallbackAngle) * fallbackRadius,
    z: Math.sin(fallbackAngle) * fallbackRadius,
    density: 0.35,
  };
}

function buildStalk(
  x: number,
  z: number,
  size: ReturnType<typeof pickBambooSize>,
  options: { heightBoost: number; radiusBoost: number; leafScale: number },
): BambooStalk {
  const body = physicsForSize(size.sizeClass);
  return {
    x,
    z,
    height: size.height * options.heightBoost,
    radius: size.radius * options.radiusBoost,
    leanBias: randomRange(-0.05, 0.05) + (Math.random() - 0.5) * 0.03,
    twist: randomRange(0, Math.PI * 2),
    phase: Math.random() * Math.PI * 2,
    speed: size.speed,
    flex: size.flex,
    colorIndex: Math.floor(Math.random() * stalkPalette.length),
    sizeClass: size.sizeClass,
    leafScale: options.leafScale,
    alive: true,
    integrity: body.integrity,
    leanX: 0,
    leanZ: 0,
    velX: 0,
    velZ: 0,
    mass: body.mass,
    stiffness: body.stiffness,
    falling: false,
  };
}

function pickOuterRingSize() {
  const roll = Math.random();
  if (roll < 0.2) {
    return pickBambooSize();
  }
  if (roll < 0.55) {
    return {
      sizeClass: 'large' as const,
      height: randomRange(18, 32),
      radius: randomRange(0.07, 0.12),
      flex: randomRange(0.22, 0.5),
      leafScale: randomRange(0.95, 1.5),
      speed: randomRange(0.28, 0.55),
    };
  }
  return {
    sizeClass: 'enormous' as const,
    height: randomRange(32, 54),
    radius: randomRange(0.1, 0.18),
    flex: randomRange(0.15, 0.4),
    leafScale: randomRange(1.4, 2.4),
    speed: randomRange(0.2, 0.45),
  };
}

/** Anillo lejano tupido con huecos: da profundidad sin montaña. */
export function createOuterRingStalks(count: number): BambooStalk[] {
  const stalks: BambooStalk[] = [];
  const sectorCount = 28;

  while (stalks.length < count) {
    const angle = Math.random() * Math.PI * 2;
    const radius = randomRange(FOREST_RING_INNER, FOREST_RING_OUTER);
    const sector = Math.floor((angle / (Math.PI * 2)) * sectorCount);
    const band = Math.floor(
      ((radius - FOREST_RING_INNER) /
        Math.max(0.001, FOREST_RING_OUTER - FOREST_RING_INNER)) *
        5,
    );
    const openCell = ((sector + band) & 1) === 0;
    if (openCell && Math.random() > 0.22) {
      continue;
    }

    const clumpSize = openCell ? 1 : 2 + Math.floor(Math.random() * 4);
    for (let member = 0; member < clumpSize && stalks.length < count; member += 1) {
      const spread = openCell ? randomRange(0.4, 1.4) : randomRange(0.08, 0.55);
      const x = Math.cos(angle) * radius + randomRange(-spread, spread);
      const z = Math.sin(angle) * radius + randomRange(-spread, spread);
      const distance = Math.hypot(x, z);
      if (distance < FOREST_RING_INNER || distance > FOREST_RING_OUTER) {
        continue;
      }

      const size = pickOuterRingSize();
      const depth = (distance - FOREST_RING_INNER) / (FOREST_RING_OUTER - FOREST_RING_INNER);
      stalks.push(
        buildStalk(x, z, size, {
          heightBoost: 1.05 + depth * 0.35,
          radiusBoost: 1.05 + depth * 0.2,
          leafScale: size.leafScale * randomRange(0.9, 1.25),
        }),
      );
    }
  }

  return stalks;
}

export function createStalkData(
  count: number,
  field: CheckerDensityField,
): BambooStalk[] {
  const stalks: BambooStalk[] = [];

  while (stalks.length < count) {
    const spot = pickForestSpot(field);
    const densePatch = spot.density > 0.55;
    const clumpSize = densePatch
      ? 5 + Math.floor(Math.random() * 6)
      : Math.random() > 0.78
        ? 2
        : 1;

    for (let member = 0; member < clumpSize && stalks.length < count; member += 1) {
      const spread = densePatch ? randomRange(0.05, 0.38) : randomRange(0.55, 2.1);
      const x = spot.x + randomRange(-spread, spread);
      const z = spot.z + randomRange(-spread, spread);
      const distance = Math.hypot(x, z);

      if (distance < FOREST_INNER_RADIUS || distance > FOREST_OUTER_RADIUS) {
        continue;
      }

      // Zonas abiertas: deja espacio real entre cañas
      if (!densePatch) {
        const tooClose = stalks.some(
          (other) => Math.hypot(other.x - x, other.z - z) < 1.55,
        );
        if (tooClose && Math.random() > 0.12) {
          continue;
        }
      }

      const size = pickBambooSize();
      const proximity = 1 - Math.min(1, (distance - FOREST_INNER_RADIUS) / 22);
      stalks.push(
        buildStalk(x, z, size, {
          heightBoost: 0.92 + proximity * 0.22,
          radiusBoost: 0.92 + proximity * 0.15,
          leafScale:
            size.leafScale *
            (densePatch ? randomRange(1.05, 1.3) : randomRange(0.8, 1)),
        }),
      );
    }
  }

  return stalks;
}

export function createLeafData(stalks: BambooStalk[], count: number): BambooLeaf[] {
  const leaves: BambooLeaf[] = [];
  const nearWeighted = stalks
    .map((stalk, index) => ({
      index,
      weight: 1 / Math.max(0.8, Math.hypot(stalk.x, stalk.z) * 0.35),
    }))
    .sort((a, b) => b.weight - a.weight);

  for (let index = 0; index < count; index += 1) {
    const preferNear = Math.random() > 0.35;
    const stalkIndex = preferNear
      ? nearWeighted[Math.floor(Math.random() * Math.min(420, nearWeighted.length))]
          .index
      : Math.floor(Math.random() * stalks.length);
    const stalk = stalks[stalkIndex];
    const canopyBias = Math.random();
    leaves.push({
      stalkIndex,
      heightRatio:
        canopyBias < 0.78
          ? randomRange(0.58, 0.99)
          : randomRange(0.32, 0.62),
      yaw: randomRange(0, Math.PI * 2),
      scale: stalk.leafScale * randomRange(0.8, 1.25),
      phase: Math.random() * Math.PI * 2,
      pitch: randomRange(-0.65, 0.2),
    });
  }

  return leaves;
}

function pickFallenSpot() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(
      randomRange(
        CLEARING_RADIUS * CLEARING_RADIUS * 1.4,
        FOREST_OUTER_RADIUS * FOREST_OUTER_RADIUS * 0.92,
      ),
    );
    const x = Math.cos(angle) * radius + randomRange(-0.35, 0.35);
    const z = Math.sin(angle) * radius + randomRange(-0.35, 0.35);
    if (Math.hypot(x, z) > CLEARING_RADIUS * 1.15) {
      return { x, z };
    }
  }
  return { x: randomRange(2, 6), z: randomRange(-4, 4) };
}

export function createFallenSegment(
  x: number,
  z: number,
  yaw: number,
): FallenBamboo {
  const broken = Math.random() > 0.35;
  return {
    x: x + randomRange(-0.15, 0.15),
    y: GROUND_Y + randomRange(0.02, 0.07),
    z: z + randomRange(-0.15, 0.15),
    length: broken ? randomRange(0.55, 1.9) : randomRange(2.2, 4.4),
    radius: randomRange(0.025, 0.08),
    yaw: yaw + randomRange(-0.35, 0.35),
    roll: Math.PI / 2 + randomRange(-0.18, 0.18),
    pitch: randomRange(-0.12, 0.12),
    colorIndex: Math.floor(Math.random() * fallenPalette.length),
  };
}

export function createFallenData(count: number): FallenBamboo[] {
  const fallen: FallenBamboo[] = [];

  while (fallen.length < count) {
    const spot = pickFallenSpot();
    const yaw = Math.random() * Math.PI * 2;
    fallen.push(createFallenSegment(spot.x, spot.z, yaw));

    if (fallen.length < count && Math.random() > 0.45) {
      const offset = randomRange(0.35, 1.1);
      fallen.push(
        createFallenSegment(
          spot.x + Math.cos(yaw) * offset,
          spot.z + Math.sin(yaw) * offset,
          yaw + randomRange(0.4, 1.4),
        ),
      );
    }
  }

  return fallen.slice(0, count);
}

export function createHiddenFallenSlot(): FallenBamboo {
  return {
    x: 0,
    y: -40,
    z: 0,
    length: 0.01,
    radius: 0.01,
    yaw: 0,
    roll: Math.PI / 2,
    pitch: 0,
    colorIndex: 0,
  };
}
