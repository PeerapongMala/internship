import { useCallback, useState, useEffect } from 'react';

interface ButtonSwitchProps {
  initialState?: boolean;
  onChange?: (value: boolean) => void;
}

const CWButtonSwitch = ({ initialState = false, onChange }: ButtonSwitchProps) => {
  const [isOn, setIsOn] = useState<boolean>(initialState);

  useEffect(() => {
    setIsOn(initialState);
  }, [initialState]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsOn((prevState) => {
        const newState = !prevState;
        if (onChange) {
          onChange(newState);
        }
        return newState;
      });
    },
    [onChange],
  );

  return (
    <button
      type="button"
      className={`flex h-6 w-12 cursor-pointer items-center gap-1 rounded-full p-1 ${
        isOn ? 'bg-green-500' : 'bg-gray-300'
      }`}
      onClick={handleClick}
    >
      <div
        className={`size-4 min-w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
          isOn ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

export default CWButtonSwitch;
