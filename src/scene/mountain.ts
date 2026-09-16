import {
  Color,
  ConeGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  type Scene,
} from 'three';
import { GROUND_Y } from './constants';

export type MountainHandle = {
  dispose: () => void;
};

export function createHorizonMountain(scene: Scene): MountainHandle {
  const group = new Group();
  group.position.set(-62, GROUND_Y, -48);

  const rock = new MeshStandardMaterial({
    color: new Color(0x1a1524),
    roughness: 0.96,
    metalness: 0.02,
    flatShading: true,
  });
  const snow = new MeshStandardMaterial({
    color: new Color(0x6a5a82),
    roughness: 0.88,
    metalness: 0.04,
    flatShading: true,
  });

  const main = new Mesh(new ConeGeometry(28, 52, 7), rock);
  main.position.y = 26;
  main.rotation.y = 0.4;
  group.add(main);

  const ridge = new Mesh(new ConeGeometry(16, 34, 6), rock);
  ridge.position.set(18, 16, 8);
  ridge.rotation.y = -0.55;
  group.add(ridge);

  const peak = new Mesh(new ConeGeometry(9, 14, 6), snow);
  peak.position.set(-2, 44, -2);
  group.add(peak);

  const shoulder = new Mesh(new ConeGeometry(12, 22, 5), rock);
  shoulder.position.set(-14, 10, 10);
  group.add(shoulder);

  scene.add(group);

  return {
    dispose() {
      scene.remove(group);
      main.geometry.dispose();
      ridge.geometry.dispose();
      peak.geometry.dispose();
      shoulder.geometry.dispose();
      rock.dispose();
      snow.dispose();
    },
  };
}
