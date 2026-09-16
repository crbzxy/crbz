import {
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  CylinderGeometry,
  type Scene,
} from 'three';
import {
  CAMERA_START_FOCUS,
  CLEARING_RADIUS,
  GROUND_Y,
  randomRange,
} from './constants';

export type TurtleHandle = {
  update: (delta: number, time: number) => void;
  dispose: () => void;
};

const WANDER_INNER = 1.2;
const WANDER_OUTER = 9.5;
const WALK_SPEED = 0.42;
const TURN_SPEED = 1.8;

type LegRig = {
  mesh: Mesh;
  side: number;
  fore: number;
  baseY: number;
};

function createSharedMaterials() {
  return {
    shell: new MeshStandardMaterial({
      color: new Color(0x3a5a32),
      roughness: 0.82,
      metalness: 0.04,
    }),
    plate: new MeshStandardMaterial({
      color: new Color(0x2a4226),
      roughness: 0.88,
      metalness: 0.02,
    }),
    skin: new MeshStandardMaterial({
      color: new Color(0x6a7a42),
      roughness: 0.78,
      metalness: 0.02,
    }),
    eye: new MeshStandardMaterial({
      color: new Color(0x1a1208),
      roughness: 0.4,
      metalness: 0.1,
      emissive: new Color(0x221808),
      emissiveIntensity: 0.15,
    }),
  };
}

function addShell(group: Group, materials: ReturnType<typeof createSharedMaterials>) {
  const shell = new Mesh(new SphereGeometry(1, 14, 10), materials.shell);
  shell.scale.set(0.55, 0.28, 0.68);
  shell.position.y = 0.22;
  group.add(shell);

  for (let index = 0; index < 5; index += 1) {
    const plate = new Mesh(new SphereGeometry(1, 8, 6), materials.plate);
    const angle = (index / 5) * Math.PI * 2;
    plate.scale.set(0.18, 0.08, 0.22);
    plate.position.set(
      Math.cos(angle) * 0.22,
      0.34,
      Math.sin(angle) * 0.28,
    );
    group.add(plate);
  }
}

function addHead(group: Group, materials: ReturnType<typeof createSharedMaterials>) {
  const head = new Mesh(new SphereGeometry(1, 10, 8), materials.skin);
  head.scale.set(0.14, 0.12, 0.2);
  head.position.set(0, 0.18, 0.62);
  group.add(head);

  const neck = new Mesh(new CylinderGeometry(0.07, 0.09, 0.18, 8), materials.skin);
  neck.rotation.x = Math.PI / 2;
  neck.position.set(0, 0.16, 0.46);
  group.add(neck);

  for (const side of [-1, 1]) {
    const eye = new Mesh(new SphereGeometry(0.03, 6, 6), materials.eye);
    eye.position.set(side * 0.09, 0.22, 0.72);
    group.add(eye);
  }
}

function createLegs(
  group: Group,
  materials: ReturnType<typeof createSharedMaterials>,
): LegRig[] {
  const legs: LegRig[] = [];
  const placements = [
    { side: -1, fore: 1 },
    { side: 1, fore: 1 },
    { side: -1, fore: -1 },
    { side: 1, fore: -1 },
  ];

  for (const place of placements) {
    const mesh = new Mesh(
      new CylinderGeometry(0.05, 0.07, 0.22, 7),
      materials.skin,
    );
    mesh.position.set(place.side * 0.32, 0.08, place.fore * 0.28);
    group.add(mesh);
    legs.push({
      mesh,
      side: place.side,
      fore: place.fore,
      baseY: 0.08,
    });
  }

  return legs;
}

function pickWanderPoint() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = randomRange(WANDER_INNER, WANDER_OUTER);
    const x = CAMERA_START_FOCUS.x + Math.cos(angle) * radius;
    const z = CAMERA_START_FOCUS.z + Math.sin(angle) * radius;
    if (Math.hypot(x, z) > CLEARING_RADIUS * 1.4) {
      return { x, z };
    }
  }
  return {
    x: CAMERA_START_FOCUS.x + randomRange(2, 5),
    z: CAMERA_START_FOCUS.z + randomRange(-4, 4),
  };
}

function shortestAngleDelta(from: number, to: number) {
  let delta = to - from;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

export function createTurtle(scene: Scene): TurtleHandle {
  const materials = createSharedMaterials();
  const geometries: Array<{ dispose: () => void }> = [];
  const group = new Group();
  const start = pickWanderPoint();
  group.position.set(start.x, GROUND_Y + 0.02, start.z);
  group.scale.setScalar(randomRange(0.85, 1.15));
  scene.add(group);

  addShell(group, materials);
  addHead(group, materials);
  const legs = createLegs(group, materials);

  const tail = new Mesh(new SphereGeometry(1, 8, 6), materials.skin);
  tail.scale.set(0.08, 0.06, 0.14);
  tail.position.set(0, 0.12, -0.58);
  group.add(tail);

  group.traverse((child) => {
    if (child instanceof Mesh) {
      geometries.push(child.geometry);
    }
  });

  let target = pickWanderPoint();
  let yaw = Math.atan2(target.x - start.x, target.z - start.z);
  group.rotation.y = yaw;
  let walkPhase = 0;
  let pauseTimer = randomRange(0.4, 1.8);

  function retarget() {
    target = pickWanderPoint();
    pauseTimer = randomRange(0.6, 2.4);
  }

  return {
    update(delta, time) {
      if (pauseTimer > 0) {
        pauseTimer -= delta;
        const idle = Math.sin(time * 1.6) * 0.01;
        group.position.y = GROUND_Y + 0.02 + idle;
        return;
      }

      const dx = target.x - group.position.x;
      const dz = target.z - group.position.z;
      const distance = Math.hypot(dx, dz);

      if (distance < 0.35) {
        retarget();
        return;
      }

      const desiredYaw = Math.atan2(dx, dz);
      const turn = shortestAngleDelta(yaw, desiredYaw);
      const maxTurn = TURN_SPEED * delta;
      yaw += Math.max(-maxTurn, Math.min(maxTurn, turn));
      group.rotation.y = yaw;

      const aligned = Math.abs(turn) < 0.55;
      if (aligned) {
        const step = Math.min(WALK_SPEED * delta, distance);
        group.position.x += Math.sin(yaw) * step;
        group.position.z += Math.cos(yaw) * step;
        walkPhase += delta * 7.2;
        group.position.y = GROUND_Y + 0.02 + Math.abs(Math.sin(walkPhase)) * 0.012;

        for (let index = 0; index < legs.length; index += 1) {
          const leg = legs[index];
          const swing =
            Math.sin(walkPhase + index * (Math.PI / 2)) * 0.22 * leg.fore;
          leg.mesh.rotation.x = swing;
          leg.mesh.position.y =
            leg.baseY + Math.max(0, Math.sin(walkPhase + index * 1.57)) * 0.04;
        }
      }
    },
    dispose() {
      scene.remove(group);
      for (const geometry of geometries) {
        geometry.dispose();
      }
      materials.shell.dispose();
      materials.plate.dispose();
      materials.skin.dispose();
      materials.eye.dispose();
    },
  };
}
