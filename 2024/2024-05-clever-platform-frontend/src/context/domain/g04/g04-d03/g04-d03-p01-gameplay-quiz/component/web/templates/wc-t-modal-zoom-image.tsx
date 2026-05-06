import ImageLessonLocal from '@component/web/atom/wc-a-image-lesson-local';
import Modal from '@global/component/web/molecule/wc-m-modal';
import StoreLevel from '@store/global/level';

const ModalZoomImage = ({
  showModal,
  setShowModal,
  image,
}: {
  showModal: boolean;
  setShowModal: any;
  image: string;
}) => {
  const { queryId } = StoreLevel.StateGet(['queryId']);
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-neutral-800 opacity-70"
            onClick={() => setShowModal(false)}
          />
          <Modal
            setShowModal={setShowModal}
            title={<>&nbsp;</>}
            className="h-[35rem] w-[60rem] relative z-[10001]"
            customBody={
              <div className="flex items-center justify-center h-full w-full overflow-hidden">
                <ImageLessonLocal
                  alt="image_zoom"
                  src={image || ''}
                  query={{
                    lessonId: queryId?.lessonId,
                    sublessonId: queryId?.sublessonId,
                    levelId: queryId?.levelId,
                    questionId: queryId?.questionId,
                  }}
                  className="p-5 max-h-full max-w-full object-contain"
                />
              </div>
            }
          />
        </div>
      )}
    </>
  );
};

export default ModalZoomImage;