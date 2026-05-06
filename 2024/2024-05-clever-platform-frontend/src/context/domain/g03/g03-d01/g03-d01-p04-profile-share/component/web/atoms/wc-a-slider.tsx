import styles from './wc-a-slider.module.css';

interface SliderProps {
  value: number;
  onValueChange?: (x: number) => void;
  step?: number;
  minValue?: number;
  maxValue?: number;
  className?: string;
}

export function Slider({
  value = 0,
  onValueChange,
  step = 1,
  minValue = 0,
  maxValue = 100,
  className = '',
}: SliderProps) {
  const variableStyle = {
    '--min': minValue,
    '--max': maxValue,
    '--value-x': value,
  } as React.CSSProperties;

  return (
    <div
      className={`w-full ${styles['range-slider']} ${className}`}
      style={variableStyle}
    >
      <input
        type="range"
        min={minValue}
        max={maxValue}
        step={step}
        value={value}
        onInput={(evt) => {
          const changedValue = Number(evt.currentTarget.value);
          if (onValueChange) {
            onValueChange(changedValue);
          }
        }}
      />
    </div>
  );
}

export default Slider;
