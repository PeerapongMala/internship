import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import InventoryAPI from '@domain/g03/g03-d01/local/api/index.ts';
import { createSoundController } from '@global/helper/sound';
import StoreGame from '@global/store/game';
import StoreBackgroundMusic from '@store/global/background-music';
import { useNavigate } from '@tanstack/react-router';
import API from '../local/api';
import Avatar from './component/web/templates/wc-a-avatar';
import ModalItem from './component/web/templates/wc-a-modal-item';
import Shop from './component/web/templates/wc-a-shop';
import ConfigJson from './config/index.json';
// import styles from './index.module.css';

import {
  AvatarOutput,
  BadgeOutput,
  CouponOutput,
  FrameOutput,
  InventoryInfo,
  PetOutput,
} from '../local/type';

import Button from '@component/web/atom/wc-a-button';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import ModalCommon from '@component/web/molecule/wc-m-modal-common';
import { SubjectListItem } from '@domain/g02/g02-d02/local/type';
import StoreGlobal from '@store/global';
import StoreSubjects from '@store/global/subjects';
import { mapBadgeResponseToOutput } from '../local/helper/mapDataBadge';
import { createAvatarMapper } from '../local/helper/mapDataByGroup'; // Updated import
import { mapCouponResponseToOutput } from '../local/helper/mapDataCoupon';
import { createPetMapper } from '../local/helper/mapDataPet';

enum STATEFLOW {
  Avatar = 1,
  Pet = 2,
  Frame = 3,
  Honer = 4,
  Gift = 5,
}

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [selectedCharacter, setSelectedCharacter] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalNotMoney, setShowModalNotMoney] = useState(false);
  const [selectedPet, setSelectedPet] = useState({});
  const [selectedFrame, setSelectedFrame] = useState({});
  const [selectedBadge, setSelectedBadge] = useState({});
  const [selectedCoupon, setSelectedCoupon] = useState({});
  const [isFrameActive, setIsFrameActive] = useState(false); // Add this line to manage isFrameActive state

  const [avatarData, setAvatarData] = useState<AvatarOutput[]>([]);
  const [petData, setPetData] = useState<PetOutput[]>([]);
  const [frameData, setFrameData] = useState<FrameOutput[]>([]);
  const [badgeData, setBadgeData] = useState<BadgeOutput[]>([]);
  const [couponData, setCouponData] = useState<CouponOutput[]>([]);

  const [imageAvatarList, setImageAvatarList] = useState<AvatarOutput[]>([]);
  const [imagePetList, setImagePetList] = useState<PetOutput[]>([]);
  const [imageFrameList, setImageFrameList] = useState<FrameOutput[]>([]);
  const [imageBadgeList, setImageBadgeList] = useState<BadgeOutput[]>([]);
  const [imageCouponList, setImageCouponList] = useState<CouponOutput[]>([]);

  const [inventoryInfo, setInventoryInfo] = useState<InventoryInfo>();
  const buySuccessSound = createSoundController('buy_1', {
    autoplay: false,
    loop: false,
    volume: 'sfx',
  });

  const buyFailedSound = createSoundController('cantBuy', {
    autoplay: false,
    loop: false,
    volume: 100,
  });

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']) as {
    currentSubject: SubjectListItem;
  };
  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  useEffect(() => {
    console.log('image list: ', imageAvatarList);
    console.log('avatar data: ', avatarData);

    // Find selected character from avatarData
    const characterSelected = avatarData.find((avatar) => avatar.selected);
    if (characterSelected) setSelectedCharacter(characterSelected);

    const petSelected = petData.find((image) => image.selected);
    if (petSelected) setSelectedPet(petSelected);

    const frameSelected = imageFrameList.find((image) => image.selected);
    if (frameSelected) setSelectedFrame(frameSelected);

    const badgeSelected = imageBadgeList.find((image) => image.selected);
    if (badgeSelected) setSelectedBadge(badgeSelected);

    const couponSelected = imageCouponList.find((image) => image.selected);
    if (couponSelected) setSelectedCoupon(couponSelected);
  }, [avatarData, petData, frameData, badgeData, couponData]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Avatar);

    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');

    InventoryAPI.mainMenu.GetInventoryInfo().then((response) => {
      const data = response.data;
      setInventoryInfo(data);
      console.log('Inventory info: ', data);
    });

    const mapAvatarWithTranslation = createAvatarMapper(t);

    // Then use these functions in your API call
    API.Avatar.AvatarAll.Get()
      .then(async (res) => {
        console.log('Avatar API Response:', res);

        if (res?.data && Array.isArray(res.data)) {
          // Create mapper with the full array of avatars
          const mapAvatarWithTranslation = createAvatarMapper(t, res.data);

          // Map the response data to the output format
          const mappedData = res.data.map(mapAvatarWithTranslation);
          console.log('Mapped Avatar Data with unlock logic applied:', mappedData);

          // Set state with the already processed data
          setImageAvatarList(mappedData);
          setAvatarData(mappedData);
        } else {
          console.error('Unexpected API response format:', res);
        }
      })
      .catch((err) => {
        console.error('Error fetching avatar data:', err);
      });

    API.Pet.PetAll.Get()
      .then(async (res) => {
        console.log('Pet API Response:', res);

        if (res?.data && Array.isArray(res.data)) {
          // Create mapper with translation support and full array of pets
          const mapPetWithTranslation = createPetMapper(t, res.data);

          // Map the response data to the output format with i18n
          const mappedData = res.data.map(mapPetWithTranslation);

          // Sort pets: bought ones first
          const sortedData = mappedData.sort((a, b) => {
            if (a.buy === b.buy) return 0;
            return a.buy ? -1 : 1; // a.buy === true should come before
          });

          console.log('Sorted Pet Data:', sortedData);

          const lastBought = sortedData
            .filter((item) => item.buy === true)
            .reduce((last, current) => (current.id > last ? current.id : last), 0);

          console.log('Last Bought Pet ID:', lastBought);

          const nextIdToUnlock = lastBought + 1;

          const updatedData = sortedData.map((item) => {
            if (item.id === nextIdToUnlock) {
              return { ...item, lock: false };
            }
            return item;
          });

          console.log('Updated Mapped Pet Data with i18n:', updatedData);

          setImagePetList(updatedData);
          setPetData(updatedData);
        } else {
          console.error('Unexpected API response format:', res);
        }
      })
      .catch((err) => {
        console.error('Error fetching pet data:', err);
      });

    API.Frame.FrameAll.Get(currentSubject?.subject_id)
      .then(async (res) => {
        console.log('Frame API Response:', res);

        if (res?.data && Array.isArray(res.data)) {
          const uniqueFrames = Array.from(
            new Map(res.data.map((item) => [item.id, item])).values(),
          );

          const mappedData = uniqueFrames.map((item) => ({
            ...item,
            id: item.id,
            buy: item.is_bought,
            // Make sure all fields needed by the Avatar component are present
            selected: item.selected || false,
          }));

          const sortedData = mappedData.sort((a, b) => {
            if (a.buy && !b.buy) return -1;
            if (!a.buy && b.buy) return 1;
            return a.id - b.id;
          });

          setImageFrameList(sortedData);
          setFrameData(sortedData);

          // First look for the equipped frame (is_equipped === true)
          const equippedFrame = sortedData.find((frame) => frame.is_equipped === true);

          // If there's an equipped frame, select it and activate it
          if (equippedFrame) {
            console.log('Found equipped frame:', equippedFrame);
            setSelectedFrame(equippedFrame);
            setIsFrameActive(true);
          }
          // Otherwise, look for frame marked as "selected"
          else {
            const frameSelected = sortedData.find((frame) => frame.selected);
            if (frameSelected) {
              setSelectedFrame(frameSelected);
            } else if (sortedData.length > 0) {
              // If no frame is marked as selected or equipped, select the first one
              setSelectedFrame(sortedData[0]);
            }
          }

          console.log('Sorted and updated frame list:', sortedData);
        } else {
          console.error('Unexpected API response format:', res);
        }
      })
      .catch((err) => {
        console.error('Error fetching frame data:', err);
      });

    API.Badge.BadgeAll.Get(currentSubject?.subject_id)
      .then(async (res) => {
        if (res?.data && Array.isArray(res.data)) {
          const mappedData = res.data.map(mapBadgeResponseToOutput);
          console.log('Mapped Badge Data:', mappedData);

          // Sort the items by price to determine the progression order
          const sortedItems = [...mappedData].sort((a, b) => a.price - b.price);

          // Find the index of the last bought item in the sorted array
          let lastBoughtItemIndex = -1;
          for (let i = sortedItems.length - 1; i >= 0; i--) {
            if (sortedItems[i].is_bought) {
              lastBoughtItemIndex = i;
              break;
            }
          }

          // Create a map of items that should be unlocked
          const unlockedItemIds = new Set<number>();

          // Unlock all bought items
          sortedItems.forEach((item) => {
            if (item.is_bought) {
              unlockedItemIds.add(item.id);
            }
          });

          // Unlock the next item after the last bought item
          if (
            lastBoughtItemIndex !== -1 &&
            lastBoughtItemIndex + 1 < sortedItems.length
          ) {
            unlockedItemIds.add(sortedItems[lastBoughtItemIndex + 1].id);
          }

          // Always unlock the first item if no items are bought
          if (lastBoughtItemIndex === -1 && sortedItems.length > 0) {
            unlockedItemIds.add(sortedItems[0].id);
          }

          // Apply unlocks to the original data order
          const updatedMappedData = mappedData.map((item) => {
            if (unlockedItemIds.has(item.id)) {
              return { ...item, lock: false };
            }
            return item;
          });

          console.log('Updated Mapped Badge Data:', updatedMappedData);

          setImageBadgeList(updatedMappedData);
          setBadgeData(updatedMappedData);
        } else {
          console.error('Unexpected API response format:', res);
        }
      })
      .catch((err) => {
        console.error('Error fetching Badge data:', err);
      });

    API.Coupon.CouponAll.Get(currentSubject?.subject_id)
      .then(async (res) => {
        console.log('Coupon API Response index:', res); // Log the full response

        if (res?.data && Array.isArray(res.data)) {
          const mappedData = res.data.map(mapCouponResponseToOutput); // Map response data
          console.log('Mapped Coupon Data:', mappedData);

          // Sort items to prioritize those with is_bought === true
          const sortedData = mappedData.sort((a, b) => {
            if (a.is_bought === b.is_bought) return 0; // Keep the original order if both are the same
            return a.is_bought ? -1 : 1; // Move items with is_bought === true to the front
          });

          console.log('Sorted Coupon Data:', sortedData);

          console.log('Updated Mapped Coupon Data:', sortedData);

          setImageCouponList(sortedData); // Update the state
          setCouponData(sortedData);
        } else {
          console.error('Unexpected API response format:', res);
        }
      })
      .catch((err) => {
        console.error('Error fetching Coupon data:', err);
      });

    API.AvatarModelAssets.ModelAssets.Get().then(async (res) => {
      console.log('Avatar model assets response:', res);

      // Check if data exists and is an array
      if (res.data && Array.isArray(res.data)) {
        console.log('Avatar models data:', res.data);

        // Now TypeScript knows it's an array
        console.log('Total models:', res.data.length);

        // If you want to access a specific model
        if (res.data.length > 0) {
          console.log('First model:', res.data[0]);
          console.log('Model ID:', res.data[0].model_id);
          console.log('Model URL:', res.data[0].url);
        }

        // Filter models by a specific pattern
        const characterModels = res.data.filter(
          (model) => model && model.model_id && model.model_id.includes('character'),
        );
        console.log('Character models:', characterModels.length);

        const petModels = res.data.filter(
          (model) =>
            model &&
            model.model_id &&
            (model.model_id.includes('_A') || model.model_id.includes('_B')),
        );
        console.log('Pet models:', petModels.length);
      } else {
        console.log('Data is not an array or is empty:', res.data);
      }
    });
  }, [t]);

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const dialogStyle: React.CSSProperties = {
    // width: `${374 * multipleScale}px`,
    // height: `${220 * multipleScale}px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '10px',
  };

  const onHandleClickMenu = (menu: number) => {
    StoreGame.MethodGet().State.Flow.Set(menu);
    switch (menu) {
      case STATEFLOW.Avatar:
        setImageAvatarList(avatarData);
        break;
      case STATEFLOW.Pet:
        setImagePetList(petData);
        break;
      case STATEFLOW.Frame:
        setImageFrameList(frameData);
        break;
      case STATEFLOW.Honer:
        setImageBadgeList(badgeData);
        break;
      case STATEFLOW.Gift:
        setImageCouponList(couponData);
        break;
      default:
        break;
    }
  };

  const handleBuy = async (item: any) => {
    let response;

    try {
      console.log('Buying item:', item);

      switch (stateFlow) {
        case STATEFLOW.Avatar:
          if (item.lock) {
            console.warn('Avatar is locked. Cannot proceed with purchase:', item);
            return null;
          }

          response = await API.Avatar.BuyAvatar.Post(item.id);

          if (response.status_code === 409) {
            buyFailedSound.play();
            setShowModalNotMoney(true);
          } else if (response.status_code === 500) {
            buyFailedSound.play();
          } else {
            buySuccessSound.play();
          }

          console.log('Buy Avatar Response:', response);

          // Refresh inventory info to update coin count
          refreshInventoryInfo();

          // Return the response so the child component can access it
          return response;

        case STATEFLOW.Pet:
          if (item.lock) {
            console.warn('Pet is locked. Cannot proceed with purchase:', item);
            return null;
          }

          response = await API.Pet.BuyPet.Post(item.id);

          if (response.status_code === 409) {
            buyFailedSound.play();
            setShowModalNotMoney(true);
          } else if (response.status_code === 500) {
            buyFailedSound.play();
          } else {
            buySuccessSound.play();
          }

          console.log('Buy Pet Response:', response);

          // Refresh inventory info
          // refreshInventoryInfo();

          if (
            response.status_code === 200 &&
            (response.message === 'Bought' || (response.data && response.data.is_bought))
          ) {
            console.log('Pet purchase successful:', response.message);
          } else {
            console.error('Pet purchase failed', response.message);
          }

          return response;

        case STATEFLOW.Frame:
          response = await API.Frame.BuyFrame.Post(item.id);

          if (response.status_code === 409) {
            buyFailedSound.play();
            setShowModalNotMoney(true);
          } else if (response.status_code === 500) {
            buyFailedSound.play();
          } else {
            buySuccessSound.play();
          }

          console.log('Buy frame Response:', response);

          // Refresh inventory info
          refreshInventoryInfo();

          if (
            response.status_code === 200 &&
            (response.message === 'Bought' || (response.data && response.data.is_bought))
          ) {
            console.log('Frame purchase successful:', response.message);
          } else {
            console.error('Frame purchase failed', response.message);
          }

          return response;

        case STATEFLOW.Honer:
          response = await API.Badge.BuyBadge.Post(item.id);

          if (response.status_code === 409) {
            buyFailedSound.play();
            setShowModalNotMoney(true);
          } else if (response.status_code === 500) {
            buyFailedSound.play();
          } else {
            buySuccessSound.play();
          }

          console.log('Buy badge Response:', response);

          // Refresh inventory info
          refreshInventoryInfo();

          if (
            response.status_code === 200 &&
            (response.message === 'Bought' || (response.data && response.data.is_bought))
          ) {
            console.log('Badge purchase successful:', response.message);
          } else {
            console.error('Badge purchase failed', response.message);
          }

          return response;

        case STATEFLOW.Gift:
          response = await API.Coupon.BuyCoupon.Post(item.id);

          if (response.status_code === 409) {
            buyFailedSound.play();
            setShowModalNotMoney(true);
          } else if (response.status_code === 500) {
            buyFailedSound.play();
          } else {
            buySuccessSound.play();
          }

          console.log('Buy coupon Response:', response);

          // Refresh inventory info
          refreshInventoryInfo();

          if (
            response.status_code === 200 &&
            (response.message === 'Bought' || (response.data && response.data.is_bought))
          ) {
            console.log('Coupon purchase successful:', response.message);
          } else {
            console.error('Coupon purchase failed', response.message);
          }

          return response;

        default:
          console.error('Unknown state flow:', stateFlow);
          return null;
      }
    } catch (error) {
      //console.error(`Error buying ${itemType}:`, error);
      buyFailedSound.play();
      return null;
    }
  };

  const selectedItem =
    stateFlow === STATEFLOW.Avatar
      ? selectedCharacter
      : stateFlow === STATEFLOW.Pet
        ? selectedPet
        : stateFlow === STATEFLOW.Frame
          ? selectedFrame
          : stateFlow === STATEFLOW.Honer
            ? selectedBadge // Assuming `selectedHoner` exists
            : stateFlow === STATEFLOW.Gift
              ? selectedCoupon // Assuming `selectedGift` exists
              : null; // Default to null

  const refreshInventoryInfo = () => {
    InventoryAPI.mainMenu.GetInventoryInfo().then((response) => {
      const data = response.data;
      setInventoryInfo(data);
      console.log('Updated Inventory info: ', data);
    });
  };

  const refreshAvatarData = async () => {
    try {
      console.log('Refreshing avatar data...');

      // Store current selection before refresh
      const currentSelectedId =
        selectedItem && 'id' in selectedItem ? selectedItem.id : undefined;

      const res = await API.Avatar.AvatarAll.Get();
      console.log('Updated Avatar API Response:', res);

      if (res?.data && Array.isArray(res.data)) {
        const mapAvatarWithTranslation = createAvatarMapper(t, res.data);
        const mappedData = res.data.map(mapAvatarWithTranslation);

        console.log('Refreshed avatar data:', mappedData);

        // First, look for the equipped avatar to ensure we have the latest state
        const equippedAvatar = mappedData.find((avatar) => avatar.is_equipped === true);

        // Update the state with the new data
        setImageAvatarList(mappedData);
        setAvatarData(mappedData);

        // If there's an equipped avatar, make sure it's selected
        if (equippedAvatar) {
          console.log('Setting equipped avatar as selected:', equippedAvatar);
          setSelectedCharacter(equippedAvatar);
        }
        // Otherwise, preserve current selection if it exists
        else if (currentSelectedId && stateFlow === STATEFLOW.Avatar) {
          const currentlySelectedItem = mappedData.find(
            (item) => item.id === currentSelectedId,
          );
          if (currentlySelectedItem) {
            setSelectedCharacter(currentlySelectedItem);
          }
        }

        return mappedData; // Return the data for potential further use
      }
    } catch (err) {
      console.error('Error refreshing avatar data:', err);
    }
    return null;
  };

  const refreshPetData = async () => {
    // Store current selection before refresh
    const currentSelectedId =
      selectedItem && 'id' in selectedItem ? selectedItem.id : undefined;

    try {
      const res = await API.Pet.PetAll.Get();
      console.log('Updated Pet API Response:', res);

      if (res?.data && Array.isArray(res.data)) {
        // Create mapper with translation support and full array of pets
        const mapPetWithTranslation = createPetMapper(t, res.data);

        // Map the response data with i18n support
        const mappedData = res.data.map(mapPetWithTranslation);

        setImagePetList(mappedData);
        setPetData(mappedData);

        // First check if we need to preserve the current UI selection
        if (currentSelectedId && stateFlow === STATEFLOW.Pet) {
          const currentlySelectedItem = mappedData.find(
            (item) => item.id === currentSelectedId,
          );
          if (currentlySelectedItem) {
            setSelectedPet(currentlySelectedItem);
          }
        } else {
          // Only fall back to API's "selected" item if we don't have a UI selection to preserve
          const petSelected = mappedData.find((pet) => pet.selected);
          if (petSelected) setSelectedPet(petSelected);
        }

        return mappedData;
      }
    } catch (err) {
      console.error('Error refreshing pet data:', err);
    }
    return null;
  };

  const refreshFrameData = async () => {
    // Store current selection before refresh
    const currentSelectedId =
      selectedItem && 'id' in selectedItem ? selectedItem.id : undefined;

    try {
      const res = await API.Frame.FrameAll.Get(currentSubject?.subject_id);
      console.log('Updated Frame API Response:', res);

      if (res?.data && Array.isArray(res.data)) {
        const uniqueFrames = Array.from(
          new Map(res.data.map((item) => [item.id, item])).values(),
        );

        const mappedData = uniqueFrames.map((item) => ({
          ...item,
          id: item.id,
          buy: item.is_bought,
          // Make sure the frame data has all required fields
          selected: item.selected || false,
          // Add any other fields that might be missing
        }));

        const sortedData = mappedData.sort((a, b) => {
          if (a.buy && !b.buy) return -1;
          if (!a.buy && b.buy) return 1;
          return a.id - b.id;
        });

        setImageFrameList(sortedData);
        setFrameData(sortedData);

        // First check if we need to preserve the current UI selection
        if (currentSelectedId && stateFlow === STATEFLOW.Frame) {
          const currentlySelectedItem = sortedData.find(
            (item) => item.id === currentSelectedId,
          );
          if (currentlySelectedItem) {
            setSelectedFrame(currentlySelectedItem);
            return sortedData; // Skip the next part
          }
        }

        // Look for the equipped frame first
        const equippedFrame = sortedData.find((frame) => frame.is_equipped === true);

        if (equippedFrame) {
          console.log('Found equipped frame during refresh:', equippedFrame);
          setSelectedFrame(equippedFrame);
          setIsFrameActive(true);
        }
        // Otherwise fall back to API's "selected" item
        else {
          const frameSelected = sortedData.find((frame) => frame.selected);
          if (frameSelected) {
            setSelectedFrame(frameSelected);
          } else if (sortedData.length > 0) {
            // If no frame is marked as selected, select the first one
            setSelectedFrame(sortedData[0]);
          }
        }

        return sortedData;
      }
    } catch (err) {
      console.error('Error refreshing frame data:', err);
    }
    return null;
  };

  const refreshBadgeData = async () => {
    // Store current selection before refresh
    const currentSelectedId =
      selectedItem && 'id' in selectedItem ? selectedItem.id : undefined;

    try {
      const res = await API.Badge.BadgeAll.Get(currentSubject?.subject_id);

      if (res?.data && Array.isArray(res.data)) {
        const mappedData = res.data.map(mapBadgeResponseToOutput);

        // Apply your badge unlock logic here (same as in useEffect)
        const sortedItems = [...mappedData].sort((a, b) => a.price - b.price);
        let lastBoughtItemIndex = -1;
        for (let i = sortedItems.length - 1; i >= 0; i--) {
          if (sortedItems[i].is_bought) {
            lastBoughtItemIndex = i;
            break;
          }
        }

        const unlockedItemIds = new Set();
        sortedItems.forEach((item) => {
          if (item.is_bought) {
            unlockedItemIds.add(item.id);
          }
        });

        if (lastBoughtItemIndex !== -1 && lastBoughtItemIndex + 1 < sortedItems.length) {
          unlockedItemIds.add(sortedItems[lastBoughtItemIndex + 1].id);
        }

        if (lastBoughtItemIndex === -1 && sortedItems.length > 0) {
          unlockedItemIds.add(sortedItems[0].id);
        }

        const updatedMappedData = mappedData.map((item) => {
          if (unlockedItemIds.has(item.id)) {
            return { ...item, lock: false };
          }
          return item;
        });

        setImageBadgeList(updatedMappedData);
        setBadgeData(updatedMappedData);

        // First check if we need to preserve the current UI selection
        if (currentSelectedId && stateFlow === STATEFLOW.Honer) {
          const currentlySelectedItem = updatedMappedData.find(
            (item) => item.id === currentSelectedId,
          );
          if (currentlySelectedItem) {
            setSelectedBadge(currentlySelectedItem);
            return updatedMappedData;
          }
        }

        // Only fall back to API's "selected" item if we don't have a UI selection to preserve
        const badgeSelected = updatedMappedData.find((badge) => badge.selected);
        if (badgeSelected) setSelectedBadge(badgeSelected);

        return updatedMappedData;
      }
    } catch (err) {
      console.error('Error refreshing badge data:', err);
    }
    return null;
  };

  const refreshCouponData = async () => {
    // Store current selection before refresh
    const currentSelectedId =
      selectedItem && 'id' in selectedItem ? selectedItem.id : undefined;

    try {
      const res = await API.Coupon.CouponAll.Get(currentSubject?.subject_id);
      console.log('Updated Coupon API Response:', res);

      if (res?.data && Array.isArray(res.data)) {
        const mappedData = res.data.map(mapCouponResponseToOutput);
        const sortedData = mappedData.sort((a, b) => {
          if (a.is_bought === b.is_bought) return 0;
          return a.is_bought ? -1 : 1;
        });

        setImageCouponList(sortedData);
        setCouponData(sortedData);

        // First check if we need to preserve the current UI selection
        if (currentSelectedId && stateFlow === STATEFLOW.Gift) {
          const currentlySelectedItem = sortedData.find(
            (item) => item.id === currentSelectedId,
          );
          if (currentlySelectedItem) {
            setSelectedCoupon(currentlySelectedItem);
            return sortedData;
          }
        }

        // Only fall back to API's "selected" item if we don't have a UI selection to preserve
        const couponSelected = sortedData.find((coupon) => coupon.selected);
        if (couponSelected) setSelectedCoupon(couponSelected);

        return sortedData;
      }
    } catch (err) {
      console.error('Error refreshing coupon data:', err);
    }
    return null;
  };

  // Add this function to refresh all data
  const refreshAllData = async () => {
    console.log('Starting complete data refresh...');

    try {
      // First refresh inventory info
      const inventoryPromise = InventoryAPI.mainMenu
        .GetInventoryInfo()
        .then((response) => {
          const data = response.data;
          setInventoryInfo(data);
          console.log('Updated Inventory info: ', data);
          return data;
        });

      // Prepare the appropriate data refresh based on current stateFlow
      let dataPromise;

      switch (stateFlow) {
        case STATEFLOW.Avatar:
          console.log('Refreshing Avatar data...');
          dataPromise = refreshAvatarData();
          break;
        case STATEFLOW.Pet:
          console.log('Refreshing Pet data...');
          dataPromise = refreshPetData();
          break;
        case STATEFLOW.Frame:
          console.log('Refreshing Frame data...');
          dataPromise = refreshFrameData();
          break;
        case STATEFLOW.Honer:
          console.log('Refreshing Badge data...');
          dataPromise = refreshBadgeData();
          break;
        case STATEFLOW.Gift:
          console.log('Refreshing Coupon data...');
          dataPromise = refreshCouponData();
          break;
      }

      // Wait for both promises to complete
      await Promise.all([inventoryPromise, dataPromise]);

      console.log('All data refreshed successfully');

      // Return the refreshed data
      return true;
    } catch (error) {
      console.error('Error during data refresh:', error);
      return false;
    }
  };

  const onSetSelectedCharacter = (character: any) => {
    setSelectedCharacter(character);
    setIsFrameActive(false); // Deactivate frame when selecting character
  };

  const onSetSelectedPet = (pet: any) => {
    setSelectedPet(pet);
    setIsFrameActive(false); // Deactivate frame when selecting pet
  };

  const onSetSelectedFrame = (frame: any) => {
    setSelectedFrame(frame);
    setIsFrameActive(true); // Activate frame when selecting frame
  };

  const onSetSelectedBadge = (badge: any) => {
    setSelectedBadge(badge);
    setIsFrameActive(false); // Deactivate frame when selecting frame
  };

  const onSetSelectedCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
    setIsFrameActive(false); // Deactivate frame when selecting frame
  };

  const handleSelect = (item: any) => {
    if (stateFlow === STATEFLOW.Avatar) {
      onSetSelectedCharacter(item);
    } else if (stateFlow === STATEFLOW.Pet) {
      onSetSelectedPet(item);
    } else if (stateFlow === STATEFLOW.Frame) {
      onSetSelectedFrame(item);
    } else if (stateFlow === STATEFLOW.Honer) {
      onSetSelectedBadge(item);
    } else if (stateFlow === STATEFLOW.Gift) {
      onSetSelectedCoupon(item);
    }
    console.log('handleSelect: ', item);
  };

  // Add a new useEffect to handle default selection when stateFlow changes
  useEffect(() => {
    // Get the appropriate list based on current stateFlow
    let currentList: any[] = [];
    switch (stateFlow) {
      case STATEFLOW.Avatar:
        currentList = imageAvatarList;
        break;
      case STATEFLOW.Pet:
        currentList = imagePetList;
        break;
      case STATEFLOW.Frame:
        currentList = imageFrameList;
        break;
      case STATEFLOW.Honer:
        currentList = imageBadgeList;
        break;
      case STATEFLOW.Gift:
        currentList = imageCouponList;
        break;
      default:
        break;
    }

    // Check if we need to set a default selection
    if (currentList.length > 0) {
      // First try to find an equipped item
      const equippedItem = currentList.find((item) => item.is_equipped);

      // If there's an equipped item, select it
      if (equippedItem) {
        handleSelect(equippedItem);
      }
      // Otherwise check if we already have a selection
      else {
        const hasSelection =
          (stateFlow === STATEFLOW.Avatar && Object.keys(selectedCharacter).length > 0) ||
          (stateFlow === STATEFLOW.Pet && Object.keys(selectedPet).length > 0) ||
          (stateFlow === STATEFLOW.Frame && Object.keys(selectedFrame).length > 0) ||
          (stateFlow === STATEFLOW.Honer && Object.keys(selectedBadge).length > 0) ||
          (stateFlow === STATEFLOW.Gift && Object.keys(selectedCoupon).length > 0);

        // If no selection exists, select the first item
        if (!hasSelection) {
          console.log(
            `No selection for stateFlow ${stateFlow}, selecting first item:`,
            currentList[0],
          );
          handleSelect(currentList[0]);
        }
      }
    }
  }, [
    stateFlow,
    imageAvatarList,
    imagePetList,
    imageFrameList,
    imageBadgeList,
    imageCouponList,
  ]);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: '/main-menu', viewTransition: true });
  };

  const itemType =
    stateFlow === STATEFLOW.Avatar
      ? 'character'
      : stateFlow === STATEFLOW.Pet
        ? 'pet'
        : stateFlow === STATEFLOW.Frame
          ? 'frame'
          : stateFlow === STATEFLOW.Honer
            ? 'badge'
            : stateFlow === STATEFLOW.Gift
              ? 'coupon'
              : ''; // Default to an empty string

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1 body">
      {/* Modal for insufficient funds - Using wc-m-modal-common */}
      <ModalCommon
        title={t('insufficient_funds')}
        isVisible={showModalNotMoney}
        setVisibleModal={setShowModalNotMoney}
        className="w-[550px]"
        overlay={true}
        openOnLoad={false}
        closeOnClickOutside={true}
        customBody={
          <div className="px-8 py-6 bg-white border-[#FCD401] border-y-2 border-dashed">
            <p className="text-2xl text-center text-gray-700 whitespace-pre-line">
              {t('insufficient_funds_message')}
            </p>
          </div>
        }
        customFooter={
          <div className="flex gap-4 w-full pt-6 pb-6 px-8 bg-white rounded-b-[55px]">
            <Button
              variant="primary"
              onClick={() => setShowModalNotMoney(false)}
              className="flex-1"
            >
              <p className="text-xl font-bold">{t('ok') || 'ตกลง'}</p>
            </Button>
          </div>
        }
      />
      <SafezonePanel className="absolute inset-0 bg-white bg-opacity-0 text-black">
        <ModalItem
          setShowModal={setShowModal}
          showModal={showModal}
          selectedItem={selectedItem} // Pass the currently selected item (character, pet, frame, etc.)
          itemType={itemType} // Pass the type of the selected item ('character', 'pet', 'frame', etc.)
        />

        <div
          className={`absolute h-[calc(100%-120px)] w-[calc(100%-790px)] top-[68px] left-[5.5rem] z-10`}
        >
          <Avatar
            selected={selectedItem} // Update to pass correct selected state
            selectedCharacter={selectedCharacter}
            selectedPet={selectedPet}
            selectedFrame={selectedFrame}
            selectedBadge={selectedBadge}
            handleBack={handleBack}
            handleBuy={handleBuy}
            isFrameActive={isFrameActive} // Add this line to pass isFrameActive to Avatar
            AvatarData={avatarData}
            petData={petData}
            onUpdate={refreshAllData}
            onShowModalNotMoney={() => setShowModalNotMoney(true)}
          />
        </div>
        <div
          className={`absolute h-[calc(100%-110px)] w-[calc(100%-625px)] top-[50px] left-[36.5rem]`}
        >
          <Shop
            STATEFLOW={STATEFLOW}
            onHandleClickMenu={onHandleClickMenu}
            stateFlow={stateFlow}
            imageList={
              stateFlow === STATEFLOW.Avatar
                ? imageAvatarList
                : stateFlow === STATEFLOW.Pet
                  ? imagePetList
                  : stateFlow === STATEFLOW.Frame
                    ? imageFrameList
                    : stateFlow === STATEFLOW.Honer
                      ? imageBadgeList
                      : stateFlow === STATEFLOW.Gift
                        ? imageCouponList
                        : [] // Default empty array for unexpected values
            }
            onSelect={handleSelect}
            selected={selectedItem}
            setShowModal={setShowModal}
            inventory={inventoryInfo}
            handleBuy={handleBuy}
            onShowModalNotMoney={() => setShowModalNotMoney(true)}
          />
        </div>


      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
