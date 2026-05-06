import { useState, useEffect } from "react";
import { Modal, ModalProps } from "@/components/Modal";
import { useParams } from "react-router-dom";
import { Subject } from "../../../type";
import API from "../../../api";
import ModalQuestion from "../ModalQuestion";

interface ModalCheckpointProps extends ModalProps {
    open: boolean
    onClose: () => void;
    subjectId: string
}

const ModalCheckpoint = ({
    open,
    onClose,
    children,
    onOk,
    subjectId,
    ...rest
}: ModalCheckpointProps) => {

    const { id } = useParams()
    const [dataSubject, setDataSubject] = useState<Subject[]>();
    console.log(dataSubject)

    useEffect(() => {
        API.Subject.SubjectAll.Get()
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setDataSubject(data);
            })
            .catch((err) => console.error(err));

    }, [])


    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }


    return (
        <Modal
            className="w-[450px] min-h-[200px] h-auto"
            open={open}
            onClose={onClose}
            onOk={onOk}
            disableCancel
            disableOk
            title="ด่าน"
            {...rest}
        >
            <div className="flex flex-col gap-2">
                <div className="flex w-full gap-2 mb-4 items-center">
                    ด่าน1
                    <button onClick={handleShowModal} className="">ดูคำตอบ</button>
                    <ModalQuestion
                        open={showModal}
                        onClose={handleCloseModal}
                        subjectId={subjectId}
                    />

                </div>
                <div className="flex justify-center">
                    <button
                        className='flex gap-2 btn btn-outline-primary w-32' 
                        onClick={onClose}>
                        ย้อนกลับ
                    </button>
                </div>
            </div>

        </Modal>

    );
};

export default ModalCheckpoint