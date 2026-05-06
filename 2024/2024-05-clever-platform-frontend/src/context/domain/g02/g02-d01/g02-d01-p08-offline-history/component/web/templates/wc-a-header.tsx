import { useTranslation } from 'react-i18next';

import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import StoreGame from '@global/store/game';
import ConfigJson from '../../../config/index.json';
import { StateTab } from '../../../types';
import { Tab } from '../atoms/wc-a-tab';
import { TextTitle } from '../atoms/wc-a-text';
import TabsList from '../molecules/wc-a-tabs-list';

export function DialogHeader() {
  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  return (
    <div className="flex flex-col">
      <div className="relative w-full h-20 flex items-center justify-center">
        <ButtonBack className="absolute left-4 p-2" buttonClassName="p-2" />
        <TextTitle>{t('title')}</TextTitle>
      </div>
      <TabsList>
        <Tab
          label={t('waiting_upload_tab_label')}
          isActive={stateFlow === StateTab.WaitingTab}
          onClick={() => {
            StoreGame.MethodGet().State.Flow.Set(StateTab.WaitingTab);
          }}
        />
        <Tab
          label={t('uploaded_history_tab_label')}
          isActive={stateFlow === StateTab.HistoryTab}
          onClick={() => {
            StoreGame.MethodGet().State.Flow.Set(StateTab.HistoryTab);
          }}
        />
      </TabsList>
    </div>
  );
}
