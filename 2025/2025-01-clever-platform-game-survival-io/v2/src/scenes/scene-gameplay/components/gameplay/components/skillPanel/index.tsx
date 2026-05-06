import { SkillName, useSkillStore } from '@/store/skillStore';
import { useGameStore } from '@/store/gameStore';
import { createDrone, createIceball } from '../..';
import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import Collection from './collection';
import UpgradeCards from './upgrade-cards';
import { ScrollableModal } from '@core-utils/ui/scrollable-modal/ScrollableModal';
import { AvailableCardInfoArray } from './upgrade-cards/available-card';
import SkillCard from './skill-card';
import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

function SkillPanel({
  isVisible,
  onClose,
}: {
  isVisible: boolean;
  onClose?: () => void;
}) {

  const isDebugMode = import.meta.env.VITE_DEBUG_CODE ===
    new URLSearchParams(window.location.search).get('debugCode');

  const {
    currentSkillLevel,
    setSkillLevel
  } = useSkillStore();

  const { closeSkillPanel } = useGameStore();
  const { isSkillLearnable } = useGameStore();

  // const updateCollection = () => { };

  const handleUpgradeClick = (skill: SkillName) => {
    // Play upgrade/select sound
    void playSoundEffect(SOUND_GROUPS.sfx.score_gain_star_upgrade);
    switch (skill) {
      case SkillName.ICEBALL:
        if (currentSkillLevel[SkillName.ICEBALL] == 0) {
          // window.createIceball();
          createIceball();
        }
        break;
      case SkillName.DRONE:
        if (currentSkillLevel[SkillName.DRONE] == 0) {
          // window.createDrone();
          createDrone();
        }
        break;
      default:
        break;
    }
    setSkillLevel(skill, currentSkillLevel[skill] + 1);
    closeSkillPanel();
    onClose && onClose();
  };

  // useEffect(() => {
  //   /*
  //   if (isVisible) {
  //     console.log("SkillPanel is visible, pausing game.");
  //     //window.GameManager.pauseGame();
  //     closeSkillPanel();
  //   } else {
  //     console.log("SkillPanel is not visible, resuming game.");
  //     //window.GameManager.resumeGame();
  //     closeSkillPanel();
  //   }*/
  // }, [isVisible]);

  if (!isVisible) return null; // ไม่แสดง panel ถ้าไม่เปิดอยู่

  return (
    <div
      // className='bg-[rgba(15, 15, 15, 0.8)]'
      className="flex h-full w-full flex-col items-center justify-center bg-black p-8 opacity-80"
    >
      <ScrollableModal>
        {/* หัวข้อหยุดเกม */}
        <h1 className="mb-8 text-center text-5xl font-bold text-white">
          หยุดเกม
        </h1>

        <Collection />

        {isSkillLearnable && (
          <>
            <img
              src={PUBLIC_ASSETS_LOCATION.image.special.upgrade.upgradeHeader}
              className="flex max-w-720 flex-row items-center justify-around p-8"
            />

            <UpgradeCards
              onUpgradeClick={handleUpgradeClick}
            />
          </>
        )}
        {/* <UpgradeCards
          onUpgradeClick={handleUpgradeClick}
        /> */}

        {/* TODO: show only in dev mode, hide on production mode */}
        {isDebugMode && (
          <div className="flex-start scrollbar-hide no-scrollbar relative inline-flex h-fit w-screen items-center justify-around overflow-x-auto overflow-y-hidden">
            <div className="relative flex h-fit w-fit flex-row items-center justify-center space-x-8">
              {AvailableCardInfoArray.map(([skill, info]) => (
                <SkillCard
                  key={skill}
                  image={info.image}
                  title={info.title}
                  description={info.desc}
                  level={currentSkillLevel[skill as SkillName]}
                  onUpgradeClick={handleUpgradeClick}
                  skill={skill}
                />
              ))}
            </div>
          </div>
        )}

        {/* ปุ่มเล่นต่อ */}
        <button
          onClick={onClose}
          className="mt-8 transition-transform hover:scale-105 active:scale-95"
        >
          <img src="/image/ui/resumeBtn.svg" alt="เล่นต่อ" />
        </button>
      </ScrollableModal>
    </div>
  );
}

export default SkillPanel;
