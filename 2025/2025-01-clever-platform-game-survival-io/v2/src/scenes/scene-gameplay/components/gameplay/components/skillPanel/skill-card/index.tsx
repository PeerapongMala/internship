import { PUBLIC_ASSETS_LOCATION } from "@/assets/public-assets-locations";
import { SkillName } from "@/store/skillStore";
import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

const SkillCard = (
  props: {
    image: string;
    title: string;
    description: string;
    level: number;
    onUpgradeClick: (skill: SkillName) => void;
    skill: string;
  } = {
      image: '',
      title: '',
      description: '',
      level: 0,
      onUpgradeClick: function (): void {
        throw new Error('Function not implemented.');
      },
      skill: '',
    },
) => {
  return (
    <div
      // className='image-column'
      className="relative mb-16 flex h-[363px] w-[256px] flex-col items-center justify-center"
    >
      <img
        src={PUBLIC_ASSETS_LOCATION.image.special.upgrade.supplyCardBG}
        // className='grid-image'
        className="absolute"
      />
      <div
        // className='text-first'
        className="font-kanit absolute items-center justify-center text-[14px] text-white"
        style={{
          top: '10%',
          transform: 'translateY(-50%)',
        }}
      >
        {props.title}
      </div>
      <img
        src={props.image}
        // className='icon-first'
        className="absolute w-[100px] items-center justify-center"
        style={{
          top: '10%',
          transform: 'translateY(50%)',
        }}
      />
      <div
        // className='des-first'
        className="font-kanit absolute text-center text-[14px] text-white"
        style={{
          top: '60%',
          transform: 'translateY(50%)',
          padding: '0 30px',
        }}
      >
        {props.description}
      </div>
      <div
        // className='lv-upf'
        className="absolute text-[12px]"
        style={{
          bottom: '15%',
          transform: 'translateY(50%)',
        }}
      >
        Lv {props.level}
      </div>
      <button
        className="animation-idlebutton absolute transition duration-300 hover:scale-110"
        onMouseEnter={() => void playSoundEffect(SOUND_GROUPS.sfx.ui_button)}
        style={{
          bottom: '0%',
          transform: 'translateY(40%)',
        }}
      >
        <img
          src={PUBLIC_ASSETS_LOCATION.image.special.upgrade.selectBtn}
          // className='icon-descriptionf'
          // className='absolute justify-center items-center'
          // style={{
          //   top: '50%',
          // }}
          //
          onClick={() => props.onUpgradeClick(props.skill as SkillName)}
        />
      </button>
    </div>
  );
};

export default SkillCard;
