import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import Box from '../../atom/Box';
import { convertTime } from '../../../util';
import { Link } from '@tanstack/react-router';
import CWButton from '@component/web/cw-button';

const FooterForm = ({
  academicLevel,
  onSave,
  onNext,
  onPrevious,
  loading,
  disableCancel,
}: {
  academicLevel: any;
  onSave?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  loading?: boolean;
  disableCancel?: boolean;
}) => {
  return (
    <>
      <div className="flex items-center gap-4">
        {onSave && (
          <CWButton
            className="w-32"
            type="button"
            title="บันทึก"
            onClick={onSave}
            loading={loading}
          />
        )}
        {!disableCancel && (
          <Link
            className="btn btn-outline-primary flex w-32"
            to={`/content-creator/level/${academicLevel?.sub_lesson_id}`}
          >
            ยกเลิก
          </Link>
        )}
        <div>
          แก้ไขล่าสุด: {convertTime(academicLevel?.updated_at)},{' '}
          {academicLevel?.updated_by}
        </div>
      </div>
      <div className="flex gap-4">
        {onPrevious && (
          <CWButton
            className="w-36"
            type="button"
            title="ก่อนหน้า"
            onClick={onPrevious}
            loading={loading}
            icon={<IconCaretDown className="rotate-90" />}
          />
        )}
        {onNext && (
          <CWButton
            className="w-36"
            type="button"
            title="ต่อไป"
            onClick={onNext}
            loading={loading}
            suffix={<IconCaretDown className="-rotate-90" />}
          />
        )}
      </div>
    </>
  );
};

export default FooterForm;
