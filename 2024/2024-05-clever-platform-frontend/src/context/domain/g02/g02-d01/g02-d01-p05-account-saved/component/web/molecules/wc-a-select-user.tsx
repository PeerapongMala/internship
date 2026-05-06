import ImageTemp from '@component/web/atom/wc-a-image-temp';
import ButtonSwitchAccount from '@global/component/web/atom/wc-a-button-switch-account';

const SelectUser = ({
  onClick,
  title = 'พงษ์สิทธิ์ วีระกิตธนา',
  description = 'เข้าสู่ระบบล่าสุด: 03/04/24',
  imageSrc = '/src/context/domain/id-02-01-05-accounts-saved/assets/icon-avatar-1.svg',
  hiddenSwap,
  tempImageSrc,
}: {
  onClick?: () => void;
  title?: string;
  description?: string;
  imageSrc?: string;
  hiddenSwap?: boolean;
  tempImageSrc?: string;
}) => {
  return (
    <div className="w-full px-10">
      <div className="relative flex w-full h-20 border-4 rounded-full focus:outline-none bg-white border-secondary focus:border-secondary">
        <ImageTemp
          src={imageSrc ?? ''}
          tempSrc={tempImageSrc ?? ''}
          className="w-[68px] h-[68px] mt-[2px] ml-[2px] rounded-full object-cover p-1"
        />
        <div className="pl-2 pt-2 grow">
          <div className="text-2xl font-semibold">{title}</div>
          <div className="pt-1 text-base">{description}</div>
        </div>
        {!hiddenSwap ? (
          <ButtonSwitchAccount
            className="absolute h-[70px] w-[70px] pt-1 pl-1 top-0 right-1"
            onClick={onClick}
          />
        ) : null}
      </div>
    </div>
  );
};

export default SelectUser;
