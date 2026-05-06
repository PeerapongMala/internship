import { useTranslation } from 'react-i18next';

import Button from '@global/component/web/atom/wc-a-button';
import ImageDownloadIcon from '../../../assets/icon-download.svg';
import ImageShareIcon from '../../../assets/icon-share.svg';
import ConfigJson from '../../../config/index.json';
import { Icon } from '../atoms/wc-a-icon';
import StoreGame from '@store/game';
import { StateFlow } from '../../../type';
import { useState } from 'react';

export function ShareMenu({
  onClickPhoto,
  onClickShare,
}: {
  onClickPhoto: () => void;
  onClickShare: () => void;
}) {
  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  return (
    <div className="flex w-full justify-between">
      <div className="flex gap-4 w-full">
        <Button
          className="!w-[15rem] !h-[5rem]"
          onClick={() => {
            console.log('save photo clicked');
            onClickPhoto();
          }}
        >
          <div className="flex gap-7 items-center text-2xl w-full p-6">
            <Icon src={ImageDownloadIcon} className="!w-[40px] !h-[40px]" />
            <div className="w-fit text-3xl">{t('save_profile_image_button')}</div>
          </div>
        </Button>
        <Button className="!w-[13rem] !h-[5rem]" onClick={onClickShare}>
          <div className="flex gap-7 items-center text-2xl w-full p-6">
            <Icon src={ImageShareIcon} className="!w-[40px] !h-[40px]" />
            <div className="w-fit text-3xl">{t('share_profile_button')}</div>
          </div>
        </Button>
      </div>

      <div className="">
        {stateFlow === StateFlow.Default && (
          <Button
            variant="primary"
            className="!w-[13rem] !h-[5rem]"
            textClassName="text-xl justify-center items-center"
            onClick={() => {
              StoreGame.MethodGet().State.Flow.Set(StateFlow.Anonymous);
            }}
          >
            <div className="w-fit text-3xl">{t('hide_identity_label')}</div>
          </Button>
        )}
        {stateFlow === StateFlow.Anonymous && (
          <Button
            variant="primary"
            className="!w-[13rem] !h-[5rem]"
            textClassName="text-xl justify-center items-center"
            onClick={() => {
              StoreGame.MethodGet().State.Flow.Set(StateFlow.Default);
            }}
          >
            <div className="w-fit text-3xl">{t('show_identity_label')}</div>
          </Button>
        )}
      </div>
    </div>
  );
}

export default ShareMenu;
