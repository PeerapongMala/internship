import * as THREE from 'three';
import { Signal } from 'signals.js';

class GameManager {
  constructor() {
    // Initialize all signals first
    this.gameEndSignal = new Signal();
    this.timeUpdateSignal = new Signal();
    this.levelIncreased = new Signal();
    this.expIncreased = new Signal();
    this.timeWarningSignal = new Signal(); // New signal for time warnings

    this.gamePaused = false;
    this.gameOver = false;

    // Time tracking properties
    this.startTime = null;
    this.elapsedTime = 0;
    this.timerInterval = null;
    this.GAME_DURATION = 15 * 60; // 15 minutes in seconds

    this.gameState = {
      exp: 0,
      level: 0,
      gamePaused: false, // เพิ่มสถานะเกมหยุด
      UnlockedAbilities: {
        Skill1: false,
        Skill2: false,
        Skill3: false,
        Skill4: false,
        Skill5: false,
        Skill6: false,
      },
      currentTime: 0,
      remainingTime: this.GAME_DURATION,
    };

    // Load the level up sound
    this.levelUpSound = new Audio('audio/levelUp.mp3');
  }

  resetGameState() {
    this.gameState.exp = 0;
    this.gameState.level = 0;
    this.gameState.gamePaused = false;
    this.gameState.currentTime = 0;
    this.resetTimer();
    for (let skill in this.gameState.UnlockedAbilities) {
      this.gameState.UnlockedAbilities[skill] = false;
    }
  }

  // เพิ่มฟังก์ชัน pauseGame และ resumeGame
  pauseGame() {
    this.gameState.gamePaused = true;
    this.stopTimer();
    console.log('Game paused');
  }

  resumeGame() {
    this.gameState.gamePaused = false;
    this.continueTimer();
    console.log('Game resumed');
  }

  // Method to increase the score
  increaseScore(points = 1) {
    this.score += points;
  }

  // Method to decrease the score
  decreaseScore(points = 1) {
    this.score -= points;
  }

  // Method to reset the score
  resetScore() {
    this.score = 0;
  }

  // Method to get the current score
  getScore() {
    return this.score;
  }

  installScenes() {
    console.log('Installing scenes...');

    console.log('Installing renderer...');

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    this.renderer = renderer;
    this.startTimer();
  }

  addExp() {
    //console.log("Adding Exp");
    this.gameState.exp += 25; // Example increase in experience points
    if (this.gameState.exp >= 100 + 10 * this.gameState.level) {
      // Example condition for level up
      this.gameState.level++;
      this.gameState.exp = 0; // Reset score after level up
      console.log(`Level ${this.gameState.level} reached!`);
      this.levelIncreased.dispatch(this.gameState.level);

      // Play level up sound
      this.levelUpSound.play();
    } else {
      // console.log(
      //   `Exp: ${this.gameState.exp}/${100 + 10 * this.gameState.level}`
      // );
      this.expIncreased.dispatch(this.gameState.exp);
    }
  }

  startTimer() {
    if (!this.startTime && !this.gameOver) {
      console.log('Starting game timer...');
      this.startTime = Date.now();
      this.elapsedTime = 0;
      this.gameState.currentTime = 0;

      this.timerInterval = setInterval(() => {
        if (!this.gameState.gamePaused && !this.gameOver) {
          this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
          this.gameState.currentTime = this.elapsedTime;
          this.gameState.remainingTime = Math.max(
            0,
            this.GAME_DURATION - this.elapsedTime,
          );

          // Emit time update signal
          this.timeUpdateSignal.dispatch(this.getFormattedTime());

          // Check for time-based events
          this.checkTimeEvents();

          // Check win condition
          if (this.elapsedTime >= this.GAME_DURATION) {
            this.gameWin();
          }
        }
      }, 1000);
    }
  }

  checkTimeEvents() {
    const remainingTime = this.GAME_DURATION - this.elapsedTime;

    // Emit warnings at specific times
    if (remainingTime === 300) {
      // 5 minutes remaining
      this.timeWarningSignal.dispatch({ type: 'warning', time: 300 });
    } else if (remainingTime === 60) {
      // 1 minute remaining
      this.timeWarningSignal.dispatch({ type: 'warning', time: 60 });
    } else if (remainingTime <= 10) {
      // Last 10 seconds
      this.timeWarningSignal.dispatch({
        type: 'final_countdown',
        time: remainingTime,
      });
    }
  }

  continueTimer() {
    if (!this.timerInterval && this.elapsedTime > 0 && !this.gameOver) {
      console.log('Continuing game timer...');
      this.startTime = Date.now() - this.elapsedTime * 1000;

      this.timerInterval = setInterval(() => {
        if (!this.gameState.gamePaused && !this.gameOver) {
          this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
          this.gameState.currentTime = this.elapsedTime;
          this.gameState.remainingTime = Math.max(
            0,
            this.GAME_DURATION - this.elapsedTime,
          );

          // Emit time update signal
          this.timeUpdateSignal.dispatch(this.getFormattedTime());

          // Check for time-based events
          this.checkTimeEvents();

          // Check win condition
          if (this.elapsedTime >= this.GAME_DURATION) {
            this.gameWin();
          }
        }
      }, 1000);
    }
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  resetTimer() {
    this.stopTimer();
    this.startTime = null;
    this.elapsedTime = 0;
    this.gameState.currentTime = 0;
    this.gameState.remainingTime = this.GAME_DURATION;
    this.gameOver = false;
    this.timeUpdateSignal.dispatch(this.getFormattedTime());
  }

  gameWin() {
    this.gameOver = true;
    this.gameState.gameOver = true;
    this.stopTimer();
    this.gameEndSignal.dispatch('win');
    console.log('Game Won! Survived for 15 minutes!');
  }

  getFormattedTime() {
    const minutes = Math.floor(this.elapsedTime / 60);
    const seconds = this.elapsedTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  getRemainingTime() {
    const remaining = this.GAME_DURATION - this.elapsedTime;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  UnlockSkill(SkillCodeName) {
    if (!this.gameState.UnlockedAbilities[SkillCodeName]) {
      this.gameState.UnlockedAbilities[SkillCodeName] = true;
      console.log(`Skill ${SkillCodeName} unlocked!`);
    }
  }

  set Gamerenderer(renderer) {
    this.renderer = renderer;
  }

  get Gamerenderer() {
    return this.renderer;
  }

  set currentScene(number) {
    if (typeof number === 'number' && number >= 0) {
      switch (number) {
        case 1:
          console.log('Lol it number 1');
          this._currentScene = this.inGameScene;
          break;
        case 2:
          this._currentScene = this.mainMenuScene;
          break;
        default:
          console.log('Lol default time');
          this._currentScene = this.inGameScene;
          break;
      }
    } else {
      console.error('Invalid scene number. Scene number must be a non-negative integer.');
    }
  }

  get currentScene() {
    return this._currentScene;
  }
}

window.entities = [];
window.GameManager = new GameManager();

export default GameManager;
