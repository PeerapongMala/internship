import ImageIconCheck from '@assets/icon-check.svg';
import Button from '@component/web/atom/wc-a-button';
import { Icon } from '@component/web/atom/wc-a-icon';
import { useTranslation } from 'react-i18next';
import ModalCommon from '../wc-m-modal-common';
import React from 'react';

interface CWModalUploadSuccessProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    onClose?: () => void;
    successCount?: number;
    totalCount?: number;
}

const CWModalUploadSuccess = ({
    showModal,
    setShowModal,
    onClose,
    successCount = 0,
    totalCount = 0,
}: CWModalUploadSuccessProps) => {
    const { t } = useTranslation(['global']);

    const handleClose = () => {
        onClose?.();
        setShowModal(false);
    };

    return (
        <ModalCommon
            title={t('upload_success_modal_title')}
            isVisible={showModal}
            setVisibleModal={setShowModal}
            className="w-[600px]"
            headerClassName="bg-gradient-to-r from-[#4CAF50] to-[#81C784]"
            overlay={true}
            openOnLoad={false}
            zIndex={50}
            onClose={handleClose}
            customBody={
                <div className="px-8 py-8 bg-white border-[#FCD401] border-y-2 border-dashed">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                            <Icon src={ImageIconCheck} className="w-12 h-12 text-green-600" />
                        </div>
                        <p className="text-2xl text-center text-gray-700">
                            {t('upload_success_message')}
                        </p>
                        {totalCount > 0 && (
                            <div className="text-center mt-2">
                                <span className="text-4xl font-bold text-green-600">{successCount}</span>
                                <span className="text-2xl text-gray-400 mx-2">/</span>
                                <span className="text-2xl text-gray-600">{totalCount}</span>
                                <p className="text-lg text-gray-500 mt-2">{t('upload_success_count')}</p>
                            </div>
                        )}
                    </div>
                </div>
            }
            customFooter={
                <div className="flex gap-4 w-full pt-6 pb-6 px-8 bg-white rounded-b-[55px]">
                    <Button
                        variant="primary"
                        onClick={handleClose}
                        className="flex-1"
                    >
                        <p className="text-xl font-bold">{t('ok')}</p>
                    </Button>
                </div>
            }
        />
    );
};

export default CWModalUploadSuccess;