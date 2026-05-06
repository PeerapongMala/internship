import './index.module.css';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import StoreGame from '@global/store/game';
import ImageBG from './assets/background.png';
import Debug from './component/web/templates/wc-a-debug';
import SafezonePanel from './component/web/templates/wc-a-safezone-panel';
import ModalHint from './component/web/templates/wc-t-modal-hint';
import ModalZoomImage from './component/web/templates/wc-t-modal-zoom-image';
import Template1 from './component/web/templates/wc-t-template-1';
import Template2 from './component/web/templates/wc-t-template-2';
import ConfigJson from './config/index.json';
import { StateFlow } from './type';

const totalTime = 60;

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const [timer, setTimer] = useState(totalTime);
  const [template, setTemplate] = useState(1);
  const [showImage, setShowImage] = useState(false);
  const [image, setImage] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleZoom = (img: string) => {
    setImage(img);
    setShowImage(true);
  };

  const handleHint = (question: string) => {
    setShowHint(true);
  };

  useEffect(() => {
    // Reset the timer and start counting again when the template changes
    setTimer(totalTime);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on template change
  }, [template]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(StateFlow.Gameplay);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const isModalActive = showImage || showHint;

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 bg-gray-800 body"
    >
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${ImageBG})` }}
        onClick={() => setTemplate((prev) => (prev === 1 ? 2 : 1))}
      />
      {isModalActive && <div className="absolute inset-0 bg-black opacity-70 z-10" />}
      <ModalZoomImage setShowModal={setShowImage} showModal={showImage} image={image} />
      <ModalHint showModal={showHint} setShowModal={setShowHint} text="Hint" />
      <SafezonePanel className="flex items-center inset-0">
        <Debug />
        {template === 1 && (
          <Template1
            timeLeft={timer}
            totalTime={totalTime}
            handleZoom={handleZoom}
            handleHint={handleHint}
          />
        )}
        {template === 2 && (
          <Template2
            timeLeft={timer}
            totalTime={totalTime}
            handleZoom={handleZoom}
            handleHint={handleHint}
          />
        )}
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
