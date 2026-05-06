import ImageButtonGreen from '../../../assets/button-green.png';

const ButtonGreen = ({ onClick, text }: { onClick: () => void; text: string }) => {
  return (
    <div
      className="flex justify-center cursor-pointer relative items-center"
      onClick={onClick}
    >
      <img src={ImageButtonGreen} className="h-20" />
      <div className="absolute flex justify-center items-center text-3xl font-semibold text-white/95 h-full w-full pr-20">
        <p className="[text-shadow:1px_4px_20px_var(--tw-shadow-color)] shadow-black/70">
          {text}
        </p>
      </div>
    </div>
  );
};

export default ButtonGreen;
