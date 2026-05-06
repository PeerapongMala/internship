import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import {
  GameplayTemplate,
  GameplayTemplateProps,
  GameStatus,
} from '@core-utils/scene/GameplayTemplate';
import Gameplay from './components/gameplay';
import { TimeManager } from '@core-utils/timer/time-manager';
import { useBackgroundMusicStore } from '@core-utils/sound/store/backgroundMusic';
import { useSoundEffectStore } from '@core-utils/sound/store/soundEffect';
import { SOUND_GROUPS } from '@assets/public-sound';
import { waveConfig } from './components/gameplay/types/game-config';
import { CountdownModal } from './components/CountdownModal';
import { ModalGameOver } from './components/gameplay/components/modal-gameover';
import { useSceneGameplayStore } from './sceneGameplayStore';
import { useSceneScoreStore } from '@/scenes/scene-score/sceneScoreStore';
import { SceneManager } from '@core-utils/scene/scene-manager';
import { SceneName } from '@/types/game';
import { API } from '@core-utils/api';
import { useArcadeStore } from '@core-utils/api/arcade/arcade-store';

// Class that extends GameplayTemplate and delegates rendering to the functional component
export class SceneGameplay extends GameplayTemplate {
  constructor(props: GameplayTemplateProps) {
    super({
      ...props,
      onGameEndCallback: async (_status: GameStatus) => {
        // Get data from gameplay store
        const { round, score, seconds } = useSceneGameplayStore.getState();

        // Submit result to API before navigating to score scene
        const { playToken } = useArcadeStore.getState();
        if (playToken) {
          try {
            const res = await API.arcade.SubmitResult({
              play_token: playToken,
              score,
              wave: round,
              time_used: Math.floor(seconds),
            });
            if (res.status_code === 200) {
              console.log('Score submitted successfully');
            } else {
              console.log('Failed to submit score:', res.message);
            }
          } catch (err) {
            console.error('Failed to submit result:', err instanceof Error ? err.message : 'Unknown error');
            // TODO: Handle submission error (e.g., show notification, retry, etc.)
          }
        }

        // Set data to score store
        const { setProps } = useSceneScoreStore.getState();
        setProps({ round, score, seconds });

        // Navigate to score scene
        SceneManager.getInstance().setScene(SceneName.SCORE);

        // Reset gameplay store for next game
        const { reset } = useSceneGameplayStore.getState();
        reset();
      }
    });
    this.background = PUBLIC_ASSETS_LOCATION.image.background.gameplay;
    this.sceneInitial();
  }

  // Override sceneLoad to initialize config when scene becomes active
  sceneLoad = async () => {
    // Set scene as active
    this._isActive = true;
    this.forceRerender();

    // Initialize config
    await this.initializeConfig();
  }

  // Implement config loading
  protected async onLoadConfig(): Promise<void> {
    let config: waveConfig | null = null;
    try {
      const response = await fetch(PUBLIC_ASSETS_LOCATION.config.waveConfig);
      if (response.ok) {
        config = await response.json();
        console.log('📂 Loaded config from file');
      } else {
        console.error('Failed to fetch config file:', response.status);
      }
    } catch (err) {
      console.error('Failed to load config from file:', err);
    }

    // Set the loaded config to gameplayState (triggers re-render)
    // Even if config is null, set it so initializeConfig knows we tried
    console.log('💾 Setting waveConfig to state in onLoadConfig:', config);
    // this.gameplayState.waveConfig = config;
    this.setConfig(config);
    console.log('✅ gameplayState.waveConfig set in onLoadConfig');
  }

  // Implement abstract methods from GameplayTemplate
  protected onGamePaused(): void {
    // Pass isUserPause flag - only user pauses should prevent auto-resume on tab switch
    const isUserPause = !this.gameplayState.isSystemPause;
    TimeManager.getInstance().pause(isUserPause);
    // if (!this.gameplayState.isSystemPause) {
    //   const { pauseSound } = useBackgroundMusicStore.getState();
    //   pauseSound();
    // }
  }

  protected onGameResumed(): void {
    TimeManager.getInstance().resume();
    // const { resumeSound } = useBackgroundMusicStore.getState();
    // resumeSound();
  }

  protected onGameEnded(status: GameStatus): void {
    TimeManager.getInstance().stop();
    const { pauseSound } = useBackgroundMusicStore.getState();
    const { playEffect } = useSoundEffectStore.getState();

    pauseSound();
    if (status === GameStatus.SUCCESS) {
      playEffect(SOUND_GROUPS.sfx.success_score);
    } else if (status === GameStatus.DEAD) {
      playEffect(SOUND_GROUPS.sfx.level_fail);
    }
  }

  renderCountdown(): React.ReactNode {
    if (!this.gameplayState.countdownState?.show) {
      return null;
    }

    const { seconds, text } = this.gameplayState.countdownState;

    return (
      <CountdownModal
        seconds={seconds}
        text={text}
      // onFinish={() => {
      //   resumeSound();
      // }}
      />
    );
  }

  renderRoundDisplay(): React.ReactNode {
    if (this.gameplayState.roundDisplay === null) {
      return null;
    }

    return (
      <div className="bg-opacity-70 pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black">
        <div className="flex flex-col items-center justify-center">
          <img src={`${PUBLIC_ASSETS_LOCATION.image.round_label}`} alt="" />
          <div className="font-cherry-bomb-one w-[200px] text-center text-[86px] font-bold text-[#fe679a] [-webkit-text-stroke:1px_#ffffff]">
            {this.gameplayState.roundDisplay}
          </div>
        </div>
      </div>
    );
  }

  renderEndGame(): React.ReactNode {
    if (!this.gameplayState.endGame || this.gameplayState.statusGame === null) {
      return null;
    }

    return <ModalGameOver status={this.gameplayState.statusGame} />;
  }

  renderScene = () => {
    // // GameplayTemplate will handle ModalConfigEditor rendering
    // // Pass game state and callbacks to Gameplay component
    // console.log('🎬 renderScene - waveConfig from state:', this.gameplayState.waveConfig);
    return (
      <Gameplay
        isGameStarted={this.gameplayState.isGameStarted}
        isGameEnding={this.gameplayState.isGameEnding}
        isPause={this.gameplayState.isPause}
        isSystemPause={this.gameplayState.isSystemPause}
        endGame={this.gameplayState.endGame}
        statusGame={this.gameplayState.statusGame}
        countdownState={this.gameplayState.countdownState}
        roundDisplay={this.gameplayState.roundDisplay}
        config={this.gameplayState.waveConfig}
        onGameEnd={(status) => this.endGame(status)}
        onPause={() => this.pauseGame()}
        onResume={() => this.resumeGame()}
        onShowRoundDisplayWithCountdown={(round, duration) => this.showRoundDisplayWithCountdown(round, duration)}
        onShowCountdown={(seconds, phase, text) => this.showCountdown(seconds, phase, text)}
      />
    );
  };
}
