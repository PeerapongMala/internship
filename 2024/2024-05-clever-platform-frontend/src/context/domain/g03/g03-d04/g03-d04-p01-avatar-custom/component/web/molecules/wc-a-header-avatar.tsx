import ImageIconCart from '@global/assets/icon-cart.svg';
import Button from '@global/component/web/atom/wc-a-button';
import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import StoreGame from '@global/store/game';
import { useNavigate } from '@tanstack/react-router';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

const HeaderAvatar = ({
  handleBack,
  selectedHoner,
}: {
  handleBack: () => void;
  selectedHoner: any;
}) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const navigate = useNavigate();

  const handleSwitch = () => {
    navigate({ to: '/shop', viewTransition: true });
  };

  console.log("selected honor: ", selectedHoner)

  return (
    <div className="flex justify-between items-center w-full px-4 z-40">
      <ButtonBack
        className="relative h-[88px] w-[72px] pb-4 mr-1 top-[10%]"
        onClick={handleBack}
      />
      {/* {stateFlow === STATEFLOW.Avatar && (
        <ButtonPrevNext
          text={'LV.2'}
          onPrev={() => console.log('prev')}
          onNext={() => console.log('next')}
        />
      )} */}
      {/* {stateFlow === STATEFLOW.Honer &&
        selectedHoner?.src &&
        selectedHoner?.name !== 'NoSelected' && (
          <img src={selectedHoner.src} alt="honer" className="h-16" />
        )} */}
      {stateFlow === STATEFLOW.Honer && Object.keys(selectedHoner).length > 0 && selectedHoner.id !== 0 && (
        <>
          {console.log("selected honor: ", selectedHoner)}
          <div className="h-28 flex items-center justify-center text-lg font-bold text-gray-600">
            {selectedHoner.text || (
              <div className="z-10">
                <img
                  src={selectedHoner.template_path}
                  alt="Badge background"
                  className="absolute w-[55%] h-[15%] z-20 top-[3%] left-[21%]"
                />
                <img
                  src={selectedHoner.image_url}
                  alt="Badge image"
                  className="absolute w-[14%] h-[12%] top-[3%] left-[22%] z-30"
                />
                <div className="w-full absolute z-30 text-cente pl-2">
                  <p className="absolute text-white -translate-x-1/2 text-[15px] -top-[14px]">
                    {selectedHoner.badge_description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <Button
        // onClick={() => (location.href = 'shop')}
        onClick={handleSwitch}
        height="76px"
        width="76px"
        variant="primary"
        className="mr-4"
      >
        <img className="h-10 w-10" src={ImageIconCart} />
      </Button>
    </div>
  );
};

export default HeaderAvatar;
