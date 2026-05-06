import React, { useState } from 'react';

interface ButtonSwitchProps {
  initialState?: boolean;
  onToggle?: (value: boolean) => void;
  onChange?: (value: boolean) => void;
}

const ButtonSwitch = ({
  initialState = false,
  onToggle,
  onChange,
}: ButtonSwitchProps) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = () => {
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
      className={`flex h-6 w-12 cursor-pointer items-center rounded-full p-1 ${
        isOn ? 'bg-green-500' : 'bg-gray-300'
      }`}
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

export default ButtonSwitch;
