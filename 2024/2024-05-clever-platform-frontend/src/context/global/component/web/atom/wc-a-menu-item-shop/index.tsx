const MenuItemShop = ({
  isActive,
  onClick,
  imageSrc,
  isLastItem,
  className,
}: {
  isActive: boolean;
  onClick: () => void;
  imageSrc: string;
  isLastItem?: boolean;
  className?: string;
}) => {
  return (
    <div
      className={`relative flex items-center justify-center w-full h-full cursor-pointer rounded-sm overflow-hidden
        ${isLastItem ? 'rounded-bl-[62px]' : ''} ${className}`}
      onClick={onClick}
    >
      <div
        className={`absolute inset-0 transition-opacity duration-300 ease-in-out bg-secondary-gradient-1
          ${isActive ? 'opacity-100' : 'opacity-0'}`}
      ></div>
      <div
        className={`absolute inset-0 transition-opacity duration-300 ease-in-out
          ${isActive ? 'opacity-0' : 'opacity-100 bg-secondary-border/30'}`}
      ></div>
      <img className="relative w-12 h-12" src={imageSrc} />
    </div>
  );
};

export default MenuItemShop;
