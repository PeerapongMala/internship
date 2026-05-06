import StoreGame from '@global/store/game';
import ImageIconSelected from '../../../assets/icon-selected.png';
import { STATEFLOW } from '../../../interfaces/stateflow.interface';

interface ImageItemProps {
  image: {
    id: string;
    avatar_id: number;
    selected: boolean;
    name: string;
    src: string;
    price: number;
  };
  selected: {
    id?: string;
    avatar_id?: number;
  };
  onSelect: (image: any) => void;
}

const getClassNames = (image: any, selected: any, stateFlow: any) => {
  const baseClass =
    'flex flex-col relative w-full h-40 justify-center items-center cursor-pointer';

  // Use avatar_id for STATEFLOW.Avatar, otherwise fall back to id
  const selectedClass =
    stateFlow === STATEFLOW.Avatar
      ? image.avatar_id === selected?.avatar_id && image.selected
        ? 'bg-secondary'
        : 'bg-white'
      : image.id === selected?.id && image.selected
        ? 'bg-secondary'
        : 'bg-white';

  const imageClass =
    stateFlow === STATEFLOW.Pet ? 'absolute max-w-36 max-h-28 top-3' : 'max-w-36';
  const noSelectedClass = image.name === 'NoSelected' ? 'w-12 top-auto' : '';

  return {
    container: `${baseClass} ${selectedClass}`,
    image: `${imageClass} ${noSelectedClass}`,
  };
};

const ImageItem = ({ image, selected, onSelect }: ImageItemProps) => {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const classNames = getClassNames(image, selected, stateFlow);

  console.log('Image to check select: ', image);
  return (
    <div
      className={classNames.container}
      onClick={() => {
        // Pass the clicked image to onSelect
        onSelect(image);
      }}
    >
      {image?.selected && (
        <img className="absolute h-12 z-10" src={ImageIconSelected} alt="Selected Icon" />
      )}

      <img className={classNames.image} src={image.src} />

      {stateFlow === STATEFLOW.Pet && image.name !== 'NoSelected' && (
        <div className="absolute bottom-0 text-lg font-bold">{image.name}</div>
      )}
      {stateFlow === STATEFLOW.Gift && image.name !== 'NoSelected' && (
        <div className="bottom-0 text-2xl font-semibold">x{image.price}</div>
      )}
    </div>
  );
};

export default ImageItem;
