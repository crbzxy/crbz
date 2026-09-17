import {
  AmbientLight,
  BackSide,
  Color,
  DirectionalLight,
  FogExp2,
  HemisphereLight,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  type Scene,
} from 'three';
import {
  AMBIENT_PURPLE,
  GROUND_TINT,
  HEMISPHERE_SKY,
  MOON_AMBIENT,
  MOON_DIRECTION,
  MOON_LIGHT,
  SKY_FOG,
  SKY_HORIZON,
  SKY_TOP,
} from './constants';
import type { SceneSystem } from './types';
import skyVertexShader from '../shaders/worldPosition.vert.glsl';
import skyFragmentShader from '../shaders/atmosphereSky.frag.glsl';

export type AtmosphereHandle = SceneSystem;

export function createAtmosphere(scene: Scene): AtmosphereHandle {
  scene.background = new Color(SKY_FOG);
  const mistFog = new Color(SKY_FOG).lerp(new Color(MOON_AMBIENT), 0.38);
  scene.fog = new FogExp2(mistFog.getHex(), 0.0055);

  const moonDirection = new Vector3(
    MOON_DIRECTION.x,
    MOON_DIRECTION.y,
    MOON_DIRECTION.z,
  ).normalize();

  const skyMaterial = new ShaderMaterial({
    vertexShader: skyVertexShader,
    fragmentShader: skyFragmentShader,
    uniforms: {
      uTop: { value: new Color(SKY_TOP) },
      uHorizon: { value: new Color(SKY_HORIZON) },
      uMoonDir: { value: moonDirection.clone() },
      uTime: { value: 0 },
    },
    side: BackSide,
    depthWrite: false,
    fog: false,
  });

  const sky = new Mesh(new SphereGeometry(120, 48, 32), skyMaterial);
  sky.frustumCulled = false;
  scene.add(sky);

  const hemiSky = new Color(HEMISPHERE_SKY).lerp(new Color(MOON_AMBIENT), 0.7);
  const hemi = new HemisphereLight(hemiSky, GROUND_TINT, 0.95);
  scene.add(hemi);

  const ambient = new AmbientLight(MOON_AMBIENT, 0.72);
  scene.add(ambient);

  const moonKey = new DirectionalLight(MOON_LIGHT, 0.78);
  moonKey.position.copy(moonDirection).multiplyScalar(48);
  scene.add(moonKey);

  const moonAmbientFill = new DirectionalLight(MOON_AMBIENT, 0.52);
  moonAmbientFill.position.copy(moonDirection).multiplyScalar(36);
  scene.add(moonAmbientFill);

  const moonBounce = new DirectionalLight(AMBIENT_PURPLE, 0.32);
  moonBounce.position
    .copy(moonDirection)
    .multiplyScalar(-18)
    .setY(Math.abs(moonDirection.y) * 12 + 6);
  scene.add(moonBounce);

  return {
    update(_delta, simTime) {
      skyMaterial.uniforms.uTime.value = simTime;
      const pulse = 0.92 + Math.sin(simTime * 0.12) * 0.08;
      moonKey.intensity = 0.78 * pulse;
      moonAmbientFill.intensity = 0.52 * pulse;
      ambient.intensity = 0.68 + pulse * 0.08;
    },
    dispose() {
      sky.geometry.dispose();
      skyMaterial.dispose();
      scene.remove(sky, hemi, ambient, moonKey, moonAmbientFill, moonBounce);
      scene.fog = null;
    },
  };
}
