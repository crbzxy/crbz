import { useEffect, useRef } from 'react';
import { SceneEngine } from '../scene/SceneEngine';
import { cn } from '../utils/cn';

type FlameSceneProps = {
  visible?: boolean;
};

export function FlameScene({ visible = true }: FlameSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const engine = new SceneEngine(canvas);
    engine.start();

    return () => engine.dispose();
  }, []);

  return (
    <div
      className={cn('scene-layer', !visible && 'scene-layer--hidden')}
      aria-hidden={!visible}
    >
      <canvas ref={canvasRef} className="flame-canvas" aria-hidden="true" />
    </div>
  );
}
