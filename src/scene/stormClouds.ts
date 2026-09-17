import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DynamicDrawUsage,
  InstancedMesh,
  MeshStandardMaterial,
  NormalBlending,
  Object3D,
  Points,
  PointsMaterial,
  SphereGeometry,
  type Scene,
} from 'three';
import {
  CAMERA_START_FOCUS,
  GROUND_Y,
  randomRange,
} from './constants';
import type { SceneSystem } from './types';

export type CloudStrikeOrigin = {
  cloudIndex: number;
  x: number;
  y: number;
  z: number;
};

export type StormCloudsHandle = SceneSystem & {
  claimStrikeOrigin: () => CloudStrikeOrigin | null;
  pickRandomOrigin: () => CloudStrikeOrigin;
  flash: (cloudIndex: number) => void;
};

type CloudPuff = {
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  scaleX: number;
  scaleY: number;
  scaleZ: number;
  roll: number;
  soft: number;
};

type StormCloud = {
  x: number;
  y: number;
  z: number;
  phase: number;
  drift: number;
  charge: number;
  cooldown: number;
  readiness: number;
  spanX: number;
  spanY: number;
  spanZ: number;
  puffs: CloudPuff[];
};

const tempObject = new Object3D();
const CLOUD_COUNT = 14;
const PUFFS_PER_CLOUD = 12;
const RAIN_COUNT = 1600;

function createOrganicPuffs(): CloudPuff[] {
  const puffs: CloudPuff[] = [];

  for (let index = 0; index < PUFFS_PER_CLOUD; index += 1) {
    // Disposición horizontal: nube ancha tipo referencia
    const along = (index / (PUFFS_PER_CLOUD - 1)) * 2 - 1;
    const lift = randomRange(-0.28, 0.42);
    const size = randomRange(0.4, 1.15);
    const edgeTaper = 1 - Math.abs(along) * 0.35;

    puffs.push({
      offsetX: along * randomRange(0.72, 1.05) + randomRange(-0.12, 0.12),
      offsetY: lift + (1 - Math.abs(along)) * randomRange(0.05, 0.22),
      offsetZ: randomRange(-0.42, 0.42) * edgeTaper,
      scaleX: size * randomRange(1.15, 1.9) * edgeTaper,
      scaleY: size * randomRange(0.38, 0.72),
      scaleZ: size * randomRange(0.85, 1.45) * edgeTaper,
      roll: randomRange(0, Math.PI * 2),
      soft: randomRange(0.55, 1),
    });
  }

  return puffs;
}

function createCloudData(): StormCloud[] {
  const clouds: StormCloud[] = [];

  for (let index = 0; index < CLOUD_COUNT; index += 1) {
    const angle = randomRange(0, Math.PI * 2);
    const radius = randomRange(10, 48);
    clouds.push({
      x: CAMERA_START_FOCUS.x + Math.cos(angle) * radius,
      y: GROUND_Y + randomRange(15, 27),
      z: CAMERA_START_FOCUS.z + Math.sin(angle) * radius,
      phase: Math.random() * Math.PI * 2,
      drift: randomRange(0.025, 0.1),
      charge: randomRange(0.1, 0.55),
      cooldown: randomRange(0, 6),
      readiness: randomRange(0.72, 0.95),
      spanX: randomRange(16, 32),
      spanY: randomRange(2.4, 4.6),
      spanZ: randomRange(7, 14),
      puffs: createOrganicPuffs(),
    });
  }

  return clouds;
}

type RainState = {
  positions: Float32Array;
  speeds: Float32Array;
  drifts: Float32Array;
  geometry: BufferGeometry;
  material: PointsMaterial;
  mesh: Points;
};

function spawnRainDrop(
  positions: Float32Array,
  speeds: Float32Array,
  drifts: Float32Array,
  index: number,
  clouds: StormCloud[],
) {
  const cloud = clouds[Math.floor(Math.random() * clouds.length)];
  const offset = index * 3;
  positions[offset] =
    cloud.x + randomRange(-cloud.spanX * 0.52, cloud.spanX * 0.52);
  positions[offset + 1] =
    cloud.y - cloud.spanY * randomRange(0.35, 0.85);
  positions[offset + 2] =
    cloud.z + randomRange(-cloud.spanZ * 0.52, cloud.spanZ * 0.52);
  speeds[index] = randomRange(14, 28);
  drifts[index] = randomRange(-1.8, 1.8);
}

function createRainSystem(scene: Scene, clouds: StormCloud[]): RainState {
  const positions = new Float32Array(RAIN_COUNT * 3);
  const speeds = new Float32Array(RAIN_COUNT);
  const drifts = new Float32Array(RAIN_COUNT);
  const geometry = new BufferGeometry();

  for (let index = 0; index < RAIN_COUNT; index += 1) {
    spawnRainDrop(positions, speeds, drifts, index, clouds);
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  const material = new PointsMaterial({
    color: new Color(0x9ab8d8),
    size: 0.09,
    transparent: true,
    opacity: 0.28,
    depthWrite: false,
    blending: NormalBlending,
    sizeAttenuation: true,
  });
  const mesh = new Points(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  return { positions, speeds, drifts, geometry, material, mesh };
}

function updateRain(
  rain: RainState,
  clouds: StormCloud[],
  delta: number,
  intensity: number,
) {
  const { positions, speeds, drifts } = rain;
  const blend = 0.35 + intensity * 0.65;
  rain.material.opacity = 0.1 + intensity * 0.18;

  for (let index = 0; index < RAIN_COUNT; index += 1) {
    const offset = index * 3;
    positions[offset] += drifts[index] * delta * blend;
    positions[offset + 1] -= speeds[index] * delta * blend;
    positions[offset + 2] += drifts[index] * delta * 0.35 * blend;

    if (positions[offset + 1] <= GROUND_Y + 0.05) {
      spawnRainDrop(positions, speeds, drifts, index, clouds);
    }
  }

  rain.geometry.attributes.position.needsUpdate = true;
}

export function createStormClouds(scene: Scene): StormCloudsHandle {
  const clouds = createCloudData();
  const geometry = new SphereGeometry(1, 18, 12);
  const material = new MeshStandardMaterial({
    color: new Color(0x4a4468),
    emissive: new Color(0x5a4888),
    emissiveIntensity: 0.1,
    roughness: 1,
    metalness: 0,
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
  });

  const puffCount = clouds.length * PUFFS_PER_CLOUD;
  const mesh = new InstancedMesh(geometry, material, puffCount);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);
  mesh.frustumCulled = false;
  scene.add(mesh);

  const baseColors = [
    new Color(0x2a2238),
    new Color(0x342840),
    new Color(0x1c1828),
    new Color(0x3a2e4c),
    new Color(0x261e34),
  ];

  const flashBoost = new Float32Array(clouds.length);
  const rain = createRainSystem(scene, clouds);

  const releaseCloudOrigin = (cloudIndex: number): CloudStrikeOrigin => {
    const cloud = clouds[cloudIndex];
    cloud.charge = Math.max(0.05, cloud.charge - randomRange(0.2, 0.45));
    cloud.cooldown = randomRange(1.2, 4.5);
    flashBoost[cloudIndex] = 1.4;

    return {
      cloudIndex,
      x: cloud.x + randomRange(-cloud.spanX * 0.35, cloud.spanX * 0.35),
      y: cloud.y - cloud.spanY * 0.55,
      z: cloud.z + randomRange(-cloud.spanZ * 0.35, cloud.spanZ * 0.35),
    };
  };

  const placePuffs = (time: number) => {
    let puffIndex = 0;
    let maxFlash = 0;
    let maxCharge = 0;

    for (let cloudIndex = 0; cloudIndex < clouds.length; cloudIndex += 1) {
      const cloud = clouds[cloudIndex];
      const breathe =
        1 +
        Math.sin(time * 0.28 + cloud.phase) * 0.05 +
        Math.sin(time * 0.51 + cloud.phase * 1.7) * 0.03;
      const shear = Math.sin(time * 0.11 + cloud.phase) * 0.08;
      const chargeGlow = 0.1 + cloud.charge * 0.5 + flashBoost[cloudIndex];
      maxFlash = Math.max(maxFlash, flashBoost[cloudIndex]);
      maxCharge = Math.max(maxCharge, cloud.charge);

      for (let puff = 0; puff < cloud.puffs.length; puff += 1) {
        const lobe = cloud.puffs[puff];
        const wobble =
          Math.sin(time * 0.6 + cloud.phase + puff * 1.3) * 0.04 * lobe.soft;

        tempObject.position.set(
          cloud.x +
            (lobe.offsetX + shear) * cloud.spanX * breathe +
            wobble * cloud.spanX,
          cloud.y + lobe.offsetY * cloud.spanY * breathe,
          cloud.z +
            lobe.offsetZ * cloud.spanZ * breathe +
            wobble * 0.6 * cloud.spanZ,
        );
        tempObject.rotation.set(
          lobe.roll * 0.15,
          cloud.phase + lobe.roll,
          shear * 0.4 + lobe.roll * 0.2,
        );
        tempObject.scale.set(
          lobe.scaleX * cloud.spanX * 0.38 * breathe,
          lobe.scaleY * cloud.spanY * 0.48 * breathe,
          lobe.scaleZ * cloud.spanZ * 0.4 * breathe,
        );
        tempObject.updateMatrix();
        mesh.setMatrixAt(puffIndex, tempObject.matrix);

        const tint = baseColors[puff % baseColors.length].clone();
        tint.offsetHSL(
          0,
          0,
          chargeGlow * 0.07 * lobe.soft - (1 - lobe.soft) * 0.03,
        );
        mesh.setColorAt(puffIndex, tint);
        puffIndex += 1;
      }
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
    material.emissiveIntensity = 0.1 + maxFlash * 0.85;
    material.opacity = 0.16 + maxCharge * 0.1;
    return maxCharge;
  };

  return {
    update(delta, simTime) {
      for (let index = 0; index < clouds.length; index += 1) {
        const cloud = clouds[index];
        cloud.x += Math.sin(simTime * 0.06 + cloud.phase) * cloud.drift * delta * 7;
        cloud.z += Math.cos(simTime * 0.05 + cloud.phase) * cloud.drift * delta * 7;
        cloud.y += Math.sin(simTime * 0.09 + cloud.phase * 1.3) * delta * 0.08;
        cloud.cooldown = Math.max(0, cloud.cooldown - delta);
        flashBoost[index] = Math.max(0, flashBoost[index] - delta * 2.8);

        if (cloud.cooldown <= 0) {
          cloud.charge = Math.min(
            1.2,
            cloud.charge + delta * randomRange(0.05, 0.16),
          );
        }
      }
      const rainIntensity = placePuffs(simTime);
      updateRain(rain, clouds, delta, rainIntensity);
    },
    claimStrikeOrigin() {
      let bestIndex = -1;
      let bestCharge = 0;

      for (let index = 0; index < clouds.length; index += 1) {
        const cloud = clouds[index];
        if (cloud.cooldown > 0 || cloud.charge < cloud.readiness) {
          continue;
        }
        if (cloud.charge > bestCharge) {
          bestCharge = cloud.charge;
          bestIndex = index;
        }
      }

      if (bestIndex < 0 && Math.random() > 0.78) {
        bestIndex = Math.floor(Math.random() * clouds.length);
      }
      if (bestIndex < 0) {
        return null;
      }

      return releaseCloudOrigin(bestIndex);
    },
    pickRandomOrigin() {
      return releaseCloudOrigin(Math.floor(Math.random() * clouds.length));
    },
    flash(cloudIndex) {
      if (cloudIndex < 0 || cloudIndex >= clouds.length) {
        return;
      }
      flashBoost[cloudIndex] = 1.8;
    },
    dispose() {
      scene.remove(mesh, rain.mesh);
      geometry.dispose();
      material.dispose();
      rain.geometry.dispose();
      rain.material.dispose();
    },
  };
}
