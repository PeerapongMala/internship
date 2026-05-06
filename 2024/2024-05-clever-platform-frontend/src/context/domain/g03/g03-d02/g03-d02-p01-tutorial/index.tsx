import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import Modal from '@global/component/web/molecule/wc-m-modal-gameplay';

import StoreGame from '@global/store/game';
import { useNavigate } from '@tanstack/react-router';
import ImageBGShop from './assets/background-shop.png';
import StoreBackgroundMusic from '@store/global/background-music';
import ConfigJson from './config/index.json';
// import styles from './index.module.css';
import ButtonBack from '@component/web/atom/wc-a-button-back';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import StoreGlobal from '@store/global';
import StoreSubjects from '@store/global/subjects';
import BlankImage from './assets/blank.png';

enum STATEFLOW {
  Input = 0,
  Success = 1,
  Fail = 2,
}

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [schoolID, setSchoolID] = useState('');
  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Input);

    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []); // Make sure to provide an appropriate dependency array

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const navigate = useNavigate();

  const handleBack = () => {
    if (stateFlow == STATEFLOW.Input) navigate({ to: '/main-menu' });
    else StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Input);
    // navigate({ to: '/main-menu' });
  };

  const handleNext = () => {
    if (stateFlow == STATEFLOW.Input || stateFlow == STATEFLOW.Fail) {
      if (schoolID == '1234') {
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Success);
      } else {
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Fail);
      }
    }
    if (stateFlow == STATEFLOW.Fail) {
      StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Input);
    }
  };

  const dialogStyle: React.CSSProperties = {
    // width: `${374 * multipleScale}px`,
    // height: `${220 * multipleScale}px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',

    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '732px',
    gap: '16px',
    fontFamily: 'Noto Sans Thai',

    padding: '8px 8px 16px 8px',
  };

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      <SafezonePanel className="absolute inset-0 text-black overflow-hidden">
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '10%',
            top: '7%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Noto Sans Thai',
          }}
        >
          <ButtonBack
            onClick={handleBack}
            className="absolute w-[67px] h-[67px] left-[7.8rem] cursor-pointer"
          />
          <h2 className="header text-5xl font-semibold">{t('tutorial_label')}</h2>
        </div>

        <div className="body" style={dialogStyle}>
          <div className="flex space-x-4">
            {/* Flex container for centering and spacing */}
            <div className="flex space-x-4">
              <Link to="/main-menu/tutorial/multiple-choices">
                <ColumnItem text={t('multiple_choices')} />
              </Link>
              <Link to="/main-menu/tutorial/sort">
                <ColumnItem text={t('sort')} />
              </Link>
              <Link to="/main-menu/tutorial/sort-group">
                <ColumnItem text={t('pair')} />
              </Link>
              <Link to="/main-menu/tutorial/sort-fill-group">
                <ColumnItem text={t('placeholder')} />
              </Link>
              <Link to="/main-menu/tutorial/input">
                <ColumnItem text={t('input')} />
              </Link>
            </div>
          </div>
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

const ColumnItem = ({ text }: { text: string }) => {
  return (
    <div className="min-w-0 flex flex-row items-center transition-transform active:scale-90 hover:scale-110">
      <div
        className="bg-white/50 shadow-[0_4px_4px_rgba(0,0,0,0.15)] w-[220px] h-[275px] flex justify-center cursor-pointer p-1"
        style={{ borderStyle: 'none none none solid', borderRadius: '28px' }}
      >
        <div className="bg-white rounded-[24px] flex flex-col h-full w-full justify-center items-center text-center text-xl">
          <div className="text-gray-800 font-semibold p-2">{text}</div>
        </div>
      </div>
    </div>
  );
};

export default DomainJSX;
