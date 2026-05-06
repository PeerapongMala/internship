import ThreeModelRenderer from '@component/game/model-renderer/custom-avatar-model-render';
import PetModelRender from '@component/game/model-renderer/pet-blob-model-renderer';
import APICustomAvatar from '@domain/g03/g03-d04/local/api';
import GoldCoin from '@global/assets/gold-coin.svg';
import Button from '@global/component/web/atom/wc-a-button';
import ButtonPrevNext from '@global/component/web/atom/wc-a-button-prev-next';
import StoreGame from '@global/store/game';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

type AvatarType = {
  id: string;
  avatar_id: string;
  buy: boolean;
  lock: boolean;
  is_equipped?: boolean;
  name?: string;
  price?: number;
};

type Props = {
  selectedCharacter: any;
  handleBuy: any;
  selected: any;
  selectedPet: any;
  selectedFrame: any;
  selectedBadge: any;
  avatarData: AvatarType[];
  isFrameActive: boolean;
  petData: any;
  onUpdate?: (data?: any) => void; // Callback to refresh parent data
  onShowModalNotMoney?: () => void; // Callback to refresh parent data
};

const extractGroupKey = (avatarId: string | undefined): string => {
  if (!avatarId) return '';
  const parts = avatarId.split('_');
  return parts.length >= 3 ? `${parts[0]}_${parts[1]}` : avatarId;
};

const BodyAvatar = ({
  selectedCharacter,
  selectedPet,
  isFrameActive,
  selectedFrame,
  selectedBadge,
  avatarData,
  selected,
  handleBuy,
  petData,
  onUpdate,
  onShowModalNotMoney,
}: Props) => {
  console.log('selected prop: ', selected);
  console.log('selected Frame: ', selectedFrame);
  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const [avatarGroups, setAvatarGroups] = useState<Record<string, AvatarType[]>>({});
  const [currentGroupKey, setCurrentGroupKey] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showModel, setShowModel] = useState<boolean>(true);
  const [justBoughtAvatarId, setJustBoughtAvatarId] = useState<string | null>(null);

  // Use a ref to track the current model ID for preventing unnecessary re-renders
  const currentModelIdRef = useRef<string | null>(null);

  // Track equipped avatar ID separately from the API data
  const [equippedAvatarId, setEquippedAvatarId] = useState<string | null>(null);

  const currentPet = petData.find((p: any) => p.pet_id === selectedPet?.pet_id);

  // Initialize equipped avatar from API data and handle just bought avatars
  useEffect(() => {
    const equippedAvatar = avatarData.find((avatar) => avatar.is_equipped === true);
    if (equippedAvatar) {
      console.log('Found equipped avatar from API:', equippedAvatar.id);
      setEquippedAvatarId(equippedAvatar.id);
    }

    // Check if we have a recently purchased avatar that needs to be equipped
    if (justBoughtAvatarId) {
      console.log('Found recently purchased avatar ID:', justBoughtAvatarId);

      // Find the avatar in the updated avatarData
      const avatarToEquip = avatarData.find((avatar) => avatar.id === justBoughtAvatarId);

      if (avatarToEquip) {
        console.log('Found avatar to equip in updated data:', avatarToEquip);

        // Set a shorter timeout for better responsiveness
        setTimeout(() => {
          console.log('Auto-equipping recently purchased avatar after delay');
          equipAvatarAndRefresh(avatarToEquip);

          // Reset the just bought ID after handling it
          setJustBoughtAvatarId(null);
        }, 300);
      } else {
        console.log(
          'Avatar not found in updated data yet. Will check again when data refreshes.',
        );
      }
    }
  }, [avatarData, justBoughtAvatarId]);

  // Group avatars and set up initial state
  useEffect(() => {
    const groups: Record<string, AvatarType[]> = {};

    avatarData.forEach((avatar) => {
      const groupKey = extractGroupKey(avatar.avatar_id);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(avatar);
    });

    console.log('Groups:', groups);
    setAvatarGroups(groups);

    // Set default avatar
    const defaultAvatar = avatarData.find((a) => a.is_equipped);
    if (defaultAvatar) {
      const groupKey = extractGroupKey(defaultAvatar.avatar_id);
      const index = groups[groupKey]?.findIndex((a) => a.id === defaultAvatar.id);

      setCurrentGroupKey(groupKey);
      setCurrentIndex(index >= 0 ? index : 0);

      // Set the initial model ID reference
      if (defaultAvatar.avatar_id) {
        currentModelIdRef.current = defaultAvatar.avatar_id;
      }
    }
  }, [avatarData]);

  // Update current group when "selected" changes
  useEffect(() => {
    if (!selected?.avatar_id || !avatarGroups) return;
    const groupKey = extractGroupKey(selected.avatar_id);
    const group = avatarGroups[groupKey];
    if (!group) return;
    const index = group.findIndex((a) => a.id === selected.id);
    setCurrentGroupKey(groupKey);
    setCurrentIndex(index >= 0 ? index : 0);
  }, [selected, avatarGroups]);

  const currentGroup = avatarGroups[currentGroupKey] || [];
  const currentAvatar = currentGroup[currentIndex];

  // Effect to handle model changes and prevent duplicate rendering
  useEffect(() => {
    if (!currentAvatar || !currentAvatar.avatar_id) return;

    // If the model ID changed, we need to hide the current model, wait, then show the new one
    if (currentModelIdRef.current !== currentAvatar.avatar_id) {
      setShowModel(false);

      // Store the new model ID
      const newModelId = currentAvatar.avatar_id;

      // Wait briefly before showing the new model
      const timer = setTimeout(() => {
        currentModelIdRef.current = newModelId;
        setShowModel(true);
      }, 100); // Short delay to allow cleanup

      return () => clearTimeout(timer);
    }
  }, [currentAvatar]);

  // Navigation handlers
  const handlePrev = async () => {
    if (isProcessing || !currentGroup.length) return;

    setIsProcessing(true);
    setShowModel(false); // Hide model during transition

    // Wait briefly for cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));

    setCurrentIndex((prev) => (prev - 1 + currentGroup.length) % currentGroup.length);

    // Wait before showing the new model
    await new Promise((resolve) => setTimeout(resolve, 200)); // Reduced from 400ms to 200ms
    setShowModel(true);
    setIsProcessing(false);
  };

  const handleNext = async () => {
    if (isProcessing || !currentGroup.length) return;

    setIsProcessing(true);
    setShowModel(false); // Hide model during transition

    // Wait briefly for cleanup
    await new Promise((resolve) => setTimeout(resolve, 100));

    setCurrentIndex((prev) => (prev + 1) % currentGroup.length);

    // Wait before showing the new model
    await new Promise((resolve) => setTimeout(resolve, 200)); // Reduced from 400ms to 200ms
    setShowModel(true);
    setIsProcessing(false);
  };

  // Check if current avatar is equipped
  const isCurrentAvatarEquipped = useCallback(() => {
    if (!currentAvatar) return false;
    return currentAvatar.id === equippedAvatarId;
  }, [currentAvatar, equippedAvatarId]);

  // Function to buy an avatar - separated from equipping
  const buyAvatar = async (avatar: AvatarType) => {
    if (!avatar || !avatar.id) {
      console.error('Invalid avatar for purchase');
      return false;
    }

    try {
      console.log('Buying avatar ID:', avatar.id);
      const response = await handleBuy(avatar);

      console.log('Buy response:', response);

      // Check for insufficient funds (status_code 409)
      if (response && response.status_code === 409) {
        console.warn('Insufficient funds to purchase avatar:', avatar.id);
        if (onShowModalNotMoney) {
          onShowModalNotMoney();
        }
        return false;
      }

      const isSuccess =
        response && (response.status_code === 200 || response.data?.is_bought);

      if (isSuccess) {
        console.log('Successfully bought avatar:', avatar.id);
        return true;
      } else {
        console.error('Failed to buy avatar:', response);
        return false;
      }
    } catch (error) {
      console.error('Error buying avatar:', error);
      return false;
    }
  };

  // Function to equip an avatar - separated from buying
  const equipAvatar = async (avatarId: number) => {
    try {
      console.log('Equipping avatar ID:', avatarId);
      const response = await APICustomAvatar.Character.UpdateCharacter.Patch(
        avatarId,
        true,
      );

      console.log('Equip response:', response);
      const isSuccess = response && response.status_code === 200;

      if (isSuccess) {
        console.log('Successfully equipped avatar ID:', avatarId);
        return true;
      } else {
        console.error('Failed to equip avatar:', response);
        return false;
      }
    } catch (error) {
      console.error('Error equipping avatar:', error);
      return false;
    }
  };

  // Combined function to equip avatar and refresh data - OPTIMIZED
  const equipAvatarAndRefresh = async (avatar: AvatarType) => {
    if (!avatar || !avatar.id) return;

    try {
      setIsProcessing(true);
      setShowModel(false);

      const avatarId = parseInt(avatar.id, 10);
      if (isNaN(avatarId)) {
        console.error('Invalid avatar ID:', avatar.id);
        return;
      }

      // Update local state immediately to provide instant feedback
      setEquippedAvatarId(avatar.id);

      // If we have the avatar_id, update the model ref immediately
      if (avatar.avatar_id) {
        currentModelIdRef.current = avatar.avatar_id;
      }

      // Show the model again quickly
      setShowModel(true);

      // Make the API call in the background
      const success = await equipAvatar(avatarId);

      if (success) {
        // No need for such a long wait here - reduce to 300ms
        console.log('Equip successful, waiting briefly before refresh...');
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Refresh parent data
        if (onUpdate) {
          console.log('Calling onUpdate to refresh all data after equip...');
          onUpdate();
        }
      } else {
        // If equip failed, revert our optimistic UI update
        console.error('Equip failed, reverting UI state');
        setEquippedAvatarId(null);
      }
    } catch (error) {
      console.error('Error in equipAvatarAndRefresh:', error);
      // Revert optimistic update on error
      setEquippedAvatarId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Main handler for buy and equip operations - OPTIMIZED
  const handleBuyAndUnlock = async (avatar: AvatarType) => {
    if (isProcessing || !avatar) return;

    setIsProcessing(true);

    // If the item is locked, we can't buy it
    if (avatar.lock) {
      console.warn('Avatar is locked. Cannot proceed with purchase:', avatar);
      setIsProcessing(false);
      return;
    }

    try {
      // If already bought, just equip it - use optimistic UI update
      if (avatar.buy) {
        console.log('Avatar already bought. Equipping:', avatar);

        // Hide model only briefly
        setShowModel(false);

        // Update local state immediately for faster UI feedback
        setEquippedAvatarId(avatar.id);

        // If we have the avatar_id, update the model ref immediately
        if (avatar.avatar_id) {
          currentModelIdRef.current = avatar.avatar_id;
        }

        // Show the model again quickly
        setShowModel(true);

        // Make the API call in the background
        const success = await equipAvatar(parseInt(avatar.id, 10));

        if (success) {
          // Wait just a short time before refreshing data
          await new Promise((resolve) => setTimeout(resolve, 300));

          // Refresh parent data
          if (onUpdate) {
            onUpdate();
          }
        }
      } else {
        // For new purchases - don't hide model unless purchase succeeds
        console.log('Buying new avatar:', avatar);
        const buySuccess = await buyAvatar(avatar);

        if (buySuccess) {
          console.log('Purchase successful, setting just bought ID:', avatar.id);

          // Hide model only after successful purchase
          setShowModel(false);

          // Wait for the purchase to register, but shorter time
          console.log('Waiting for backend to process purchase...');
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Refresh data to get the updated avatar status from API
          if (onUpdate) {
            console.log('Refreshing data to get updated avatar status...');
            onUpdate();

            // Wait for the refresh to complete before proceeding
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Now set the just bought avatar ID to trigger auto-equip in useEffect
            console.log('Setting just bought avatar ID to trigger equip:', avatar.id);
            setJustBoughtAvatarId(avatar.id);
          }
        } else {
          console.error('Purchase failed for avatar:', avatar.id);
          // Don't hide model on failed purchase
        }
      }
    } catch (error) {
      console.error('Error in handleBuyAndUnlock:', error);
      setShowModel(true); // Ensure model is shown on error
    } finally {
      setIsProcessing(false);
    }
  };

  const buttonText = `LV.${currentIndex + 1}`;

  // Determine button visibility based on current equipped status
  const isEquipped = isCurrentAvatarEquipped();
  const buttonVisibility = currentAvatar?.lock || isEquipped ? 'hidden' : '';

  console.log('Current avatar ID:', currentAvatar?.id);
  console.log('Equipped avatar ID:', equippedAvatarId);
  console.log('Just bought avatar ID:', justBoughtAvatarId);
  console.log('Is current equipped:', isEquipped);
  console.log('Button visibility:', buttonVisibility);
  console.log('Show model:', showModel);

  return (
    <div className="flex flex-col items-center absolute top-[0%] w-[500px] h-[600px]">
      {stateFlow === STATEFLOW.Frame ? (
        <img
          className="absolute top-[25%] left-[6%] w-[400px] h-[250px]"
          src={selected?.image_url}
          alt="Frame"
        />
      ) : (
        <>
          {stateFlow === STATEFLOW.Avatar && currentAvatar && (
            <>
              {console.log('Current Avatar Data: ', currentAvatar)}
              <div className="-z-20">
                {/* Only render the model when showModel is true */}
                {showModel && currentAvatar.avatar_id && (
                  <ThreeModelRenderer
                    key={currentAvatar.avatar_id}
                    modelSrc={currentAvatar.avatar_id}
                  />
                )}
              </div>
              <div className="z-40">
                <ButtonPrevNext
                  text={buttonText}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  disabled={isProcessing}
                />
              </div>

              {/* Button visibility controlled by buttonVisibility class */}
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
                      {`${t('buy')} ${currentAvatar?.price ?? ''}`}
                    </>
                  )}
                </Button>
              </div>
            </>
          )}

          {stateFlow === STATEFLOW.Pet &&
            selectedPet?.src &&
            selectedPet?.name !== 'NoSelected' && (
              <>
                {currentPet?.pet_id ? (
                  <>
                    <div className="w-full h-full -left-[12px] top-4 absolute">
                      {showModel && (
                        <PetModelRender
                          key={currentPet.model_name}
                          modelSrc={currentPet.model_name}
                          className="h-full w-full"
                        />
                      )}
                    </div>
                    {console.log('Pet src: ', selectedPet.src)}
                  </>
                ) : (
                  <>
                    {console.log('Rendering fallback image for pet')}
                    <img src={selectedPet.src} alt={selectedPet.name} />
                  </>
                )}
              </>
            )}

          {stateFlow === STATEFLOW.Honer && showModel && currentAvatar && (
            <ThreeModelRenderer
              key={currentAvatar.avatar_id}
              modelSrc={currentAvatar.avatar_id}
            />
          )}

          {stateFlow === STATEFLOW.Gift && showModel && currentAvatar && (
            <ThreeModelRenderer
              key={currentAvatar.avatar_id}
              modelSrc={currentAvatar.avatar_id}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BodyAvatar;
