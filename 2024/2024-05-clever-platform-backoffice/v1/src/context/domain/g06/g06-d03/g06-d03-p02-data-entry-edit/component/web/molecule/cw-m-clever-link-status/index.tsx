import IconImgNotFound from '@core/design-system/library/component/icon/IconImgNotFound';
import IconTask from '@core/design-system/library/component/icon/IconTask';
import { IGetSheetDetail, IGetSubjectData } from '@domain/g06/g06-d03/local/type';
import { useMemo } from 'react';

type CleverLinkStatusProps = {
  sheetID: number;
  year?: string;
  room?: string;
  sheet: IGetSheetDetail;
};

const SheetInfo = ({ sheetID, sheet, room, year }: CleverLinkStatusProps) => {
  const isClever = useMemo(
    () => sheet.subject_data?.is_clever,
    [sheet.subject_data?.is_clever],
  );

  const sheetCode = useMemo(() => sheetID.toString().padStart(11, '0'), [sheetID]);

  const info = useMemo(() => {
    const infos = [
      sheet.subject_data?.subject_name ?? sheet.sheet_data?.general_name,
      year,
      room,
    ];

    return infos.map((info) => info?.toString().trim() ?? '-').join(' / ');
  }, [year, room, sheet.subject_data?.subject_name]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold">{info}</span>
        <div className="flex items-center gap-2 font-bold text-dark">
          {sheet.subject_data &&
            (isClever ? (
              <>
                <IconTask /> <span>เชื่อมต่อกับระบบ Clever</span>
              </>
            ) : (
              <>
                <IconImgNotFound />
                <span> ไม่ได้เชื่อมต่อกับระบบ Clever</span>
              </>
            ))}
        </div>
      </div>
      <span>รหัสใบตัดเกรด: {sheetCode} </span>
    </div>
  );
};

export default SheetInfo;
