import { useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three';

const GROUND_Y = -0.83;
const MIN_FLAMES = 3;
const MAX_FLAMES = 7;
const PARTICLES_PER_FLAME = 120;

const flameVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const flameFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform float uIntensity;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 6; i++) {
      value += amplitude * noise(p);
      p = p * 2.15 + vec2(1.7, -3.1);
      amplitude *= 0.52;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime + uSeed * 17.0;

    float lean = sin(t * 3.7) * 0.08 + sin(t * 7.1 + 1.3) * 0.05 + sin(t * 11.4) * 0.025;
    float stretch = 0.94 + sin(t * 5.3) * 0.06 + sin(t * 9.8 + 0.6) * 0.04;
    vec2 warped = uv;
    warped.x += lean * pow(uv.y, 1.8);
    warped.y = pow(clamp(uv.y / stretch, 0.0, 1.05), 0.95);

    float gust = fbm(vec2(warped.x * 3.2 + t * 0.55 + uSeed, warped.y * 1.4 - t * 0.9));
    warped.x += (gust - 0.5) * 0.18 * pow(warped.y, 1.5);
    warped.y += (gust - 0.45) * 0.03 * warped.y;

    float width = pow(max(1.0 - abs(warped.x * 2.0 - 1.0), 0.0), 1.05 + gust * 0.35);
    float tip = 0.48 + sin(t * 6.2) * 0.06 + (gust - 0.5) * 0.08;
    float heightMask = smoothstep(0.0, 0.05, warped.y) * smoothstep(1.0, tip, warped.y);
    float shape = width * heightMask;

    vec2 flameUv = vec2(warped.x * 3.4 + sin(t * 4.2) * 0.4, warped.y * 2.8 - t * 1.8);
    float n = fbm(flameUv + vec2(fbm(flameUv * 1.3 + t * 0.2)));
    float detail = fbm(flameUv * 2.4 + vec2(2.4, -t * 0.75));
    float snaps = step(0.72, noise(vec2(floor(t * 14.0), floor(warped.x * 8.0 + uSeed))));

    float raw = shape * (0.32 + n * 0.95) - (1.0 - shape) * detail * 0.55 - snaps * 0.12 * warped.y;
    float flame = clamp(smoothstep(0.16, 0.62, raw), 0.0, 1.0);
    flame *= 0.75 + 0.25 * (0.5 + 0.5 * sin(t * 17.0 + warped.x * 10.0));
    flame *= uIntensity;

    vec3 color = mix(vec3(0.4, 0.03, 0.0), vec3(0.95, 0.28, 0.02), flame);
    color = mix(color, vec3(1.0, 0.68, 0.12), pow(flame, 2.0));
    color = mix(color, vec3(1.0, 0.94, 0.5), pow(flame, 4.2) * (1.0 - warped.y) * 0.9);

    gl_FragColor = vec4(color, clamp(flame * shape * 0.92, 0.0, 1.0));
  }
`;

const spotVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const spotFragmentShader = /* glsl */ `
  uniform float uIntensity;
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float d = length(p);
    float flicker = 0.8
      + 0.12 * sin(uTime * 8.5 + uSeed)
      + 0.08 * sin(uTime * 19.0 + uSeed * 3.0);
    float glow = exp(-d * d * 3.2) * uIntensity * flicker;
    float rim = exp(-d * d * 1.1) * uIntensity * 0.35 * flicker;
    vec3 color = vec3(1.0, 0.4, 0.06) * glow + vec3(1.0, 0.62, 0.18) * rim;
    gl_FragColor = vec4(color, clamp(glow + rim, 0.0, 0.75));
  }
`;

type FlameTraits = {
  x: number;
  z: number;
  size: number;
  intensity: number;
  seed: number;
  phase: number;
  speed: number;
};

type ParticleBundle = {
  positions: Float32Array;
  colors: Float32Array;
  ages: Float32Array;
  speeds: Float32Array;
  geometry: BufferGeometry;
};

type FlameInstance = {
  traits: FlameTraits;
  group: Group;
  flameMesh: Mesh;
  glowMesh: Mesh;
  spotMesh: Mesh;
  light: PointLight;
  flameMaterial: ShaderMaterial;
  glowMaterial: ShaderMaterial;
  spotMaterial: ShaderMaterial;
  particles: ParticleBundle;
  particleMaterial: PointsMaterial;
  height: number;
};

function randomRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createUniqueTraits(existing: FlameTraits[]): FlameTraits {
  let traits: FlameTraits | null = null;

  for (let attempt = 0; attempt < 24; attempt += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = randomRange(0.4, 3.8);
    const candidate: FlameTraits = {
      x: Math.cos(angle) * distance * randomRange(0.55, 1.0),
      z: Math.sin(angle) * distance * 0.45 - distance * 0.35,
      size: randomRange(0.35, 1.35),
      intensity: randomRange(0.35, 1.4),
      seed: Math.random() * 100,
      phase: Math.random() * Math.PI * 2,
      speed: randomRange(0.7, 1.45),
    };

    const tooClose = existing.some((other) => {
      const dx = other.x - candidate.x;
      const dz = other.z - candidate.z;
      return Math.hypot(dx, dz) < 0.55;
    });

    if (!tooClose) {
      traits = candidate;
      break;
    }
  }

  return (
    traits ?? {
      x: randomRange(-2, 2),
      z: randomRange(-2.5, 0.5),
      size: randomRange(0.4, 1.2),
      intensity: randomRange(0.4, 1.2),
      seed: Math.random() * 100,
      phase: Math.random() * Math.PI * 2,
      speed: randomRange(0.8, 1.3),
    }
  );
}

function createParticleBundle(traits: FlameTraits): ParticleBundle {
  const count = PARTICLES_PER_FLAME;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const ages = new Float32Array(count);
  const speeds = new Float32Array(count);
  const geometry = new BufferGeometry();

  for (let index = 0; index < count; index += 1) {
    resetParticle(positions, colors, ages, speeds, index, traits);
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));

  return { positions, colors, ages, speeds, geometry };
}

function resetParticle(
  positions: Float32Array,
  colors: Float32Array,
  ages: Float32Array,
  speeds: Float32Array,
  index: number,
  traits: FlameTraits,
) {
  const offset = index * 3;
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 0.06 * traits.size;

  positions[offset] = Math.cos(angle) * radius;
  positions[offset + 1] = 0.02 + Math.random() * 0.03;
  positions[offset + 2] = Math.sin(angle) * radius * 0.35;

  ages[index] = Math.random();
  speeds[index] = (0.6 + Math.random() * 1.0) * traits.speed;

  const heat = 0.4 + traits.intensity * 0.35;
  colors[offset] = 1.0;
  colors[offset + 1] = 0.35 + heat * 0.35;
  colors[offset + 2] = 0.04 + Math.random() * 0.08;
}

function flickerFor(time: number, traits: FlameTraits) {
  const local = time * traits.speed + traits.phase;
  const spike = Math.sin(local * 31.0 + traits.seed) > 0.93 ? 0.28 : 0;
  return (
    traits.intensity *
    (0.9 +
      Math.sin(local * 6.4) * 0.16 +
      Math.sin(local * 13.9) * 0.12 +
      Math.sin(local * 22.5) * 0.08 +
      spike)
  );
}

function createFlameInstance(traits: FlameTraits): FlameInstance {
  const group = new Group();
  group.position.set(traits.x, GROUND_Y, traits.z);

  const height = 0.42 * traits.size;
  const width = 0.32 * traits.size;

  const flameMaterial = new ShaderMaterial({
    vertexShader: flameVertexShader,
    fragmentShader: flameFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uSeed: { value: traits.seed },
      uIntensity: { value: traits.intensity },
    },
    transparent: true,
    depthWrite: false,
    side: DoubleSide,
  });

  const flameMesh = new Mesh(new PlaneGeometry(width, height), flameMaterial);
  flameMesh.position.y = height / 2;
  group.add(flameMesh);

  const glowMaterial = new ShaderMaterial({
    vertexShader: spotVertexShader,
    fragmentShader: spotFragmentShader,
    uniforms: {
      uIntensity: { value: 0.35 * traits.intensity },
      uTime: { value: 0 },
      uSeed: { value: traits.seed },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  });

  const glowMesh = new Mesh(
    new PlaneGeometry(1.2 * traits.size, 1.2 * traits.size),
    glowMaterial,
  );
  glowMesh.position.y = height * 0.35;
  glowMesh.position.z = -0.02;
  group.add(glowMesh);

  const spotMaterial = new ShaderMaterial({
    vertexShader: spotVertexShader,
    fragmentShader: spotFragmentShader,
    uniforms: {
      uIntensity: { value: 0.7 * traits.intensity },
      uTime: { value: 0 },
      uSeed: { value: traits.seed + 1 },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
  });

  const spotMesh = new Mesh(
    new PlaneGeometry(1.8 * traits.size, 1.8 * traits.size),
    spotMaterial,
  );
  spotMesh.rotation.x = -Math.PI / 2;
  spotMesh.position.y = 0.01;
  group.add(spotMesh);

  const light = new PointLight(
    0xff6a1a,
    1.4 * traits.intensity,
    3.5 + traits.size * 2.5,
    2,
  );
  light.position.set(0, height * 0.45, 0.08);
  group.add(light);

  const particles = createParticleBundle(traits);
  const particleMaterial = new PointsMaterial({
    size: 0.018 * traits.size,
    vertexColors: true,
    transparent: true,
    opacity: 0.28 + traits.intensity * 0.18,
    depthWrite: false,
    blending: AdditiveBlending,
    sizeAttenuation: true,
  });
  group.add(new Points(particles.geometry, particleMaterial));

  return {
    traits,
    group,
    flameMesh,
    glowMesh,
    spotMesh,
    light,
    flameMaterial,
    glowMaterial,
    spotMaterial,
    particles,
    particleMaterial,
    height,
  };
}

function disposeFlame(flame: FlameInstance) {
  flame.flameMesh.geometry.dispose();
  flame.glowMesh.geometry.dispose();
  flame.spotMesh.geometry.dispose();
  flame.flameMaterial.dispose();
  flame.glowMaterial.dispose();
  flame.spotMaterial.dispose();
  flame.particles.geometry.dispose();
  flame.particleMaterial.dispose();
}

function updateFlameParticles(
  flame: FlameInstance,
  delta: number,
  time: number,
) {
  const { positions, colors, ages, speeds, geometry } = flame.particles;
  const traits = flame.traits;
  const maxRise = flame.height * 0.8;

  for (let index = 0; index < PARTICLES_PER_FLAME; index += 1) {
    const offset = index * 3;
    const turbulence = 0.7 + Math.sin(time * 8.0 + index * 0.37 + traits.seed) * 0.5;
    ages[index] += delta * speeds[index] * (0.45 + turbulence * 0.2);

    if (ages[index] >= 1) {
      resetParticle(positions, colors, ages, speeds, index, traits);
      continue;
    }

    const age = ages[index];
    positions[offset] +=
      Math.sin(time * 5.5 + index + traits.seed) * 0.0012 * turbulence;
    positions[offset + 1] += (0.08 + turbulence * 0.05 - age * 0.04) * delta * traits.size;
    positions[offset + 2] +=
      Math.cos(time * 4.2 + index) * 0.0008 * turbulence;

    if (positions[offset + 1] > maxRise) {
      ages[index] = 1;
    }

    const fade = (1 - age) * traits.intensity;
    colors[offset] = fade;
    colors[offset + 1] = (0.5 - age * 0.35) * fade;
    colors[offset + 2] = 0.04 * fade;
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.attributes.color.needsUpdate = true;
}

export function FlameScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const scene = new Scene();
    scene.background = new Color(0x030201);

    const camera = new PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.15, 7.2);
    camera.lookAt(0, GROUND_Y + 0.2, -0.4);

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x030201, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const floor = new Mesh(
      new PlaneGeometry(16, 16),
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
        uniforms: {},
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float alpha = smoothstep(1.0, 0.2, d) * 0.18;
            gl_FragColor = vec4(0.02, 0.01, 0.0, alpha);
          }
        `,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = GROUND_Y;
    scene.add(floor);

    const flameCount = Math.floor(randomRange(MIN_FLAMES, MAX_FLAMES + 1));
    const traitsList: FlameTraits[] = [];
    const flames: FlameInstance[] = [];

    for (let index = 0; index < flameCount; index += 1) {
      const traits = createUniqueTraits(traitsList);
      traitsList.push(traits);
      const flame = createFlameInstance(traits);
      flames.push(flame);
      scene.add(flame.group);
    }

    let animationFrame = 0;
    let previousTime = performance.now();

    const resize = () => {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, true);
    };

    const animate = (now: number) => {
      const delta = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      const time = now / 1000;

      for (const flame of flames) {
        const pulse = flickerFor(time, flame.traits);
        flame.flameMaterial.uniforms.uTime.value = time;
        flame.flameMaterial.uniforms.uIntensity.value = pulse;
        flame.glowMaterial.uniforms.uTime.value = time;
        flame.glowMaterial.uniforms.uIntensity.value = pulse * 0.4;
        flame.spotMaterial.uniforms.uTime.value = time;
        flame.spotMaterial.uniforms.uIntensity.value = pulse * 0.75;

        flame.light.intensity = 1.2 * pulse;
        flame.light.position.x =
          Math.sin(time * 11.0 + flame.traits.phase) * 0.03 * flame.traits.size;
        flame.light.position.y =
          flame.height * 0.4 + Math.sin(time * 9.0 + flame.traits.seed) * 0.02;

        const scaleX =
          0.94 +
          Math.sin(time * 4.6 * flame.traits.speed + flame.traits.phase) * 0.07;
        const scaleY =
          0.96 +
          Math.sin(time * 3.8 * flame.traits.speed + flame.traits.phase) * 0.05 +
          pulse * 0.02;
        flame.flameMesh.scale.set(scaleX, scaleY, 1);
        flame.flameMesh.position.y = (flame.height * scaleY) / 2;
        flame.flameMesh.rotation.y =
          Math.sin(time * 0.7 + flame.traits.phase) * 0.03;
        flame.flameMesh.rotation.z =
          Math.sin(time * 1.9 + flame.traits.seed) * 0.02;

        flame.glowMesh.scale.setScalar(0.9 + pulse * 0.08);
        flame.spotMesh.scale.setScalar(0.92 + pulse * 0.1);

        updateFlameParticles(flame, delta, time);
      }

      camera.position.x = Math.sin(time * 0.1) * 0.08;
      camera.lookAt(0, GROUND_Y + 0.2, -0.3);

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      floor.geometry.dispose();
      (floor.material as ShaderMaterial).dispose();
      for (const flame of flames) {
        disposeFlame(flame);
      }
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="flame-canvas" aria-hidden="true" />;
}
