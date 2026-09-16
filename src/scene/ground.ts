import {
  CanvasTexture,
  Color,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Vector3,
  type Scene,
} from 'three';
import { GROUND_Y } from './constants';

export type GroundHandle = {
  dispose: () => void;
};

function noise2d(x: number, z: number) {
  return (
    Math.sin(x * 0.35) * Math.cos(z * 0.28) * 0.45 +
    Math.sin(x * 0.9 + 1.7) * Math.cos(z * 0.7) * 0.2 +
    Math.sin(x * 2.1 + z * 1.4) * 0.08
  );
}

function createEarthTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('No se pudo crear textura de tierra');
  }

  const image = context.createImageData(size, size);
  const data = image.data;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = x / size;
      const ny = y / size;
      const soil =
        0.45 +
        Math.sin(nx * 38 + ny * 21) * 0.08 +
        Math.sin(nx * 71 - ny * 53) * 0.05 +
        Math.sin((nx + ny) * 120) * 0.03;
      const litter =
        Math.sin(nx * 160 + ny * 90) * Math.cos(nx * 40 - ny * 130) * 0.5 + 0.5;
      const speck = Math.random();

      let red = 48 + soil * 42 + litter * 28;
      let green = 36 + soil * 28 + litter * 18;
      let blue = 22 + soil * 16 + litter * 8;

      if (speck > 0.94) {
        red += 18;
        green += 22;
        blue += 8;
      } else if (speck < 0.06) {
        red -= 12;
        green -= 8;
        blue -= 6;
      }

      const offset = (y * size + x) * 4;
      data[offset] = Math.min(255, Math.max(0, red));
      data[offset + 1] = Math.min(255, Math.max(0, green));
      data[offset + 2] = Math.min(255, Math.max(0, blue));
      data[offset + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(18, 18);
  texture.needsUpdate = true;
  return texture;
}

export function createGround(scene: Scene): GroundHandle {
  const geometry = new PlaneGeometry(200, 200, 80, 80);
  const position = geometry.attributes.position;
  const vertex = new Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vertex.fromBufferAttribute(position, index);
    const lift = noise2d(vertex.x * 1.2, vertex.y * 1.2) * 0.1;
    const grit = noise2d(vertex.x * 3.5, vertex.y * 3.1) * 0.03;
    position.setZ(index, lift + grit);
  }

  geometry.computeVertexNormals();

  const map = createEarthTexture();
  const material = new MeshStandardMaterial({
    map,
    color: new Color(0xa89878),
    roughness: 0.96,
    metalness: 0.02,
  });

  const ground = new Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = GROUND_Y;
  scene.add(ground);

  return {
    dispose() {
      scene.remove(ground);
      geometry.dispose();
      material.dispose();
      map.dispose();
    },
  };
}
