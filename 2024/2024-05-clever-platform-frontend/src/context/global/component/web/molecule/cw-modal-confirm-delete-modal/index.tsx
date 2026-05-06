import ImageIconTrashWhite from '@assets/icon-trash.svg';
import Button from '@component/web/atom/wc-a-button';
import { Icon } from '@component/web/atom/wc-a-icon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ModalCommon from '../wc-m-modal-common';

export type DeleteModalMode = 'model' | 'sublesson';

interface CWModalConfirmDeleteModelProps {
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    onConfirm: () => void;
    onClose?: () => void;
    itemName: string;
    mode?: DeleteModalMode;
    isLoading?: boolean; // Show loading spinner on confirm button
}

const CWModalConfirmDeleteModal = ({
    showModal,
    setShowModal,
    onConfirm,
    onClose,
    itemName,
    mode = 'model',
    isLoading = false,
}: CWModalConfirmDeleteModelProps) => {
    const { t } = useTranslation(['global']);

    const handleCancel = () => {
        onClose?.();
        setShowModal(false);
    };

    const handleConfirm = () => {
        onConfirm();
        // Don't close modal immediately - let parent handle closing after deletion completes
    };

    // Get text based on mode
    const getText = () => {
        if (mode === 'sublesson') {
            return {
                title: t('delete_sublesson_modal_title'),
                confirmMessage: t('delete_sublesson_confirm_message'),
                warningMessage: t('delete_sublesson_warning_message'),
                confirmBtn: t('delete_sublesson_confirm_btn'),
                waiting: t('delete_sublesson_confirm_waiting'),
            };
        }
        return {
            title: t('delete_model_modal_title'),
            confirmMessage: t('delete_model_confirm_message'),
            warningMessage: t('delete_model_warning_message'),
            confirmBtn: t('delete_sublesson_confirm_btn'),
            waiting: t('delete_sublesson_confirm_waiting'),
        };
    };

    const text = getText();

    return (
        <ModalCommon
            title={text.title}
            isVisible={showModal}
            setVisibleModal={setShowModal}
            className="w-[600px]"
            overlay={true}
            openOnLoad={false}
            closeOnClickOutside={true}
            zIndex={50}
            onClose={handleCancel}
            customBody={
                <div className="px-8 py-6 bg-white border-[#FCD401] border-y-2 border-dashed">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-3xl font-bold  my-4">
                            "{itemName}"
                        </p>
                        <p className="text-2xl mb-4 text-center">
                            {text.confirmMessage}
                        </p>
                        {mode === 'sublesson' && (
                            <p className="text-2xl mb-4 text-center">
                                {text.warningMessage}
                            </p>
                        )}

                    </div>
                </div>
            }
            customFooter={
                <div className="flex gap-4 w-full pt-6 pb-6 px-8 bg-white rounded-b-[55px]">
                    <Button
                        variant="danger"
                        onClick={handleConfirm}
                        className="flex-1"
                        prefix={!isLoading ? <Icon src={ImageIconTrashWhite} className="w-6 h-6" /> : undefined}
                        disabled={isLoading}
                    >
                        <p className="text-xl font-bold">
                            {isLoading ? text.waiting : text.confirmBtn}
                        </p>
                    </Button>
                </div>
            }
        />
    );
};

export default CWModalConfirmDeleteModal;