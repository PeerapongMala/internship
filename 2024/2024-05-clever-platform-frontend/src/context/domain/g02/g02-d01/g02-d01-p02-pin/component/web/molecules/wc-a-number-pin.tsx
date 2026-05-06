import Button from '@global/component/web/atom/wc-a-button';
import TextWithStroke from '@global/component/web/atom/wc-a-text-stroke';

const PinButton = ({ pin, onClick }: { pin: number; onClick: (pin: number) => void }) => (
  <div className="flex justify-center items-center h-20">
    <Button onClick={() => onClick(pin)} className="ml-2" size="circle">
      <div className="flex justify-center items-center h-[52px] w-[56px]">
        <TextWithStroke
          text={pin.toString()}
          className="flex text-2xl justify-center items-center"
          strokeColor="#5C23FD"
          strokeSize="2px"
        />
      </div>
    </Button>
  </div>
);

const NumberPin = ({ onClick }: { onClick: (pin: number) => void }) => {
  return (
    <div className="grid grid-cols-5 gap-2 gap-y-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((pin) => (
        <PinButton key={pin} pin={pin} onClick={onClick} />
      ))}
    </div>
  );
};

export default NumberPin;
