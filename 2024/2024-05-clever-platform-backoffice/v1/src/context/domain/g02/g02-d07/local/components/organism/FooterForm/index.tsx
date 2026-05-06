import IconCaretDown from '@core/design-system/library/vristo/source/components/Icon/IconCaretDown';
import Box from '../../atom/Box';

const FooterForm = () => {
  return (
    <>
      <div className="flex items-center gap-4">
        <button className="btn btn-primary flex w-32">บันทึก</button>
        <button className="btn btn-outline-primary flex w-32">ยกเลิก</button>
        <div>แก้ไขล่าสุด: 20 ก.พ 2565 24:24, Admin</div>
      </div>
      <div>
        <button className="btn btn-primary flex w-32 gap-2">
          ต่อไป <IconCaretDown className="-rotate-90" />
        </button>
      </div>
    </>
  );
};

export default FooterForm;
