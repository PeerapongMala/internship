import CWSelect, { SelectOption } from '@component/web/cw-select';
import { useMemo } from 'react';
import { IGetSheetCompare, IGetSheetDetail } from '@domain/g06/g06-d03/local/type';
import SelectVersion from '../../molecule/cw-m-select-version';
import { formatToDate } from '@global/utils/format/date';
import { formatHistoryLabel } from '@domain/g06/g06-d03/local/utils/sheet';

type PanelVersionActionProps = {
  sheetDetail?: IGetSheetDetail;
  viewOnly?: boolean;
  historyOptions: SelectOption[];
  selectedVersionCompare?: string;
  onSelectedVersionComparedChange?: (value: string) => void;
  comparedData?: IGetSheetCompare;
  onRetrieveVersion?: (retrieveVersionID: number) => void;
};

const PanelVersionAction = ({
  sheetDetail,
  historyOptions,
  selectedVersionCompare,
  comparedData,
  onSelectedVersionComparedChange,
  onRetrieveVersion,
}: PanelVersionActionProps) => {
  const currentVersion = sheetDetail?.version;

  const optionsCurrentVersion = useMemo<SelectOption[]>(() => {
    if (!sheetDetail || !currentVersion) return [];

    const isLatestVersion =
      historyOptions.length > 0 && historyOptions[0].value == currentVersion;

    const label = formatHistoryLabel(
      sheetDetail.created_at,
      currentVersion,
      isLatestVersion,
    );
    return [{ label: label, value: currentVersion }];
  }, [sheetDetail, historyOptions]);

  const optionsComparedVersion = useMemo<SelectOption[]>(() => {
    if (!comparedData || !selectedVersionCompare) return [];

    const isLatestVersion =
      historyOptions.length > 0 && historyOptions[0].value == selectedVersionCompare;

    const label = formatHistoryLabel(
      comparedData.version_right.created_at,
      selectedVersionCompare,
      isLatestVersion,
    );

    return [{ label: label, value: selectedVersionCompare }];
  }, [comparedData, selectedVersionCompare]);

  return (
    <div className="flex w-full items-end gap-4">
      <CWSelect
        disabled
        label="Version ปัจจุบัน"
        className="w-full max-w-[300px]"
        options={optionsCurrentVersion}
        value={currentVersion}
        onChange={(e) => onSelectedVersionComparedChange?.(e.target.value)}
      />

      <div className="flex h-9 items-end justify-end">
        <span className="m-auto">{'>'}</span>
      </div>

      <SelectVersion
        containerClassName="flex w-full items-end gap-4"
        label="Compare Version"
        disabled
        options={optionsComparedVersion}
        value={selectedVersionCompare}
        selectedVersionID={comparedData?.version_right.id}
        onRetrieveVersion={onRetrieveVersion}
      />
    </div>
  );
};

export default PanelVersionAction;
