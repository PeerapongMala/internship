import { cn } from '@core/design-system/library/vristo/source/utils/cn';
import useFetchHistoryData from '@domain/g06/g06-d03/local/hooks/useFetchHistoryData';
import { useEffect, useMemo } from 'react';

type HeaderHistoryProps = {
  className?: string;
  sheetId: number;
  onSheetNotFound?: () => void;
};

const HeaderHistory = ({ className, sheetId, onSheetNotFound }: HeaderHistoryProps) => {
  const history = useFetchHistoryData();

  useEffect(() => {
    history.fetchData(sheetId, onSheetNotFound);
  }, [sheetId]);

  const labelSheetID = useMemo(() => {
    if (isNaN(sheetId)) return '-';

    return sheetId;
  }, [sheetId]);

  const [subjectName, year, classRoom] = useMemo(() => {
    return [
      history.data?.subject_name ?? '-',
      history.data?.year ?? '-',
      history.data?.class_name ?? '-',
    ];
  }, [history.data]);

  return (
    <div className={cn('relative flex flex-col rounded-md bg-gray-100 p-3', className)}>
      <h2 className="text-xl font-bold">
        {subjectName} / {year} / {classRoom}
      </h2>
      <span>รหัสใบตัดเกรด: {labelSheetID}</span>
    </div>
  );
};

export default HeaderHistory;
