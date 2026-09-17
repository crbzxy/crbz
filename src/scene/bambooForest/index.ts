import {
  Color,
  CylinderGeometry,
  DoubleSide,
  DynamicDrawUsage,
  InstancedMesh,
  MeshStandardMaterial,
  Object3D,
  type Scene,
} from 'three';
import {
  BAMBOO_BLAST_RADIUS,
  BAMBOO_COUNT,
  BAMBOO_FALLEN_COUNT,
  BAMBOO_LEAF_COUNT,
  BAMBOO_RING_COUNT,
  BAMBOO_STRIKE_DEBRIS,
  GROUND_Y,
  randomRange,
} from '../constants';
import type { SceneSystem } from '../types';
import {
  createCheckerDensityField,
  createFallenData,
  createFallenSegment,
  createHiddenFallenSlot,
  createLeafData,
  createLeafShapeGeometry,
  createOuterRingStalks,
  createStalkData,
  fallenPalette,
  leafPalette,
  stalkPalette,
} from './layout';
import { applyBlastToStalk, integrateStalk } from './physics';
import type { FallenBamboo } from './types';

export type BambooForestHandle = SceneSystem & {
  /** Explosión del rayo: impulso + daño de integridad. */
  thinAround: (x: number, z: number) => void;
  /** Abre un claro limpio (sin escombros) para props / escenografía. */
  clearPocket: (x: number, z: number, radius: number) => void;
};

const tempObject = new Object3D();

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

function placeFallenInstances(mesh: InstancedMesh, fallen: FallenBamboo[]) {
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

  function writeStrikeDebris(stalk: (typeof stalks)[number]) {
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

  function clearPocket(x: number, z: number, radius: number) {
    const radiusSq = radius * radius;

    for (let index = 0; index < stalks.length; index += 1) {
      const stalk = stalks[index];
      if (!stalk.alive) {
        continue;
      }
      const offsetX = stalk.x - x;
      const offsetZ = stalk.z - z;
      if (offsetX * offsetX + offsetZ * offsetZ > radiusSq) {
        continue;
      }
      stalk.alive = false;
      stalk.falling = false;
      stalk.integrity = 0;
      hideStalkInstance(stalkMesh, index);
    }
    stalkMesh.instanceMatrix.needsUpdate = true;
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
    clearPocket,
    update(delta, simTime, ctx) {
      for (let index = 0; index < stalks.length; index += 1) {
        const stalk = stalks[index];
        if (!stalk.alive) {
          leanXCache[index] = 0;
          leanZCache[index] = 0;
          hideStalkInstance(stalkMesh, index);
          continue;
        }

        const snapped = integrateStalk(stalk, delta, simTime, ctx.windStrength);
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
          Math.sin(simTime * 3.8 * stalk.speed + leaf.phase) *
          0.35 *
          ctx.windStrength *
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
