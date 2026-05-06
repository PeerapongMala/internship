import CustomAvatarAPI from '@domain/g03/g03-d04/local/api';
import GoldCoin from '@global/assets/gold-coin.svg';
import Button from '@global/component/web/atom/wc-a-button';
import StoreGame from '@global/store/game';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

const FooterAvatar = ({
  selected,
  handleBack,
  handleBuy,
  onUpdate,
}: {
  selected: any;
  handleBack: () => void;
  handleBuy: (item: any) => Promise<any>; // Changed to Promise<any> to indicate it's async
  onUpdate?: (data?: any) => Promise<any>; // Changed to Promise<any> to indicate it's async
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const [isLoading, setIsLoading] = useState(false);

  console.log({ stateFlow: stateFlow })

  useEffect(() => {
    console.log('stateFlow changed:', stateFlow);
  }, [stateFlow]);

  console.log('Footer avatar: ', selected);

  const onSetSelected = async (item: any) => {
    if (isLoading) return; // Prevent multiple clicks while loading

    setIsLoading(true);

    try {
      let response;
      let success = false;

      // Make the appropriate API call based on stateFlow
      switch (stateFlow) {
        case STATEFLOW.Avatar:
          response = await CustomAvatarAPI.Character.UpdateCharacter.Patch(item.id, true);
          success = response && response.status_code === 200;
          break;
        case STATEFLOW.Pet:
          response = await CustomAvatarAPI.Pet.UpdatePet.Patch(item.id, true);
          success = response && response.status_code === 200;
          break;
        case STATEFLOW.Frame:
          response = await CustomAvatarAPI.Frame.UpdateFrame.Patch(item.item_id, true);
          success = response && response.status_code === 200;
          break;
        case STATEFLOW.Honer:
          response = await CustomAvatarAPI.ItemBadge.UpdateItemBadge.Patch(
            item.item_id,
            true,
          );
          success = response && response.status_code === 200;
          break;
        default:
          break;
      }

      console.log('API Response:', response);

      // Optimistic UI update - immediately show as equipped in the UI
      if (success) {
        console.log('Equipment successful, updating UI');

        // Immediately update local UI if needed
        // ...

        // Wait a short time for backend to process the change
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Then notify parent component to refresh data
        if (onUpdate) {
          console.log('Calling onUpdate after successful equipment');
          try {
            const result = await onUpdate({
              selectedItem: item,
              stateFlow: stateFlow,
              isEquipped: true,
              apiResponse: response,
            });
            console.log('onUpdate completed with result:', result);
          } catch (error) {
            console.error('Error during onUpdate after equipment:', error);
          }
        }
      } else {
        console.error('API call failed:', response);
      }
    } catch (error) {
      console.error('Error during API call:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Wrapper for handleBuy to also notify other components
  const handleBuyAndUpdate = async (item: any) => {
    if (isLoading) return; // Prevent multiple clicks while loading

    setIsLoading(true);

    try {
      console.log('Starting buy operation for item:', item);

      // Call the original handleBuy function
      const buyResponse = await handleBuy(item);
      console.log('Buy response received:', buyResponse);

      const isSuccess =
        buyResponse &&
        (buyResponse.status_code === 200 ||
          (buyResponse.data && buyResponse.data.is_bought));

      // Only update if the buy was successful
      if (isSuccess) {
        console.log('Buy successful, waiting before update');
        // Wait for the server state to update (give it a moment)
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Then notify other components about the update
        if (onUpdate) {
          console.log('Calling onUpdate after successful purchase');
          try {
            const result = await onUpdate({
              selectedItem: item,
              stateFlow: stateFlow,
              isBuying: true,
              buyResponse: buyResponse,
            });
            console.log('onUpdate completed with result:', result);
          } catch (error) {
            console.error('Error during onUpdate after purchase:', error);
          }
        }
      } else {
        console.error('Buy operation failed:', buyResponse);
      }
    } catch (error) {
      console.error('Error during buy operation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canBuyItem = () => {
    // Check stock availability: if stock is null or greater than 0, the item can be bought
    return selected?.stock === null || selected?.stock > 0;
  };

  // Skip rendering if selected is null or undefined
  if (!selected) {
    return <div className="flex justify-center w-full h-20"></div>;
  }

  // // Skip rendering if item is already equipped or locked
  // if (selected.is_equipped === true || selected.lock === true) {
  //   return <div className="flex justify-center w-full h-20"></div>;
  // }

  return (
    <div className="flex justify-center w-full h-20">
      {/* Handle different STATEFLOW cases */}
      {stateFlow === STATEFLOW.Gift ? (
        <Button
          soundKey="no_sound"
          disabled={isLoading}
          onClick={() => {
            if (selected) {
              // Check if the item can be bought based on stock and buy status
              if (selected.buy === true && canBuyItem()) {
                console.log('Calling handleBuy:', selected);
                handleBuyAndUpdate(selected);
              } else if (selected.buy === true) {
                console.log('Calling PATCH update for selected:', selected);
                onSetSelected(selected);
              } else {
                handleBuyAndUpdate(selected);
                console.log('Item cannot be bought (stock is 0 or unavailable)');
              }
            }
          }}
          size="large"
        >
          {isLoading ? (
            t('loading')
          ) : selected ? (
            stateFlow === STATEFLOW.Gift &&
              (selected.stock == null || selected.stock > 0) ? (
              <>
                <img
                  src={GoldCoin}
                  alt="Buy Icon"
                  style={{ width: 36, height: 36, marginRight: 8 }}
                />
                {selected.price}
              </>
            ) : (
              // For non-Gift or when stock is 0 or unavailable
              `${selected.buy === true ? t('save') : `${t('buy')} ${selected.price}`}`
            )
          ) : (
            t('back')
          )}
        </Button>
      ) : stateFlow === STATEFLOW.Avatar ? (
        // Avatar button is now handled in BodyAvatar (like Shop)
        // Don't show anything here
        <div className="flex justify-center w-full h-20"></div>
      ) : stateFlow === STATEFLOW.Pet ? (
        // For Pet stateFlow, always show button
        <>
          <div
            className={
              !selected || Object.keys(selected).length === 0 || selected.selected
                ? 'hidden'
                : ''
            }
          >
            <Button
              disabled={isLoading}
              onClick={() => {
                if (selected) {
                  if (selected.buy === true) {
                    onSetSelected(selected);
                  } else {
                    handleBuyAndUpdate(selected);
                  }
                }
              }}
              size="large"
            >
              {isLoading ? (
                t('save')
              ) : selected?.buy === true ? (
                t('save')
              ) : (
                <>
                  <img
                    src={GoldCoin}
                    alt="Buy Icon"
                    style={{ width: 36, height: 36, marginRight: 4 }}
                  />
                  {`${selected?.price || ''}`}
                </>
              )}
            </Button>
          </div>
        </>
      ) : (
        // For other stateFlow cases (Frame, Honer)
        <div
          className={
            !selected || Object.keys(selected).length === 0 || selected.selected
              ? 'hidden'
              : ''
          }
        >
          <Button
            disabled={isLoading}
            onClick={() => {
              if (selected) {
                if (selected.buy === true) {
                  // Item already bought, update the character, pet, etc.
                  onSetSelected(selected);
                } else {
                  // Item not bought yet, handle buying process
                  handleBuyAndUpdate(selected);
                }
              }
            }}
            size="large"
          >
            {isLoading ? (
              t('save')
            ) : selected?.buy === true ? (
              t('save')
            ) : (
              <>
                <img
                  src={GoldCoin}
                  alt="Buy Icon"
                  style={{ width: 36, height: 36, marginRight: 4 }}
                />
                {`${selected?.price || ''}`}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FooterAvatar;
