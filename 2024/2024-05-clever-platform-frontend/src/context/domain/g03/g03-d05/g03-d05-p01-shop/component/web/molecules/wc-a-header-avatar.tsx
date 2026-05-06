import ImageIconHanger from '@global/assets/icon-hanger.svg';
import Button from '@global/component/web/atom/wc-a-button';
import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import StoreGame from '@global/store/game';
import { useNavigate } from '@tanstack/react-router';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

// --- Add the interfaces defined above here ---
interface Character {
  id: string | number;
  model_src: string;
  name?: string;
  level?: number;
}

interface HeaderAvatarProps {
  handleBack: () => void;
  selected: any;
}
// --- End Interfaces ---

const HeaderAvatar = ({
  handleBack,
  selected, // Only receive selectedCharacter now
}: HeaderAvatarProps) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const navigate = useNavigate();
  console.log('Header selectedCharacter: ', selected);

  const handleSwitch = () => {
    navigate({ to: '/avatar-custom', viewTransition: true });
  };

  // Determine the text for the button, potentially based on the character
  // Using optional chaining and nullish coalescing for safety
  const buttonText = `LV.${selected?.id ?? '?'}`;
  // Or keep it static: const buttonText = 'LV.2';

  return (
    <div className="flex justify-between items-center w-full px-4 z-20">
      <ButtonBack className="h-[80px] w-[4rem] pb-4 mr-4" onClick={handleBack} />

      {stateFlow === STATEFLOW.Honer && (
        <div className="h-28 flex items-center justify-center text-lg font-bold text-gray-600">
          {selected.text || (
            <div className="z-10">
              <img
                src={selected.template_path}
                alt="Badge background"
                className="absolute w-[55%] h-[15%] z-20 top-[3%] left-[21%]"
              />
              <img
                src={selected.image_url}
                alt="Badge image"
                className="absolute w-[14%] h-[12%] top-[3%] left-[22%] z-30"
              />
              <div className="w-full absolute z-30 text-cente pl-2">
                <p className="absolute text-white -translate-x-1/2 text-[15px] -top-[14px]">
                  {selected.badge_description}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <Button
        onClick={handleSwitch}
        height="76px"
        width="76px"
        variant="tertiary"
        className="mr-4"
      >
        <img className="h-10 w-10" src={ImageIconHanger} alt="Customize Avatar" />
      </Button>
    </div>
  );
};

export default HeaderAvatar;
