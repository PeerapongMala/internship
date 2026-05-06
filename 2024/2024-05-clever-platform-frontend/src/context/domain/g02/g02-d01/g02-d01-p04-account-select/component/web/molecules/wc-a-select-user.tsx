import ImageTemp from '@component/web/atom/wc-a-image-temp';
import ImageIconAvatar1 from '@global/assets/icon-avatar-1.svg';
import ButtonSwitchAccount from '@global/component/web/atom/wc-a-button-switch-account';

const SelectUser = ({
  onClick,
  title,
  uuid,
  imageSrc,
  tempImageSrc,
}: {
  onClick?: () => void;
  title?: string;
  uuid?: string;
  imageSrc?: string | null;
  tempImageSrc?: string | null;
}) => {
  return (
    <div className="w-full px-10">
      <div className="relative flex w-full h-20 border-4 rounded-full focus:outline-none bg-white border-secondary focus:border-secondary">
        <ImageTemp
          src={imageSrc ?? ''}
          tempSrc={tempImageSrc ?? ImageIconAvatar1}
          className="w-[68px] h-[68px] mt-[2px] ml-[2px] rounded-full object-cover p-1"
        />
        <div className="pl-2 pt-2 grow">
          <div className="text-2xl font-semibold">{title}</div>
          <div className="pt-1">uuid: {uuid}</div>
        </div>
        <ButtonSwitchAccount
          className="absolute h-[68px] w-[68px] pt-1 pl-1 top-0 right-1"
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default SelectUser;
