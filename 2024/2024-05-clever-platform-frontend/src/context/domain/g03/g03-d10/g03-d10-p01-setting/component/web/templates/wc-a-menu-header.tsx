import { useTranslation } from 'react-i18next';

import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import StoreGame from '@global/store/game';
import ConfigJson from '../../../config/index.json';
import { StateFlow } from '../../../type';
import TabItem from '../atoms/wc-a-tab-item';
import TabList from '../molecules/wc-a-tab-list';

export function MenuHeader() {
  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  return (
    <div className="bg-white rounded-t-[54px] flex justify-center items-center">
      <div className="relative flex items-center justify-center w-[96px] h-[48px]">
        <ButtonBack buttonClassName="p-2 px-[9px]" />
      </div>
      <TabList className="w-full h-full">
        <TabItem
          onClick={() => {
            StoreGame.MethodGet().State.Flow.Set(StateFlow.Setting);
          }}
          isActive={stateFlow === StateFlow.Setting}
        >
          {t('tab_menu_setting')}
        </TabItem>
        <TabItem
          onClick={() => {
            StoreGame.MethodGet().State.Flow.Set(StateFlow.Download);
          }}
          isActive={stateFlow === StateFlow.Download}
        >
          {t('tab_menu_download')}
        </TabItem>
        <TabItem
          onClick={() => {
            StoreGame.MethodGet().State.Flow.Set(StateFlow.Account);
          }}
          isActive={stateFlow === StateFlow.Account}
        >
          {t('tab_menu_account')}
        </TabItem>
        <TabItem
          onClick={() => {
            StoreGame.MethodGet().State.Flow.Set(StateFlow.AboutUs);
          }}
          isActive={stateFlow === StateFlow.AboutUs}
        >
          {t('tab_menu_about_us')}
        </TabItem>
      </TabList>
    </div>
  );
}

export default MenuHeader;
