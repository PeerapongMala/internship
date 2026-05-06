import StoreGame from '@global/store/game';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react'; // Added useMemo
import { useTranslation } from 'react-i18next';

// --- Assets from First Component (needed for Avatar state) ---
import ImageIconLock from '../../../assets/icon-lock.png';

// --- Assets from Second Component (needed for other states) ---
import ImageIconLineLeft from '../../../assets/arrow-line-left.png';
import ImageIconLightBulb from '../../../assets/icon-light-bulb.png';

import { RewardItem } from '@domain/g03/g03-d04/local/types';
import CoinArcade from '@domain/g04/g04-d02/g04-d02-p01-level/assets/level/coin-arcade.svg';
import KeyArcade from '@domain/g04/g04-d02/g04-d02-p01-level/assets/level/key-arcade.svg';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';
import ShopMenuBodyEmpty from './wc-a-shop-menu-body-empty';

// --- Interface from First Component (More specific than any[]) ---
interface ImageItem {
  id: number | string;
  src?: string;
  avatar_id?: string; // used for grouping in Avatar state
  image_url?: string; // Used in Frame, Gift, Honer
  template_path?: string; // Used in Honer
  badge_description?: string; // Used in Honer
  text?: string; // Used in Honer
  lock?: boolean; // Used in Avatar
  buy?: boolean; // Used in Avatar
  price?: number | string; // Used in Avatar
  is_equipped?: boolean; // Keep if relevant elsewhere
  selected?: boolean; // From original second component - may be redundant now for Avatar if selection logic changes
}

// --- Helper function from First Component ---
const extractGroupKey = (avatarId: string | undefined): string => {
  if (!avatarId) return '';
  const parts = avatarId.split('_');
  return parts.length >= 3 ? `${parts[0]}_${parts[1]}` : avatarId;
};

// --- groupByChunks from Second Component (Removed from Avatar, kept for potential future use or refactoring) ---
// const groupByChunks = (array: ImageItem[], chunkSize: number) => {
//   const result = [];
//   for (let i = 0; i < array.length; i += chunkSize) {
//     result.push(array.slice(i, i + chunkSize));
//   }
//   return result;
// };

const ShopMenuBody = ({
  imageList,
  onSelect,
  selected,
  onHandleClickMenu,
  rewardLogs,
  setShowProfileShare,
}: {
  rewardLogs: any;
  imageList: ImageItem[]; // Use the more specific interface
  onSelect: (image: ImageItem) => void; // Use the specific interface
  selected: ImageItem | null | undefined; // Use the specific interface
  onHandleClickMenu: (flow: STATEFLOW) => void; // Added type hint for clarity
  setShowProfileShare?: (show: boolean) => void; // Added type hint
}) => {
  const [whichStateFLow, setWhichStateFlow] = useState<STATEFLOW>(); // Add type hint
  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']); // Destructure directly
  const navigate = useNavigate();

  console.log('selected body shop: ', selected);
  console.log('image list: ', imageList);

  // --- Logic from First Component for Avatar ---
  const uniqueAvatarList = useMemo(() => {
    if (stateFlow !== STATEFLOW.Avatar) {
      return []; // Only compute if needed
    }
    const seenSrc = new Set<string>();
    const uniqueList: ImageItem[] = [];
    for (const image of imageList) {
      // Ensure src exists for Avatar items
      if (image.src && !seenSrc.has(image.src)) {
        seenSrc.add(image.src);
        uniqueList.push(image);
      } else if (!image.src && image.avatar_id) {
        // Handle cases where src might be missing but avatar_id exists - depends on data structure
        // If src is always expected for Avatar, this else if might not be needed
        console.warn('Avatar item missing src:', image);
      }
    }
    return uniqueList;
  }, [imageList, stateFlow]);

  // Compute the selected group key (for Avatar highlighting)
  const selectedGroupKey = useMemo(() => {
    if (stateFlow === STATEFLOW.Avatar && selected?.avatar_id) {
      return extractGroupKey(selected.avatar_id);
    }
    return '';
  }, [selected, stateFlow]);
  // --- End Logic from First Component ---

  useEffect(() => {
    // Optional: Update local state if needed, though direct use of stateFlow is common
    setWhichStateFlow(stateFlow);
    console.log('stateFlow changed:', stateFlow);
  }, [stateFlow]);

  const handleGiftHistoryClick = () => {
    // Note: Directly modifying the destructured stateFlow won't update the store or trigger re-renders properly.
    // Use the passed handler or a store action to change the state.
    onHandleClickMenu(STATEFLOW.GiftHistory);
    // stateFlow = 6; // Avoid direct mutation like this
    // setWhichStateFlow(STATEFLOW.GiftHistory); // Update local state if tracking needed
    console.log('Changing state flow to GiftHistory');
  };
  console.log('rewardLogs::: ', rewardLogs);

  return (
    <>
      {/* Top Info Sections (Keep original logic from second component) */}
      {stateFlow === STATEFLOW.Frame && (
        <div className="flex gap-2 w-full bg-white text-xl font-semibold border-2 border-slate-100 p-2 pl-4 items-center relative">
          <img src={ImageIconLightBulb} className="h-8" alt="Light Bulb Icon" />
          <div className="flex w-full justify-between pr-4">
            <div>ตกแต่งพื้นหลังอวดความสำเร็จ</div>
            <div
              className="underline cursor-pointer"
              // onClick={() => navigate({ to: '/profile-share', viewTransition: true })}
              onClick={() => setShowProfileShare?.(true)}
            >
              ดูตัวอย่าง
            </div>
          </div>
        </div>
      )}

      {stateFlow === STATEFLOW.Gift && (
        <div className="flex gap-2 w-full bg-white text-xl font-semibold border-2 border-slate-100 p-2 pl-4 items-center relative">
          <img src={ImageIconLightBulb} className="h-8" alt="Light Bulb Icon" />
          <div className="flex w-full justify-between pr-4">
            <div>{t('make_mission')}</div>
            <div className="underline cursor-pointer" onClick={handleGiftHistoryClick}>
              {t('gift_history')}
            </div>
          </div>
        </div>
      )}

      {stateFlow === STATEFLOW.GiftHistory && (
        <div className="flex gap-2 w-full bg-white text-xl font-semibold border-2 border-slate-100 p-2 pl-4 items-center">
          <img
            src={ImageIconLineLeft}
            className="h-8 cursor-pointer"
            onClick={() => onHandleClickMenu(STATEFLOW.Gift)} // Use handler to go back
            alt="Back Arrow Icon"
          />
          <div className="flex w-full justify-between pr-4">
            <div>{t('history')}</div>
          </div>
        </div>
      )}

      {/* Main Content Section */}
      <div
        className={`row-span-6 flex flex-col gap-1 w-full bg-secondary/10 p-4 rounded-br-[70px] overflow-y-auto pb-36 pr-6 z-10 overflow-x-hidden ${
          stateFlow === STATEFLOW.GiftHistory ? 'h-[500px]' : 'h-full'
        }`}
      >
        {/* === AVATAR STATE: Use Logic and Rendering from FIRST Component === */}
        {stateFlow === STATEFLOW.Avatar ? (
          // === Avatar Grid ===
          <div className="grid grid-cols-3 gap-1 w-full bg-slate-100 p-1">
            {uniqueAvatarList.map((image, index) => {
              const imageGroupKey = image.avatar_id
                ? extractGroupKey(image.avatar_id)
                : '';
              const isHighlighted =
                imageGroupKey !== '' && imageGroupKey === selectedGroupKey;

              return (
                <div
                  key={image.src || image.id || index}
                  className={`flex flex-col relative w-full h-40 justify-center items-center cursor-pointer ${
                    isHighlighted ? 'bg-secondary' : 'bg-white'
                  }`}
                  onClick={() => onSelect(image)}
                >
                  {image.lock && (
                    <img
                      className="absolute h-7 top-0 right-0 m-2 mt-3"
                      src={ImageIconLock}
                      alt="Lock Icon"
                    />
                  )}
                  <div
                    className={`z-10 ${image.id === selected?.id ? 'opacity-100' : 'opacity-100'}`}
                  >
                    <img className="h-28" src={image.src} alt="Avatar Image" />
                  </div>
                  {image.buy ? (
                    <div className="flex gap-1 items-center mt-1"></div>
                  ) : image.price !== undefined ? (
                    <div className="flex gap-1 items-center mt-1"></div>
                  ) : (
                    <div className="h-8 mt-1"></div>
                  )}
                </div>
              );
            })}
          </div>
        ) : stateFlow === STATEFLOW.Pet ? (
          // === Pet Grid (NEW IMPLEMENTATION) ===
          <div className="grid grid-cols-3 gap-1 w-full bg-slate-100 p-1">
            {imageList.map((image, index) => (
              <div
                key={image.id || index}
                className={`flex flex-col relative w-full h-40 justify-center items-center cursor-pointer ${
                  image.id === selected?.id ? 'bg-secondary' : 'bg-white'
                }`}
                onClick={() => onSelect(image)}
              >
                <div
                  className={`z-10 ${image.id === selected?.id ? 'opacity-50' : 'opacity-100'}`}
                >
                  <img
                    className="h-28"
                    src={image.src || image.image_url}
                    alt="Pet Image"
                  />
                </div>
                <div className="h-8 mt-1"></div>
              </div>
            ))}
          </div>
        ) : stateFlow === STATEFLOW.GiftHistory ? (
          // === GiftHistory View ===
          <div className="flex-1 overflow-y-scroll space-y-4 pr-2 h-[500px]">
            {rewardLogs.map((log: RewardItem, idx: number) => (
              <div
                key={idx}
                className="grid grid-cols-10 w-full h-40 justify-center bg-white shadow rounded-xl hover:bg-gray-50 transition"
              >
                {/* <ItemGame
                  image={CoinArcade}
                  count={0}
                  remaining={0}
                  style={{
                    background: `linear-gradient(180deg, #FCA726 0%, #FF6B00 50%, #CC0000 150%)`,
                    position: 'relative',
                  }}
                />*/}
                <div className="col-span-3 relative flex justify-center items-center h-full w-full">
                  <div>
                    {log.item_image_url ? (
                      // Code for when item_image_url exists
                      <>
                        <img
                          className="absolute w-32 z-20 left-2 top-4"
                          //src={log.item_image_url}
                          src={log.item_image_url}
                          alt={log.item_name || `Badge ${idx + 1}`}
                        />
                      </>
                    ) : (
                      <>
                        <img
                          className="absolute w-32 z-20 -left-2 top-2"
                          //src={log.item_image_url}
                          src={CoinArcade}
                          alt={log.item_name || `Badge ${idx + 1}`}
                        />
                        <img
                          className="absolute w-32 z-20 left-8 top-4"
                          //src={log.item_image_url}
                          src={KeyArcade}
                          alt={log.item_name || `Badge ${idx + 1}`}
                        />
                      </>
                    )}
                  </div>

                  {log.item_type === 'badge' && log.item_image_url ? (
                    <>
                      <div className="absolute h-12 z-10 bg-yellow-100 rounded-full p-2"></div>
                      <img
                        className="max-w-36 z-20"
                        //src={log.item_image_url}
                        src={CoinArcade}
                        alt={log.item_name || `Badge ${idx + 1}`}
                      />

                      {/* <ItemGame
                        image={KeyArcade}
                        count={0}
                        remaining={0}
                        style={{
                          background: `linear-gradient(180deg, #FCA726 0%, #FF6B00 50%, #CC0000 150%)`,
                        }}
                      /> */}
                    </>
                  ) : (
                    <>
                      <div className="absolute h-12 z-10 bg-yellow-100 rounded-full p-2"></div>
                      <div className="max-w-36 z-20"></div>
                    </>
                  )}
                </div>
                <div className="col-span-7 flex flex-col justify-between items-start h-full w-full py-4">
                  <div className="text-3xl font-semibold">
                    {log.item_name ?? `รางวัล ${idx + 1}`}
                  </div>
                  <div className="text-2xl">ได้รับไอเทม จาก {log.description}</div>
                  <div className="text-lg">
                    เวลา{' '}
                    {new Date(log.received_at).toLocaleString('th-TH', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                      timeZone: 'Asia/Bangkok',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // === Other States (Honer, Frame, Gift, etc.) ===
          <div className="grid grid-cols-3 gap-1 w-full bg-slate-100 p-1">
            {imageList.map((image, index) => (
              <div
                key={image.id || index}
                className={`flex flex-col relative w-full h-40 justify-center items-center cursor-pointer ${
                  image.id === selected?.id ? 'bg-secondary' : 'bg-white'
                }`}
                onClick={() => onSelect(image)}
              >
                {stateFlow === STATEFLOW.Honer ? (
                  <div className="h-28 flex items-center justify-center text-lg font-bold text-gray-600 z-20">
                    {image.text || (
                      <div
                        className={`z-10 ${image.id === selected?.id ? 'opacity-50' : 'opacity-100'}`}
                      >
                        <img
                          src={image.template_path}
                          alt=""
                          className={`absolute w-full h-[35%] z-20 top-[35%] left-0 ${image.image_url === '/badge/icon-no-selected.png' ? 'hidden' : ''}`}
                        />
                        <img
                          src={image.image_url}
                          alt=""
                          className={`absolute w-[28%] h-[28%] top-[34%] -left-[2px] z-30 ${image.image_url === '/badge/icon-no-selected.png' ? 'w-[50%] h-[50%] top-[19.5%] left-10' : ''}`}
                        />
                        <div className="w-full absolute z-30">
                          <p
                            className={`absolute text-white w-full text-center left-[-50%] text-[12px] pl-7 top-[2px] ${image.image_url === '/badge/icon-no-selected.png' ? 'hidden' : ''}`}
                          >
                            {image.badge_description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : stateFlow === STATEFLOW.Frame ? (
                  <div
                    className={`z-10 ${image.id === selected?.id ? 'opacity-50' : 'opacity-100'}`}
                  >
                    <img className="h-28" src={image.image_url} alt="Frame Image" />
                  </div>
                ) : stateFlow === STATEFLOW.Gift ? (
                  <div
                    className={`z-10 ${image.id === selected?.id ? 'opacity-50' : 'opacity-100'}`}
                  >
                    <img className="h-28" src={image.image_url} alt="Gift Image" />
                  </div>
                ) : (
                  <div
                    className={`z-10 ${image.id === selected?.id ? 'opacity-50' : 'opacity-100'}`}
                  >
                    <img className="h-28" src={image.src} alt="Default Image" />
                  </div>
                )}
                <div className="h-8 mt-1"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ShopMenuBody;
