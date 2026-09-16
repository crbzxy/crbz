import { PerspectiveCamera, Vector3 } from 'three';
import {
  VIEW_HOLD_SECONDS,
  VIEW_TRANSITION_SECONDS,
} from './constants';
import {
  cloneViewpointParams,
  randomViewPresets,
  resolvePolarPosition,
  viewpointPresets,
  type SequenceStep,
  type ViewpointParams,
  type ViewpointPresetName,
} from './viewpointPresets';

type Phase = 'idle' | 'transitioning' | 'holding';

function easeInOutCubic(progress: number) {
  if (progress < 0.5) {
    return 4 * progress * progress * progress;
  }
  return 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function lerpParams(
  from: ViewpointParams,
  to: ViewpointParams,
  amount: number,
): ViewpointParams {
  return {
    target: {
      x: lerp(from.target.x, to.target.x, amount),
      y: lerp(from.target.y, to.target.y, amount),
      z: lerp(from.target.z, to.target.z, amount),
    },
    distance: lerp(from.distance, to.distance, amount),
    azimuthDeg: lerp(from.azimuthDeg, to.azimuthDeg, amount),
    elevationDeg: lerp(from.elevationDeg, to.elevationDeg, amount),
    fov: lerp(from.fov, to.fov, amount),
    up: {
      x: lerp(from.up.x, to.up.x, amount),
      y: lerp(from.up.y, to.up.y, amount),
      z: lerp(from.up.z, to.up.z, amount),
    },
    near: lerp(from.near, to.near, amount),
    far: lerp(from.far, to.far, amount),
    breath: lerp(from.breath, to.breath, amount),
  };
}

function resolvePresetOrParams(
  target: ViewpointPresetName | ViewpointParams,
): ViewpointParams {
  if (typeof target === 'string') {
    return cloneViewpointParams(viewpointPresets[target]);
  }
  return cloneViewpointParams(target);
}

function pickRandomPreset(exclude: ViewpointPresetName | null) {
  const pool =
    exclude === null
      ? randomViewPresets
      : randomViewPresets.filter((name) => name !== exclude);

  if (pool.length === 0) {
    return randomViewPresets[0];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export class ViewpointController {
  private camera: PerspectiveCamera;
  private current: ViewpointParams;
  private from: ViewpointParams;
  private to: ViewpointParams;
  private transitionProgress = 1;
  private transitionDuration = 1;
  private sequence: SequenceStep[] = [];
  private sequenceIndex = 0;
  private loopSequence = true;
  private holdElapsed = 0;
  private phase: Phase = 'idle';
  private elapsed = 0;
  private randomMode = false;
  private randomHoldSeconds = VIEW_HOLD_SECONDS;
  private randomTransitionSeconds = VIEW_TRANSITION_SECONDS;
  private currentPresetName: ViewpointPresetName | null = null;
  private readonly lookTarget = new Vector3();
  private readonly upVector = new Vector3();

  constructor(
    camera: PerspectiveCamera,
    initial: ViewpointPresetName | ViewpointParams,
  ) {
    this.camera = camera;
    this.current = resolvePresetOrParams(initial);
    this.from = cloneViewpointParams(this.current);
    this.to = cloneViewpointParams(this.current);
    if (typeof initial === 'string') {
      this.currentPresetName = initial;
    }
    this.apply(this.current, 0);
  }

  get params(): ViewpointParams {
    return cloneViewpointParams(this.current);
  }

  setParams(partial: Partial<ViewpointParams>) {
    this.current = {
      ...this.current,
      ...partial,
      target: partial.target
        ? { ...this.current.target, ...partial.target }
        : { ...this.current.target },
      up: partial.up
        ? { ...this.current.up, ...partial.up }
        : { ...this.current.up },
    };
    this.from = cloneViewpointParams(this.current);
    this.to = cloneViewpointParams(this.current);
    this.transitionProgress = 1;
    this.phase = 'idle';
    this.apply(this.current, this.elapsed);
  }

  setPreset(name: ViewpointPresetName) {
    this.currentPresetName = name;
    this.setParams(viewpointPresets[name]);
  }

  transitionTo(
    target: ViewpointPresetName | ViewpointParams,
    duration = 6,
  ) {
    this.from = cloneViewpointParams(this.current);
    this.to = resolvePresetOrParams(target);
    if (typeof target === 'string') {
      this.currentPresetName = target;
    }
    this.transitionDuration = Math.max(0.05, duration);
    this.transitionProgress = 0;
    this.phase = 'transitioning';
  }

  playSequence(steps: SequenceStep[], loop = true) {
    if (steps.length === 0) {
      return;
    }

    this.randomMode = false;
    this.sequence = steps.map((step) => ({ ...step }));
    this.loopSequence = loop;
    this.sequenceIndex = 0;
    this.holdElapsed = 0;
    this.setPreset(this.sequence[0].preset);
    this.phase = 'holding';
  }

  /** Cambia a una vista aleatoria cada `holdSeconds` (tiempo real). */
  playRandomViews(
    holdSeconds = VIEW_HOLD_SECONDS,
    transitionSeconds = VIEW_TRANSITION_SECONDS,
  ) {
    this.randomMode = true;
    this.sequence = [];
    this.randomHoldSeconds = Math.max(1, holdSeconds);
    this.randomTransitionSeconds = Math.max(0.5, transitionSeconds);
    this.holdElapsed = 0;
    const first = pickRandomPreset(null);
    this.setPreset(first);
    this.phase = 'holding';
  }

  /**
   * @param delta Tiempo de simulación (afecta breath).
   * @param wallDelta Tiempo real para holds/transiciones en modo random.
   */
  update(delta: number, wallDelta = delta) {
    this.elapsed += delta;
    const timingDelta = this.randomMode ? wallDelta : delta;

    if (this.phase === 'transitioning') {
      this.transitionProgress = Math.min(
        1,
        this.transitionProgress + timingDelta / this.transitionDuration,
      );
      const eased = easeInOutCubic(this.transitionProgress);
      this.current = lerpParams(this.from, this.to, eased);

      if (this.transitionProgress >= 1) {
        this.current = cloneViewpointParams(this.to);
        this.holdElapsed = 0;
        this.phase =
          this.randomMode || this.sequence.length > 0 ? 'holding' : 'idle';
      }
    } else if (this.phase === 'holding') {
      this.holdElapsed += timingDelta;

      if (this.randomMode) {
        if (this.holdElapsed >= this.randomHoldSeconds) {
          this.goToRandomView();
        }
      } else if (this.sequence.length > 1) {
        const settle = this.sequence[this.sequenceIndex]?.hold ?? 0.6;
        if (this.holdElapsed >= settle) {
          this.goToNextSequenceStep();
        }
      }
    }

    this.apply(this.current, this.elapsed);
  }

  private goToRandomView() {
    const next = pickRandomPreset(this.currentPresetName);
    this.holdElapsed = 0;
    this.transitionTo(next, this.randomTransitionSeconds);
  }

  private goToNextSequenceStep() {
    const previousIndex = this.sequenceIndex;
    let nextIndex = previousIndex + 1;

    if (nextIndex >= this.sequence.length) {
      if (!this.loopSequence) {
        this.phase = 'idle';
        return;
      }
      nextIndex = 0;
    }

    const transitionDuration = this.sequence[previousIndex].duration;
    this.sequenceIndex = nextIndex;
    this.holdElapsed = 0;
    this.transitionTo(this.sequence[nextIndex].preset, transitionDuration);
  }

  private apply(params: ViewpointParams, time: number) {
    const position = resolvePolarPosition(params);
    const breath = params.breath;
    const offsetX = Math.sin(time * 0.07) * breath;
    const offsetY = Math.cos(time * 0.05) * breath * 0.35;
    const offsetZ = Math.cos(time * 0.06) * breath;

    this.camera.position.set(
      position.x + offsetX,
      position.y + offsetY,
      position.z + offsetZ,
    );
    this.lookTarget.set(
      params.target.x + Math.sin(time * 0.04) * breath * 0.4,
      params.target.y,
      params.target.z + Math.cos(time * 0.035) * breath * 0.4,
    );
    this.upVector.set(params.up.x, params.up.y, params.up.z).normalize();
    this.camera.up.copy(this.upVector);
    this.camera.lookAt(this.lookTarget);
    this.camera.fov = params.fov;
    this.camera.near = params.near;
    this.camera.far = params.far;
    this.camera.updateProjectionMatrix();
  }
}
