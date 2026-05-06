
import { useTranslation } from 'react-i18next';

import Modal from '../wc-m-modal';


const CWModalAlertAngle = ({
    showModal,
    setShowModal,
}: {
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    onConfirm: () => void;
}) => {
    const { t } = useTranslation(['global']);
    return (
        <>

            {showModal && (
                <Modal
                    title={t('orientation.title')}
                    classNameTitle='  text-[16px] sm:text-[18px] md:text-[20px] 
                        font-bold'
                    setShowModal={setShowModal}
                    className="h-[10rem] w-auto sm:w-[300px]"
                    disableClose={true}
                    customBody={
                        <div className="w-full flex flex-col items-center justify-center p-4">
                            <p className="text-[14px] mb-8 whitespace-pre-line text-center px-5">
                                {t('orientation.description')}
                            </p>
                        </div>
                    }
                />
            )}
        </>
    );
};

export default CWModalAlertAngle
