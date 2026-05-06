import ImageArrowGlyphLeft from './assets/arrow-glyph-left.png';

const ButtonBack = ({ onClick }: { onClick: () => void }) => {
  return (
    <img
      className="icon h-20 absolute left-4 pt-3 cursor-pointer"
      src={ImageArrowGlyphLeft}
      onClick={onClick}
    />
  );
};

export default ButtonBack;
