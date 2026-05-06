import CWButton from '@component/web/cw-button';
import CWWhiteBox from '@component/web/cw-white-box';
import ButtonDownloadLevelsPdf from '@component/web/organism/cw-o-download-levels-pdf';
import CWTLevelView from '@component/web/template/cw-t-question-view';
import IconDownload from '@core/design-system/library/component/icon/IconDownload';
import IconUpload from '@core/design-system/library/component/icon/IconUpload';
import { LevelItem } from '@domain/g02/g02-d05/local/type';
import usePagination from '@global/hooks/usePagination';
import { useEffect, useState } from 'react';

const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
};

export const CWQuestion = ({
  levelId,
  onStandardLoaded,
}: {
  levelId: number;
  onStandardLoaded?: (standard: LevelItem['standard']) => void;
}) => {
  const modalAdditem = useModal();

  const [statusFilter, setStatusFilter] = useState<Status | undefined>(undefined);
  const { pagination, setPagination } = usePagination();
  const [pdfLoading, setPdfLoading] = useState(false);
  const [currentStandard, setCurrentStandard] = useState<LevelItem['standard']>();

  const handleStandardLoaded = (standard: LevelItem['standard']) => {
    setCurrentStandard(standard);
    if (onStandardLoaded) {
      onStandardLoaded(standard);
    }
  };
  return (
    <div className="w-full">
      <div className="flex w-full justify-between">
        <ButtonDownloadLevelsPdf levelId={levelId} />
      </div>

      <CWWhiteBox className="mt-5 p-5">
        <CWTLevelView
          levelId={levelId}
          // CWModalQuestionView_please_fix_this_for_real_data
          onStandardLoaded={handleStandardLoaded}
        />
      </CWWhiteBox>
    </div>
  );
};
