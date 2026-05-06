import WCMLatexEditor from '@component/web/molecule/wc-m-latex-editor';
import Modal from '@global/component/web/molecule/wc-m-modal';
import { useTranslation } from 'react-i18next';

const ModalLatexEditor = ({
  showModal,
  value,
  setShowModal,
  setValue,
}: {
  showModal: boolean;
  value?: string;
  setShowModal: (show: boolean) => void;
  setValue?: (value: string) => void;
}) => {
  const { t, i18n } = useTranslation(['global']);

  return (
    <>
      {showModal ? (
        <Modal
          title={t('latex_editor.title')}
          setShowModal={setShowModal}
          className="h-[36.5rem] w-[40rem]"
          childrenClassName="bg-white"
          customBody={
            <div className="relative flex justify-center h-full">
              <WCMLatexEditor value={value} setValue={setValue} />
            </div>
          }
        />
      ) : null}
    </>
  );
};

export default ModalLatexEditor;
