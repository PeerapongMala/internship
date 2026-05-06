import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import StoreGame from '@global/store/game';
import ConfigJson from './config/index.json';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const [sTest, sTestSet] = useState('Test');
  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
  }, []); // Make sure to provide an appropriate dependency array

  const [scale, setScale] = useState(1);
  const [inputText, setInputText] = useState('');
  const [selectedOption, setSelectedOption] = useState('option1');

  const scenarioSize = { width: 1440, height: 810 };

  const uiStyle: React.CSSProperties = {
    width: `${scenarioSize.width}px`,
    height: `${scenarioSize.height}px`,
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  };

  const sideMenuStyle: React.CSSProperties = {
    width: `200px`,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(5px)',
    overflowY: 'auto',
    padding: '15px',
    boxSizing: 'border-box',
    zIndex: 10,
  };

  return (
    <ResponsiveScaler deBugVisibleIs className="flex-1 bg-gray-800">
      <div style={uiStyle} className="bg-gray-800 bg-opacity-30 text-white">
        <div className="w-full h-full p-4 flex flex-col">
          <h2 className="text-5xl mb-4 text-center text-yellow-400 font-bold">
            Epic Adventure
          </h2>
          <p className="mb-4 text-center text-base">Embark on a journey of a lifetime!</p>

          <div className="flex justify-center space-x-4 mb-6">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your hero's name"
              className="text-xl p-2 w-64 bg-white bg-opacity-10 border border-white border-opacity-30 text-white rounded"
            />

            <select
              title="hero class"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="text-xl p-2 w-64 bg-white bg-opacity-10 border border-white border-opacity-30 text-white rounded"
            >
              <option value="option1">Warrior</option>
              <option value="option2">Mage</option>
              <option value="option3">Rogue</option>
            </select>
          </div>

          <div className="w-full max-w-xl mx-auto h-36 overflow-y-scroll p-3 text-base bg-white bg-opacity-10 border border-white border-opacity-30 rounded mb-6">
            <p className="mb-2">
              Welcome to Epic Adventure, a world of magic and mystery!
            </p>
            <p className="mb-2">
              Choose your hero's name and class to begin your journey.
            </p>
            <p className="mb-2">
              Explore vast landscapes, battle fearsome monsters, and uncover ancient
              secrets.
            </p>
            <p>Are you ready to become a legend?</p>
          </div>

          <div className="flex justify-center space-x-6">
            <button className="px-8 py-4 text-2xl bg-green-600 hover:bg-green-700 text-white rounded cursor-pointer transition-colors">
              Start Adventure
            </button>
            <button className="px-8 py-4 text-2xl bg-blue-600 hover:bg-blue-700 text-white rounded cursor-pointer transition-colors">
              Game Options
            </button>
          </div>
        </div>
      </div>
      <div style={sideMenuStyle}>
        <h3 className="text-white text-lg mb-3 font-bold">Game Menu</h3>
        <ul className="text-white space-y-2">
          <li className="hover:bg-blue-500 px-2 py-1 rounded cursor-pointer transition-colors">
            New Game
          </li>
          <li className="hover:bg-blue-500 px-2 py-1 rounded cursor-pointer transition-colors">
            Load Game
          </li>
          <li className="hover:bg-blue-500 px-2 py-1 rounded cursor-pointer transition-colors">
            Settings
          </li>
          <li className="hover:bg-blue-500 px-2 py-1 rounded cursor-pointer transition-colors">
            Achievements
          </li>
          <li className="hover:bg-blue-500 px-2 py-1 rounded cursor-pointer transition-colors">
            Exit
          </li>
        </ul>
      </div>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
