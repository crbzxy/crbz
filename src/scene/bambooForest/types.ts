export type BambooSizeClass = 'small' | 'medium' | 'large' | 'enormous';

export type BambooStalk = {
  x: number;
  z: number;
  height: number;
  radius: number;
  leanBias: number;
  twist: number;
  phase: number;
  speed: number;
  flex: number;
  colorIndex: number;
  sizeClass: BambooSizeClass;
  leafScale: number;
  alive: boolean;
  /** 0 = destrozado, 1 = intacto. */
  integrity: number;
  leanX: number;
  leanZ: number;
  velX: number;
  velZ: number;
  mass: number;
  stiffness: number;
  falling: boolean;
};

export type BambooLeaf = {
  stalkIndex: number;
  heightRatio: number;
  yaw: number;
  scale: number;
  phase: number;
  pitch: number;
};

export type FallenBamboo = {
  x: number;
  y: number;
  z: number;
  length: number;
  radius: number;
  yaw: number;
  roll: number;
  pitch: number;
  colorIndex: number;
};

export type CheckerFigureKind = 'blob' | 'rect' | 'diamond' | 'band';

export type CheckerFigure = {
  kind: CheckerFigureKind;
  x: number;
  z: number;
  width: number;
  depth: number;
  yaw: number;
  phase: number;
  dense: number;
  sparse: number;
};

export type CheckerDensityField = {
  cellSize: number;
  originX: number;
  originZ: number;
  globalPhase: number;
  globalDense: number;
  globalSparse: number;
  figures: CheckerFigure[];
};
