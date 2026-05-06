import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import CreateCharacterScene from '@component/web/template/wc-t-character-scene';
import ImageBGLogin from './assets/background-login.png';
import ConfigJson from './config/index.json';

const LoadingInfoBar: React.CSSProperties = {
  display: 'flex',
  width: 366 * 2,
  height: 62 * 2,
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 7,
  transform: 'translate(-50%, -50%)',
  left: '50%',
  top: '75%',
};

const loadingTitle: React.CSSProperties = {
  alignSelf: 'stretch',
  textAlign: 'center',
  fontFamily: 'Noto Sans Thai',
  fontSize: 24,
  fontStyle: 'normal',
  fontWeight: 700,
  lineHeight: 'normal',
  letterSpacing: -0.36,
};

const loadingProgressText: React.CSSProperties = {
  alignSelf: 'stretch',
  textAlign: 'right',
  fontFamily: 'Prompt',
  fontSize: 16,
  fontStyle: 'normal',
  fontWeight: 400,
  lineHeight: 'normal',
};

const loadingBarContainer: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: 4,
  width: '100%',
  height: 36,
  fontFamily: 'Noto Sans Thai',
  fontSize: '0.875rem',
  fontWeight: 'bold',
};

const loadingBar: React.CSSProperties = {
  flexGrow: 1,
  flexShrink: 0,
  flexBasis: 0,
  height: 16,
  backgroundColor: 'white',
  backgroundImage: 'linear-gradient(to bottom, white, white)',
  borderRadius: '1rem',
  borderWidth: '1px',
  borderColor: 'white',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
};

const loadingBarFill: React.CSSProperties = {
  width: '75%',
  height: 16,
  backgroundColor: '#4e04c8',
  borderRadius: '1rem 0 0 1rem',
  boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)',
};

const loadingBarPercentage: React.CSSProperties = {
  alignSelf: 'center',
  width: 48,
  height: 'stretch',
  fontFamily: 'Noto Sans Thai',
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333333',
};

const getRandomLetter = (): string => {
  const letters = ['A', 'B', 'C', 'D'];
  const randomIndex = Math.floor(Math.random() * letters.length);
  return letters[randomIndex];
};

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [progressPercentage, setprogressPercentage] = useState<number>(0);

  const LoadSize = 500;
  const characterData = {
    src: getRandomLetter(),
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setprogressPercentage((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return prevProgress;
        }
        return Math.min(prevProgress + Math.random() * 10, 100); // Increment progress by a random amount
      });
    }, 500); // Update progress every 500 milliseconds

    return () => {
      clearInterval(timer); // Clear timer when component unmounts
    };
  }, []);

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 bg-gray-800"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${ImageBGLogin})`, zIndex: 1 }}
      ></div>
      {/* Safezone */}
      <SafezonePanel
        style={{ zIndex: 2 }}
        className="absolute inset-0 bg-white bg-opacity-0"
      >
        {/* Container for the Three.js scene */}
        <CreateCharacterScene characterData={characterData} />

        <div style={LoadingInfoBar} className="absolute inset-0">
          <div style={loadingTitle}>{t('pre-loading')}... </div>
          <div style={loadingBarContainer}>
            <div style={loadingBar}>
              <div style={{ ...loadingBarFill, width: `${progressPercentage}%` }} />
            </div>
            <div style={loadingBarPercentage}>{Math.ceil(progressPercentage)} %</div>
          </div>
          <div style={loadingProgressText}>
            {((progressPercentage / 100) * LoadSize).toFixed(2)}KB/{LoadSize.toFixed(2)}KB
          </div>
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
