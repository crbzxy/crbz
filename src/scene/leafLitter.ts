import {
  Color,
  DoubleSide,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  Shape,
  ShapeGeometry,
  type Scene,
} from 'three';
import {
  CAMERA_START_FOCUS,
  CLEARING_RADIUS,
  FOREST_OUTER_RADIUS,
  GROUND_Y,
  randomRange,
} from './constants';

export type LeafLitterHandle = {
  dispose: () => void;
};

const tempObject = new Object3D();
const LITTER_COUNT = 4200;

const litterPalette = [
  new Color(0x3a2e18),
  new Color(0x4a3820),
  new Color(0x2c2414),
  new Color(0x5a4428),
  new Color(0x3f3420),
  new Color(0x6a5230),
  new Color(0x2a3018),
  new Color(0x4a4024),
  new Color(0x1e1a10),
];

function createDriedLeafGeometry() {
  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.16, 0.04, 0.48, 0.015);
  shape.quadraticCurveTo(0.82, 0, 0.95, -0.015);
  shape.quadraticCurveTo(0.62, -0.07, 0.3, -0.06);
  shape.quadraticCurveTo(0.1, -0.04, 0, 0);
  const geometry = new ShapeGeometry(shape, 6);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function pickLitterSpot() {
  const angle = Math.random() * Math.PI * 2;
  const preferNear = Math.random() > 0.4;
  const maxRadius = preferNear
    ? FOREST_OUTER_RADIUS * 0.42
    : FOREST_OUTER_RADIUS * 0.9;
  const radius = Math.sqrt(Math.random()) * maxRadius;
  return {
    x: CAMERA_START_FOCUS.x + Math.cos(angle) * radius + randomRange(-0.25, 0.25),
    z: CAMERA_START_FOCUS.z + Math.sin(angle) * radius + randomRange(-0.25, 0.25),
  };
}

export function createLeafLitter(scene: Scene): LeafLitterHandle {
  const geometry = createDriedLeafGeometry();
  const material = new MeshStandardMaterial({
    color: new Color(0xffffff),
    roughness: 0.95,
    metalness: 0.02,
    side: DoubleSide,
    flatShading: true,
  });

  const mesh = new InstancedMesh(geometry, material, LITTER_COUNT);
  mesh.frustumCulled = false;
  scene.add(mesh);

  for (let index = 0; index < LITTER_COUNT; index += 1) {
    const spot = pickLitterSpot();
    const inClearing =
      Math.hypot(spot.x - CAMERA_START_FOCUS.x, spot.z - CAMERA_START_FOCUS.z) <
      CLEARING_RADIUS * 1.8;
    const scale = inClearing
      ? randomRange(0.35, 0.85)
      : randomRange(0.45, 1.25);
    const curl = randomRange(-0.35, 0.45);

    tempObject.position.set(
      spot.x,
      GROUND_Y + randomRange(0.012, 0.045),
      spot.z,
    );
    tempObject.rotation.set(
      curl * 0.35,
      randomRange(0, Math.PI * 2),
      randomRange(-0.55, 0.55),
    );
    tempObject.scale.set(
      scale * randomRange(0.75, 1.2),
      1,
      scale * randomRange(0.55, 1.05),
    );
    tempObject.updateMatrix();
    mesh.setMatrixAt(index, tempObject.matrix);
    mesh.setColorAt(
      index,
      litterPalette[Math.floor(Math.random() * litterPalette.length)],
    );
  }

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }

  return {
    dispose() {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    },
  };
}
