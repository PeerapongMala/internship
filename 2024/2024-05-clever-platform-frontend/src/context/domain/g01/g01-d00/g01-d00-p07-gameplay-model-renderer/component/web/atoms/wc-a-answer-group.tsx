interface IButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  id?: string;
}

const AnswerGroup = ({ children, className = '', onClick, disabled, ref, id }: IButtonProps) => {
  return (
    <div
      id={id}
      ref={ref}
      className={`relative bg-white/70 p-2 rounded-[37px] cursor-pointer
         border-box h-full  select-none transition active:translate-y-0.5 hover:translate-y-[-0.125rem] 
         leading-relaxed break-words whitespace-pre-wrap
        ${className}
        ${disabled ? 'brightness-75 pointer-events-none' : ''}
        `}
      style={{
        borderBottom: '8px solid #DFDEDE',
        boxShadow:
          '0px 8px 8px 0px rgba(0, 0, 0, 0.15), 0px 8px 8px 0px rgba(0, 0, 0, 0.05)',
      }}
      onClick={onClick}
    >
      <div className="flex justify-center items-center bg-white h-full w-full rounded-[30px]">
        {children}
      </div>
    </div>
  );
};

export default AnswerGroup;
