import {
  Box3,
  Group,
  Vector3,
  type Object3D,
  type Scene,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  BAMBOO_BLAST_FORCE,
  BAMBOO_BLAST_RADIUS,
  CAMERA_START_FOCUS,
  FOREST_OUTER_RADIUS,
  GOLDEN_ANGLE,
  GROUND_Y,
  PROP_STAGE_FOCUS,
  randomRange,
} from './constants';
import type { SceneSystem } from './types';

export type ShowcasePropsHandle = SceneSystem & {
  ready: Promise<void>;
  /** Daño / derribo por onda de rayo, igual que el bambú. */
  thinAround: (x: number, z: number) => void;
};

type PropKind = 'sculpture' | 'vinyl' | 'billboard';

type PropTemplate = {
  kind: PropKind;
  url: string;
  baseHeight: number;
};

type InstancePose = {
  kind: PropKind;
  x: number;
  z: number;
  yaw: number;
  heightScale: number;
};

type LiveProp = {
  holder: Group;
  kind: PropKind;
  x: number;
  z: number;
  mass: number;
  integrity: number;
  alive: boolean;
  falling: boolean;
  leanX: number;
  leanZ: number;
  velX: number;
  velZ: number;
  spin: number;
  heightScale: number;
};

const PROP_TEMPLATES: PropTemplate[] = [
  {
    kind: 'sculpture',
    url: '/models/fractal-sculpture.glb',
    baseHeight: 2.6,
  },
  {
    kind: 'vinyl',
    url: '/models/vinyl-figure.glb',
    baseHeight: 1.5,
  },
  {
    kind: 'billboard',
    url: '/models/digital-billboard.glb',
    baseHeight: 2.3,
  },
];

const PROP_KINDS: PropKind[] = ['sculpture', 'vinyl', 'billboard'];

const SCALE_STEPS = [
  0.28, 0.38, 0.48, 0.58, 0.72, 0.88, 1.05, 1.25, 1.55, 1.9, 2.35, 2.85,
];

const INSTANCES_PER_KIND = 14;
const POCKET_RADIUS = 2.4;
const FALL_LEAN_SNAP = 1.15;

function buildScatteredPoses(): InstancePose[] {
  const poses: InstancePose[] = [];
  const total = INSTANCES_PER_KIND * PROP_KINDS.length;
  const minRadius = 2.2;
  const maxRadius = Math.min(FOREST_OUTER_RADIUS * 0.72, 38);

  for (let index = 0; index < total; index += 1) {
    const kind = PROP_KINDS[index % PROP_KINDS.length];
    const t = index / Math.max(total - 1, 1);
    const radius = minRadius + Math.pow(t, 0.72) * (maxRadius - minRadius);
    const angle = index * GOLDEN_ANGLE + 0.18;
    const jitter = 0.55 + (index % 5) * 0.12;
    const aroundStage = index % 7 === 0;
    const originX = aroundStage ? PROP_STAGE_FOCUS.x : CAMERA_START_FOCUS.x;
    const originZ = aroundStage ? PROP_STAGE_FOCUS.z : CAMERA_START_FOCUS.z;

    poses.push({
      kind,
      x: originX + Math.cos(angle) * radius * jitter,
      z: originZ + Math.sin(angle) * radius * (0.78 + (index % 3) * 0.1),
      yaw: angle + (index % 4) * 0.9,
      heightScale: SCALE_STEPS[index % SCALE_STEPS.length],
    });
  }

  return poses;
}

const ALL_INSTANCE_POSES: InstancePose[] = buildScatteredPoses();

function massForKind(kind: PropKind, heightScale: number) {
  const base =
    kind === 'sculpture' ? 1.4 : kind === 'billboard' ? 1.1 : 0.75;
  return base * Math.max(0.45, heightScale);
}

function blastFalloff(distance: number, radius: number) {
  const t = 1 - distance / radius;
  return Math.max(0, t * t);
}

function prepareTemplate(root: Object3D, baseHeight: number): Object3D {
  root.traverse((child) => {
    child.castShadow = false;
    child.receiveShadow = false;
  });

  root.position.set(0, 0, 0);
  root.rotation.set(0, 0, 0);
  root.scale.set(1, 1, 1);
  root.updateMatrixWorld(true);

  const bounds = new Box3().setFromObject(root);
  const size = new Vector3();
  bounds.getSize(size);
  const height = Math.max(size.y, 0.001);
  root.scale.setScalar(baseHeight / height);
  root.updateMatrixWorld(true);

  const fitted = new Box3().setFromObject(root);
  const center = new Vector3();
  fitted.getCenter(center);
  root.position.set(-center.x, -fitted.min.y, -center.z);
  root.updateMatrixWorld(true);

  return root;
}

function createLiveProp(
  template: Object3D,
  pose: InstancePose,
  parent: Group,
): LiveProp {
  const holder = new Group();
  const heightScale = pose.heightScale * randomRange(0.92, 1.08);
  holder.position.set(pose.x, GROUND_Y, pose.z);
  holder.rotation.y = pose.yaw + randomRange(-0.35, 0.35);
  holder.scale.setScalar(heightScale);
  holder.add(template.clone(true));
  parent.add(holder);

  return {
    holder,
    kind: pose.kind,
    x: pose.x,
    z: pose.z,
    mass: massForKind(pose.kind, heightScale),
    integrity: 1,
    alive: true,
    falling: false,
    leanX: 0,
    leanZ: 0,
    velX: 0,
    velZ: 0,
    spin: 0,
    heightScale,
  };
}

function applyBlastToProp(prop: LiveProp, x: number, z: number, radius: number) {
  if (!prop.alive) {
    return;
  }

  const dx = prop.x - x;
  const dz = prop.z - z;
  const distance = Math.hypot(dx, dz);
  if (distance > radius) {
    return;
  }

  let dirX = 1;
  let dirZ = 0;
  let falloff = 1;
  if (distance > 0.0001) {
    falloff = blastFalloff(distance, radius);
    dirX = dx / distance;
    dirZ = dz / distance;
  }

  const impulse = (BAMBOO_BLAST_FORCE * 1.15 * falloff) / prop.mass;
  prop.velX += dirX * impulse * randomRange(0.9, 1.35);
  prop.velZ += dirZ * impulse * randomRange(0.9, 1.35);
  prop.spin += randomRange(-2.4, 2.4) * falloff;

  const damage = falloff * randomRange(0.35, 0.85) * (1.2 - prop.mass * 0.15);
  prop.integrity = Math.max(0, prop.integrity - damage);

  if (prop.integrity <= 0.18 || (falloff > 0.55 && Math.random() > 0.25)) {
    prop.falling = true;
    prop.velX += dirX * impulse * 0.7;
    prop.velZ += dirZ * impulse * 0.7;
  }
}

function destroyProp(prop: LiveProp) {
  prop.alive = false;
  prop.falling = false;
  prop.integrity = 0;
  prop.holder.visible = false;
  prop.holder.position.y = -40;
}

function integrateProp(prop: LiveProp, delta: number) {
  if (!prop.alive) {
    return;
  }

  if (prop.falling) {
    prop.velX *= 0.985;
    prop.velZ *= 0.985;
    prop.leanX += prop.velX * delta * 0.55;
    prop.leanZ += prop.velZ * delta * 0.55;
    prop.holder.rotation.z = -prop.leanX;
    prop.holder.rotation.x = prop.leanZ;
    prop.holder.rotation.y += prop.spin * delta;
    prop.x += prop.velX * delta * 0.35;
    prop.z += prop.velZ * delta * 0.35;
    prop.holder.position.x = prop.x;
    prop.holder.position.z = prop.z;

    const lean = Math.hypot(prop.leanX, prop.leanZ);
    if (lean > FALL_LEAN_SNAP) {
      destroyProp(prop);
    }
    return;
  }

  if (prop.integrity < 0.55) {
    prop.holder.rotation.z = Math.sin(prop.x * 3) * (1 - prop.integrity) * 0.12;
    prop.holder.rotation.x = Math.cos(prop.z * 2.4) * (1 - prop.integrity) * 0.1;
  }
}

async function loadTemplate(
  loader: GLTFLoader,
  template: PropTemplate,
): Promise<Object3D | null> {
  try {
    const gltf = await loader.loadAsync(template.url);
    return prepareTemplate(gltf.scene, template.baseHeight);
  } catch (error) {
    console.error(`No se pudo cargar el prop ${template.url}`, error);
    return null;
  }
}

/**
 * Carga cada GLB una vez, clona instancias dispersas y las hace
 * destruibles por la onda de los rayos.
 */
export function createShowcaseProps(scene: Scene): ShowcasePropsHandle {
  const stage = new Group();
  stage.name = 'showcaseProps';
  scene.add(stage);

  const liveProps: LiveProp[] = [];
  const loader = new GLTFLoader();

  const ready = (async () => {
    const templates = await Promise.all(
      PROP_TEMPLATES.map(async (spec) => ({
        spec,
        root: await loadTemplate(loader, spec),
      })),
    );

    const byKind = new Map<PropKind, Object3D>();
    for (const entry of templates) {
      if (!entry.root) {
        continue;
      }
      byKind.set(entry.spec.kind, entry.root);
    }

    for (const pose of ALL_INSTANCE_POSES) {
      const template = byKind.get(pose.kind);
      if (!template) {
        continue;
      }
      liveProps.push(createLiveProp(template, pose, stage));
    }
  })();

  return {
    ready,
    thinAround(x, z) {
      const radius = BAMBOO_BLAST_RADIUS * randomRange(0.9, 1.25);
      for (const prop of liveProps) {
        applyBlastToProp(prop, x, z, radius);
        if (prop.integrity <= 0) {
          destroyProp(prop);
        }
      }
    },
    update(delta) {
      for (const prop of liveProps) {
        integrateProp(prop, delta);
      }
    },
    dispose() {
      scene.remove(stage);
      const disposed = new Set<unknown>();
      stage.traverse((child) => {
        const mesh = child as Object3D & {
          geometry?: { dispose: () => void };
          material?:
            | { dispose: () => void }
            | Array<{ dispose: () => void }>;
        };
        if (mesh.geometry && !disposed.has(mesh.geometry)) {
          disposed.add(mesh.geometry);
          mesh.geometry.dispose();
        }
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : mesh.material
            ? [mesh.material]
            : [];
        for (const material of materials) {
          if (disposed.has(material)) {
            continue;
          }
          disposed.add(material);
          material.dispose();
        }
      });
      liveProps.length = 0;
    },
  };
}

export function clearShowcasePocket(
  clearPocket: (x: number, z: number, radius: number) => void,
) {
  for (const pose of ALL_INSTANCE_POSES) {
    const radius = POCKET_RADIUS * Math.max(0.7, Math.min(1.6, pose.heightScale));
    clearPocket(pose.x, pose.z, radius);
  }
}
