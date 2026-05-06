import { useTranslation } from 'react-i18next';

import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import StoreGame from '@global/store/game';
import ImageIconDownloadDone from '../../../assets/icon-download-done.svg';
import ImageIconDownloading from '../../../assets/icon-downloading.svg';
import ConfigJson from '../../../config/index.json';
import { StateFlow } from '../../../type';
import { Icon } from '../atoms/wc-a-icon';
import TabItem from '../atoms/wc-a-tab-item';
import { TextHeader } from '../atoms/wc-a-text';
import TabList from '../molecules/wc-a-tab-list';
import { useNavigate } from '@tanstack/react-router';

interface MenuHeaderProps {
  title: string;
  subjectId: string | undefined;
}

export function MenuHeader({ title, subjectId }: MenuHeaderProps) {
  const navigate = useNavigate();

  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const handleBackClick = () => {
    navigate({ to: `/lesson-state/${subjectId}`, replace: true });
  };

  return (
    <div className="bg-white rounded-t-[54px] flex flex-col">
      <div className="flex items-center py-6">
        <div className="absolute flex items-center justify-center w-[96px] h-[48px]">
          <ButtonBack buttonClassName="p-2 px-[10px]" onClick={handleBackClick} />
        </div>
        <div className="w-full text-center">
          <TextHeader>{title}</TextHeader>
        </div>
      </div>

      <TabList className="w-full h-[64px]">
        <TabItem
          onClick={() => {
            StoreGame.MethodGet().State.Flow.Set(StateFlow.ALL);
          }}
          isActive={stateFlow === StateFlow.ALL}
        >
          {t('menu_header_all_tab')}
        </TabItem>
        <TabItem
          onClick={() => {
            StoreGame.MethodGet().State.Flow.Set(StateFlow.DOWNLOADED);
          }}
          isActive={stateFlow === StateFlow.DOWNLOADED}
        >
          <div className="flex gap-2 items-center">
            <Icon src={ImageIconDownloadDone} className="!w-5 !h-5" />
            {t('menu_header_downloaded_tab')}
          </div>
        </TabItem>
        <TabItem
          onClick={() => {
            StoreGame.MethodGet().State.Flow.Set(StateFlow.UNDOWNLOADED);
          }}
          isActive={stateFlow === StateFlow.UNDOWNLOADED}
        >
          <div className="flex gap-2 items-center">
            <Icon src={ImageIconDownloading} className="!w-5 !h-5" />
            {t('menu_header_undownloaded_tab')}
          </div>
        </TabItem>
      </TabList>
    </div>
  );
}

export default MenuHeader;
