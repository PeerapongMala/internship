// components/GlobalOrientationHandler.tsx
import useOrientationCheck from '@global/helper/orientationCheck';
import { ReactNode, useState } from 'react';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import CWModalAlertAngle from '../cw-model-alert-angle';

type CheckPropsOrientationProps = { children?: ReactNode };

const CWOrientationHandler = ({ children }: CheckPropsOrientationProps) => {
    const [showAngleModal, setShowAngleModal] = useState(false);

    useOrientationCheck((isWrong) => {
        setShowAngleModal(isWrong);
    });

    return (
        <>
            {showAngleModal && (
                <div className="fixed inset-0 bg-black opacity-70 z-40" />
            )}
            <CWModalAlertAngle
                showModal={showAngleModal}
                setShowModal={setShowAngleModal}
                onConfirm={() => { }}
            />

            <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">

                <div>{children}</div>

            </ResponsiveScaler>
        </>
    );
};

export default CWOrientationHandler;