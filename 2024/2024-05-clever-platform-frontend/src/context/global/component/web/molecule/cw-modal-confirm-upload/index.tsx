// component/organisms/cw-modal-confirm-upload.tsx

import Button from '@component/web/atom/wc-a-button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ModalCommon from '../wc-m-modal-common';

export type UploadMode = 'sublesson' | 'model';

interface CWModalConfirmUploadProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: () => void;
    onClose?: () => void;
    mode: UploadMode;
}

const CWModalConfirmUpload = ({
    showModal,
    setShowModal,
    onConfirm,
    onClose,
    mode,
}: CWModalConfirmUploadProps) => {
    const { t } = useTranslation(['global']);

    const getTitle = () => {
        if (mode === 'sublesson') {
            return t('upload-sublesson-modal-title');
        }
        return t('upload-model-modal-title');
    };

    const getDescription = () => {
        if (mode === 'sublesson') {
            return t('upload-sublesson-modal-description');
        }
        return t('upload-model-modal-description');
    };

    const getConfirmLabel = () => {
        if (mode === 'sublesson') {
            return t('upload-sublesson-button-label');
        }
        return t('upload-model-button-label');
    };

    const handleCancel = () => {
        onClose?.();
        setShowModal(false);
    };

    const handleConfirm = () => {
        onConfirm();
        setShowModal(false);
    };

    return (
        <ModalCommon
            title={getTitle()}
            isVisible={showModal}
            setVisibleModal={setShowModal}
            className="w-[550px]"
            overlay={true}
            openOnLoad={false}
            closeOnClickOutside={true}
            zIndex={50}
            onClose={handleCancel}
            customBody={
                <div className="px-8 py-6 bg-white border-[#FCD401] border-y-2 border-dashed">
                    <p className="text-2xl text-center whitespace-pre-line">
                        {getDescription()}
                    </p>
                </div>
            }
            customFooter={
                <div className="flex gap-4 w-full pt-6 pb-6 px-8 bg-white rounded-b-[55px]">
                    <Button
                        variant="danger"
                        onClick={handleCancel}
                        className="flex-1"
                    >
                        <p className="text-xl font-bold">{t('cancel')}</p>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        className="flex-1"
                    >
                        <p className="text-xl font-bold">{getConfirmLabel()}</p>
                    </Button>
                </div>
            }
        />
    );
};

export default CWModalConfirmUpload;