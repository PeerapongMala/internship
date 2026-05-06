import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import StoreGame from '@global/store/game';
import ImageBGLogin from './assets/background-login.jpg';
import ImageContainerOuter from './assets/container-outer.png';
import ImagePrivacy from './assets/privacy.png';
import ConfigJson from './config/index.json';

enum StateFlow {
  Language = 0,
  Privacy = 1,
}

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(0);
  }, []); // Make sure to provide an appropriate dependency array

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  // const { test1 } = StoreGame.StateGet(['test1']);
  // StoreGame.MethodGet().Test1Increment();

  // Menu

  //

  //
  // 1. เอา Class นำหน้า
  // 2. เอาสิ่งสำคัญขึ้นก่อน
  // 3. ถ้าใส่ได้ให้ใส่ประเภทตัวแปรต่อท้ายด้วย
  // 4. ใส่ Dict , List ต่อท้าย
  // hungarian notation

  // react hook
  // const [count, setCount] = useState(0);
  // const incrementCount = () => {
  //   setCount(count + 1);
  // };

  // const decrementCount = () => {
  //   setCount(count - 1);
  // };

  const multipleScale = 2;
  // 640 * 360 : 16:9 > 1440 * 810 > x2.25
  const safezoneStyle: React.CSSProperties = {
    width: `1280px`,
    height: `720px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const dialogLanguageStyle: React.CSSProperties = {
    width: `${374 * multipleScale}px`,
    height: `${220 * multipleScale}px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundImage: `url(${ImageContainerOuter})`,
  };

  const dialogPrivacyStyle: React.CSSProperties = {
    width: `${434 * multipleScale}px`,
    height: `${350 * multipleScale}px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundImage: `url(${ImagePrivacy})`,
  };

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 bg-gray-800"
    >
      {/* Background Image */}
      <div
        // className="absolute inset-0 bg-contain bg-bottom bg-no-repeat"
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${ImageBGLogin})` }}
      ></div>
      {/* Safezone */}
      <div
        style={safezoneStyle}
        className="absolute inset-0 bg-white bg-opacity-0 border-4 border-red-500 border-dashed"
      >
        {stateFlow == 0 && (
          /* Language */
          <div
            // className="absolute inset-0 bg-contain bg-bottom bg-no-repeat"
            className="absolute inset-0 bg-cover bg-center"
            style={dialogLanguageStyle}
            onClick={() => {
              StoreGame.MethodGet().State.Flow.Set(StateFlow.Privacy);
            }}
          ></div>
        )}
        {stateFlow == 1 && (
          /* Privacy */
          <div
            // className="absolute inset-0 bg-contain bg-bottom bg-no-repeat"
            className="absolute inset-0 bg-cover bg-center"
            style={dialogPrivacyStyle}
            onClick={() => {
              StoreGame.MethodGet().State.Flow.Set(StateFlow.Language);
            }}
          ></div>
        )}
      </div>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
