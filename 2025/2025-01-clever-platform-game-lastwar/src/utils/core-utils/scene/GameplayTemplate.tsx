import React from 'react';
import { SceneTemplate, SceneTemplateProps } from './SceneTemplate';
import { ModalConfigEditor } from '@core-utils/ui/modal-config-editor';

// ========================================
// Enums
// ========================================
export enum CountdownPhase {
  START = 'start',       // Initial game start or wave start
  CONTINUE = 'continue', // Resume after user pause
  WAVE = 'wave',        // New wave starting (system pause)
}

export enum ConfigEditorPhase {
  BEFORE_GAME = 'before-game', // Show config editor before game starts
  AFTER_GAME = 'after-game',   // Show config editor after game ends
}

export enum GameStatus {
  SUCCESS = 'success', // Game completed successfully
  DEAD = 'dead',       // Game over (failed)
}

// ========================================
// GameplayTemplate Props Interface
// ========================================
export interface GameplayTemplateProps extends SceneTemplateProps {
  // Callback during countdown (every second)
  onCounting?: (second: number) => void;
  // Callback when game ends in non-debug mode (to navigate to score scene)
  onGameEndCallback?: (status: GameStatus) => void;
}

// ========================================
// GameplayTemplate State Interface
// ========================================
export interface GameplayTemplateState {
  forceRenderKey: number;

  // Wave Config - store in state for proper reactivity
  waveConfig: any | null;

  // Config Editor Modal States
  showConfigEditor: boolean;
  configEditorPhase: ConfigEditorPhase;
  editableConfig: any | null;

  // Game Flow States
  isGameStarted: boolean;
  isGameEnding: boolean;
  isPause: boolean;
  isSystemPause: boolean; // True when paused by system (round/countdown), false when paused by user
  endGame: boolean;
  statusGame: GameStatus | null;

  // Loading State
  isSubmittingScore: boolean;

  // Countdown States
  countdownState: {
    show: boolean;
    seconds: number;
    phase: CountdownPhase;
    text: string;
  } | null;

  // Round Display
  roundDisplay: number | null;
}

// ========================================
// GameplayTemplate Class
// ========================================
/**
 * Abstract base class for gameplay scenes that provides common functionality:
 * - Config editor modal management (before/after game)
 * - Game flow control (start, pause, resume, end)
 * - Countdown management
 * - Round display
 * - Sound management integration
 * 
 * Extend this class to create new gameplay scenes with consistent behavior.
 */
export abstract class GameplayTemplate<
  P extends GameplayTemplateProps = GameplayTemplateProps,
  S extends GameplayTemplateState = GameplayTemplateState
> extends SceneTemplate {
  // Protected state that child classes can access
  protected gameplayState: S;

  // Props with proper type
  protected gameplayProps: P;

  // Debug mode flag
  protected isDebugMode = import.meta.env.VITE_DEBUG_CODE ===
    new URLSearchParams(window.location.search).get('debugCode');

  // Countdown texts (can be overridden by child classes)
  protected countdownTexts = {
    countdown_start: 'ภารกิจรอบใหม่ เริ่มแล้ว!',
    countdown_continue: 'เกมกำลังจะเริ่มต่อใน',
  };

  // Visibility handler for tab switching (pause countdown when tab hidden)
  private visibilityHandler: (() => void) | null = null;

  constructor(props: P) {
    super(props);
    this.gameplayProps = props;

    // Initialize gameplay state using reset method
    this.gameplayState = {
      forceRenderKey: 0,
      waveConfig: null,
      showConfigEditor: false,
      configEditorPhase: ConfigEditorPhase.BEFORE_GAME,
      editableConfig: null,
    } as S;

    this.resetGameplayState();
    this.setupVisibilityHandler();
  }

  // ========================================
  // State Management Methods
  // ========================================

  /**
   * Reset gameplay state to initial values
   * Used in constructor and sceneUnload
   */
  protected resetGameplayState(): void {
    this.gameplayState.isGameStarted = false;
    this.gameplayState.isGameEnding = false;
    this.gameplayState.isPause = false;
    this.gameplayState.isSystemPause = false;
    this.gameplayState.endGame = false;
    this.gameplayState.statusGame = null;
    this.gameplayState.isSubmittingScore = false;
    this.gameplayState.countdownState = null;
    this.gameplayState.roundDisplay = null;
    // Don't reset waveConfig here - it should persist
  }

  // ========================================
  // Config Editor Methods
  // ========================================

  /**
   * Shows the config editor modal with the given config
   * @param config - The configuration to edit
   * @param phase - Whether this is before or after the game
   */
  protected showConfigEditorModal(config: any, phase: ConfigEditorPhase = ConfigEditorPhase.BEFORE_GAME) {
    // If config is null/undefined, skip showing modal and start game directly
    if (!config) {
      console.warn('⚠️ Cannot show config editor with null config, starting game directly');
      this.startGame();
      return;
    }

    this.gameplayState.editableConfig = config;
    this.gameplayState.configEditorPhase = phase;
    this.gameplayState.showConfigEditor = true;
    this.forceRerender();
  }

  /**
   * Hides the config editor modal
   */
  protected hideConfigEditorModal() {
    this.gameplayState.showConfigEditor = false;
    this.forceRerender();
  }

  /**
   * Handle config confirmation from modal
   * Child classes should override this to implement custom behavior
   */
  protected onConfigConfirm(config: any) {
    console.log('🔧 onConfigConfirm - config received:', config);
    this.hideConfigEditorModal();

    if (this.gameplayState.configEditorPhase === ConfigEditorPhase.BEFORE_GAME) {
      // Before game: Use edited config and start the game
      console.log('📝 Setting waveConfig to state:', config);
      this.gameplayState.waveConfig = config;
      console.log('✅ gameplayState.waveConfig is now:', this.gameplayState.waveConfig);
      this.forceRerender(); // Trigger re-render with new config
      console.log('🚀 Calling startGame()...');
      this.startGame();
      console.log('✅ startGame() called, isGameStarted:', this.gameplayState.isGameStarted);
    } else {
      // After game: Use edited config and restart the game
      // this.restartGameWithConfig(config);

      // After game: Restart with original config from file (reload page)
      window.location.reload();
    }
  }

  /**
   * Handle config download from modal
   */
  protected onConfigDownload(config: any) {
    const jsonString = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `waveConfig-${document.title}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ========================================
  // Game Flow Control Methods
  // ========================================

  /**
   * Start the game (called after config confirmation or directly in non-debug mode)
   */
  protected startGame() {
    console.log('🎮 startGame() - Setting isGameStarted to true');
    this.gameplayState.isGameStarted = true;
    console.log('📊 isGameStarted is now:', this.gameplayState.isGameStarted);
    this.forceRerender(); // 🔄 Force re-render to pass isGameStarted=true to Gameplay
    this.showCountdown(3, CountdownPhase.WAVE, this.countdownTexts.countdown_start);
    console.log('⏱️ Countdown started');
  }

  /**
   * Initialize config - loads config and shows editor in debug mode
   * Call this in componentDidMount or useEffect
   */
  protected async initializeConfig() {
    // Load config from child class (this sets gameplayState.waveConfig)
    await this.onLoadConfig();

    const config = this.gameplayState.waveConfig;

    if (!config) {
      console.warn('⚠️ No config loaded in initializeConfig, will use default config');
      // Don't return - still need to start game (Gameplay has fallback config)
    } else {
      console.log('📋 initializeConfig - config loaded:', config);
    }

    // Show config editor modal in debug mode before game starts
    if (this.isDebugMode) {
      this.showConfigEditorModal(config, ConfigEditorPhase.BEFORE_GAME);
    } else {
      // In production, start game directly (even if config is null - Gameplay will handle it)
      this.startGame();
    }
  }

  /**
   * Pause the game (user initiated)
   */
  protected pauseGame() {
    // Clear any running countdown when user pauses
    if (this.countdownTimerRef !== null) {
      clearInterval(this.countdownTimerRef);
      this.countdownTimerRef = null;
    }
    this.gameplayState.countdownState = null;

    this.gameplayState.isPause = true;
    this.gameplayState.isSystemPause = false; // User pause
    this.onGamePaused();
    this.forceRerender();
  }

  /**
   * Resume the game (with countdown)
   */
  protected resumeGame() {
    this.gameplayState.isPause = false;
    this.gameplayState.isSystemPause = false;
    this.showCountdown(3, CountdownPhase.CONTINUE, this.countdownTexts.countdown_continue);
  }

  /**
   * End the game
   * @param status - Whether the game was won (SUCCESS) or lost (DEAD)
   */
  protected endGame(status: GameStatus) {
    if (this.gameplayState.isGameEnding) return;

    this.gameplayState.isGameEnding = true;
    this.gameplayState.statusGame = status;
    this.gameplayState.endGame = true;

    this.onGameEnded(status);
    this.forceRerender();

    // After delay, either show config editor (debug mode) or navigate to score scene
    setTimeout(async () => {
      if (this.isDebugMode) {
        // Debug mode: Show config editor
        if (this.gameplayState.waveConfig) {
          this.showConfigEditorModal(this.gameplayState.waveConfig, ConfigEditorPhase.AFTER_GAME);
        }
      } else {
        // Production mode: Show loading and call callback to navigate to score scene
        this.gameplayState.isSubmittingScore = true;
        this.forceRerender();

        if (this.gameplayProps.onGameEndCallback) {
          await this.gameplayProps.onGameEndCallback(status);
        }

        // this.gameplayState.isSubmittingScore = false;
        this.forceRerender();
      }
    }, 3000);
  }

  /**
   * Restart game with new config (saves to localStorage and reloads)
   */
  // protected restartGameWithConfig(config: any) {
  //   try {
  //     localStorage.setItem('tempWaveConfig', JSON.stringify(config));
  //   } catch (err) {
  //     console.error('Failed to save config to localStorage:', err);
  //   }

  //   window.location.reload();
  // }

  // ========================================
  // Countdown Methods
  // ========================================

  private countdownTimerRef: number | null = null;

  /**
   * Setup visibility change handler to pause/resume countdown when tab switches
   */
  private setupVisibilityHandler() {
    this.visibilityHandler = () => {
      if (document.hidden) {
        // Tab hidden - stop countdown timer completely (keep state to resume later)
        if (this.countdownTimerRef !== null) {
          clearInterval(this.countdownTimerRef);
          this.countdownTimerRef = null;
          // countdownState is preserved so we can resume from current seconds
        }
      } else {
        // Tab visible - resume countdown if there was one running
        if (this.gameplayState.countdownState?.show && this.countdownTimerRef === null) {
          // Small delay to ensure tab is fully visible before resuming
          setTimeout(() => {
            if (this.gameplayState.countdownState?.show && this.countdownTimerRef === null) {
              this.startCountdownInterval();
              this.forceRerender();
            }
          }, 100);
        }
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  /**
   * Start or resume the countdown interval timer
   */
  private startCountdownInterval() {
    if (!this.gameplayState.countdownState) return;

    // Clear any existing timer first
    if (this.countdownTimerRef !== null) {
      clearInterval(this.countdownTimerRef);
    }

    this.countdownTimerRef = window.setInterval(() => {
      // If tab is hidden, don't do anything - wait for tab to be visible
      if (document.hidden) {
        return;
      }

      if (!this.gameplayState.countdownState) {
        if (this.countdownTimerRef !== null) {
          clearInterval(this.countdownTimerRef);
          this.countdownTimerRef = null;
        }
        return;
      }

      const newSeconds = this.gameplayState.countdownState.seconds - 1;

      if (newSeconds <= 0) {
        // Countdown finished
        if (this.countdownTimerRef !== null) {
          clearInterval(this.countdownTimerRef);
          this.countdownTimerRef = null;
        }
        this.onCountdownFinished();
      } else {
        // Update countdown seconds (state only, no re-render needed)
        // CountdownModal has its own local state that handles UI updates
        if (this.gameplayProps.onCounting) {
          this.gameplayProps.onCounting(newSeconds);
        }

        this.gameplayState.countdownState = {
          ...this.gameplayState.countdownState,
          seconds: newSeconds,
        };
        // Note: forceRerender() removed to prevent screen flicker
        // CountdownModal handles its own re-render via setCount()
      }
    }, 1000);
  }

  /**
   * Show countdown modal with auto-hide after countdown finishes
   */
  protected showCountdown(seconds: number, phase: CountdownPhase, text: string) {
    // Clear any existing countdown timer
    if (this.countdownTimerRef !== null) {
      clearInterval(this.countdownTimerRef);
    }

    // Pause game during countdown for 'wave' phase (new wave starting)
    // This is a system pause (no UI buttons)
    if (phase === CountdownPhase.WAVE) {
      this.gameplayState.isPause = true;
      this.gameplayState.isSystemPause = true; // System pause - no UI
      this.onGamePaused();
    }

    this.gameplayState.countdownState = {
      show: true,
      seconds,
      phase,
      text,
    };
    this.forceRerender();

    if (this.gameplayProps.onCounting) {
      this.gameplayProps.onCounting(seconds);
    }

    // Start countdown interval (uses shared method for pause/resume support)
    this.startCountdownInterval();
  }

  /**
   * Hide countdown modal
   */
  protected hideCountdown() {
    // Clear countdown timer
    if (this.countdownTimerRef !== null) {
      clearInterval(this.countdownTimerRef);
      this.countdownTimerRef = null;
    }

    this.gameplayState.countdownState = null;
    this.forceRerender();
  }

  /**
   * Called when countdown finishes
   * Child classes can override this
   */
  protected onCountdownFinished() {
    const wasWaveCountdown = this.gameplayState.countdownState?.phase === CountdownPhase.WAVE;

    this.hideCountdown();

    // Check if user paused during countdown - don't resume if so
    if (this.gameplayState.isPause && !this.gameplayState.isSystemPause) {
      // User paused during countdown, don't resume
      return;
    }

    // Resume game if it was paused for wave countdown
    if (wasWaveCountdown) {
      this.gameplayState.isPause = false;
      this.gameplayState.isSystemPause = false;
      this.onGameResumed();
      this.forceRerender(); // Trigger re-render to update isPause state in child components
    } else {
      // For 'continue' phase, resume the game
      this.gameplayState.isPause = false;
      this.onGameResumed();
      this.forceRerender(); // Trigger re-render to update isPause state in child components
    }
  }

  // ========================================
  // Round Display Methods
  // ========================================

  /**
   * Show round display
   */
  protected showRoundDisplay(round: number) {
    // Pause game while showing round display
    // This is a system pause (no UI buttons)
    this.gameplayState.isPause = true;
    this.gameplayState.isSystemPause = true; // System pause - no UI
    this.onGamePaused();

    this.gameplayState.roundDisplay = round;
    this.forceRerender();
  }

  /**
   * Hide round display
   */
  protected hideRoundDisplay() {
    this.gameplayState.roundDisplay = null;
    // Don't resume here - countdown will handle resume after it finishes
    this.forceRerender();
  }

  /**
   * Show round display with auto-hide after delay (for wave transitions)
   * @param round - Round number to display
   * @param duration - Duration in seconds to show the round display (default: 1.5)
   */
  protected showRoundDisplayWithCountdown(round: number, duration: number = 1.5) {
    this.showRoundDisplay(round);

    // Auto-hide after duration and show countdown
    setTimeout(() => {
      this.hideRoundDisplay();
      this.showCountdown(3, CountdownPhase.WAVE, this.countdownTexts.countdown_start);
    }, duration * 1000);
  }

  /**
   * Cleanup when scene is unloaded
   */
  sceneUnload = () => {
    // Clear countdown timer
    if (this.countdownTimerRef !== null) {
      clearInterval(this.countdownTimerRef);
      this.countdownTimerRef = null;
    }

    // Remove visibility change listener
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
      this.visibilityHandler = null;
    }

    // Reset game state using centralized method
    this.resetGameplayState();
    this.gameplayState.showConfigEditor = false;

    // Call parent cleanup
    this._isActive = false;
    this.forceRerender();
  };

  // ========================================
  // Config Management Getters (for child classes to access)
  // ========================================

  /**
   * Get current config
   */
  protected getConfig(): any {
    return this.gameplayState.waveConfig;
  }

  /**
   * Set/update config
   */
  protected setConfig(config: any) {
    this.gameplayState.waveConfig = config;
    this.forceRerender();
  }

  /**
   * Check if game has started
   */
  protected hasGameStarted(): boolean {
    return this.gameplayState.isGameStarted;
  }

  /**
   * Set game started state
   */
  protected setGameStarted(started: boolean) {
    this.gameplayState.isGameStarted = started;
    this.forceRerender();
  }

  // ========================================
  // Abstract Methods (must be implemented by child classes)
  // ========================================

  /**
   * Called when the game is paused
   * Override to implement custom pause behavior (e.g., stop sounds, pause physics)
   */
  protected abstract onGamePaused(): void;

  /**
   * Called when the game is resumed
   * Override to implement custom resume behavior (e.g., resume sounds, resume physics)
   */
  protected abstract onGameResumed(): void;

  /**
   * Called when the game ends
   * Override to implement custom end game behavior (e.g., play sounds, show effects)
   */
  protected abstract onGameEnded(status: GameStatus): void;

  /**
   * Called to load/initialize game config
   * Child classes should override this to load their specific config
   * @returns Promise that resolves when config is loaded
   */
  protected abstract onLoadConfig(): Promise<void>;

  // ========================================
  // Render Methods
  // ========================================

  /**
   * Render the config editor modal if needed
   */
  protected renderConfigEditor(): React.ReactNode {
    if (!this.gameplayState.showConfigEditor || !this.gameplayState.editableConfig) {
      return null;
    }

    return (
      <ModalConfigEditor
        configData={this.gameplayState.editableConfig}
        phase={this.gameplayState.configEditorPhase}
        onConfirm={(config) => this.onConfigConfirm(config)}
        onDownload={(config) => this.onConfigDownload(config)}
      />
    );
  }

  /**
   * Render countdown modal if needed
   * Child classes can override to customize countdown appearance
   */
  protected renderCountdown(): React.ReactNode {
    if (!this.gameplayState.countdownState?.show) {
      return null;
    }

    const { seconds, text } = this.gameplayState.countdownState;

    return (
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-center">
          <p className="font-cherry-bomb-one mb-4 text-2xl font-bold text-white">
            {text}
          </p>
          <div className="font-cherry-bomb-one text-8xl font-bold text-white [-webkit-text-stroke:2px_#fe679a]">
            {seconds}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render round display if needed
   * Child classes can override to customize round display appearance
   */
  protected renderRoundDisplay(): React.ReactNode {
    if (this.gameplayState.roundDisplay === null) {
      return null;
    }

    return (
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-70">
        <div className="flex flex-col items-center justify-center">
          <div className="w-[200px] text-center text-[86px] font-bold [-webkit-text-stroke:1px_#ffffff]">
            {this.gameplayState.roundDisplay}
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render end game modal if needed
   * Child classes SHOULD override to provide custom game over UI
   * This is a placeholder implementation
   */
  protected renderEndGame(): React.ReactNode {
    if (!this.gameplayState.endGame || this.gameplayState.statusGame === null) {
      return null;
    }

    // Default implementation - child classes should override this
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="rounded-lg bg-white p-8 text-center">
          <h2 className="mb-4 text-4xl font-bold">
            {this.gameplayState.statusGame === GameStatus.SUCCESS ? 'Victory!' : 'Game Over'}
          </h2>
          <p className="text-xl">
            {this.gameplayState.statusGame === GameStatus.SUCCESS
              ? 'Congratulations!'
              : 'Better luck next time!'}
          </p>
        </div>
      </div>
    );
  }

  /**
   * Render loading overlay during score submission
   */
  protected renderLoadingOverlay(): React.ReactNode {
    if (!this.gameplayState.isSubmittingScore) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-70">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Spinning loader */}
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          {/* Loading text */}
          <div className="font-cherry-bomb-one text-2xl font-bold text-white">
            กำลังบันทึกคะแนน...
          </div>
        </div>
      </div>
    );
  }

  /**
   * Main render method - combines all UI elements
   */
  render = (): React.ReactNode => {
    return (
      <>
        {this._isActive && (
          <div className="absolute flex h-screen w-full items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${this.background})`,
              }}
            />
            {this.content}
            {this.renderScene()}
            {this.renderCountdown()}
            {this.renderRoundDisplay()}
            {this.renderEndGame()}
            {this.renderLoadingOverlay()}
            {this.props.children}
          </div>
        )}
        {this.renderConfigEditor()}
      </>
    );
  };
}
