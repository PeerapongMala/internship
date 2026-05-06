import IconCaretDown from "../../../../../components/Icon/IconCaretDown";
import Box from "../../../components/atom/Box";

const FooterForm = () => {
    return (
        <>
            <div className='flex gap-4 items-center'>
                <button className="flex btn btn-primary w-32">
                    บันทึก
                </button>
                <button className="flex btn btn-outline-primary w-32">
                    ยกเลิก
                </button>
                <div>
                    แก้ไขล่าสุด: 20 ก.พ 2565 24:24, Admin
                </div>
            </div>
            <div>
                <button className="flex gap-2 btn btn-primary w-32">
                    ต่อไป <IconCaretDown className='-rotate-90' />
                </button>
            </div>
        </>
    );
};

export default FooterForm;
