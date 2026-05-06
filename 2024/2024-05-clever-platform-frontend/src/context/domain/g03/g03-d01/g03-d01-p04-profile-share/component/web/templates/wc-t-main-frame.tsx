import { UserData } from '@domain/g02/g02-d01/local/type';
import ImageLogo from '@domain/g03/g03-d01/g03-d01-p04-profile-share/assets/logo-innomath.png';
import { AllEquipped, IProfile } from '../../../type';
import AwardStatBox from '../organisms/wc-a-award-box';
import CurrencyStatBox from '../organisms/wc-a-currency-stat-box';
import CharacterDisplay from './wc-a-character-display';
import MenuFrame from './wc-a-memu-frame';
import MenuHeader from './wc-a-menu-header';
import ProfileSection from './wc-a-profile-section';

const MainFrame = ({
  allEquipped,
  refComponent,
  userData,
  profile,
  isCapture,
  showLogo,
  frameUrl,
}: {
  allEquipped: AllEquipped;
  refComponent?: any;
  userData: UserData;
  profile: IProfile | undefined;
  isCapture?: boolean;
  showLogo?: boolean;
  frameUrl?: string;
}) => {
  return (
    <div
      className={`absolute top-[2rem] left-[11.2rem] w-[60.3rem] h-[33.3rem] p-4 
      ${isCapture ? 'bg-[#f8f3dc] scale-75' : ''}`}
      ref={refComponent}
    >
      <div className="absolute w-[58rem] h-[31.5rem] bg-[#f8f3dc] border-r-2 border-solid border-white">
        <div className="flex w-full h-full">
          <div className="relative w-full h-full">
            <MenuHeader
              isCapture={isCapture}
              className="absolute top-[1.7rem] left-[4rem] w-[22rem] h-20"
              allEquipped={allEquipped}
            />
            <CharacterDisplay
              className="relative w-[27rem] h-full"
              modelSrc={allEquipped.characters || ''}
              selectedPet={allEquipped.pets || ''}
            />
          </div>
          <div className="flex flex-col w-full h-full p-4 pr-7 gap-2">
            <div className="flex items-end w-full h-[9rem]">
              <ProfileSection profile={userData} className="" isCapture={isCapture} />
            </div>
            <CurrencyStatBox profile={profile} className="mt-2" />
            <AwardStatBox profile={profile} isCapture={isCapture} />
          </div>
        </div>
      </div>
      <div className="absolute -top-[3.4rem] left-[3px] w-[60rem] h-[40rem] pt-12">
        <MenuFrame src={frameUrl || allEquipped.frame || ''} />
      </div>
      {isCapture && (
        <div className="absolute top-0 right-2 w-[13rem] z-50">
          <img src={ImageLogo} />
        </div>
      )}
    </div>
  );
};

export default MainFrame;
