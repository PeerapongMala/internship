import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import ImageIconGoogle from '@global/assets/icon-google.png';
import ImageIconLine from '@global/assets/icon-lineapp.png';
import Button from '@global/component/web/atom/wc-a-button';
import Modal from '@global/component/web/molecule/wc-m-modal';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const ModalSocialLogin = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: any;
}) => {
  const { t } = useTranslation(['global']);
  const handleLineLogin = () => {
    localStorage.setItem('provider', 'line');
    const lineAuthUrl = `${BACKEND_URL}/game-arriving/v1/oauth/line/redirect`;
    window.location.href = lineAuthUrl;
  };
  const handleGoogleLogin = () => {
    localStorage.setItem('provider', 'google');
    const GoogleAuthUrl = `${BACKEND_URL}/game-arriving/v1/oauth/google/redirect`;
    window.location.href = GoogleAuthUrl;
  };

  return (
    <>
      {showModal ? (
        <Modal
          title={t('login_with_other_methods')}
          setShowModal={setShowModal}
          className="h-[70%] w-[56%]"
          customBody={
            <Body
              setShowModal={setShowModal}
              onLineLogin={handleLineLogin}
              onGoogleLogin={handleGoogleLogin}
            />
          }
        />
      ) : null}
    </>
  );
};

// const Body = () => {
//   return (
//     <div className="flex flex-col w-full items-center pt-7">
//       <div className="w-96 relative h-28">
//         <img src={ImageButtonBlueLine} alt="line" className="w-96 absolute" />
//         <div className="absolute w-96 h-20 cursor-pointer"></div>
//       </div>
//       <div className="w-96 relative h-28">
//         <img src={ImageButtonBlueThaiId} alt="line" className="w-96 absolute" />
//         <div className="absolute w-96 h-20 cursor-pointer"></div>
//       </div>
//       <div className="w-96 relative h-28">
//         <img src={ImageButtonBlueGoogle} alt="line" className="w-96 absolute" />
//         <div className="absolute w-96 h-20 cursor-pointer"></div>
//       </div>
//       <div className="w-96 relative h-28">
//         <img src={ImageButtonBlueFacebook} alt="line" className="w-96 absolute" />
//         <div className="absolute w-96 h-20 cursor-pointer"></div>
//       </div>
//     </div>
//   );
// };

const Body = ({
  setShowModal,
  onLineLogin,
  onGoogleLogin,
}: {
  setShowModal: any;
  onLineLogin: () => void;
  onGoogleLogin: () => void;
}) => {
  const { t } = useTranslation(['global']);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-full justify-center items-center pl-7 gap-12">
      <LanguageButton
        label="LINE"
        icon={ImageIconLine}
        setShowModal={setShowModal}
        onClick={onLineLogin}
        className='!bg-green-500 !divide-green-400 !border-green-400'
        strokeColor='#00C300'
        strokeSize='5px'
      />
      {/* <LanguageButton
        label="THAI ID"
        icon={ImageIconThaiID}
        setShowModal={setShowModal}
        onClick={() => {
          navigate({ to: '/account-connect', viewTransition: true });
        }}
      /> */}
      <LanguageButton
        label="Google"
        icon={ImageIconGoogle}
        setShowModal={setShowModal}
        onClick={onGoogleLogin}
      />
      {/* <LanguageButton
        label="Facebook"
        icon={ImageIconFacebook}
        setShowModal={setShowModal}
      /> */}
    </div>
  );
};

interface LanguageButtonProps {
  label: string;
  setShowModal: (show: boolean) => void;
  icon: string;
  onClick?: () => void;
  className?: string;
  strokeColor?: string;
  strokeSize?: string;
}

const LanguageButton: React.FC<LanguageButtonProps> = ({
  label,
  setShowModal,
  icon,
  onClick,
  className = '',
  strokeColor = '',
  strokeSize = '',
}) => {
  const { i18n } = useTranslation();

  const handleClick = () => {
    if (onClick) onClick();
    setShowModal(false);
  };

  return (
    <div className="w-96 relative h-24">
      <Button
        onClick={handleClick}
        variant="primary"
        prefix={<img src={icon} className="w-[68px] pt-[3px] pl-[7px]" alt="icon" />}
        size="large"
        width="22rem"
        height="5rem"
        textClassName="justify-center items-center pr-4"
        className={className}
        strokeColor={strokeColor}
        strokeSize={strokeSize}
      >
        {label}
      </Button>
    </div>
  );
};

export default ModalSocialLogin;
