import { IGetSheetDetail } from '@domain/g06/g06-d03/local/type';
import SheetPanel from '../../organism/cw-o-sheet-panel';

type DataEntryEditTemplateProps = {
  sheet: IGetSheetDetail;
  isEditMode: boolean;
  isAdvanceMode: boolean;
  onAdvancedModeToggle?: (value: boolean) => void;
};

const DataEntryEditTemplate = ({
  sheet,
  isEditMode,
  isAdvanceMode,
  onAdvancedModeToggle,
}: DataEntryEditTemplateProps) => {
  return (
    <>
      <SheetPanel
        isAdvanceMode={isAdvanceMode}
        sheet={sheet}
        isEditMode={isEditMode}
        onAdvancedModeToggle={onAdvancedModeToggle}
      />
    </>
  );
};

export default DataEntryEditTemplate;
