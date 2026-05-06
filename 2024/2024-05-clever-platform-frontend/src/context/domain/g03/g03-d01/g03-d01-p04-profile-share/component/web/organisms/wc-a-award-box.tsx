import { useTranslation } from 'react-i18next';

import ImageCalendarCheckIcon from '../../../assets/icon-calendar-check.svg';
import ImageTrophyIcon from '../../../assets/icon-trophy.svg';
import ConfigJson from '../../../config/index.json';
import { IProfile } from '../../../type';
import { IconSmall } from '../atoms/wc-a-icon';
import { TextLight, TextNormal } from '../atoms/wc-a-text';
import Button from '@component/web/atom/wc-a-button';
import { toDDMMYYCurrentTime } from '@global/helper/date';

interface AwardStatBoxProps {
  profile?: IProfile;
  className?: string;
  isCapture?: boolean;
}

export function AwardStatBox({ profile, className = '', isCapture }: AwardStatBoxProps) {
  const { t } = useTranslation([ConfigJson.key]);

  return (
    <div className={'flex flex-col ' + className}>
      <TextNormal className="text-center !text-2xl !font-semibold">
        {'วิชา' + profile?.award.subject || ''}
      </TextNormal>
      <div className="flex justify-center items-center divide-x-2 divide-solid divide-black/20 p-4 pb-0 rounded-full">
        <div className="flex-1 flex flex-col justify-center items-center gap-2 pr-4">
          <TextLight>{t('award_consecutive_days_label')}</TextLight>
          {isCapture ? (
            <div className="rounded-full bg-white w-12 h-12 flex justify-center items-center">
              <IconSmall src={ImageCalendarCheckIcon} />
            </div>
          ) : (
            <Button
              variant="white"
              className="active:scale-[1] hover:scale-[1] cursor-auto"
              onClick={() => {}}
              width="3rem"
              height="3rem"
            >
              <IconSmall src={ImageCalendarCheckIcon} />
            </Button>
          )}
          <TextNormal>
            {t('award_consecutive_days_value', { days: profile?.award.consecutiveDays })}
          </TextNormal>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center gap-2 pl-4">
          <TextLight>{t('award_trophy_label')}</TextLight>
          {isCapture ? (
            <div className="rounded-full bg-white w-12 h-12 flex justify-center items-center">
              <IconSmall src={ImageTrophyIcon} />
            </div>
          ) : (
            <Button
              variant="white"
              className="active:scale-[1] hover:scale-[1] cursor-auto"
              onClick={() => {}}
              width="3rem"
              height="3rem"
            >
              <IconSmall src={ImageTrophyIcon} />
            </Button>
          )}
          <TextNormal>
            {t('award_trophy_value', { trophy: profile?.award.trophy })}
          </TextNormal>
        </div>
      </div>
      <TextLight className="text-center text-sm pt-2">
        {toDDMMYYCurrentTime(new Date()) + ', Clever'}
      </TextLight>
    </div>
  );
}

export default AwardStatBox;
