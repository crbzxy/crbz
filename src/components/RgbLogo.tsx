import './RgbLogo.css';

type RgbLogoProps = {
  size?: number;
};

export function RgbLogo({ size = 40 }: RgbLogoProps) {
  const circleSize = Math.round(size * 0.6);

  return (
    <span
      className="rgb-logo"
      style={{
        width: size,
        height: size,
        ['--circle-size' as string]: `${circleSize}px`,
      }}
      aria-hidden="true"
    >
      <span className="rgb-logo__circle rgb-logo__circle--red" />
      <span className="rgb-logo__circle rgb-logo__circle--green" />
      <span className="rgb-logo__circle rgb-logo__circle--blue" />
    </span>
  );
}
