import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ToggleButtonInternet from '../../atom/wc-a-button-toggle-internet';

const ToggleInternet = ({
  value,
  onChange,
  onClick,
}: {
  value?: boolean;
  onChange?: (value: boolean) => void;
  onClick?: () => void;
}) => {
  const { t, i18n } = useTranslation(['global']);

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
    <div className="flex flex-col items-center h-[9.5rem] w-[31.5rem]">
      <div className="flex-1 pt-3 pl-10 text-center text-gray-800 bg-white rounded-[50px] h-full w-full">
        <div className="font-bold text-2xl grid grid-cols-4 gap-2 items-center">
          <div className="col-span-1">
            <ToggleButtonInternet
              isChecked={isChecked}
              onChange={handleCheckboxChange}
              onClick={onClick}
            />
          </div>
          <div className='col-span-3 text-start'>
            {!value ? (
              <p className="">
                <span className="underline">{t('account_not_remembered')}</span>
                <span className=""> {t('for_play_offline_mode')}</span>
              </p>
            ) : (
              <p className="">
                <span className="underline">{t('account_remembered')}</span>
                <span className=""> {t('for_play_offline_mode')}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col pt-2 items-center pr-4">
          <div className="text-xl text-start flex gap-1">
            {t('use_this_mode_if_this_device')}
            <span className="underline">{t('device_personal')}</span>
            <span>{t('only')}</span>
          </div>
          <div className="text-xl text-start flex gap-1">
            {t('please_play_online')}
            <span className="underline">{t('not_personal_device')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleInternet;
