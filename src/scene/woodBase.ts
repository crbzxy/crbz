import {
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from 'three';
import { randomRange } from './constants';

const woodPalette = [
  new Color(0x3b2a1c),
  new Color(0x4a3422),
  new Color(0x2c1f14),
  new Color(0x5a3f28),
  new Color(0x1f1610),
];

const charcoalPalette = [
  new Color(0x1a1410),
  new Color(0x2a2218),
  new Color(0x12100c),
];

export type WoodBaseHandle = {
  group: Group;
  dispose: () => void;
};

type WoodStyle = 'single' | 'crossed' | 'pile' | 'teepee';

function pickStyle(): WoodStyle {
  const roll = Math.random();
  if (roll < 0.25) return 'single';
  if (roll < 0.5) return 'crossed';
  if (roll < 0.78) return 'pile';
  return 'teepee';
}

function createLogMesh(
  length: number,
  radius: number,
  charred: boolean,
) {
  const geometry = new CylinderGeometry(radius * 0.85, radius, length, 7, 1);
  const color = charred
    ? charcoalPalette[Math.floor(Math.random() * charcoalPalette.length)]
    : woodPalette[Math.floor(Math.random() * woodPalette.length)];

  const material = new MeshStandardMaterial({
    color,
    roughness: charred ? 0.95 : 0.88,
    metalness: 0.02,
    flatShading: true,
  });

  const mesh = new Mesh(geometry, material);
  mesh.userData.disposables = [geometry, material];
  return mesh;
}

function placeLog(
  group: Group,
  mesh: Mesh,
  position: Vector3,
  rotation: Vector3,
) {
  mesh.position.copy(position);
  mesh.rotation.set(rotation.x, rotation.y, rotation.z);
  group.add(mesh);
}

export function createWoodBase(scale: number): WoodBaseHandle {
  const group = new Group();
  const style = pickStyle();
  const woodScale = scale * randomRange(0.85, 1.25);
  const disposables: Array<{ dispose: () => void }> = [];

  const track = (mesh: Mesh) => {
    const items = mesh.userData.disposables as Array<{ dispose: () => void }>;
    disposables.push(...items);
    return mesh;
  };

  if (style === 'single') {
    const length = randomRange(0.28, 0.55) * woodScale;
    const radius = randomRange(0.035, 0.065) * woodScale;
    const log = track(createLogMesh(length, radius, Math.random() > 0.45));
    placeLog(
      group,
      log,
      new Vector3(0, radius * 0.85, 0),
      new Vector3(0, randomRange(0, Math.PI), Math.PI / 2 + randomRange(-0.15, 0.15)),
    );
  }

  if (style === 'crossed') {
    for (let index = 0; index < 2; index += 1) {
      const length = randomRange(0.32, 0.6) * woodScale;
      const radius = randomRange(0.03, 0.055) * woodScale;
      const log = track(createLogMesh(length, radius, Math.random() > 0.35));
      placeLog(
        group,
        log,
        new Vector3(
          randomRange(-0.04, 0.04),
          radius * (0.9 + index * 0.7),
          randomRange(-0.04, 0.04),
        ),
        new Vector3(
          randomRange(-0.2, 0.2),
          index * (Math.PI / 2) + randomRange(-0.25, 0.25),
          Math.PI / 2 + randomRange(-0.2, 0.2),
        ),
      );
    }
  }

  if (style === 'pile') {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let index = 0; index < count; index += 1) {
      const length = randomRange(0.18, 0.48) * woodScale;
      const radius = randomRange(0.022, 0.05) * woodScale;
      const log = track(createLogMesh(length, radius, Math.random() > 0.4));
      placeLog(
        group,
        log,
        new Vector3(
          randomRange(-0.1, 0.1) * woodScale,
          radius + index * radius * 0.55,
          randomRange(-0.1, 0.1) * woodScale,
        ),
        new Vector3(
          randomRange(-0.35, 0.35),
          randomRange(0, Math.PI * 2),
          Math.PI / 2 + randomRange(-0.45, 0.45),
        ),
      );
    }
  }

  if (style === 'teepee') {
    const count = 3 + Math.floor(Math.random() * 2);
    for (let index = 0; index < count; index += 1) {
      const length = randomRange(0.34, 0.58) * woodScale;
      const radius = randomRange(0.02, 0.04) * woodScale;
      const angle = (index / count) * Math.PI * 2 + randomRange(-0.2, 0.2);
      const log = track(createLogMesh(length, radius, Math.random() > 0.5));
      placeLog(
        group,
        log,
        new Vector3(
          Math.cos(angle) * 0.08 * woodScale,
          length * 0.28,
          Math.sin(angle) * 0.08 * woodScale,
        ),
        new Vector3(
          randomRange(0.45, 0.75),
          angle,
          randomRange(-0.15, 0.15),
        ),
      );
    }
  }

  const emberCount = 1 + Math.floor(Math.random() * 3);
  for (let index = 0; index < emberCount; index += 1) {
    const chip = track(
      createLogMesh(
        randomRange(0.06, 0.14) * woodScale,
        randomRange(0.012, 0.025) * woodScale,
        true,
      ),
    );
    placeLog(
      group,
      chip,
      new Vector3(
        randomRange(-0.12, 0.12) * woodScale,
        randomRange(0.01, 0.04),
        randomRange(-0.12, 0.12) * woodScale,
      ),
      new Vector3(
        randomRange(0, Math.PI),
        randomRange(0, Math.PI * 2),
        Math.PI / 2 + randomRange(-0.5, 0.5),
      ),
    );
  }

  return {
    group,
    dispose() {
      for (const item of disposables) {
        item.dispose();
      }
    },
  };
}
