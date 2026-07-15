import { useEffect, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
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

const PARTICLE_COUNT = 400;
const FLAME_Y = -0.55;

const flameVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const flameFragmentShader = /* glsl */ `
  uniform float uTime;
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
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p *= 2.02;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    float width = pow(max(1.0 - abs(uv.x * 2.0 - 1.0), 0.0), 1.25);
    float heightMask = smoothstep(0.0, 0.08, uv.y) * smoothstep(1.0, 0.45, uv.y);
    float shape = width * heightMask;

    vec2 flameUv = vec2(uv.x * 2.8, uv.y * 2.4 - uTime * 1.35);
    float n = fbm(flameUv);
    float detail = fbm(flameUv * 1.8 + vec2(1.7, -uTime * 0.4));
    float flame = clamp(smoothstep(0.22, 0.68, shape * (0.45 + n * 0.7) - (1.0 - shape) * detail * 0.35), 0.0, 1.0);

    vec3 color = mix(vec3(0.45, 0.04, 0.0), vec3(0.95, 0.32, 0.02), flame);
    color = mix(color, vec3(1.0, 0.72, 0.18), pow(flame, 2.2));
    color = mix(color, vec3(1.0, 0.92, 0.55), pow(flame, 5.0) * (1.0 - uv.y) * 0.85);

    gl_FragColor = vec4(color, flame * shape * 0.95);
  }
`;

const groundVertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorldPos = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const groundFragmentShader = /* glsl */ `
  uniform float uIntensity;
  uniform float uTime;
  uniform vec3 uLightColor;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vec2 centered = vWorldPos.xz;
    float dist = length(centered);
    float flicker = 0.88 + 0.12 * sin(uTime * 7.3) + 0.06 * sin(uTime * 13.1);

    float core = exp(-dist * dist * 9.0) * uIntensity * flicker;
    float mid = exp(-dist * dist * 2.2) * uIntensity * 0.45 * flicker;
    float halo = exp(-dist * dist * 0.55) * uIntensity * 0.18;

    float warmth = core + mid + halo;
    vec3 color = uLightColor * warmth;

    float edge = smoothstep(1.0, 0.15, dist / 4.5);
    float alpha = clamp(warmth * 1.4, 0.0, 0.85) * edge;

    gl_FragColor = vec4(color, alpha);
  }
`;

const glowVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragmentShader = /* glsl */ `
  uniform float uIntensity;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float d = length(p);
    float glow = exp(-d * d * 2.8) * uIntensity;
    float rim = exp(-d * d * 0.9) * uIntensity * 0.35;
    vec3 color = vec3(1.0, 0.42, 0.08) * glow + vec3(1.0, 0.65, 0.2) * rim;
    float alpha = clamp(glow + rim, 0.0, 0.55);
    gl_FragColor = vec4(color, alpha);
  }
`;

type ParticleData = {
  positions: Float32Array;
  colors: Float32Array;
  ages: Float32Array;
  speeds: Float32Array;
};

function createParticles(): ParticleData {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const ages = new Float32Array(PARTICLE_COUNT);
  const speeds = new Float32Array(PARTICLE_COUNT);

  for (let index = 0; index < PARTICLE_COUNT; index += 1) {
    resetParticle(positions, colors, ages, speeds, index);
  }

  return { positions, colors, ages, speeds };
}

function resetParticle(
  positions: Float32Array,
  colors: Float32Array,
  ages: Float32Array,
  speeds: Float32Array,
  index: number,
) {
  const offset = index * 3;
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 0.08;

  positions[offset] = Math.cos(angle) * radius;
  positions[offset + 1] = FLAME_Y - 0.17 + Math.random() * 0.05;
  positions[offset + 2] = Math.sin(angle) * radius * 0.35;

  ages[index] = Math.random();
  speeds[index] = 0.7 + Math.random() * 1.1;

  colors[offset] = 1.0;
  colors[offset + 1] = 0.45 + Math.random() * 0.35;
  colors[offset + 2] = 0.05 + Math.random() * 0.1;
}

function flickerIntensity(time: number) {
  return (
    1.05 +
    Math.sin(time * 8.2) * 0.12 +
    Math.sin(time * 14.7) * 0.08 +
    Math.sin(time * 23.1) * 0.05
  );
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
    camera.position.set(0, -0.05, 6.5);
    camera.lookAt(0, FLAME_Y, 0);

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x030201, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const flameLight = new PointLight(0xff6a1a, 2.4, 8, 2);
    flameLight.position.set(0, FLAME_Y + 0.12, 0.15);
    scene.add(flameLight);

    const fillLight = new PointLight(0xff9a3c, 0.55, 14, 2);
    fillLight.position.set(0, FLAME_Y + 0.4, 0.8);
    scene.add(fillLight);

    const groundMaterial = new ShaderMaterial({
      vertexShader: groundVertexShader,
      fragmentShader: groundFragmentShader,
      uniforms: {
        uIntensity: { value: 1 },
        uTime: { value: 0 },
        uLightColor: { value: new Color(1.0, 0.38, 0.06) },
      },
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
    });

    const ground = new Mesh(new PlaneGeometry(10, 10), groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = FLAME_Y - 0.28;
    scene.add(ground);

    const glowMaterial = new ShaderMaterial({
      vertexShader: glowVertexShader,
      fragmentShader: glowFragmentShader,
      uniforms: {
        uIntensity: { value: 0.55 },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      side: DoubleSide,
    });

    const glow = new Mesh(new PlaneGeometry(1.8, 1.8), glowMaterial);
    glow.position.set(0, FLAME_Y - 0.05, -0.02);
    scene.add(glow);

    const flameMaterial = new ShaderMaterial({
      vertexShader: flameVertexShader,
      fragmentShader: flameFragmentShader,
      uniforms: { uTime: { value: 0 } },
      transparent: true,
      depthWrite: false,
      side: DoubleSide,
    });

    const flameMesh = new Mesh(new PlaneGeometry(0.45, 0.6), flameMaterial);
    flameMesh.position.set(0, FLAME_Y, 0);
    scene.add(flameMesh);

    const particleData = createParticles();
    const particleGeometry = new BufferGeometry();
    particleGeometry.setAttribute(
      'position',
      new BufferAttribute(particleData.positions, 3),
    );
    particleGeometry.setAttribute(
      'color',
      new BufferAttribute(particleData.colors, 3),
    );

    const particleMaterial = new PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      blending: AdditiveBlending,
      sizeAttenuation: true,
    });

    scene.add(new Points(particleGeometry, particleMaterial));

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
      const pulse = flickerIntensity(time);

      flameMaterial.uniforms.uTime.value = time;
      groundMaterial.uniforms.uTime.value = time;
      groundMaterial.uniforms.uIntensity.value = pulse;
      glowMaterial.uniforms.uIntensity.value = 0.42 + pulse * 0.18;

      flameLight.intensity = 2.1 * pulse;
      fillLight.intensity = 0.45 * pulse;
      flameLight.position.x = Math.sin(time * 11.0) * 0.03;
      flameLight.position.y = FLAME_Y + 0.1 + Math.sin(time * 9.4) * 0.02;

      for (let index = 0; index < PARTICLE_COUNT; index += 1) {
        const offset = index * 3;
        particleData.ages[index] += delta * particleData.speeds[index] * 0.5;

        if (particleData.ages[index] >= 1) {
          resetParticle(
            particleData.positions,
            particleData.colors,
            particleData.ages,
            particleData.speeds,
            index,
          );
          continue;
        }

        const age = particleData.ages[index];
        particleData.positions[offset] += Math.sin(time * 2.5 + index) * 0.0006;
        particleData.positions[offset + 1] += (0.22 - age * 0.06) * delta;
        particleData.positions[offset + 2] += Math.cos(time * 1.8 + index) * 0.0004;

        const fade = 1 - age;
        particleData.colors[offset] = fade;
        particleData.colors[offset + 1] = (0.55 - age * 0.4) * fade;
        particleData.colors[offset + 2] = 0.05 * fade;
      }

      particleGeometry.attributes.position.needsUpdate = true;
      particleGeometry.attributes.color.needsUpdate = true;

      flameMesh.rotation.y = Math.sin(time * 0.35) * 0.02;
      glow.scale.setScalar(0.95 + pulse * 0.08);
      camera.position.x = Math.sin(time * 0.12) * 0.05;
      camera.lookAt(0, FLAME_Y, 0);

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      ground.geometry.dispose();
      groundMaterial.dispose();
      glow.geometry.dispose();
      glowMaterial.dispose();
      flameMesh.geometry.dispose();
      flameMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="flame-canvas" aria-hidden="true" />;
}
