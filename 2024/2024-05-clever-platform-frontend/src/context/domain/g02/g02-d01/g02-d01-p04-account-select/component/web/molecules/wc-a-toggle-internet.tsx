import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ConfigJson from '../../../config/index.json';
import ToggleButtonInternet from '../atoms/wc-a-toggle-internet';

const ToggleInternet = ({
  value,
  onChange,
  onClick,
}: {
  value?: boolean;
  onChange?: (value: boolean) => void;
  onClick?: () => void;
}) => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const [isChecked, setIsChecked] = useState(value || false);

  useEffect(() => {
    setIsChecked(value || false);
  }, [value]);

  const handleCheckboxChange = () => {
    if (value !== undefined) {
      return;
    }
    setIsChecked((prev) => {
      const newValue = value ? false : !prev;
      if (onChange) {
        onChange(newValue);
      }
      return newValue;
    });
  };

  return (
    <div className="flex flex-col items-center h-[148px] w-[31.5rem]">
      <div className="flex-1 pt-5 pl-10 text-center text-gray-800 bg-white rounded-[50px] h-full w-full">
        <div className="font-bold text-3xl">
          <span className="underline">{t('close')}</span>
          {t('offline_mode')}
        </div>
        <div className="flex gap-4 pt-3">
          <ToggleButtonInternet
            isChecked={isChecked}
            onChange={handleCheckboxChange}
            onClick={onClick}
          />
          <div className="text-2xl text-start">
            {t('use_this_mode_if_this_device')}
            <div className="font-bold">{t('not_personal_device')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleInternet;
