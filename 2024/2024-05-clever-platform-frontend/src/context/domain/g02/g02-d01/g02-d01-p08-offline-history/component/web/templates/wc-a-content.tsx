import ScrollableContainer from '@global/component/web/atom/wc-a-scrollable-container';
import StoreGame from '@global/store/game';
import { StateTab, UploadHistoryData } from '../../../types';
import Dialog from '../atoms/wc-a-dialog';
import UploadedHistoryDataSection from '../organisms/wc-a-uploaded-history';
import WaitingHistoryDataSection from '../organisms/wc-a-waiting-history';

export function DialogContent({ records }: { records: UploadHistoryData[] }) {
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  return (
    <ScrollableContainer id="content" className="flex justify-center p-4 overflow-y-auto">
      {stateFlow === StateTab.WaitingTab ? (
        <WaitingHistoryDataSection
          records={records.filter((record) => record.status === 'Waiting')}
        />
      ) : (
        <UploadedHistoryDataSection
          records={records.filter((record) => record.status === 'Complete')}
        />
      )}
    </ScrollableContainer>
  );
}

export default Dialog;
