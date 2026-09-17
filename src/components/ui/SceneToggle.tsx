import { cn } from '../../utils/cn';

type SceneToggleProps = {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  className?: string;
};

/** Switch: escena 3D encendida o fondo negro detrás de la landing. */
export function SceneToggle({ enabled, onChange, className }: SceneToggleProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xs font-display font-medium text-muted-foreground">
        Escena 3D
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={enabled ? 'Ocultar escena 3D' : 'Mostrar escena 3D'}
        onClick={() => onChange(!enabled)}
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          enabled ? 'bg-foreground' : 'bg-muted',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-background transition-transform',
            enabled && 'translate-x-5',
          )}
        />
      </button>
    </div>
  );
}
