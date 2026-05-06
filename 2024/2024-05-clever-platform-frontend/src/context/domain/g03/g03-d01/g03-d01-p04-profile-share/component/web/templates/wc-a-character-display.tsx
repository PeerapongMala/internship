// import ThreeModelRenderer from '@component/game/model-renderer/custom-avatar-model-render';
import { ThreeModelRenderer } from '@global/component/game/model-renderer/character-model-renderer-share-profile';

import PetModelRenderer from '@component/game/model-renderer/pet-blob-model-renderer-no-spin-share-profile';

interface CharacterDisplayProps {
  modelSrc: string | null;
  selectedPet: string | null;
  className?: string;
}

export function CharacterDisplay({
  modelSrc,
  selectedPet,
  className,
}: CharacterDisplayProps) {
  console.log('Share profile pet: ', selectedPet);

  return (
    <div className={`${className} ml-2`}>
      <ThreeModelRenderer
        modelSrc={modelSrc as string}
        key={modelSrc || 'no-model'}
        className="absolute h-full w-full -top-16 -left-16"
      />

      <PetModelRenderer
        modelSrc={selectedPet || 'A'}
        className="absolute h-full w-full top-[35%] -right-[26%]"
      />
      {/* <PetModelRenderer
        modelSrc={'Sloth_A'}
        className="absolute h-full w-full top-[35%] -right-[26%]"
      /> */}
    </div>
  );
}

export default CharacterDisplay;
