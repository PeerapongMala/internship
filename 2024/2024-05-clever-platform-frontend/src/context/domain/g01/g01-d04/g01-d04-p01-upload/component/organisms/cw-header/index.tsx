
import { CWTextHeader } from '@component/web/atom/cw-text-header';
import IconButton from '@component/web/atom/wc-a-icon-button';
import IconUpload from '@global/assets/icon-upload.svg';
import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import { useNavigate } from '@tanstack/react-router';

export type CWHeaderProps = {
    title: string;
    onBack?: () => void;
    showUploadButton?: boolean;
    onUploadClick?: () => void;
};

/**
 * CWHeader - Header component with back button, title, and optional upload button
 *
 * @example
 * <CWHeader
 *   title="การนำเข้าบทเรียนด้วยตัวเอง"
 *   onBack={() => navigate('/main-menu')}
 *   showUploadButton={true}
 *   onUploadClick={handleUpload}
 * />
 */
const CWHeader = ({
    title,
    onBack,
    showUploadButton = true,
    onUploadClick,
}: CWHeaderProps) => {
    const navigate = useNavigate();

    const handleBackClick = () => {
        if (onBack) {
            onBack();
        } else {
            navigate({ to: `/login-id`, replace: true });
        }
    };

    const handleUpload = () => {
        if (onUploadClick) {
            onUploadClick();
        } else {
            // fallback: ถ้าไม่ส่ง onUploadClick มา  เปิด file dialog
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.zip';
            input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) alert(`เลือกไฟล์: ${file.name}`);
            };
            input.click();
        }
    };

    return (
        <div className="bg-white rounded-t-[54px] flex justify-between items-center py-6 w-full">
            <div className='w-full relative'>
                <div className="flex items-center justify-center w-[96px] min-h-[48px]">
                    <ButtonBack
                        buttonClassName="p-2 px-[10px]"
                        onClick={handleBackClick}
                    />
                </div>
            </div>

            <div className="w-full text-center text-nowrap">
                <CWTextHeader>{title}</CWTextHeader>
            </div>

            <div className="w-full flex justify-end pr-10">
                {showUploadButton && (
                    <IconButton
                        variant='yellow'
                        iconSrc={IconUpload}
                        className='text-white'
                        onClick={handleUpload}
                    />
                )}
            </div>
        </div>
    );
};

export default CWHeader;