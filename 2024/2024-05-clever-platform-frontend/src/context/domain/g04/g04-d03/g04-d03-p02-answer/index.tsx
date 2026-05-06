import React, { useEffect } from 'react';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import ThreeModelRenderer from '@component/game/model-renderer';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import ImageBGLogin from './assets/background.svg';
import correcticon from './assets/correcticon.svg';
import defeatImage from './assets/defeat.svg';
import avatar2 from './assets/flower.svg';
import incorrecticon from './assets/incorrect.png';
import settingicon from './assets/setting.png';
import swordicon from './assets/sword.png';
import teachericon from './assets/teacher.png';
import styles from './index.module.css';
const loadFonts = () => {
  const linkIBM = document.createElement('link');
  linkIBM.href =
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&display=swap';
  linkIBM.rel = 'stylesheet';

  const linkNoto = document.createElement('link');
  linkNoto.href =
    'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;700&display=swap';
  linkNoto.rel = 'stylesheet';

  const linkPrompt = document.createElement('link');
  linkPrompt.href =
    'https://fonts.googleapis.com/css2?family=Prompt:wght@400;700&display=swap';
  linkPrompt.rel = 'stylesheet';

  document.head.appendChild(linkIBM);
  document.head.appendChild(linkNoto);
  document.head.appendChild(linkPrompt);
};

const DomainJSX = () => {
  useEffect(() => {
    loadFonts();
  }, []);

  const safezoneStyle: React.CSSProperties = {
    width: `1280px`,
    height: `720px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 bg-gray-800"
    >
      <div
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${ImageBGLogin})` }}
      ></div>
      <SafezonePanel className="absolute inset-0 bg-white bg-opacity-0">
        <div className={styles.page1}>
          <div className={styles.statusbar}>
            <div className={styles.statusgroup}>
              <button className={styles.circularbutton} style={{ marginLeft: '10px' }}>
                <div className="highlight"></div>
                <img
                  src={settingicon}
                  alt="Help Icon"
                  className={styles.circularbuttonicon}
                />
              </button>
              <button className={styles.circularbutton} style={{ marginLeft: '10px' }}>
                <div className="highlight"></div>
                <img
                  src={teachericon}
                  alt="Help Icon"
                  className={styles.circularbuttonicon}
                />
              </button>
            </div>

            <div className={`${styles.statusgroup} ${styles.mainInfo}`}>
              <div className={styles.title}>1-1) การอ่านจำนวนนับ</div>
              <div className={`${styles.title} ${styles.exercisebutton}`}>แบบฝึกหัด</div>
            </div>

            <div className={`${styles.statusgroup} ${styles.progressinfo}`}>
              <div className={styles.progressdetail}>
                <span className={styles.title}>ด่าน: 004</span>
                <span className={styles.correcticon}>
                  <img
                    src={correcticon}
                    alt="correcticon"
                    className={styles.correctincorrecticon}
                  />
                </span>
                <span className={styles.title}>2/4</span>
                <span className={styles.incorrecticon}>
                  <img
                    src={incorrecticon}
                    alt="incorrect"
                    className={styles.correctincorrecticon}
                  />
                </span>
                <span className={styles.title}>1/4</span>
              </div>
              <div className={styles.timerinfo}>
                <div className={styles.timericon}></div>
                <div className={styles.title}>30s</div>
              </div>
            </div>

            <div className={styles.statusgroup}>
              <button className={`${styles.circularbutton} ${styles.green}`}>
                <div className="highlight"></div>
                <img
                  src={swordicon}
                  alt="Help Icon"
                  className={`${styles.circularButtonIcon} ${styles.green}`}
                />
              </button>
            </div>
          </div>
          <div className={styles.defeat}>
            <img
              src={defeatImage}
              alt="Defeat Icon"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div className={styles.cardDescription}>
            <div className={styles.modalTitleArea}>
              <div className={styles.titletext}>คุณตอบผิด</div>
            </div>
            <div className={styles.descriptionArea}>
              <span className={styles.titleDescription}>คำตอบที่ถูกต้องคือ ก</span>
              <span className={styles.titleDescription}>
                Lorem ipsum dolor sit amet consectetur. Fermentum vitae amet placerat sit
                metus nibh elementum felis. Nunc neque id dictum magna mauris lacus. Morb
              </span>
            </div>
            <div className={styles.buttonArea}>
              <button className={`${styles.circularButton} ${styles.bule}`}>
                <div className="highlight"></div>
                <span style={{ color: 'white' }}>เข้าใจแล้ว</span>
              </button>
            </div>
            <div className={styles.Avatar1}>
              <ThreeModelRenderer modelSrc={'A'} className="h-auto w-100%" />
            </div>
            <div className={styles.Avatar2}>
              <img
                src={avatar2}
                alt="Avatar2"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
