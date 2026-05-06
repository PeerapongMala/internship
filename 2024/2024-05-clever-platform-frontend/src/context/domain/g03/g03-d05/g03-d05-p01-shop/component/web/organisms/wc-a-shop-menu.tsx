import MenuItem from '@global/component/web/atom/wc-a-menu-item-shop';
import ImageIconBoy from '../../../assets/icon-boy.png';
import ImageIconFrame from '../../../assets/icon-frame.png';
import ImageIconGift from '../../../assets/icon-gift.png';
import ImageIconPet from '../../../assets/icon-pet.png';
import ImageIconShield from '../../../assets/icon-shield.png';

const ShopMenu = ({
  STATEFLOW,
  onHandleClickMenu,
  stateFlow,
}: {
  STATEFLOW: any;
  onHandleClickMenu: (menu: number) => void;
  stateFlow: number;
}) => {
  return (
    <div className="flex flex-col gap-1 w-[105px] h-full z-20">
      <div className="min-h-[87px] max-h-[87px] bg-secondary/10 rounded-tl-[70px]"></div>
      <div className="flex-initial h-[5.8rem]">
        <MenuItem
          isActive={stateFlow === STATEFLOW.Avatar}
          onClick={() => onHandleClickMenu(STATEFLOW.Avatar)}
          imageSrc={ImageIconBoy}
        />
      </div>
      <div className="flex-initial h-[5.8rem]">
        <MenuItem
          isActive={stateFlow === STATEFLOW.Pet}
          onClick={() => onHandleClickMenu(STATEFLOW.Pet)}
          imageSrc={ImageIconPet}
        />
      </div>
      <div className="flex-initial h-[5.8rem]">
        <MenuItem
          isActive={stateFlow === STATEFLOW.Frame}
          onClick={() => onHandleClickMenu(STATEFLOW.Frame)}
          imageSrc={ImageIconFrame}
        />
      </div>
      <div className="flex-initial h-28">
        <MenuItem
          isActive={stateFlow === STATEFLOW.Honer}
          onClick={() => onHandleClickMenu(STATEFLOW.Honer)}
          imageSrc={ImageIconShield}
        />
      </div>
      <div className="flex-initial h-32">
        <MenuItem
          isActive={stateFlow === STATEFLOW.Gift}
          onClick={() => onHandleClickMenu(STATEFLOW.Gift)}
          imageSrc={ImageIconGift}
          isLastItem={true}
          className="pb-6"
        />
      </div>
      <div className="flex-grow w-full bg-secondary/10 rounded-bl-[70px]"></div>
    </div>
  );
};

export default ShopMenu;
