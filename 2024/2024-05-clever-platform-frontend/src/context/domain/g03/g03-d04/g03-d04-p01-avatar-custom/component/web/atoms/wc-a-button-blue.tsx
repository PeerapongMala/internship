import ImageButtonBlue from '../../../assets/button-blue.png';

const ButtonBlue = ({ onClick, text }: { onClick: () => void; text: string }) => {
  return (
    <div className="flex justify-center cursor-pointer" onClick={onClick}>
      <img src={ImageButtonBlue} />
      <div className="absolute pt-4 text-3xl font-semibold text-white/95">
        <p className="[text-shadow:1px_4px_20px_var(--tw-shadow-color)] shadow-black/70">
          {text}
        </p>
      </div>
    </div>
  );
};

export default ButtonBlue;
