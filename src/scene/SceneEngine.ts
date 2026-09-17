import {
  ACESFilmicToneMapping,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { createAtmosphere, type AtmosphereHandle } from './atmosphere';
import { createBambooForest, type BambooForestHandle } from './bambooForest';
import { SKY_FOG } from './constants';
import { createFlameField, type FlameFieldHandle } from './flames';
import { createGround, type GroundHandle } from './ground';
import { createLeafLitter, type LeafLitterHandle } from './leafLitter';
import { createLightning, type LightningHandle } from './lightning';
import { createHorizonMist, type MistHandle } from './mist';
import { createRockField, type RockFieldHandle } from './rocks';
import {
  clearShowcasePocket,
  createShowcaseProps,
  type ShowcasePropsHandle,
} from './showcaseProps';
import { createStormClouds, type StormCloudsHandle } from './stormClouds';
import { createStormDirector, windStrengthAt, type StormDirectorHandle } from './stormDirector';
import { createTurtle, type TurtleHandle } from './turtle';
import { ViewpointController } from './ViewpointController';
import { createRandomDollySequence } from './viewpointPresets';
import type { SceneSystem } from './types';

const MIN_SPEED = 0.2;
const MAX_SPEED = 2.6;

function speedFromPointer(clientX: number, clientY: number) {
  const width = Math.max(window.innerWidth, 1);
  const height = Math.max(window.innerHeight, 1);
  const horizontal = clientX / width;
  const vertical = 1 - clientY / height;
  const blend = horizontal * 0.65 + vertical * 0.35;
  return MIN_SPEED + blend * (MAX_SPEED - MIN_SPEED);
}

type CoreSystems = {
  atmosphere: AtmosphereHandle;
  ground: GroundHandle;
  litter: LeafLitterHandle;
  rocks: RockFieldHandle;
  bamboo: BambooForestHandle;
  mist: MistHandle;
  storm: StormCloudsHandle;
  turtle: TurtleHandle;
  showcaseProps: ShowcasePropsHandle;
  stormDirector: StormDirectorHandle;
};

function tryCreateRenderer(canvas: HTMLCanvasElement): WebGLRenderer | null {
  try {
    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(SKY_FOG, 1);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return renderer;
  } catch (error) {
    console.error('No se pudo crear WebGLRenderer', error);
    return null;
  }
}

/**
 * Orquesta el ciclo de vida completo de la escena 3D: setup de Three.js,
 * creación de sistemas, loop de animación y liberación de recursos.
 * No conoce React; `FlameScene.tsx` solo lo instancia y lo destruye.
 */
export class SceneEngine {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(42, 1, 0.2, 400);
  private readonly renderer: WebGLRenderer | null;
  private readonly viewpoint: ViewpointController;
  private readonly systems: CoreSystems | null;

  private flames: FlameFieldHandle | null = null;
  private lightning: LightningHandle | null = null;

  private disposed = false;
  private animationFrame = 0;
  private previousTime = performance.now();
  private simTime = 0;
  private playbackSpeed = 1;
  private flameBootTimer = 0;

  constructor(canvas: HTMLCanvasElement) {
    const dollySequence = createRandomDollySequence();
    this.viewpoint = new ViewpointController(this.camera, dollySequence[0].preset);
    this.viewpoint.playSequence(dollySequence, true);

    const renderer = tryCreateRenderer(canvas);
    this.systems = renderer ? this.tryCreateSystems(renderer) : null;
    this.renderer = this.systems ? renderer : null;
  }

  private tryCreateSystems(renderer: WebGLRenderer): CoreSystems | null {
    try {
      const bamboo = createBambooForest(this.scene);
      const showcaseProps = createShowcaseProps(this.scene);
      clearShowcasePocket(bamboo.clearPocket);

      const storm = createStormClouds(this.scene);
      const flames = () => this.flames;
      const lightning = () => this.lightning;
      const stormDirector = createStormDirector({
        getFlames: flames,
        getLightning: lightning,
        getStorm: () => storm,
        bamboo,
        showcaseProps,
      });

      return {
        atmosphere: createAtmosphere(this.scene),
        ground: createGround(this.scene),
        litter: createLeafLitter(this.scene),
        rocks: createRockField(this.scene),
        bamboo,
        mist: createHorizonMist(this.scene),
        storm,
        turtle: createTurtle(this.scene),
        showcaseProps,
        stormDirector,
      };
    } catch (error) {
      console.error('Error creando la escena base', error);
      renderer.dispose();
      return null;
    }
  }

  start() {
    if (!this.renderer || !this.systems) {
      return;
    }

    this.resize();
    window.addEventListener('resize', this.resize);
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    this.animationFrame = window.requestAnimationFrame(this.animate);
    this.flameBootTimer = window.setTimeout(this.bootFlames, 0);
  }

  dispose() {
    this.disposed = true;
    window.clearTimeout(this.flameBootTimer);
    window.cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointerMove);

    if (!this.renderer || !this.systems) {
      return;
    }

    try {
      this.lightning?.dispose();
      this.flames?.dispose();
      this.systems.showcaseProps.dispose();
      this.systems.storm.dispose();
      this.systems.mist.dispose();
      this.systems.turtle.dispose();
      this.systems.bamboo.dispose();
      this.systems.rocks.dispose();
      this.systems.litter.dispose();
      this.systems.ground.dispose();
      this.systems.atmosphere.dispose();
    } catch (error) {
      console.error('Error al liberar la escena', error);
    }

    this.renderer.dispose();
  }

  private resize = () => {
    if (this.disposed || !this.renderer) {
      return;
    }
    const width = Math.max(window.innerWidth, 1);
    const height = Math.max(window.innerHeight, 1);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, true);
  };

  private onPointerMove = (event: PointerEvent) => {
    this.playbackSpeed = speedFromPointer(event.clientX, event.clientY);
  };

  private bootFlames = () => {
    if (this.disposed || this.flames) {
      return;
    }
    try {
      this.flames = createFlameField(this.scene);
      this.lightning = createLightning(this.scene);
    } catch (error) {
      console.error('Error creando fuegos', error);
    }
  };

  private animate = (now: number) => {
    const { renderer, systems } = this;
    if (this.disposed || !renderer || !systems) {
      return;
    }

    const frameDelta = Math.min((now - this.previousTime) / 1000, 0.05);
    this.previousTime = now;
    const delta = frameDelta * this.playbackSpeed;
    this.simTime += delta;

    const ctx = {
      windStrength: windStrengthAt(this.simTime),
      camera: {
        x: this.camera.position.x,
        y: this.camera.position.y,
        z: this.camera.position.z,
      },
    };

    const timeDrivenSystems: SceneSystem[] = [
      systems.atmosphere,
      systems.mist,
      systems.bamboo,
      systems.turtle,
      systems.storm,
      systems.showcaseProps,
    ];
    for (const system of timeDrivenSystems) {
      system.update(delta, this.simTime, ctx);
    }
    this.flames?.update(delta, this.simTime, ctx);
    this.viewpoint.update(delta);
    systems.stormDirector.update(delta, this.simTime);
    this.lightning?.update(delta, this.simTime, ctx);

    renderer.render(this.scene, this.camera);
    this.animationFrame = window.requestAnimationFrame(this.animate);
  };
}
