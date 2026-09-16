import {
  CAMERA_START_FOCUS,
  GROUND_Y,
  MOON_DIRECTION,
  VIEW_HOLD_SECONDS,
  VIEW_TRANSITION_SECONDS,
} from './constants';

export type Vec3 = {
  x: number;
  y: number;
  z: number;
};

export type ViewpointParams = {
  target: Vec3;
  distance: number;
  azimuthDeg: number;
  elevationDeg: number;
  fov: number;
  up: Vec3;
  near: number;
  far: number;
  breath: number;
};

export type ViewpointPresetName =
  | 'wormEye'
  | 'distant'
  | 'close'
  | 'cavalier45'
  | 'moonGaze'
  | 'fireReveal';

export type SequenceStep = {
  preset: ViewpointPresetName;
  /** Segundos de transición hacia el siguiente plano. */
  duration: number;
  /** Segundos en este plano antes de continuar (default 0.6). */
  hold?: number;
};

const defaultUp: Vec3 = { x: 0, y: 1, z: 0 };

function normalizeVec3(vector: Vec3): Vec3 {
  const length = Math.hypot(vector.x, vector.y, vector.z) || 1;
  return {
    x: vector.x / length,
    y: vector.y / length,
    z: vector.z / length,
  };
}

/**
 * Cámara en el claro mirando al cielo hacia la luna (forward ≈ moonDir).
 */
function buildMoonAlignedGaze(
  lookDistance: number,
  cameraHeightAboveGround: number,
  fov: number,
  breath: number,
): ViewpointParams {
  const moon = normalizeVec3(MOON_DIRECTION);
  const opposite = {
    x: -moon.x,
    y: -moon.y,
    z: -moon.z,
  };
  const elevationDeg =
    (Math.asin(Math.max(-0.98, Math.min(0.98, opposite.y))) * 180) / Math.PI;
  const azimuthDeg = (Math.atan2(opposite.x, opposite.z) * 180) / Math.PI;
  const cameraY = GROUND_Y + cameraHeightAboveGround;
  const target = {
    x: CAMERA_START_FOCUS.x + moon.x * lookDistance,
    y: cameraY + moon.y * lookDistance,
    z: CAMERA_START_FOCUS.z + moon.z * lookDistance,
  };

  return {
    target,
    distance: lookDistance,
    azimuthDeg,
    elevationDeg,
    fov,
    up: defaultUp,
    near: 0.1,
    far: 360,
    breath,
  };
}

export const viewpointPresets: Record<ViewpointPresetName, ViewpointParams> = {
  distant: {
    target: {
      x: CAMERA_START_FOCUS.x,
      y: GROUND_Y + 0.6,
      z: CAMERA_START_FOCUS.z,
    },
    distance: 28,
    azimuthDeg: 28,
    elevationDeg: 22,
    fov: 42,
    up: defaultUp,
    near: 0.2,
    far: 360,
    breath: 0.08,
  },
  close: {
    target: {
      x: CAMERA_START_FOCUS.x + 0.2,
      y: GROUND_Y + 0.55,
      z: CAMERA_START_FOCUS.z + 0.1,
    },
    distance: 3.2,
    azimuthDeg: -18,
    elevationDeg: 12,
    fov: 58,
    up: defaultUp,
    near: 0.05,
    far: 120,
    breath: 0.04,
  },
  wormEye: buildMoonAlignedGaze(34, 1.35, 72, 0.03),
  cavalier45: {
    target: {
      x: CAMERA_START_FOCUS.x,
      y: GROUND_Y + 0.4,
      z: CAMERA_START_FOCUS.z,
    },
    distance: 18,
    azimuthDeg: 45,
    elevationDeg: 45,
    fov: 40,
    up: defaultUp,
    near: 0.2,
    far: 360,
    breath: 0.05,
  },
  moonGaze: buildMoonAlignedGaze(46, 6.4, 54, 0.035),
  fireReveal: {
    target: {
      x: CAMERA_START_FOCUS.x + 0.08,
      y: GROUND_Y + 1.35,
      z: CAMERA_START_FOCUS.z + 0.06,
    },
    distance: 5.2,
    azimuthDeg: -12,
    elevationDeg: 18,
    fov: 50,
    up: defaultUp,
    near: 0.08,
    far: 280,
    breath: 0.04,
  },
};

export const randomViewPresets: ViewpointPresetName[] = [
  'distant',
  'close',
  'cavalier45',
  'moonGaze',
  'fireReveal',
  'wormEye',
];

const slowHold = VIEW_HOLD_SECONDS;
const slowPan = VIEW_TRANSITION_SECONDS;

export const defaultDollySequence: SequenceStep[] = [
  { preset: 'distant', duration: slowPan, hold: slowHold },
  { preset: 'close', duration: slowPan, hold: slowHold },
  { preset: 'distant', duration: slowPan, hold: slowHold },
  { preset: 'moonGaze', duration: slowPan, hold: slowHold * 1.2 },
  { preset: 'fireReveal', duration: slowPan, hold: slowHold },
  { preset: 'close', duration: slowPan, hold: slowHold },
  { preset: 'cavalier45', duration: slowPan, hold: slowHold },
  { preset: 'wormEye', duration: slowPan, hold: slowHold * 1.1 },
  { preset: 'distant', duration: slowPan, hold: slowHold },
];

/** Secuencia con orden aleatorio (toma inicial distinta cada carga). */
export function createRandomDollySequence(
  steps: SequenceStep[] = defaultDollySequence,
): SequenceStep[] {
  const shuffled = steps.map((step) => ({ ...step }));

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];
    shuffled[index] = shuffled[swapIndex];
    shuffled[swapIndex] = current;
  }

  return shuffled;
}

export function cloneViewpointParams(params: ViewpointParams): ViewpointParams {
  return {
    target: { ...params.target },
    distance: params.distance,
    azimuthDeg: params.azimuthDeg,
    elevationDeg: params.elevationDeg,
    fov: params.fov,
    up: { ...params.up },
    near: params.near,
    far: params.far,
    breath: params.breath,
  };
}

export function resolvePolarPosition(params: ViewpointParams): Vec3 {
  const elevation = (params.elevationDeg * Math.PI) / 180;
  const azimuth = (params.azimuthDeg * Math.PI) / 180;
  const horizontal = Math.cos(elevation) * params.distance;

  return {
    x: params.target.x + Math.sin(azimuth) * horizontal,
    y: params.target.y + Math.sin(elevation) * params.distance,
    z: params.target.z + Math.cos(azimuth) * horizontal,
  };
}
