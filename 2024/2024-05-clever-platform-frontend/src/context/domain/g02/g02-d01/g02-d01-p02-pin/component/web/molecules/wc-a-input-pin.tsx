import { useTranslation } from 'react-i18next';

import ConfigJson from '../../../config/index.json';

const InputPin = ({ pin, warning }: { pin: string; warning: boolean }) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  return (
    <div className="flex w-full px-10 items-center">
      <div className="text-2xl font-bold grow">{t('input_pin')}:</div>
      <div
        className={`grid grid-cols-4 w-[20rem] h-[70px] border-4 rounded-full focus:outline-none bg-white focus:border-secondary
        ${warning ? 'border-red-500' : 'border-secondary'}
        `}
      >
        <GridItem content={pin[0] || '-'} hasBorder={true} />
        <GridItem content={pin[1] || '-'} hasBorder={true} />
        <GridItem content={pin[2] || '-'} hasBorder={true} />
        <GridItem content={pin[3] || '-'} hasBorder={false} />
      </div>
    </div>
  );
};

const GridItem = ({ content, hasBorder }: { content: string; hasBorder: boolean }) => (
  <div
    className={`flex justify-center items-center text-3xl ${hasBorder ? 'border-r-2 border-r-secondary' : ''}`}
  >
    {content}
  </div>
);

export default InputPin;
