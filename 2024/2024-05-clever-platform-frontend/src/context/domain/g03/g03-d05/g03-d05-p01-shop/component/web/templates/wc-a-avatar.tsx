import BodyAvatar from '../molecules/wc-a-body-avatar';
import FooterAvatar from '../molecules/wc-a-footer-avatar';
import HeaderAvatar from '../molecules/wc-a-header-avatar';

const Avatar = ({
  selectedCharacter,
  selectedPet,
  selectedFrame,
  selectedBadge,
  handleBack,
  isFrameActive,
  selected,
  handleBuy,
  AvatarData,
  petData,
  // Optional callback function for handling updates
  onUpdate,
  onShowModalNotMoney,
}: {
  selectedCharacter: any;
  AvatarData: any;
  petData: any;
  selectedPet: any;
  selected: any;
  selectedFrame: any;
  selectedBadge: any;
  handleBack: () => void;
  handleBuy: (item: any) => Promise<any>; // Changed to Promise<any> to indicate it's async
  isFrameActive: boolean;
  onUpdate?: (data?: any) => Promise<any>; // Changed to Promise<any> to indicate it's async
  onShowModalNotMoney?: () => void;
}) => {
  console.log('selected prop at template: ', selected);
  console.log('selectedFrame prop at template: ', selectedFrame);

  // Create a wrapper for handleBuy that will call onUpdate if provided
  const handleBuyWithUpdate = async (item: any) => {
    try {
      // First, call the original handleBuy function and wait for it to complete
      console.log('Calling handleBuy for item:', item);
      const buyResponse = await handleBuy(item);
      console.log('Buy response received:', buyResponse);

      // Check if the buy was successful
      const isSuccess =
        buyResponse &&
        (buyResponse.status_code === 200 ||
          (buyResponse.data && buyResponse.data.is_bought));

      // Only update if the buy was successful
      if (isSuccess && onUpdate) {
        console.log('Buy successful, calling onUpdate');
        // Wait for the server state to update (give it a moment)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Then call onUpdate to refresh the data
        const updateResult = await onUpdate(item);
        console.log('Update completed with result:', updateResult);
        return updateResult;
      }

      return buyResponse;
    } catch (error) {
      console.error('Error in handleBuyWithUpdate:', error);
      return null;
    }
  };

  // Handle updates from child components
  const handleChildUpdate = async (updatedData: any) => {
    console.log('Child component triggered update:', updatedData);

    // Call the parent component's onUpdate if provided and return the result
    if (onUpdate) {
      console.log('Forwarding update request to parent');
      try {
        const result = await onUpdate(updatedData);
        console.log('Parent update completed with result:', result);
        return result;
      } catch (error) {
        console.error('Error during parent update:', error);
        return null;
      }
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full justify-between z-20">
      <HeaderAvatar handleBack={handleBack} selected={selected} />
      <BodyAvatar
        selectedCharacter={selectedCharacter}
        selectedPet={selectedPet}
        isFrameActive={isFrameActive}
        selectedFrame={selectedFrame}
        selectedBadge={selectedBadge}
        avatarData={AvatarData}
        selected={selected}
        handleBuy={handleBuyWithUpdate} // Use the async wrapper function
        petData={petData}
        onUpdate={handleChildUpdate} // Use our handler that correctly awaits and handles errors
        onShowModalNotMoney={onShowModalNotMoney}
      />
      <FooterAvatar
        selected={selected}
        handleBack={handleBack}
        handleBuy={handleBuyWithUpdate} // Use the async wrapper function
        onUpdate={handleChildUpdate} // Use our handler that correctly awaits and handles errors
        onShowModalNotMoney={onShowModalNotMoney}
      />
    </div>
  );
};

export default Avatar;
