interface IButtonProps {
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  answerCount?: number;
}

const AnswerInput = ({
  className = '',
  onChange,
  disabled,
  answerCount = 3,
}: IButtonProps) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event);
    }
  };
  return (
    <div
      className={`relative bg-secondary p-1 rounded-[37px] cursor-pointer border-box h-[4rem] min-w-32 select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem]
        ${className}
        ${disabled ? 'brightness-75 pointer-events-none' : ''}
        `}
      style={{
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="flex justify-center items-center bg-white h-full w-full rounded-[30px] text-center px-4 py-1">
        <input
          type="text"
          className="w-full h-full text-center font-medium placeholder:tracking-[-0.1em] focus:outline-none"
          placeholder={`___${answerCount}___`}
          onChange={handleOnChange}
        />
      </div>
    </div>
  );
};

export default AnswerInput;
