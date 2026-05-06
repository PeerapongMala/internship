import {
  GameplayTemplate,
  GameplayTemplateProps,
  GameStatus,
  CountdownPhase,
} from '@core-utils/scene/GameplayTemplate';
import { TimeManager } from '@core-utils/timer/time-manager';
import { useBackgroundMusicStore } from '@core-utils/sound/store/backgroundMusic';
import { playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';
import { SceneName } from '@/types/game';
import { SceneManager } from '@core-utils/scene/scene-manager';
import Gameplay from './components/gameplay';
import { ModalCountdown } from './components/modal-countdown';
import { ModalEndgame } from './components/modal-endgame';
import { ModalRound } from './components/modal-round';
import { useSceneScoreStore } from '../scene-score/sceneScoreStore';
import { useSceneGameplayStore } from './sceneGameplayStore';
import { useArcadeStore } from '@core-utils/api/arcade/arcade-store';
import { API } from '@core-utils/api';

// Class that extends GameplayTemplate and provides gameplay-specific logic
export class SceneGameplay extends GameplayTemplate {
  constructor(props: GameplayTemplateProps) {
    super({
      ...props,
      onGameEndCallback: async (_status: GameStatus) => {
        // Get data from gameplay store
        const { round, score, seconds, level, stars, exp } = useSceneGameplayStore.getState();

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
        setProps({ round, score, seconds, level, stars, exp });

        // Navigate to score scene
        SceneManager.getInstance().setScene(SceneName.SCORE);

        // TODO:
        // Reset gameplay store for next game
        // const { reset } = useSceneGameplayStore.getState();
        // reset();
      },
      onCounting: async (_second: number) => {
        void playSoundEffect(SOUND_GROUPS.sfx.countdown_start);
      }

    });
    // this.background = PUBLIC_ASSETS_LOCATION.image.background.gameplay;
    this.sceneInitial();
  }

  // Override sceneLoad to initialize config when scene becomes active
  sceneLoad = async () => {
    this._isActive = true;
    this.forceRerender();
    await this.initializeConfig();
  };

  // Implement: Load game config
  protected async onLoadConfig(): Promise<void> {
    let config = null;
    try {
      const response = await fetch('/config/monsterwave.json');
      if (response.ok) {
        config = await response.json();
      }
    } catch (err) {
      console.error('Failed to load config:', err);
    }

    if (config) {
      this.setConfig(config);
    }
  }

  // Implement: Handle game pause
  protected onGamePaused(): void {
    TimeManager.getInstance().pause();
    const { pauseSound } = useBackgroundMusicStore.getState();
    pauseSound();
  }

  // Implement: Handle game resume
  protected onGameResumed(): void {
    TimeManager.getInstance().resume();
    const { resumeSound } = useBackgroundMusicStore.getState();
    resumeSound();
  }

  // Implement: Handle game end
  protected onGameEnded(status: GameStatus): void {
    TimeManager.getInstance().stop();
    const { pauseSound } = useBackgroundMusicStore.getState();

    pauseSound();
    if (status === GameStatus.SUCCESS) {
      // Optional: subtle win cue (reuse level_up as placeholder)
      void playSoundEffect(SOUND_GROUPS.sfx.level_up);
    } else if (status === GameStatus.DEAD) {
      void playSoundEffect(SOUND_GROUPS.sfx.game_over);
    }
  }

  protected countdownTexts = {
    countdown_start: 'ภารกิจใหม่กำลังเริ่ม!',
    countdown_continue: 'เกมกำลังจะเริ่มต่อใน',
  };

  renderCountdown(): React.ReactNode {
    // return (
    //   // <ModalCountdown
    //   //   text={this.countdownTexts.countdown_start}
    //   //   seconds={3}
    //   // />
    //   <ModalEndgame
    //     text={this.countdownTexts.countdown_start}
    //   />
    // );

    if (!this.gameplayState.countdownState?.show) {
      return null;
    }

    const { seconds, text } = this.gameplayState.countdownState;

    return (
      <ModalCountdown
        text={text}
        seconds={seconds}
      />
    );
  }

  renderRoundDisplay(): React.ReactNode {
    if (!this.gameplayState.roundDisplay) {
      return null;
    }

    return (
      <ModalRound
        round={this.gameplayState.roundDisplay}
      />
    );
  }

  renderEndgame(): React.ReactNode {
    if (!this.gameplayState.endGame || this.gameplayState.statusGame === null) {
      return null;
    }

    return <ModalEndgame status={this.gameplayState.statusGame} />;
  }

  // Render game component with props from GameplayTemplate
  renderScene = () => {
    console.log('🎬 renderScene called, isGameStarted:', this.gameplayState.isGameStarted);
    return (
      <Gameplay
        config={this.gameplayState.waveConfig}
        isGameStarted={this.gameplayState.isGameStarted}
        isPause={this.gameplayState.isPause}
        isSystemPause={this.gameplayState.isSystemPause}
        isConfigEditorOpen={this.gameplayState.showConfigEditor} // Pass config editor state
        countdownState={this.gameplayState.countdownState}
        roundDisplay={this.gameplayState.roundDisplay}
        endGame={this.gameplayState.endGame}
        statusGame={this.gameplayState.statusGame}
        onGameEnd={(status: GameStatus) => this.endGame(status)}
        onPause={() => this.pauseGame()}
        onResume={() => this.resumeGame()}
        onShowRoundDisplayWithCountdown={(round: number, duration?: number) =>
          this.showRoundDisplayWithCountdown(round, duration)
        }
        onShowCountdown={(seconds: number, phase: CountdownPhase, text: string) =>
          this.showCountdown(seconds, phase, text)
        }
      />
    );
  };
}
