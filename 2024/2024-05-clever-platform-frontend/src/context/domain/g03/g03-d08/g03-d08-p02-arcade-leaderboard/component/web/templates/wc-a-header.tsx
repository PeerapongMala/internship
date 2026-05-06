import { useTranslation } from 'react-i18next';

import StoreGame from '@global/store/game';
import ImageIconArrowGlyphRightWhite from '../../../assets/icon-arrow-glyph-right-white.svg';
import lastwars from '../../../assets/LastWars.png';
import ConfigJson from '../../../config/index.json';
import { StateTab } from '../../../types';
import IconButton from '../atoms/wc-a-icon-button';
import { Tab } from '../atoms/wc-a-tab';
import TabsList from '../molecules/wc-a-tabs-list';
import DateTime from './wc-a-datetime';

export function DialogHeader() {
  const { t } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  return (
    <div>
      <div className="bg-[#fcd401] flex items-center w-full h-[80px] rounded-t-[16px]">
        <img src={lastwars} className="h-[64px] pl-3 rounded-[16px]" />
        <div className="flex-1 transition-all duration-100 text-2xl pl-3 font-semibold text-gray-20">
          Lastwars
        </div>
        <div className="pr-2">
          <IconButton iconSrc={ImageIconArrowGlyphRightWhite} variant="primary" />
        </div>
      </div>
      <div className="flex items-center pt-1">
        <div className="w-1/2">
          <TabsList>
            <Tab
              label={t('classroom')}
              isActive={stateFlow === StateTab.ClassroomTab}
              onClick={() => {
                StoreGame.MethodGet().State.Flow.Set(StateTab.ClassroomTab);
              }}
            />
            <Tab
              label={t('year')}
              isActive={stateFlow === StateTab.YearTab}
              onClick={() => {
                StoreGame.MethodGet().State.Flow.Set(StateTab.YearTab);
              }}
            />
            <Tab
              label={t('affiliation')}
              isActive={stateFlow === StateTab.AffiliationTab}
              onClick={() => {
                StoreGame.MethodGet().State.Flow.Set(StateTab.AffiliationTab);
              }}
            />
            <Tab
              label={t('country')}
              isActive={stateFlow === StateTab.CountryTab}
              onClick={() => {
                StoreGame.MethodGet().State.Flow.Set(StateTab.CountryTab);
              }}
            />
          </TabsList>
        </div>

        <DateTime />
      </div>
    </div>
  );
}
