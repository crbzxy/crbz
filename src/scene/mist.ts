import {
  BackSide,
  Color,
  CylinderGeometry,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  type Scene,
} from 'three';
import { GROUND_Y, MOON_AMBIENT, SKY_FOG, SKY_HORIZON } from './constants';
import type { SceneSystem } from './types';
import mistVertexShader from '../shaders/mist.vert.glsl';
import bandFragmentShader from '../shaders/mistBand.frag.glsl';
import groundMistFragmentShader from '../shaders/mistGround.frag.glsl';

export type MistHandle = SceneSystem;

export function createHorizonMist(scene: Scene): MistHandle {
  const mistColor = new Color(SKY_FOG).lerp(new Color(MOON_AMBIENT), 0.55);
  mistColor.lerp(new Color(SKY_HORIZON), 0.25);

  const bandMaterial = new ShaderMaterial({
    vertexShader: mistVertexShader,
    fragmentShader: bandFragmentShader,
    uniforms: {
      uMist: { value: mistColor.clone() },
      uHorizon: { value: new Color(SKY_HORIZON) },
      uTime: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    side: BackSide,
    fog: false,
  });

  const band = new Mesh(
    new CylinderGeometry(95, 95, 22, 48, 1, true),
    bandMaterial,
  );
  band.position.y = GROUND_Y + 8.5;
  band.frustumCulled = false;
  scene.add(band);

  const sheetMaterial = new ShaderMaterial({
    vertexShader: mistVertexShader,
    fragmentShader: groundMistFragmentShader,
    uniforms: {
      uMist: { value: mistColor.clone() },
      uTime: { value: 0 },
    },
    transparent: true,
    depthWrite: false,
    fog: false,
  });

  const sheet = new Mesh(new PlaneGeometry(180, 180, 1, 1), sheetMaterial);
  sheet.rotation.x = -Math.PI / 2;
  sheet.position.y = GROUND_Y + 0.35;
  sheet.frustumCulled = false;
  scene.add(sheet);

  return {
    update(_delta, simTime) {
      bandMaterial.uniforms.uTime.value = simTime;
      sheetMaterial.uniforms.uTime.value = simTime;
    },
    dispose() {
      scene.remove(band, sheet);
      band.geometry.dispose();
      sheet.geometry.dispose();
      bandMaterial.dispose();
      sheetMaterial.dispose();
    },
  };
}
