import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import React, { useState, useEffect } from 'react';

interface ButtonSwitchProps {
  initialState?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onToggle?: (value: boolean) => void;
  onChange?: (value: boolean) => void;
  disabledColor?: string;
  customOnClassName?: string;
}

/**
 * CWButtonSwitch is a toggle switch component with the following features:
 * - `disabled`: Disables interaction when true. ignore when `isLoading` is `true`
 * - `isLoading`: Shows a loading cursor when an action is in progress.
 * - `initialState`: Sets the initial toggle state.
 * - `onToggle`: Callback triggered when the switch is toggled.
 * - `onChange`: Callback triggered when the state changes.
 */
const CWButtonSwitch = ({
  initialState = false,
  disabled,
  isLoading,
  onToggle,
  onChange,
  customOnClassName,
  disabledColor = 'bg-neutral-300',
}: ButtonSwitchProps) => {
  const [isOn, setIsOn] = useState(initialState);

  const onClassName = customOnClassName ? customOnClassName : 'bg-green-500';

  useEffect(() => {
    setIsOn(initialState);
  }, [initialState]);

  const handleToggle = () => {
    if (disabled) return;

    const newState = !isOn;
    setIsOn(newState);

    if (onToggle) {
      onToggle(newState);
    }
    if (onChange) {
      onChange(newState);
    }
  };

  return (
    <div
      className={cn(
        `flex h-6 w-12 items-center rounded-full p-1`,
        isLoading
          ? 'cursor-progress'
          : disabled
            ? 'cursor-not-allowed'
            : 'cursor-pointer',
        isOn && !disabled ? onClassName : 'bg-white-light',
        disabled && disabledColor,
      )}
      onClick={handleToggle}
    >
      <div
        className={`size-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          isOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      ></div>
    </div>
  );
};

export default CWButtonSwitch;
