import Button from '@component/web/atom/wc-a-button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ModalCommon from '../wc-m-modal-common';

export enum ESuccessModalMode {
    UploadSublesson = 'upload-sublesson',
    UploadModel = 'upload-model',
    DeleteSublesson = 'delete-sublesson',
    DeleteModel = 'delete-model',
    Delete = 'delete',
}
interface CWModalCustomSuccessProp {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    onClose?: () => void;
    mode?: ESuccessModalMode;
    count?: number; // Number of items deleted/uploaded
}

const CWModalCustomSuccess = ({
    showModal,
    setShowModal,
    onClose,
    mode = ESuccessModalMode.Delete,
    count = 1,
}: CWModalCustomSuccessProp) => {
    const { t } = useTranslation(['global']);

    const handleClose = () => {
        onClose?.();
        setShowModal(false);
    };

    // Get title and message based on mode
    const getTitleAndMessage = () => {
        switch (mode) {
            case 'upload-sublesson':
                return {
                    title: t('upload_sublesson_success_modal_title'),
                    message: t('upload_sublesson_success_message_multiple', { count })
                };
            case 'upload-model':
                return {
                    title: t('upload_model_success_modal_title'),
                    message: t('upload_model_success_message_multiple', { count })
                };
            case 'delete-sublesson':
                return {
                    title: t('delete_sublesson_success_modal_title'),
                    message: t('delete_sublesson_success_message_multiple',),
                };
            case 'delete-model':
                return {
                    title: t('delete_model_success_modal_title'),
                    message: t('delete_model_success_message_multiple',),
                };
            case 'delete':
            default:
                return {
                    title: t('delete_model_success_modal_title'),
                    message: t('delete_model_success_message'),
                };
        }
    };

    const { title, message } = getTitleAndMessage();

    return (
        <ModalCommon
            title={title}
            isVisible={showModal}
            setVisibleModal={setShowModal}
            className="w-[550px]"
            overlay={true}
            openOnLoad={false}
            closeOnClickOutside={true}
            zIndex={50}
            onClose={handleClose}
            customBody={
                <div className="px-8 py-6 bg-white border-[#FCD401] border-y-2 border-dashed">
                    <p className="text-2xl text-center text-gray-700">
                        {message}
                    </p>
                </div>
            }
            customFooter={
                <div className="flex gap-3 w-full pt-4 pb-6 px-8 bg-white rounded-b-[55px]">
                    <Button variant="primary" onClick={handleClose} className="flex-1">
                        <p className="text-xl font-bold">{t('ok')}</p>
                    </Button>
                </div>
            }
        />
    );
};

export default CWModalCustomSuccess;