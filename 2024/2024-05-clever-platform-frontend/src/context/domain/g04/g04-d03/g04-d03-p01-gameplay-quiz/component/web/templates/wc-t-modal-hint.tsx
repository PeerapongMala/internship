import Modal from '@global/component/web/molecule/wc-m-modal';

const ModalHint = ({
  showModal,
  setShowModal,
  text,
  children,
}: {
  showModal: boolean;
  setShowModal: any;
  text?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <>
      {showModal ? (
        <Modal
          setShowModal={setShowModal}
          title={<>&nbsp;</>}
          className="h-[25rem] w-[50rem]"
          customBody={
            children ? (
              children
            ) : (
              <div className="flex items-center justify-center h-full w-full overflow-hidden">
                <div className="font-medium">{text}</div>
              </div>
            )
          }
        />
      ) : null}
    </>
  );
};

export default ModalHint;
