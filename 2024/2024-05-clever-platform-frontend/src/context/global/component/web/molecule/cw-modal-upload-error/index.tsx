import Button from '@component/web/atom/wc-a-button';
import { useTranslation } from 'react-i18next';
import CWErrorList, { ErrorItem } from '../cw-error-list';
import ModalCommon from '../wc-m-modal-common';

interface CWModalUploadErrorProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    onClose?: () => void;
    errorList?: ErrorItem[];
    successCount?: number;
    totalCount?: number;
    mode?: 'upload' | 'download';
}

const CWModalUploadError = ({
    showModal,
    setShowModal,
    onClose,
    errorList = [],
    successCount = 0,
    totalCount = 0,
    mode = 'upload',
}: CWModalUploadErrorProps) => {
    const { t } = useTranslation(['global']);

    const handleClose = () => {
        onClose?.();
        setShowModal(false);
    };

    const title = mode === 'download'
        ? t('download_error_modal_title')
        : t('upload_error_modal_title');

    const successMessage = mode === 'download'
        ? t('download_success_message_with_count', { successCount, totalCount })
        : t('upload_success_message_with_count', { successCount, totalCount });

    return (
        <ModalCommon
            title={title}
            isVisible={showModal}
            setVisibleModal={setShowModal}
            className="w-[700px]"
            overlay={true}
            openOnLoad={false}
            zIndex={50}
            onClose={handleClose}
            customBody={
                <div className=" py-6 bg-white border-[#FCD401] border-y-2 border-dashed">
                    <p className="text-2xl text-center mb-4 text-gray-700">
                        {successMessage}
                    </p>
                    {errorList.length > 0 && (
                        <CWErrorList items={errorList} />
                    )}
                </div>
            }
            customFooter={
                <div className="flex gap-4 w-full pt-6 pb-6 px-8 bg-white rounded-b-[55px]">
                    <Button
                        variant="primary"
                        onClick={handleClose}
                        className="flex-1"                    >
                        <p className="text-xl font-bold">{t('ok')}</p>
                    </Button>
                </div>
            }
        />
    );
};

export default CWModalUploadError;