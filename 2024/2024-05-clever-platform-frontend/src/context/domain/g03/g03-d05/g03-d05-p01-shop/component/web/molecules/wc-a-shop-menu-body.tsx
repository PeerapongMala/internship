import StoreGame from '@global/store/game';
import { useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ImageCheckCircle from '../../../assets/check-circle.png';
import ImageIconCoin from '../../../assets/icon-coin.png';
import ImageIconLock from '../../../assets/icon-lock.png';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

interface ImageItem {
  id: number | string;
  src?: string;
  avatar_id?: string; // used for grouping in Avatar state
  image_url?: string;
  template_path?: string;
  badge_description?: string;
  text?: string;
  lock?: boolean;
  buy?: boolean;
  price?: number | string;
  is_equipped?: boolean;
  stock: number;
}

const ShopMenuBody = ({
  imageList,
  onSelect,
  selected,
}: {
  imageList: ImageItem[];
  onSelect: (image: ImageItem) => void;
  selected: ImageItem | null | undefined;
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  // Add state to track manually selected item
  const [manuallySelectedId, setManuallySelectedId] = useState<string | number | null>(
    null,
  );
  // Track if user has made any selection
  const [hasUserSelected, setHasUserSelected] = useState<boolean>(false);

  console.log('image list on shop: ', imageList);

  // Helper: extract group key from avatar_id (e.g. "set1_character1_level4" -> "set1_character1")
  const extractGroupKey = (avatarId: string | undefined): string => {
    if (!avatarId) return '';

    const parts = avatarId.split('_');
    if (parts.length >= 3) {
      // Extract set and character parts (e.g., "set1" and "character1" from "set1_character1_level1")
      return `${parts[0]}_${parts[1]}`;
    }
    return avatarId;
  };

  // Solution 1: Get one representative avatar per character type
  const uniqueAvatarList = useMemo<ImageItem[]>(() => {
    if (stateFlow !== STATEFLOW.Avatar) {
      return [];
    }

    const avatarGroups: Record<string, ImageItem> = {};

    for (const image of imageList) {
      if (image.avatar_id) {
        const parts = image.avatar_id.split('_');
        if (parts.length >= 3) {
          const groupKey = `${parts[0]}_${parts[1]}`;

          // Get the level number
          const currentLevelMatch = parts[2].match(/level(\d+)/i);
          const currentLevel = currentLevelMatch
            ? parseInt(currentLevelMatch[1], 10)
            : Infinity;

          // Get the existing item's level if it exists
          const existingItem = avatarGroups[groupKey];
          const existingLevelMatch = existingItem?.avatar_id
            ?.split('_')[2]
            .match(/level(\d+)/i);
          const existingLevel = existingLevelMatch
            ? parseInt(existingLevelMatch[1], 10)
            : Infinity;

          // Take the first level for each character type
          if (!existingItem || currentLevel < existingLevel) {
            avatarGroups[groupKey] = image;
          }
        }
      }
    }

    // Convert back to array
    return Object.values(avatarGroups);
  }, [imageList, stateFlow]);

  const listToRender = stateFlow === STATEFLOW.Avatar ? uniqueAvatarList : imageList;

  // For Avatar state, compute the selected group key
  const selectedGroupKey = useMemo(() => {
    if (stateFlow === STATEFLOW.Avatar && selected?.avatar_id) {
      return extractGroupKey(selected.avatar_id);
    } else if (stateFlow === STATEFLOW.Avatar && uniqueAvatarList.length > 0) {
      // If no selection but we have avatars, use the first one's group key
      return extractGroupKey(uniqueAvatarList[0].avatar_id);
    }
    return '';
  }, [selected, stateFlow, uniqueAvatarList]);

  // Reset user selection when stateFlow changes
  useEffect(() => {
    setManuallySelectedId(null);
    setHasUserSelected(false);
  }, [stateFlow]);

  // Check if any item is equipped
  const hasEquippedItem = useMemo(() => {
    return listToRender.some((item) => item.is_equipped);
  }, [listToRender]);

  // Auto-select the first item for Avatar state if nothing is selected
  useEffect(() => {
    if (
      stateFlow === STATEFLOW.Avatar &&
      !selected &&
      uniqueAvatarList.length > 0 &&
      !hasUserSelected
    ) {
      console.log('Auto-selecting first avatar item');
      onSelect(uniqueAvatarList[0]);
    }
  }, [stateFlow, selected, uniqueAvatarList, hasUserSelected, onSelect]);

  console.log('Selected group key:', selectedGroupKey);
  console.log('Has user selected:', hasUserSelected);

  return (
    <div className="row-span-6 flex flex-col gap-1 w-full h-full bg-secondary/10 p-4 rounded-br-[70px] overflow-y-auto pb-36 pr-6 overflow-x-hidden z-20">
      <div className="grid grid-cols-3 gap-1 w-full bg-slate-100 p-1">
        {listToRender.map((image, index) => {
          let isHighlighted = false;

          // If user has made a selection, only highlight the selected item
          if (hasUserSelected) {
            isHighlighted = image.id === manuallySelectedId;
          }
          // If no user selection yet, use default highlighting logic
          else if (stateFlow === STATEFLOW.Avatar) {
            // For Avatar, highlight if image's group key matches the selected group key or first item if no selection
            const imageGroupKey = image.avatar_id ? extractGroupKey(image.avatar_id) : '';
            isHighlighted =
              imageGroupKey === selectedGroupKey || (!selectedGroupKey && index === 0);
          } else if (stateFlow === STATEFLOW.Frame) {
            // For Frame state, highlight if equipped or first item if none equipped
            isHighlighted =
              (image.is_equipped as boolean) || (!hasEquippedItem && index === 0);
          } else if (stateFlow === STATEFLOW.Gift) {
            // For Gift state, highlight selected item or first by default
            isHighlighted = image.id === selected?.id || (!selected && index === 0);
          } else {
            // For other states, highlight if equipped or first item if none equipped
            isHighlighted =
              (image.is_equipped as boolean) || (!hasEquippedItem && index === 0);
          }

          return (
            <div
              key={
                stateFlow === STATEFLOW.Avatar ? image.src || image.id : image.id || index
              }
              className={`flex flex-col relative w-full h-40 z-40 justify-center items-center cursor-pointer ${
                isHighlighted ? 'bg-secondary' : 'bg-white'
              }`}
              onClick={() => {
                // Set manually selected ID when user clicks
                setManuallySelectedId(image.id);
                setHasUserSelected(true);
                onSelect(image);
              }}
            >
              {image.lock && (
                <img
                  className="absolute h-7 top-0 right-0 m-2 mt-3"
                  src={ImageIconLock}
                  alt="Lock Icon"
                />
              )}

              {stateFlow === STATEFLOW.Honer ? (
                <div className="h-28 flex items-center justify-center text-lg font-bold text-gray-600 z-20">
                  {image.text || (
                    <div
                      className={`z-10 ${image.id === selected?.id ? 'opacity-50' : 'opacity-100'}`}
                    >
                      <img
                        src={image.template_path}
                        alt="Badge background"
                        className="absolute w-full h-[35%] z-20 top-[35%] left-0"
                      />
                      <img
                        src={image.image_url}
                        alt="Badge image"
                        className="absolute w-[28%] h-[28%] top-[34%] -left-[2px] z-30"
                      />
                      <div className="w-full absolute z-30">
                        <p className="absolute text-white w-full text-center left-[-50%] text-[12px] pl-7 -top-[0px]">
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
              ) : stateFlow === STATEFLOW.Avatar ? (
                <div
                  className={`z-10 ${image.id === selected?.id ? 'opacity-50' : 'opacity-100'}`}
                >
                  <img className="h-28" src={image.src} alt="Avatar Image" />
                </div>
              ) : (
                <div
                  className={`z-10 ${image.id === selected?.id ? 'opacity-50' : 'opacity-100'}`}
                >
                  <img className="h-28" src={image.src} alt="Default Image" />
                </div>
              )}

              {image.buy && stateFlow !== STATEFLOW.Gift ? (
                <div className="flex gap-1 items-center">
                  <img className="h-8" src={ImageCheckCircle} alt="Bought Icon" />
                  <div className="text-2xl font-semibold">{t('bought')}</div>
                </div>
              ) : image.buy &&
                stateFlow === STATEFLOW.Gift &&
                (image.stock == null || image.stock > 0) ? (
                // For Gift state with available stock
                <div className="flex gap-1 items-center">
                  <img className="h-8" src={ImageIconCoin} alt="Coin Icon" />
                  <div className="text-2xl font-semibold">{image.price}</div>
                </div>
              ) : (
                // Default: show price for other states
                <div className="flex gap-1 items-center">
                  <img className="h-8" src={ImageIconCoin} alt="Coin Icon" />
                  <div className="text-2xl font-semibold">{image.price}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopMenuBody;
