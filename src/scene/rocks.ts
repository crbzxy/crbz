import {
  Color,
  DodecahedronGeometry,
  DynamicDrawUsage,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
  type Scene,
} from 'three';
import {
  FOREST_INNER_RADIUS,
  FOREST_OUTER_RADIUS,
  GROUND_Y,
  randomRange,
} from './constants';

export type RockFieldHandle = {
  dispose: () => void;
};

const ROCK_COUNT = 48;
const tempObject = new Object3D();

function createOrganicRockGeometry() {
  const geometry = new DodecahedronGeometry(1, 1);
  const position = geometry.attributes.position;
  const vertex = new Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index);
    const warp =
      0.72 +
      Math.sin(vertex.x * 4.1 + vertex.y * 2.7) * 0.12 +
      Math.cos(vertex.z * 3.3 + vertex.x * 1.9) * 0.1 +
      Math.random() * 0.18;
    vertex.multiplyScalar(warp);
    vertex.y *= randomRange(0.45, 0.85);
    position.setXYZ(index, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function placeRock() {
  for (let attempt = 0; attempt < 24; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = randomRange(FOREST_INNER_RADIUS + 0.2, FOREST_OUTER_RADIUS * 0.7);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    if (Math.hypot(x, z) > FOREST_INNER_RADIUS) {
      return { x, z, radius };
    }
  }
  return { x: 2, z: -1.5, radius: 2.5 };
}

export function createRockField(scene: Scene): RockFieldHandle {
  const geometry = createOrganicRockGeometry();
  const material = new MeshStandardMaterial({
    color: new Color(0x3a3544),
    roughness: 0.92,
    metalness: 0.08,
    flatShading: true,
  });

  const mesh = new InstancedMesh(geometry, material, ROCK_COUNT);
  mesh.instanceMatrix.setUsage(DynamicDrawUsage);

  const palette = [
    new Color(0x2e2a36),
    new Color(0x3f3a48),
    new Color(0x4a4452),
    new Color(0x25222c),
    new Color(0x554e5c),
  ];

  for (let index = 0; index < ROCK_COUNT; index += 1) {
    const { x, z, radius } = placeRock();
    const size =
      radius < 3 ? randomRange(0.08, 0.22) : randomRange(0.12, 0.45);

    tempObject.position.set(x, GROUND_Y + size * randomRange(0.15, 0.35), z);
    tempObject.rotation.set(
      randomRange(-0.4, 0.4),
      randomRange(0, Math.PI * 2),
      randomRange(-0.35, 0.35),
    );
    tempObject.scale.set(
      size * randomRange(0.8, 1.3),
      size * randomRange(0.4, 0.85),
      size * randomRange(0.75, 1.25),
    );
    tempObject.updateMatrix();
    mesh.setMatrixAt(index, tempObject.matrix);
    mesh.setColorAt(index, palette[index % palette.length]);
  }

  mesh.instanceMatrix.needsUpdate = true;
  if (mesh.instanceColor) {
    mesh.instanceColor.needsUpdate = true;
  }

  scene.add(mesh);

  return {
    dispose() {
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
    },
  };
}
