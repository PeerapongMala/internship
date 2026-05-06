import { useTranslation } from 'react-i18next';

import ImageIconSelected from '../../../assets/icon-selected.png';
import ConfigJson from '../../../config/index.json';

const ImageItemGift = ({ image }: { image: any }) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className={'grid grid-cols-10 w-full h-40 justify-center bg-white'}>
      <div className="col-span-3 relative flex justify-center items-center h-full w-full">
        <img className="absolute h-12 z-10" src={ImageIconSelected} />
        <img className="max-w-36" src={image.src} />
      </div>
      <div className="col-span-7 flex flex-col justify-between items-start h-full w-full py-4">
        <div className="text-3xl font-semibold">{image.name}</div>
        <div className="text-2xl">{image.description}</div>
        <div className="text-lg">
          {t('used')}: {image.date}
        </div>
      </div>
    </div>
  );
};

export default ImageItemGift;
