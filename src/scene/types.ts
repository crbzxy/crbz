export type SceneContext = {
  windStrength: number;
  camera: {
    x: number;
    y: number;
    z: number;
  };
};

/** Contrato común para los sistemas que el SceneEngine actualiza cada frame. */
export type SceneSystem = {
  update: (delta: number, simTime: number, ctx: SceneContext) => void;
  dispose: () => void;
};
