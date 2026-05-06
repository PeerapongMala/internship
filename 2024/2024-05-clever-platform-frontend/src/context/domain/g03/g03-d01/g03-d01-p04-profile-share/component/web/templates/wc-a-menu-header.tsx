import { useTranslation } from 'react-i18next';

import ConfigJson from '../../../config/index.json';
import { AllEquipped } from '../../../type';

export function MenuHeader({
  className,
  nickname = 'นักเรียนคิดเลขเร็ว',
  isCapture,
  allEquipped,
}: {
  className?: string;
  nickname?: string;
  isCapture?: boolean;
  allEquipped: AllEquipped;
}) {
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <>
      <StudentBadge nickname={nickname} isCapture={isCapture} allEquipped={allEquipped} />
    </>
  );
}

const StudentBadge = ({
  className,
  nickname = 'นักเรียนคิดเลขเร็ว',
  isCapture,
  allEquipped,
}: {
  className?: string;
  nickname?: string;
  isCapture?: boolean;
  allEquipped: AllEquipped;
}) => {
  console.log('Badge: ', allEquipped.badges);
  return (
    <div
      className={`flex items-center justify-center absolute top-[1.7rem] left-[4rem] w-[22rem] h-20 ${className} z-50`}
    >
      <div className="absolute -top-2 -left-3 w-full">
        {/* <BadgeBg1_1 className="w-[24rem] h-full" /> */}
        <img src={allEquipped.badges?.template_path} className="w-full" />
      </div>
      <div className={`absolute -top-2 left-0`}>
        <img src={allEquipped.badges?.image_url} className="w-[4.7rem]" />
      </div>
      <div className={`absolute text-2xl !font-semibold text-white z-10 pl-5`}>
        {allEquipped.badges?.badge_description}
      </div>
      {/* <div className="flex">
        <TextWithStroke
          text={nickname}
          className="text-2xl !font-semibold text-white flex items-center justify-center pl-10"
          strokeClassName="text-stroke-warning"
          backgroundClassName="flex items-center justify-center w-[90%]"
          textClassName="flex items-center justify-center w-[90%]"
        />
      </div> */}
    </div>
  );
};

export default MenuHeader;
