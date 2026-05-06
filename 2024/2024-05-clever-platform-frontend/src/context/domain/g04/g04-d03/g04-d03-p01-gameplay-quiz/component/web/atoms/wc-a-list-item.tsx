import Button from '@component/web/atom/wc-a-button';
import ImageIconArrowLeft from '@global/assets/icon-arrow-left.svg';
import ImageIconSword from '@global/assets/icon-sword.png';

interface ListItemProps {
  title: string;
  duration?: string;
  status: 'completed' | 'active' | 'locked';
  onClick?: () => void;
  icon?: 'arrow' | 'sword';
  onSubmit?: () => void;
}

const ListItem = ({
  title,
  duration,
  status,
  onClick,
  icon = 'arrow',
  onSubmit
}: ListItemProps) => {
  const getBackgroundColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-white';
      case 'active':
        return 'bg-[#FCD401]';
      case 'locked':
        return 'bg-[rgba(137,137,137,0.35)]';
      default:
        return 'bg-white';
    }
  };


  const isDisabled = status === 'locked';

  return (
    <div
      className={`
        ${getBackgroundColor()}
        border-[#e9e9e9] border-b-[3px] border-solid
        flex gap-4 items-center justify-center
        min-h-[70px] px-3 py-1
        rounded-[2px] w-full
        ${!isDisabled && onClick ? 'cursor-pointer hover:brightness-95' : ''}
      `}
    >
      <div className="flex-1 flex flex-col items-start justify-center min-h-[24px]">
        <div className="flex flex-col items-start w-full">
          <div className="flex items-center justify-between w-[120px]">
            <p
              className="flex-1 font-bold leading-normal overflow-ellipsis overflow-hidden text-[#333] text-[16px] whitespace-nowrap tracking-[-0.33px]"
            >
              {title}
            </p>
          </div>
        </div>
        {duration && (
          <div className="flex items-end justify-between w-full">
            <p
              className="font-normal leading-normal text-[#333] text-[16px] text-center whitespace-nowrap"
            >
              {duration}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center">
        <div
          className={`
            border-[#77db82] border-b border-solid
            flex items-center justify-center
            w-full h-full rounded-full
            shadow-[0px_2.182px_2.182px_0px_rgba(0,0,0,0.15),0px_4.364px_4.364px_0px_rgba(0,0,0,0.05)]
          `}
          onClick={!isDisabled && onClick ? onClick : undefined}

        >
          {icon === 'arrow' ? (
            <Button
              width="50px"
              height="50px"
              variant={'success'}

              className={`border-0.5 border-white   ${status === 'locked' ? 'bg-neutral-400' : ''}`}
              disabled={isDisabled}
            >
              <img src={ImageIconArrowLeft} alt="next" className='flex justify-center items-center size-[30px] rotate-180' />
            </Button>
          ) : (
            <Button
              width="50px"
              height="50px"
              variant={'success'}
              className={`border-0.5 border-white pt-3   ${status === 'locked' ? 'bg-neutral-400' : ''}`}
              onClick={onSubmit}
              disabled={isDisabled}
            >
              <img src={ImageIconSword} alt="next" className='flex justify-center items-center size-[50px] ' />
            </Button>
          )}

        </div>
      </div>
    </div>
  );
};

export default ListItem;
