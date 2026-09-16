import {
  Color,
  CylinderGeometry,
  DoubleSide,
  DynamicDrawUsage,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  Shape,
  ShapeGeometry,
  type Scene,
} from 'three';
import {
  BAMBOO_BLAST_FORCE,
  BAMBOO_BLAST_RADIUS,
  BAMBOO_COUNT,
  BAMBOO_FALLEN_COUNT,
  BAMBOO_LEAF_COUNT,
  BAMBOO_RING_COUNT,
  BAMBOO_STRIKE_DEBRIS,
  CLEARING_RADIUS,
  FOREST_INNER_RADIUS,
  FOREST_OUTER_RADIUS,
  FOREST_RING_INNER,
  FOREST_RING_OUTER,
  GROUND_Y,
  randomRange,
} from './constants';

type BambooSizeClass = 'small' | 'medium' | 'large' | 'enormous';

type BambooStalk = {
  x: number;
  z: number;
  height: number;
  radius: number;
  leanBias: number;
  twist: number;
  phase: number;
  speed: number;
  flex: number;
  colorIndex: number;
  sizeClass: BambooSizeClass;
  leafScale: number;
  alive: boolean;
  /** 0 = destrozado, 1 = intacto. */
  integrity: number;
  leanX: number;
  leanZ: number;
  velX: number;
  velZ: number;
  mass: number;
  stiffness: number;
  falling: boolean;
};

type BambooLeaf = {
  stalkIndex: number;
  heightRatio: number;
  yaw: number;
  scale: number;
  phase: number;
  pitch: number;
};

type FallenBamboo = {
  x: number;
  y: number;
  z: number;
  length: number;
  radius: number;
  yaw: number;
  roll: number;
  pitch: number;
  colorIndex: number;
};

export type BambooForestHandle = {
  /** Explosión del rayo: impulso + daño de integridad. */
  thinAround: (x: number, z: number) => void;
  update: (time: number, windStrength: number, delta: number) => void;
  dispose: () => void;
};

const tempObject = new Object3D();

const stalkPalette = [
  new Color(0x243822),
  new Color(0x2f472c),
  new Color(0x1c2e1a),
  new Color(0x354f32),
  new Color(0x2a3c28),
];

const leafPalette = [
  new Color(0x5f9a4a),
  new Color(0x74b058),
  new Color(0x4e853c),
  new Color(0x88c466),
  new Color(0x6aaa50),
  new Color(0x9bc56e),
  new Color(0x3f6f32),
];

const fallenPalette = [
  new Color(0x4a3f2a),
  new Color(0x3a3424),
  new Color(0x5c4e32),
  new Color(0x2e2a1c),
  new Color(0x6a5a38),
  new Color(0x453820),
  new Color(0x7a6a42),
];

function createLeafShapeGeometry() {
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

function physicsForSize(sizeClass: BambooSizeClass) {
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

function pickBambooSize() {
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

type CheckerFigureKind = 'blob' | 'rect' | 'diamond' | 'band';

type CheckerFigure = {
  kind: CheckerFigureKind;
  x: number;
  z: number;
  width: number;
  depth: number;
  yaw: number;
  phase: number;
  dense: number;
  sparse: number;
};

type CheckerDensityField = {
  cellSize: number;
  originX: number;
  originZ: number;
  globalPhase: number;
  globalDense: number;
  globalSparse: number;
  figures: CheckerFigure[];
};

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
function createCheckerDensityField(): CheckerDensityField {
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

function densityAt(x: number, z: number, field: CheckerDensityField) {
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
function createOuterRingStalks(count: number): BambooStalk[] {
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

function createStalkData(
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

function createLeafData(stalks: BambooStalk[], count: number): BambooLeaf[] {
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

function createFallenSegment(
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

function createFallenData(count: number): FallenBamboo[] {
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

function windForce(time: number, stalk: BambooStalk, windStrength: number) {
  const gust =
    Math.sin(time * 0.55 * stalk.speed + stalk.phase) * 0.45 +
    Math.sin(time * 1.2 * stalk.speed + stalk.x * 0.15) * 0.25;
  const strength = gust * 0.55 * stalk.flex * windStrength * stalk.integrity;
  return {
    x: strength * Math.sin(stalk.phase * 0.7),
    z: strength * Math.cos(stalk.phase * 0.5) + stalk.leanBias * 0.4,
  };
}

function leanMagnitude(stalk: BambooStalk) {
  return Math.hypot(stalk.leanX, stalk.leanZ);
}

function blastFalloff(distance: number, radius: number) {
  const t = 1 - distance / radius;
  return Math.max(0, t * t);
}

function createHiddenFallenSlot(): FallenBamboo {
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

function placeFallenInstance(
  mesh: InstancedMesh,
  piece: FallenBamboo,
  index: number,
) {
  tempObject.position.set(piece.x, piece.y, piece.z);
  tempObject.rotation.set(piece.pitch, piece.yaw, piece.roll);
  tempObject.scale.set(piece.radius, piece.length, piece.radius);
  tempObject.updateMatrix();
  mesh.setMatrixAt(index, tempObject.matrix);
  mesh.setColorAt(index, fallenPalette[piece.colorIndex]);
}

function placeFallenInstances(
  mesh: InstancedMesh,
  fallen: FallenBamboo[],
) {
  for (let index = 0; index < fallen.length; index += 1) {
    placeFallenInstance(mesh, fallen[index], index);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }
}

function hideStalkInstance(mesh: InstancedMesh, index: number) {
  tempObject.position.set(0, -40, 0);
  tempObject.rotation.set(0, 0, 0);
  tempObject.scale.set(0, 0, 0);
  tempObject.updateMatrix();
  mesh.setMatrixAt(index, tempObject.matrix);
}


export function createBambooForest(scene: Scene): BambooForestHandle {
  const densityField = createCheckerDensityField();
  const stalks = [
    ...createStalkData(BAMBOO_COUNT, densityField),
    ...createOuterRingStalks(BAMBOO_RING_COUNT),
  ];
  const leaves = createLeafData(stalks, BAMBOO_LEAF_COUNT);
  const fallen = [
    ...createFallenData(BAMBOO_FALLEN_COUNT),
    ...Array.from({ length: BAMBOO_STRIKE_DEBRIS }, createHiddenFallenSlot),
  ];
  let strikeDebrisCursor = 0;

  const nodesPerStalk = 5;
  const stalkGeometry = new CylinderGeometry(0.85, 1.15, 1, 8, 8);
  stalkGeometry.translate(0, 0.5, 0);

  const stalkMaterial = new MeshStandardMaterial({
    color: new Color(0xffffff),
    roughness: 0.84,
    metalness: 0.03,
  });

  const stalkMesh = new InstancedMesh(stalkGeometry, stalkMaterial, stalks.length);
  stalkMesh.instanceMatrix.setUsage(DynamicDrawUsage);
  scene.add(stalkMesh);

  const nodeGeometry = new CylinderGeometry(1.2, 1.2, 0.035, 8);
  const nodeMaterial = new MeshStandardMaterial({
    color: new Color(0x1c2a1a),
    roughness: 0.9,
    metalness: 0.02,
  });
  const nodeCount = stalks.length * nodesPerStalk;
  const nodeMesh = new InstancedMesh(nodeGeometry, nodeMaterial, nodeCount);
  nodeMesh.instanceMatrix.setUsage(DynamicDrawUsage);
  scene.add(nodeMesh);

  const leafGeometry = createLeafShapeGeometry();
  const leafMaterial = new MeshStandardMaterial({
    color: new Color(0xffffff),
    roughness: 0.62,
    metalness: 0.02,
    emissive: new Color(0x1a3a12),
    emissiveIntensity: 0.45,
    side: DoubleSide,
  });
  const leafMesh = new InstancedMesh(leafGeometry, leafMaterial, leaves.length);
  leafMesh.instanceMatrix.setUsage(DynamicDrawUsage);
  scene.add(leafMesh);

  const fallenGeometry = new CylinderGeometry(0.9, 1.05, 1, 7, 1);
  fallenGeometry.translate(0, 0.5, 0);
  const fallenMaterial = new MeshStandardMaterial({
    color: new Color(0xffffff),
    roughness: 0.94,
    metalness: 0.01,
    flatShading: true,
  });
  const fallenMesh = new InstancedMesh(
    fallenGeometry,
    fallenMaterial,
    fallen.length,
  );
  scene.add(fallenMesh);
  placeFallenInstances(fallenMesh, fallen);

  for (let index = 0; index < stalks.length; index += 1) {
    stalkMesh.setColorAt(index, stalkPalette[stalks[index].colorIndex]);
  }
  if (stalkMesh.instanceColor) {
    stalkMesh.instanceColor.needsUpdate = true;
  }

  for (let index = 0; index < leaves.length; index += 1) {
    leafMesh.setColorAt(index, leafPalette[index % leafPalette.length]);
  }
  if (leafMesh.instanceColor) {
    leafMesh.instanceColor.needsUpdate = true;
  }

  const nodeStalkIndex = new Int16Array(nodeCount);
  const nodeHeightRatio = new Float32Array(nodeCount);
  let nodeCursor = 0;
  for (let stalkIndex = 0; stalkIndex < stalks.length; stalkIndex += 1) {
    for (let node = 0; node < nodesPerStalk; node += 1) {
      nodeStalkIndex[nodeCursor] = stalkIndex;
      nodeHeightRatio[nodeCursor] = 0.12 + node * 0.17 + Math.random() * 0.05;
      nodeCursor += 1;
    }
  }

  const leanXCache = new Float32Array(stalks.length);
  const leanZCache = new Float32Array(stalks.length);

  function writeStrikeDebris(stalk: BambooStalk) {
    const slot =
      BAMBOO_FALLEN_COUNT + (strikeDebrisCursor % BAMBOO_STRIKE_DEBRIS);
    strikeDebrisCursor += 1;
    const yaw = Math.atan2(stalk.leanZ, stalk.leanX) + randomRange(-0.4, 0.4);
    const piece = createFallenSegment(stalk.x, stalk.z, yaw);
    piece.length = Math.min(stalk.height * randomRange(0.45, 0.9), 4.6);
    piece.radius = stalk.radius * randomRange(0.9, 1.25);
    piece.colorIndex = Math.floor(Math.random() * fallenPalette.length);
    fallen[slot] = piece;
    placeFallenInstance(fallenMesh, piece, slot);
  }

  function destroyStalk(index: number) {
    const stalk = stalks[index];
    if (!stalk.alive) {
      return;
    }
    stalk.alive = false;
    stalk.falling = false;
    stalk.integrity = 0;
    hideStalkInstance(stalkMesh, index);
    writeStrikeDebris(stalk);
    fallenMesh.instanceMatrix.needsUpdate = true;
    if (fallenMesh.instanceColor) {
      fallenMesh.instanceColor.needsUpdate = true;
    }
  }

  function applyBlastToStalk(stalk: BambooStalk, x: number, z: number, radius: number) {
    const dx = stalk.x - x;
    const dz = stalk.z - z;
    const distance = Math.hypot(dx, dz);
    if (distance > radius) {
      return;
    }

    let dirX = Math.cos(stalk.twist);
    let dirZ = Math.sin(stalk.twist);
    let falloff = 1;
    if (distance > 0.0001) {
      falloff = blastFalloff(distance, radius);
      dirX = dx / distance;
      dirZ = dz / distance;
    }

    const impulse = (BAMBOO_BLAST_FORCE * falloff) / stalk.mass;
    stalk.velX += dirX * impulse * randomRange(0.85, 1.25);
    stalk.velZ += dirZ * impulse * randomRange(0.85, 1.25);

    const damage =
      falloff * randomRange(0.28, 0.72) * (1.15 - stalk.mass * 0.2);
    stalk.integrity = Math.max(0, stalk.integrity - damage);
    stalk.flex *= 0.92 + stalk.integrity * 0.08;

    if (stalk.integrity <= 0.12 || (falloff > 0.7 && Math.random() > 0.35)) {
      stalk.falling = true;
      stalk.velX += dirX * impulse * 0.6;
      stalk.velZ += dirZ * impulse * 0.6;
    }
  }

  function fallingPull(stalk: BambooStalk) {
    const mag = leanMagnitude(stalk);
    if (mag > 0.05) {
      return { x: stalk.leanX / mag, z: stalk.leanZ / mag };
    }
    const speed = Math.hypot(stalk.velX, stalk.velZ);
    if (speed > 0.01) {
      return { x: stalk.velX / speed, z: stalk.velZ / speed };
    }
    return { x: Math.cos(stalk.twist), z: Math.sin(stalk.twist) };
  }

  function integrateStalk(
    stalk: BambooStalk,
    delta: number,
    time: number,
    windStrength: number,
  ) {
    const step = Math.min(delta, 0.05);
    if (stalk.falling) {
      const pull = fallingPull(stalk);
      stalk.velX += pull.x * 4.8 * step;
      stalk.velZ += pull.z * 4.8 * step;
      stalk.leanX += stalk.velX * step;
      stalk.leanZ += stalk.velZ * step;
      stalk.integrity = Math.max(0, stalk.integrity - step * 0.45);
      return leanMagnitude(stalk) > 1.25;
    }

    const wind = windForce(time, stalk, windStrength);
    const spring = stalk.stiffness * (0.35 + stalk.integrity * 0.65);
    stalk.velX +=
      (-stalk.leanX * spring + wind.x * stalk.flex) * step / stalk.mass;
    stalk.velZ +=
      (-stalk.leanZ * spring + wind.z * stalk.flex) * step / stalk.mass;
    const damping = 0.9 + stalk.integrity * 0.06;
    stalk.velX *= damping;
    stalk.velZ *= damping;
    stalk.leanX += stalk.velX * step;
    stalk.leanZ += stalk.velZ * step;

    const mag = leanMagnitude(stalk);
    const breakLean = 0.55 + stalk.integrity * 0.55;
    if (mag > breakLean || (stalk.integrity < 0.2 && mag > 0.35)) {
      stalk.falling = true;
    }
    return false;
  }

  function thinAround(x: number, z: number) {
    const radius = BAMBOO_BLAST_RADIUS * randomRange(0.85, 1.2);

    for (let index = 0; index < stalks.length; index += 1) {
      const stalk = stalks[index];
      if (!stalk.alive) {
        continue;
      }
      applyBlastToStalk(stalk, x, z, radius);
      if (stalk.integrity <= 0) {
        destroyStalk(index);
      }
    }
  }

  function placeStalkVisual(index: number, heightScale: number) {
    const stalk = stalks[index];
    const leanX = stalk.leanX;
    const leanZ = stalk.leanZ;
    leanXCache[index] = leanX;
    leanZCache[index] = leanZ;
    const height = stalk.height * heightScale;
    tempObject.position.set(stalk.x, GROUND_Y, stalk.z);
    tempObject.rotation.set(leanZ, stalk.twist, -leanX);
    tempObject.scale.set(stalk.radius, height, stalk.radius);
    tempObject.updateMatrix();
    stalkMesh.setMatrixAt(index, tempObject.matrix);
  }

  return {
    thinAround,
    update(time: number, windStrength: number, delta: number) {
      for (let index = 0; index < stalks.length; index += 1) {
        const stalk = stalks[index];
        if (!stalk.alive) {
          leanXCache[index] = 0;
          leanZCache[index] = 0;
          hideStalkInstance(stalkMesh, index);
          continue;
        }

        const snapped = integrateStalk(stalk, delta, time, windStrength);
        if (snapped) {
          destroyStalk(index);
          continue;
        }

        const heightScale = 0.72 + stalk.integrity * 0.28;
        placeStalkVisual(index, heightScale);
      }
      stalkMesh.instanceMatrix.needsUpdate = true;

      for (let index = 0; index < nodeCount; index += 1) {
        const stalkIndex = nodeStalkIndex[index];
        const stalk = stalks[stalkIndex];
        if (!stalk.alive) {
          hideStalkInstance(nodeMesh, index);
          continue;
        }

        const leanX = leanXCache[stalkIndex];
        const leanZ = leanZCache[stalkIndex];
        const heightRatio = nodeHeightRatio[index];
        const tipX = leanX * heightRatio;
        const tipZ = leanZ * heightRatio;
        const height = stalk.height * (0.72 + stalk.integrity * 0.28);
        tempObject.position.set(
          stalk.x + Math.sin(tipZ) * height * heightRatio * 0.22,
          GROUND_Y + height * heightRatio,
          stalk.z + Math.sin(tipX) * height * heightRatio * 0.1,
        );
        tempObject.rotation.set(tipZ * 0.8, stalk.twist, -tipX * 0.8);
        tempObject.scale.set(stalk.radius, 1, stalk.radius);
        tempObject.updateMatrix();
        nodeMesh.setMatrixAt(index, tempObject.matrix);
      }
      nodeMesh.instanceMatrix.needsUpdate = true;

      for (let index = 0; index < leaves.length; index += 1) {
        const leaf = leaves[index];
        const stalk = stalks[leaf.stalkIndex];
        if (!stalk.alive) {
          hideStalkInstance(leafMesh, index);
          continue;
        }

        const leanX = leanXCache[leaf.stalkIndex];
        const leanZ = leanZCache[leaf.stalkIndex];
        const tipX = leanX * leaf.heightRatio;
        const tipZ = leanZ * leaf.heightRatio;
        const height = stalk.height * (0.72 + stalk.integrity * 0.28);
        const flutter =
          Math.sin(time * 3.8 * stalk.speed + leaf.phase) *
          0.35 *
          windStrength *
          stalk.integrity;

        tempObject.position.set(
          stalk.x + Math.sin(tipZ) * height * leaf.heightRatio * 0.22,
          GROUND_Y + height * leaf.heightRatio,
          stalk.z + Math.sin(tipX) * height * leaf.heightRatio * 0.1,
        );
        tempObject.rotation.set(
          leaf.pitch + tipZ * 0.35 + flutter * 0.2,
          leaf.yaw + flutter * 0.45,
          -tipX * 0.35 + flutter * 0.12,
        );
        const leafScale = leaf.scale * (0.65 + stalk.integrity * 0.35);
        tempObject.scale.set(leafScale, leafScale, leafScale * 0.85);
        tempObject.updateMatrix();
        leafMesh.setMatrixAt(index, tempObject.matrix);
      }
      leafMesh.instanceMatrix.needsUpdate = true;
    },
    dispose() {
      scene.remove(stalkMesh, nodeMesh, leafMesh, fallenMesh);
      stalkGeometry.dispose();
      nodeGeometry.dispose();
      leafGeometry.dispose();
      fallenGeometry.dispose();
      stalkMaterial.dispose();
      nodeMaterial.dispose();
      leafMaterial.dispose();
      fallenMaterial.dispose();
    },
  };
}
