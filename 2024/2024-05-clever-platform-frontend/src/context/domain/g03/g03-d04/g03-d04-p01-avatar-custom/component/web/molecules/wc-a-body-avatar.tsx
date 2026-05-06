import ThreeModelRenderer from '@component/game/model-renderer/custom-avatar-model-render';
import PetModelRender from '@component/game/model-renderer/pet-blob-model-renderer';
import APICustomAvatar from '@domain/g03/g03-d04/local/api';
import GoldCoin from '@global/assets/gold-coin.svg';
import Button from '@global/component/web/atom/wc-a-button';
import ButtonPrevNext from '@global/component/web/atom/wc-a-button-prev-next';
import StoreGame from '@global/store/game';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

type AvatarType = {
  id: number;
  avatar_id: string;
  buy: boolean;
  lock: boolean;
  name: string;
  price: number;
  model_src: string;
  src: string;
  description?: string;
  selected?: boolean;
  is_equipped?: boolean;
};

type Props = {
  selectedCharacter: AvatarType; // initial selected character (from shop)
  selectedPet?: any;
  selectedFrame?: any;
  selectedBadge?: any; // Add this if needed
  isFrameActive: boolean;
  avatarData: AvatarType[]; // all purchased avatars from shop
  petData: any;
  selected: any;
  handleBuy?: (item: any) => Promise<any>; // Add this
  onUpdate?: (data?: any) => Promise<any>;
};

const extractGroupKey = (avatarId: string | undefined): string => {
  if (!avatarId) return '';
  const parts = avatarId.split('_');
  return parts.length >= 3 ? `${parts[0]}_${parts[1]}` : avatarId;
};

const BodyAvatar = ({
  selectedCharacter,
  selectedPet,
  selectedFrame,
  isFrameActive,
  avatarData,
  petData,
  selected,
  onUpdate,
}: Props) => {
  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  // State to store grouped avatars and the currently active group/index.
  const [avatarGroups, setAvatarGroups] = useState<Record<string, AvatarType[]>>({});
  const [currentGroupKey, setCurrentGroupKey] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentAvatar, setCurrentAvatar] = useState<AvatarType | null>(null);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Flag for processing delay

  // Track equipped avatar ID locally (like Shop does)
  const [equippedAvatarId, setEquippedAvatarId] = useState<number | null>(null);

  console.log('avatarData custom avatar: ', avatarData);
  console.log('petData custom avatar: ', petData);
  console.log('Avatar selected in custom avatar: ', selected);

  const currentPet = petData.find((p: any) => p.pet_id === selectedPet?.pet_id);

  console.log('currentPet:', currentPet);

  const currentGroup = avatarGroups[currentGroupKey] || [];

  // Initialize equipped avatar from API data
  useEffect(() => {
    const equippedAvatar = avatarData.find((avatar) => avatar.is_equipped === true);
    if (equippedAvatar) {
      console.log('Found equipped avatar from API:', equippedAvatar.id);
      setEquippedAvatarId(equippedAvatar.id);
    }
  }, [avatarData]);

  // Check if current avatar is equipped
  const isCurrentAvatarEquipped = useCallback(() => {
    if (!currentAvatar) return false;
    return currentAvatar.id === equippedAvatarId;
  }, [currentAvatar, equippedAvatarId]);

  // Helper: Get next level avatar based on current avatar's avatar_id
  const getNextLevelAvatar = (avatar: AvatarType): AvatarType | undefined => {
    const parts = avatar.avatar_id.split('level');
    const currentLevel = parseInt(parts[1] || '0', 10);
    const nextLevel = currentLevel + 1;
    const nextAvatarId = `${parts[0]}level${nextLevel}`;
    return currentGroup.find((a) => a.avatar_id === nextAvatarId);
  };

  // Helper: Get previous level avatar based on current avatar's avatar_id
  const getPreviousLevelAvatar = (avatar: AvatarType): AvatarType | undefined => {
    const parts = avatar.avatar_id.split('level');
    const currentLevel = parseInt(parts[1] || '0', 10);
    const prevLevel = currentLevel - 1;
    if (prevLevel < 1) return undefined;
    const prevAvatarId = `${parts[0]}level${prevLevel}`;
    return currentGroup.find((a) => a.avatar_id === prevAvatarId);
  };

  const handleBuyAndUnlock = async (avatar: AvatarType) => {
    if (isProcessing || !avatar) return;

    setIsProcessing(true);

    // If the current avatar is locked, try to unlock it.
    if (avatar.lock) {
      const previous = getPreviousLevelAvatar(avatar);
      if (previous && previous.buy) {
        // Unlock the current avatar.
        avatar.lock = false;
        console.log(`Unlocked current avatar: ${avatar.name}`);
      } else {
        console.warn('Avatar is locked. Cannot proceed with purchase:', avatar);
        setIsProcessing(false);
        return;
      }
    }

    try {
      // Check if the item has been bought already
      if (avatar.buy) {
        // If already bought, equip it
        console.log('Avatar already bought. Equipping:', avatar);
        const avatarId = avatar.id;

        // Update local state immediately for faster UI feedback
        setEquippedAvatarId(avatarId);

        // Make the API call
        const response = await APICustomAvatar.Character.UpdateCharacter.Patch(avatarId, true);
        console.log('Equip response:', response);

        if (response && response.status_code === 200) {
          // Wait briefly then refresh parent data
          await new Promise((resolve) => setTimeout(resolve, 300));
          if (onUpdate) {
            onUpdate({
              selectedItem: avatar,
              stateFlow: stateFlow,
              isEquipped: true,
            });
          }
        } else {
          // Revert on failure
          console.error('Failed to equip avatar:', response);
          setEquippedAvatarId(null);
        }
      } else {
        // Otherwise, execute the purchase
        console.log('handleBuy executed for item:', avatar);
        // TODO: Implement buy logic if needed
      }

      // After a successful purchase, unlock the next level (if exists).
      const nextAvatar = getNextLevelAvatar(avatar);
      if (nextAvatar && nextAvatar.lock) {
        nextAvatar.lock = false;
        console.log(`Unlocked next avatar: ${nextAvatar.name}`);
      }
    } catch (error) {
      console.error('Error in handleBuyAndUnlock:', error);
      setEquippedAvatarId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Group and sort the avatar data
  useEffect(() => {
    if (!avatarData?.length) return;
    const groups: Record<string, AvatarType[]> = {};

    avatarData.forEach((avatar) => {
      const key = extractGroupKey(avatar.avatar_id);
      if (!groups[key]) groups[key] = [];
      groups[key].push(avatar);
    });

    // Sort each group by the level number extracted from avatar_id
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => {
        const aLevel = parseInt(a.avatar_id.split('level')[1] || '0', 10);
        const bLevel = parseInt(b.avatar_id.split('level')[1] || '0', 10);
        return aLevel - bLevel;
      });
    });

    console.log('Grouped avatars:', groups);
    setAvatarGroups(groups);

    // Determine default group based on the initial selectedCharacter
    const defaultGroupKey = extractGroupKey(selectedCharacter.avatar_id);
    const group = groups[defaultGroupKey] || [];
    const defaultIndex = group.findIndex((a) => a.id === selectedCharacter.id);
    setCurrentGroupKey(defaultGroupKey);
    setCurrentIndex(defaultIndex >= 0 ? defaultIndex : 0);
    setCurrentAvatar(group[defaultIndex] || group[0] || null);
  }, [avatarData, selectedCharacter]);

  // Update currentAvatar when currentIndex or currentGroupKey changes
  useEffect(() => {
    const group = avatarGroups[currentGroupKey] || [];
    setCurrentAvatar(group[currentIndex] || null);
  }, [currentIndex, currentGroupKey, avatarGroups]);

  // Delay handler for prev
  const handlePrev = () => {
    if (isModelLoading || isProcessing) return; // Prevent rapid clicking
    setIsProcessing(true); // Set processing to true
    const group = avatarGroups[currentGroupKey] || [];
    if (!group.length) return;
    setCurrentIndex((prev) => (prev - 1 + group.length) % group.length);
    setTimeout(() => setIsProcessing(false), 500); // Reset processing after 500ms
  };

  const handleNext = () => {
    if (isModelLoading || isProcessing) return; // Prevent rapid clicking
    setIsProcessing(true); // Set processing to true
    const group = avatarGroups[currentGroupKey] || [];
    if (!group.length) return;
    setCurrentIndex((prev) => (prev + 1) % group.length);
    setTimeout(() => setIsProcessing(false), 500); // Reset processing after 500ms
  };

  // Button label (for example, showing level number)
  const buttonText = `LV.${currentIndex + 1}`;

  // Determine button visibility based on current equipped status (like Shop)
  const isEquipped = isCurrentAvatarEquipped();
  const buttonVisibility = currentAvatar?.lock || isEquipped ? 'hidden' : '';

  console.log('Current avatar ID:', currentAvatar?.id);
  console.log('Equipped avatar ID:', equippedAvatarId);
  console.log('Is current equipped:', isEquipped);
  console.log('selectedFrame:', selectedFrame);

  return (
    <div className="flex flex-col items-center absolute top-0 w-[500px] h-[600px]">
      {stateFlow === STATEFLOW.Frame && selectedFrame?.image_url ? (
        <div className="absolute top-[25%] left-[7%] w-[400px] h-[300px]">
          <img
            src={selectedFrame.image_url}
            alt="Frame"
            className={`w-[110%] h-auto ${selectedFrame.id === 0 ? 'hidden' : ''}`}
          />
        </div>
      ) : (
        <>
          {stateFlow === STATEFLOW.Avatar && (
            <>
              {/* Render the 3D model */}
              <ThreeModelRenderer
                modelSrc={currentAvatar?.avatar_id}
                key={currentAvatar?.avatar_id}
              />

              {/* Prev/Next navigation */}
              <div className="z-40">
                <ButtonPrevNext
                  text={buttonText}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  disabled={isModelLoading || isProcessing}
                />
              </div>

              {/* Save/Buy button - inside BodyAvatar like Shop */}
              <div className={`absolute bottom-3 left-[72px] ${buttonVisibility}`}>
                <Button
                  onClick={() => currentAvatar && handleBuyAndUnlock(currentAvatar)}
                  size="large"
                  disabled={isProcessing}
                >
                  {currentAvatar?.buy ? (
                    t('save')
                  ) : (
                    <>
                      <img
                        src={GoldCoin}
                        alt="Buy Icon"
                        style={{ width: 24, height: 24, marginRight: 8 }}
                      />
                      {`${currentAvatar?.price ?? ''}`}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {stateFlow === STATEFLOW.Pet && selectedPet?.src && (
            <>
              {selectedPet?.name !== 'NoSelected' ? (
                <>
                  {console.log(
                    'Selected Avatar model_src: ',
                    selectedCharacter.avatar_id,
                  )}
                  <ThreeModelRenderer modelSrc={currentAvatar?.avatar_id} />

                  {currentPet?.pet_id ? (
                    <>
                      {console.log('Pet src: ', selectedPet.src)}
                      {console.log('Pet model name: ', selectedPet.model_name)}
                      <PetModelRender
                        modelSrc={currentPet.model_name}
                        className="absolute w-full h-full top-[32%] -right-[20%]"
                      />
                    </>
                  ) : (
                    <>
                      {console.log('Rendering fallback image for pet')}

                      <img src={selectedPet.src} alt={selectedPet.name} />
                    </>
                  )}
                </>
              ) : (
                <>
                  {console.log('No pet selected')}
                  {/* Render something for 'NoSelected' case */}
                  <ThreeModelRenderer modelSrc={currentAvatar?.avatar_id} />
                </>
              )}
            </>
          )}

          {stateFlow === STATEFLOW.Honer && (
            <>
              {/* Render the 3D model */}
              <ThreeModelRenderer modelSrc={currentAvatar?.avatar_id} />
              {/* Prev/Next navigation */}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BodyAvatar;
