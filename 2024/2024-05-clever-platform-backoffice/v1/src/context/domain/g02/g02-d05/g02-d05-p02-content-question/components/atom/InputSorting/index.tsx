import IconArrowLeft from '@core/design-system/library/vristo/source/components/Icon/IconArrowLeft';

const InputSorting = ({
  label,
  onUp,
  onDown,
  disabledUp,
  disabledDown,
}: {
  label?: string;
  onUp?: () => void;
  onDown?: () => void;
  disabledUp?: boolean;
  disabledDown?: boolean;
}) => {
  return (
    <div className="form-input flex h-10 w-full justify-between !p-[5px] !px-2">
      <span className="badge badge-outline-info">{label}</span>
      <div className="flex gap-2">
        <div onClick={onUp} className={`${disabledUp ? 'pointer-events-none' : ''}`}>
          <IconArrowLeft
            className={`h-6 w-6 -rotate-90 cursor-pointer ${disabledUp ? 'text-gray-300' : ''} `}
          />
        </div>
        <div onClick={onDown} className={`${disabledDown ? 'pointer-events-none' : ''}`}>
          <IconArrowLeft
            className={`h-6 w-6 rotate-90 cursor-pointer ${disabledDown ? 'text-gray-300' : ''} `}
          />
        </div>
      </div>
    </div>
  );
};

export default InputSorting;
