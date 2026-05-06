import ButtonBack from '@global/component/web/atom/wc-a-button-back';

const Header = ({
  title = 'เข้าสู่ระบบ',
  showBack = false,
  onClick,
}: {
  title?: string;
  showBack?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div className="flex relative justify-center w-full border-b-2 border-dashed border-secondary">
      {showBack && (
        <ButtonBack
          className="absolute h-[77px] w-[4rem] pt-4 pl-1 left-6"
          onClick={onClick}
        />
      )}
      <div className="text-3xl font-semibold pt-8 pb-4">{title}</div>
    </div>
  );
};

export default Header;
