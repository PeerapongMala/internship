import { useState, useEffect } from 'react';
import './css/style.css';
import { logger } from '@core-utils/debug/logger';
import { SceneName } from './types/game';
import { Workspace } from './scenes/scene-workspace';
import { SceneMainMenu } from './scenes/scene-main-menu';
import { SceneGameplay } from './scenes/scene-gameplay';
import { SceneScore } from './scenes/scene-score';
import { SceneLogin } from '@core-utils/scene/scene-login';
import { SceneManagerContent } from '@core-utils/scene/SceneManagerContent';
import { SceneManager } from '@core-utils/scene/scene-manager';
import FloatingModalSystemInfo from '@core-utils/debug/sytem-monitor/FloatingModalSystemInfo';
import SceneGameplayDebugTool from './scenes/scene-gameplay/components/SceneGameplayDebugTool';
import SceneScoreDebugTool from './scenes/scene-score/components/SceneScoreDebugTool';
import SettingsPanel from '@core-utils/sound/component/molecule/cw-setting-panel';
import AuthorizeSession from '@core-utils/api/arcade/component/AutherizeSession';

import { initializeSounds } from '@core-utils/sound/store/soundSourceStore';
import { SOUND_GROUPS } from './assets/public-sound';
import { initAudioSystem } from './utils/core-utils/sound/simpleAudio';

const SwitchSceneButtons = () => {
  const [sceneName, setSceneName] = useState('');
  const sceneManager = SceneManager.getInstance();

  useEffect(() => {
    sceneManager.subscribeSceneChange(setSceneName);
  }, []);

  const sceneSwitchBtn = Object.entries(SceneName);
  const sceneSwitchElements = sceneSwitchBtn.map(([sceneKey, sceneNameEnum]) => {
    return (
      <div key={sceneKey}>
        <button
          className="underline"
          onClick={() => {
            sceneManager.setScene(sceneNameEnum);
          }}
        >
          SceneName.{sceneNameEnum}
        </button>
        <br />
      </div>
    );
  });

  return (
    <div className="relative gap-2">
      {/* <TimeProviderDemo /> */}
      {sceneSwitchElements}
      <br />
      <p>{sceneManager.getCurrentSceneName()} Debug</p>

      {sceneName === SceneName.GAME && <SceneGameplayDebugTool />}
      {sceneName === SceneName.SCORE && <SceneScoreDebugTool />}
    </div>
  );
};

const initScenes = () => {
  const sceneManager = SceneManager.getInstance();

  const sceneWorkspace = new Workspace({ sceneName: SceneName.WORKSPACE });
  const sceneMenu = new SceneMainMenu({ sceneName: SceneName.MENU });
  const sceneGame = new SceneGameplay({ sceneName: SceneName.GAME });
  const sceneScore = new SceneScore({ sceneName: SceneName.SCORE });
  const sceneLogin = new SceneLogin({ sceneName: SceneName.LOGIN });

  sceneManager.addScene(sceneWorkspace);
  sceneManager.addScene(sceneMenu);
  sceneManager.addScene(sceneGame);
  sceneManager.addScene(sceneScore);
  sceneManager.addScene(sceneLogin);

  // sceneManager.setScene(SceneName.WORKSPACE);
  sceneManager.setScene(SceneName.MENU);
  // sceneManager.setScene(SceneName.GAME);
  // sceneManager.setScene(SceneName.SCORE);

  const sceneList = sceneManager.getSceneList();
  console.debug(logger.getCallerMessage('Scenes initialized:', sceneList));
};

// Initialize sounds and scenes BEFORE App component renders
initAudioSystem(SOUND_GROUPS.bgm, SOUND_GROUPS.sfx); // Initialize audio system with sound sources
initScenes();

const App = () => {
  const isDebugMode = import.meta.env.VITE_DEBUG_CODE ===
    new URLSearchParams(window.location.search).get('debugCode');
  return (
    <div className={`${!import.meta.env.DEV ? 'select-none' : ''}`}>
      <AuthorizeSession />
      <SceneManagerContent />
      {isDebugMode && (
        <FloatingModalSystemInfo settingChildren={<SettingsPanel />}>
          <SwitchSceneButtons />
        </FloatingModalSystemInfo>
      )}
    </div>
  );
};

export default App;
