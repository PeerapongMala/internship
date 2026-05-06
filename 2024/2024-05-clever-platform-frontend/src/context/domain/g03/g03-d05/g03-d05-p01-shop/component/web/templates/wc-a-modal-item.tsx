import Modal from '../molecules/wc-a-modal';

const ModalItem = ({
  showModal,
  setShowModal,
  selectedItem,
  itemType,
}: {
  showModal: boolean;
  setShowModal: any;
  selectedItem: any;
  itemType: string;
}) => {
  return (
    <>
      {showModal ? (
        <Modal
          title={selectedItem.name}
          setShowModal={setShowModal}
          selected={selectedItem}
          customBody={
            itemType === 'character'
              ? selectedItem.description
              : itemType === 'pet'
                ? selectedItem.petDescription
                : selectedItem.frameDescription
          }
        />
      ) : null}
    </>
  );
};

export default ModalItem;
