import { useTranslation } from 'react-i18next';

import ImageIconFullIcon from '@global/assets/full-screen-black.svg';
import IconUpload from '@global/assets/icon-upload.svg';
import Button from '@global/component/web/atom/wc-a-button';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import ImageIconGlobe from '../../../assets/icon-globe.svg';
import ImageIconUpload from '../../../assets/icon-upload.svg';
import ConfigJson from '../../../config/index.json';
import LoginLogo from '../organisms/wc-a-login-logo';


const LINK_LINE_OA_URL = import.meta.env.VITE_LINK_LINE_OA_URL ?? '/line';

const ContainerLeft = ({
  setShowModalSocialLogin,
  setShowModalChangeLanguage,
  enableEnterAdminMode,
}: {
  setShowModalSocialLogin: (x: boolean) => void;
  setShowModalChangeLanguage: (x: boolean) => void;
  enableEnterAdminMode?: 'pressed' | 'clicked';
}) => {
  const navigate = useNavigate();

  const [classNameContactUs, setClassNameContactUs] = useState('');
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const textLanguage: any = {
    en: 'EN',
    th: 'ไทย',
    zh: '中文',
  };

  const handleClickContactUs = () => {
    setClassNameContactUs('text-red-500');
    setTimeout(() => {
      setClassNameContactUs('');
    }, 2000);
    const lineUrl = LINK_LINE_OA_URL || "https://lin.ee/5OpvRTO"
    const fullUrl = new URL(lineUrl, window.location.origin).href;
    window.open(fullUrl, '_blank');
  };
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen?.().catch(console.error);
    } else {
      document.exitFullscreen?.().catch(console.error);
    }
  };


  return (
    <div className="flex flex-col gap-10 h-full w-full relative">
      <div className='flex justify-center items-center -mt-40'>
        <LoginLogo enableEnterAdminMode={enableEnterAdminMode} />
      </div>
      <div className="flex flex-col gap-5 -mt-[200px]">
        <div className="flex p-2 px-6 flex-col items-center gap-2">
          <div className="text-3xl font-bold text-center">
            {t('title_smart_classroom_system')}
          </div>
        </div>
        <div className="flex h-20 px-12 justify-center items-center gap-5">
          <Button
            onClick={() => {
              setShowModalSocialLogin(true);
            }}
            size="large"
          >
            {t('login_with_other_methods')}
          </Button>
        </div>
        <div className="flex h-20 px-12 justify-center items-center gap-5 text-2xl">
          {t('cant_sign_in')}{' '}
          <p
            className={'underline font-semibold cursor-pointer ' + classNameContactUs}
            onClick={handleClickContactUs}
          >
            {t('contact_us')}
          </p>
        </div>
        <div className="flex justify-center items-start gap-5 pl-0 pb-5">
          <Button
            onClick={() => {
              navigate({ to: '/upload', viewTransition: true });
            }}
            variant="secondary"
            textClassName="text-[1.5rem] justify-start items-center pl-3"
            width="63px"
            height="63px"
          >
            <img src={IconUpload} alt="IconUpload" className="h-9 w-10" />
          </Button>
          <Button
            prefix={<img src={ImageIconGlobe} className="w-[70px] pl-[7px] pt-[5px]" />}
            onClick={() => setShowModalChangeLanguage(true)}
            variant="secondary"
            textClassName="text-[1.5rem] justify-start items-center pl-3"
            width="150px"
            height="63px"
          >
            {textLanguage?.[i18n.language] || 'Language'}
          </Button>
          <Button
            variant="secondary"
            width="63px"
            height="63px"
            onClick={() => {
              navigate({ to: '/offline-history', viewTransition: true });
            }}
          >
            <div className="h-9 w-10">
              <img src={ImageIconUpload} alt="ImageIconUpload" className="h-9 w-10" />
            </div>
          </Button>
          <Button
            variant="secondary"
            width="63px"
            height="63px"
            onClick={toggleFullScreen}
          >
            <div className="h-9 w-10">
              <img src={ImageIconFullIcon} alt="ImageIconUpload" className="h-9 w-10" />
            </div>
          </Button>
        </div>
      </div>

    </div>
  );
};

export default ContainerLeft;
