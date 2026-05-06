import { cn } from '@global/helper/cn';
import styles from './wc-a-slider.module.css';

interface SliderProps {
  value: number;
  onValueChange?: (x: number) => void;
  step?: number;
  minValue?: number;
  maxValue?: number;
  className?: string;
  disabled?: boolean;
}

export function Slider({
  value = 0,
  onValueChange,
  step = 1,
  minValue = 0,
  maxValue = 100,
  className = '',
  disabled = false,
}: SliderProps) {
  const variableStyle = {
    '--min': minValue,
    '--max': maxValue,
    '--value-x': value,
  } as React.CSSProperties;

  return (
    <div
      className={cn('w-full', styles['range-slider'], className)}
      style={variableStyle}
    >
      <input
        type="range"
        min={minValue}
        max={maxValue}
        step={step}
        value={value}
        disabled={disabled}
        onInput={(evt) => {
          const changedValue = Number(evt.currentTarget.value);
          if (onValueChange) {
            onValueChange(changedValue);
          }
        }}
      />
      <div className={styles['slider']} />
    </div>
  );
}

export default Slider;
