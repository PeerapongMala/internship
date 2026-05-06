import { UploadHistoryData } from '../../../types';
import AccountButtonList from './wc-a-account-list';

export function UploadedHistoryDataSection({
  records,
}: {
  records: UploadHistoryData[];
}) {
  return (
    <div
      id="uploaded-history-list"
      className="flex flex-col justify-center min-w-[620px] gap-4 h-fit"
    >
      <div className="flex flex-col justify-center gap-4 max-h-[636px] box-content">
        {records?.map((profile, index) => {
          return <AccountButtonList account={profile} key={index} />;
        })}
      </div>
    </div>
  );
}

export default UploadedHistoryDataSection;
