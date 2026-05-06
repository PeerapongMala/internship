import ImageArrowLineLeft from '../../../../assets/arrow-line-left.svg';
import ImageArrowLineRight from '../../../../assets/arrow-line-right.svg';

const ButtonPrevNext = ({
  text,
  onPrev,
  onNext,
  disabled,
}: {
  text: string;
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
}) => {
  return (
    <div
      className={`flex justify-between items-center h-[70px] w-52 left-4 bg-secondary-gradient border-white border-[6px] rounded-full px-2 bg-black cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05)',
        zIndex: '100',
      }}
    >
      <div
        className="flex items-center justify-center h-[83%] w-12 border-white border-r-2"
        onClick={!disabled ? onPrev : undefined}
      >
        <img src={ImageArrowLineLeft} className="h-[32px]" />
      </div>
      <div className="text-2xl font-bold">
        <p className="drop-shadow-[0px_2px_var(--tw-shadow-color)] shadow-white">
          {text}
        </p>
      </div>
      <div
        className="flex items-center justify-center h-[83%] w-12 border-white border-l-2"
        onClick={!disabled ? onNext : undefined}
      >
        <img src={ImageArrowLineRight} className="h-[32px]" />
      </div>
    </div>
  );
};

export default ButtonPrevNext;
