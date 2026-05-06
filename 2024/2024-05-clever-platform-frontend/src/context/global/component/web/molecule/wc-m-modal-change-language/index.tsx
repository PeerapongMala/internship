import { useTranslation } from 'react-i18next';

//import ImageIconHome from '@global/assets/icon-home.png';
import Button from '@global/component/web/atom/wc-a-button';
import Modal from '@global/component/web/molecule/wc-m-modal';

const ModalChangeLanguage = ({
  showModal,
  setShowModal,
  onLanguageChange,
  disableClose = true,
}: {
  showModal: boolean;
  setShowModal: any;
  onLanguageChange?: (language: string) => void;
  disableClose?: boolean;
}) => {
  const { t } = useTranslation(['global']);

  return (
    <>
      {showModal ? (
        <Modal
          title={t('change_language')}
          setShowModal={setShowModal}
          className="h-[60%] w-[60%]"
          customBody={
            <Body setShowModal={setShowModal} onLanguageChange={onLanguageChange} />
          }
          disableClose={disableClose}
        />
      ) : null}
    </>
  );
};

const Body = ({
  setShowModal,
  onLanguageChange,
}: {
  setShowModal: any;
  onLanguageChange?: (language: string) => void;
}) => {

  return (
    <div className="flex flex-col w-full items-center pt-7 pl-7">
      <LanguageButton
        language="th"
        label="ภาษาไทย"
        setShowModal={setShowModal}
        onLanguageChange={onLanguageChange}
      />
      <LanguageButton
        language="en"
        label="ENGLISH"
        setShowModal={setShowModal}
        onLanguageChange={onLanguageChange}
      />
      <LanguageButton
        language="zh"
        label="中文"
        setShowModal={setShowModal}
        onLanguageChange={onLanguageChange}
      />
    </div>
  );
};

interface LanguageButtonProps {
  language: string;
  label: string;
  setShowModal: (isOpen: boolean) => void;
  onLanguageChange?: (language: string) => void;
}

const LanguageButton: React.FC<LanguageButtonProps> = ({
  language,
  label,
  setShowModal,
  onLanguageChange,
}) => {
  const { i18n } = useTranslation();

  const handleClick = () => {
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);

    if (onLanguageChange) onLanguageChange(language);
    setShowModal(false);
  };

  return (
    <div className="w-96 relative h-24">
      <Button
        onClick={handleClick}
        variant="secondary"
        //prefix={<img src={ImageIconHome} className="w-[70px] pt-2 pl-1" alt="icon" />}
        size="large"
        width="22rem"
        height="5rem"
        textClassName="justify-center items-center pr-4"
      >
        {label}
      </Button>
    </div>
  );
};

export default ModalChangeLanguage;
