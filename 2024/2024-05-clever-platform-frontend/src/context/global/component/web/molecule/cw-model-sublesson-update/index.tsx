

import { useTranslation } from 'react-i18next';
// import ImageIconArrowGlyphRightWhite from '../../../../assets/icon-download.svg';
import Modal from '../wc-m-modal';


const CWModalUpdateLesson = ({
    showModal,
    setShowModal,
    mode = 'update',
    progress = 0,
    current = 0,
    total = 0
}: {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    onConfirm: () => void;
    mode: 'update' | 'download';
    progress: number;
    current?: number;
    total?: number;
}) => {
    const { t } = useTranslation(['global']);

    return (
        <>
            {showModal && (
                <Modal
                    title={mode === 'update' ? t('modal-update-sublesson-title') : t('modal-download-sublesson-title')}
                    setShowModal={setShowModal}
                    className="h-[16rem] w-[40rem]"
                    disableClose={true}
                    customBody={
                        <div className="w-full flex flex-col items-center justify-center p-4">
                            <p className="text-lg mb-4">
                                {
                                    mode === 'update'
                                        ? t('modal-update-sublesson-description')
                                        : t('modal-download-sublesson-description')
                                }
                            </p>
                            {/* แสดงจำนวนบทเรียนย่อยที่ดาวน์โหลด */}
                            {total > 0 && (
                                <p className="text-base text-gray-600 mb-4">
                                    {current} / {total} บทเรียนย่อย
                                </p>
                            )}
                            <div className="flex gap-4 w-full justify-center items-center">
                                <div className="relative w-[90%] bg-gray-200 rounded-full h-5 overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 bg-[length:200%_100%] animate-[progressGradient_2s_linear_infinite]"
                                        style={{ width: `${Math.round(progress)}%` }}
                                    ></div>
                                </div>
                                <span className="text-lg font-medium  text-right">
                                    {Math.round(progress)}%
                                </span>
                            </div>

                        </div>
                    }
                />
            )}
        </>
    );
};

export default CWModalUpdateLesson
