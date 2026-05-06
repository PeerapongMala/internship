import CustomAvatarAPI from '@domain/g03/g03-d04/local/api';
import Button from '@global/component/web/atom/wc-a-button';
import StoreGame from '@global/store/game';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import GoldCoin from '../../../assets/gold-coin.svg';
import ConfigJson from '../../../config/index.json';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

const FooterAvatar = ({
  selected,
  handleBack,
  handleBuy,
  onUpdate,
  onShowModalNotMoney,
}: {
  selected: any;
  handleBack: () => void;
  handleBuy: (item: any) => Promise<any>;
  onUpdate?: (data: any) => void;
  onShowModalNotMoney?: () => void;
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('stateFlow changed:', stateFlow);
  }, [stateFlow]);

  console.log('Footer avatar: ', selected);

  const onSetSelected = async (item: any) => {
    if (isLoading) return; // Prevent multiple clicks while loading

    setIsLoading(true);

    try {
      let response;

      // Make the appropriate API call based on stateFlow
      switch (stateFlow) {
        case STATEFLOW.Avatar:
          response = await CustomAvatarAPI.Character.UpdateCharacter.Patch(item.id, true);
          break;
        case STATEFLOW.Pet:
          response = await CustomAvatarAPI.Pet.UpdatePet.Patch(item.id, true);
          break;
        case STATEFLOW.Frame:
          response = await CustomAvatarAPI.Frame.UpdateFrame.Patch(item.item_id, true);
          break;
        case STATEFLOW.Honer:
          response = await CustomAvatarAPI.ItemBadge.UpdateItemBadge.Patch(
            item.item_id,
            true,
          );
          break;
        default:
          break;
      }

      console.log('API Response:', response);

      // Only notify parent component if the API call was successful
      if (response && response.status_code === 200) {
        if (onUpdate) {
          onUpdate({
            selectedItem: item,
            stateFlow: stateFlow,
            isEquipped: true,
            apiResponse: response,
          });
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
      // Call the original handleBuy function
      const buyResponse = await handleBuy(item);

      // Only call onUpdate if the purchase was successful
      const isSuccess =
        buyResponse &&
        buyResponse.status_code === 200 &&
        (buyResponse.message === 'Bought' || (buyResponse.data && buyResponse.data.is_bought));

      if (isSuccess && onUpdate) {
        onUpdate({
          selectedItem: item,
          stateFlow: stateFlow,
          isBuying: true,
        });
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

  return (
    <div className="flex justify-center w-full h-20">
      {!(selected?.is_equipped === true || selected?.lock === true) &&
        stateFlow !== STATEFLOW.Avatar &&
        // Only show the button for Gift stateFlow and the item not already bought or locked
        (stateFlow === STATEFLOW.Gift ? (
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
        ) : (
          // For other stateFlow cases (e.g., Avatar, Pet, Frame, Honer)
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
              t('loading')
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
        ))}
    </div>
  );
};

export default FooterAvatar;
