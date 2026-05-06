import { useTranslation } from 'react-i18next';

import ConfigJson from '../../../config/index.json';
import { UploadHistoryData } from '../../../types';
import { TextSubtitle } from '../atoms/wc-a-text';
import AccountButtonList from './wc-a-account-list';

export function WaitingHistoryDataSection({ records }: { records: UploadHistoryData[] }) {
  const { t } = useTranslation([ConfigJson.key]);
  return (
    <div
      id="waiting-list"
      className="flex flex-col justify-center min-w-[620px] gap-4 h-fit"
    >
      <div className="w-full px-4 py-2 bg-[#fcd401] rounded-full text-center">
        <TextSubtitle>{t('waiting_upload_subtitle')}</TextSubtitle>
      </div>
      <div className="flex flex-col justify-center gap-4">
        {records?.map((profile, index) => {
          return <AccountButtonList account={profile} key={index} />;
        })}
      </div>
    </div>
  );
}

export default WaitingHistoryDataSection;
