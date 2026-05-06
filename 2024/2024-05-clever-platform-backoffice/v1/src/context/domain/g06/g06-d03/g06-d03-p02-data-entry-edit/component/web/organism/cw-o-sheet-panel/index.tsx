import { IGetSheetDetail } from '@domain/g06/g06-d03/local/type';
import SheetInfo from '../../molecule/cw-m-clever-link-status';
import IconSettings from '@core/design-system/library/component/icon/IconSettings';
import CWButtonSwitch from '@component/web/cw-button-switch';
import CWButton from '@component/web/cw-button';
import { useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';

type SheetPanelProps = {
  sheet: IGetSheetDetail;
  isEditMode: boolean;
  isAdvanceMode: boolean;
  onAdvancedModeToggle?: (enabled: boolean) => void;
};

const SheetPanel = ({
  sheet,
  isAdvanceMode,
  onAdvancedModeToggle,
  isEditMode,
}: SheetPanelProps) => {
  const navigate = useNavigate();

  const evaluationFormID = useMemo(
    () => sheet.sheet_data?.form_id,
    [sheet.sheet_data?.form_id],
  );

  return (
    <div className="my-5 flex justify-between bg-[#F5F5F5] px-2 py-3">
      <SheetInfo
        sheetID={sheet.sheet_id}
        sheet={sheet}
        room={sheet.sheet_data?.school_room}
        year={sheet.sheet_data?.year}
      />

      <div className="flex items-center gap-2">
        {isEditMode ? (
          <>
            <div className="flex items-center gap-2 rounded border border-primary bg-white p-2">
              <CWButtonSwitch
                onToggle={(value) => onAdvancedModeToggle?.(value)}
                initialState={isAdvanceMode}
              />

              <div className="flex flex-col">
                <span>Advance mode:</span>
                <span>เปิดหน้าต่างแสดงรายละเอียดเพื่อบันทึกคะแนนแต่ละช่อง</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <CWButton
              className="flex h-full items-center gap-2 rounded border border-primary bg-white p-2 text-primary"
              onClick={() => {
                navigate({ to: `/grade-system/evaluation/info/${evaluationFormID}` });
              }}
              icon={<IconSettings />}
              outline
              title="ตัวชี้วัด"
            />

            <CWButton
              title="ประวัติการกรอกข้อมูล"
              outline
              onClick={() => {
                navigate({
                  to: `./history`,
                });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default SheetPanel;
