import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import WCAButton1 from '@global/component/web/atom/wc-a-button-1';
import StoreGame from '@global/store/game';
import ConfigJson from './config/index.json';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const [sTest, sTestSet] = useState('Test');
  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
  }, []); // Make sure to provide an appropriate dependency array

  return (
    <div className="uh-h-screen text-white">
      Test i18n : {t('test')} <br />
      Hello World <br />
      <textarea
        className="uh-w-full uh-h-20 text-black"
        onChange={(e) => {
          sTestSet(e.target.value);
          // i18n.changeLanguage(e.target.value);
        }}
        placeholder="Test DOM Input"
      ></textarea>
      <br />
      <span>{sTest}</span>
      <br />
      <select
        title="Select Language"
        className="uh-w-full text-black"
        defaultValue={i18n.language}
        onChange={(e) => {
          i18n.changeLanguage(e.target.value);
        }}
      >
        <option value="en">English</option>
        <option value="th">Thailand</option>
        <option value="cn">China</option>
      </select>
      <WCAButton1 />
    </div>
  );
};

export default DomainJSX;
