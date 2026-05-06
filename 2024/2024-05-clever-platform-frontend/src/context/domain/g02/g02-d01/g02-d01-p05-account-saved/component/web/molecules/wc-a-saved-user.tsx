// import ButtonEyeOff from '@global/component/web/atom/wc-a-button-eye-off';
import ButtonEyeOff from '@component/web/atom/wc-a-button-eye-off';
import ImageTemp from '@component/web/atom/wc-a-image-temp';
import ImageIconAvatar1 from '../../../assets/icon-avatar-1.svg';

const SelectUser = ({
  onClick,
  title = 'พงษ์สิทธิ์ วีระกิตธนา',
  uuid = '0000001',
  imageSrc = ImageIconAvatar1,
  tempImageSrc,
  onSelect,
}: {
  onClick?: () => void;
  title?: string;
  uuid?: string;
  imageSrc?: string | null;
  tempImageSrc?: string | null;
  onSelect?: () => void;
}) => {
  return (
    <div className="w-full px-10">
      <div
        className="relative flex w-full h-20 border-4 rounded-full focus:outline-none bg-white border-secondary focus:border-secondary
        transition active:translate-y-0.5 hover:translate-y-[-0.125rem]"
      >
        <div className="absolute h-full w-full cursor-pointer" onClick={onSelect} />
        <ImageTemp
          src={imageSrc ?? ''}
          tempSrc={tempImageSrc ?? ImageIconAvatar1}
          className="w-[68px] h-[68px] mt-[2px] ml-[2px] rounded-full object-cover p-1"
        />
        <div className="pl-2 pt-2 grow">
          <div className="text-2xl font-semibold">{title}</div>
          <div className="pt-1">uuid: {uuid}</div>
        </div>
        <ButtonEyeOff
          className="absolute h-[67px] w-[67px] pt-1 pl-1 top-0 right-[6px]"
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default SelectUser;
