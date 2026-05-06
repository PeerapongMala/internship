import StoreGame from '@global/store/game';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';
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
  avatarData,
  petData,
  onUpdate,
}: {
  selectedCharacter: any;
  selectedPet: any;
  selectedBadge: any;
  selectedFrame: any;
  handleBack: () => void;
  isFrameActive: boolean;
  avatarData: any;
  petData: any;
  onUpdate?: (data?: any) => Promise<any>; // Optional callback to handle updates
}) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  console.log('Avatar component rendering with stateFlow:', stateFlow);
  console.log('selected custom avatar:', selectedPet);

  // Handle save action (equip item) - but implement it as handleBuy to match FooterAvatar's expected props
  const handleSaveAction = async (item: any) => {
    try {
      console.log('Handling save action for item:', item);

      // Call the parent's onUpdate function to handle the save/equip operation
      if (onUpdate) {
        console.log('Calling onUpdate for save action');

        // Then call onUpdate to handle the save operation and refresh data
        const updateResult = await onUpdate({
          item: item,
          stateFlow: stateFlow,
          action: 'save',
        });
        console.log('Save update completed with result:', updateResult);
        return updateResult;
      }

      return null;
    } catch (error) {
      console.error('Error in handleSaveAction:', error);
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
        const result = await onUpdate({
          ...updatedData,
          stateFlow: stateFlow,
        });
        console.log('Parent update completed with result:', result);
        return result;
      } catch (error) {
        console.error('Error during parent update:', error);
        return null;
      }
    }
    return null;
  };

  // Determine which item to pass as "selected" based on the stateFlow
  const selectedItem =
    stateFlow === STATEFLOW.Avatar
      ? selectedCharacter
      : stateFlow === STATEFLOW.Pet
        ? selectedPet
        : stateFlow === STATEFLOW.Frame
          ? selectedFrame
          : stateFlow === STATEFLOW.Honer
            ? selectedBadge
            : null;

  return (
    <div className="flex flex-col h-full justify-between z-20">
      <HeaderAvatar handleBack={handleBack} selectedHoner={selectedItem} />
      <BodyAvatar
        selectedCharacter={selectedCharacter}
        selectedPet={selectedPet}
        isFrameActive={isFrameActive}
        selectedFrame={selectedFrame}
        avatarData={avatarData}
        selected={selectedItem}
        petData={petData}
        onUpdate={handleChildUpdate}
      />
      <FooterAvatar
        selected={selectedItem}
        handleBack={handleBack}
        handleBuy={handleSaveAction} // We use handleSaveAction for the handleBuy prop
        onUpdate={handleChildUpdate}
      />
    </div>
  );
};

export default Avatar;
