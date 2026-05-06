import * as THREE from 'three';

// -------------------- TimeManager Singleton --------------------
export class TimeManager {
  private static instance: TimeManager | null = null;
  playing = true;
  timeScale = 1;
  updateCallbacks: Set<(dt: number) => void> = new Set();
  fixedCallbacks: Set<(dt: number) => void> = new Set();
  last: number | null = null;
  accumulator = 0;
  fixedDeltaTime: number;
  maxFrameDt = 0.1;
  maxAccumulator = 0.5;
  running = false;
  frameId: number | null = null;
  renderTargets: {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.Camera;
  }[] = [];
  visibilityHandler: () => void;

  // Flag to track if user has manually paused the game
  // This prevents auto-resume when tab becomes visible
  private userPaused = false;

  constructor(fixedDeltaTime = 1 / 50) {
    this.fixedDeltaTime = fixedDeltaTime;

    this.visibilityHandler = () => {
      if (document.hidden) {
        this.setPlaying(false);
        this.last = null;
      } else {
        this.last = performance.now();
        // Only auto-resume if user hasn't manually paused
        if (!this.userPaused) {
          this.setPlaying(true);
        }
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  static getInstance() {
    if (!TimeManager.instance) {
      TimeManager.instance = new TimeManager();
    }
    return TimeManager.instance;
  }

  dispose() {
    this.stop();
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    this.updateCallbacks.clear();
    this.fixedCallbacks.clear();
    this.renderTargets = [];
    if (TimeManager.instance === this) TimeManager.instance = null;
  }

  addRenderTarget(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera,
  ) {
    this.renderTargets.push({ renderer, scene, camera });
    if (!this.running) {
      this.start();
    }
  }

  removeRenderTarget(renderer: THREE.WebGLRenderer) {
    this.renderTargets = this.renderTargets.filter((rt) => rt.renderer !== renderer);
    if (this.renderTargets.length === 0) {
      this.dispose();
    }
  }

  start(timeScale = 1) {
    if (this.running) return;
    this.running = true;

    this.setTimeScale(timeScale);

    const loop = () => {
      if (!this.running) return;

      const now = performance.now();
      if (!this.playing) {
        this.last = now;
        this.frameId = requestAnimationFrame(loop);
        return;
      }
      if (this.last === null) this.last = now;
      let rawDt = (now - this.last) / 1000;
      rawDt = Math.min(rawDt, this.maxFrameDt);
      this.last = now;

      const scaledDt = rawDt * this.timeScale;

      this.updateCallbacks.forEach((cb) => cb(scaledDt));

      this.accumulator += rawDt;
      this.accumulator = Math.min(this.accumulator, this.maxAccumulator);

      let steps = 0;
      const maxSteps = 5;
      while (this.accumulator >= this.fixedDeltaTime && steps < maxSteps) {
        this.accumulator -= this.fixedDeltaTime;
        this.fixedCallbacks.forEach((cb) => cb(this.fixedDeltaTime * this.timeScale));
        steps++;
      }

      this.renderTargets.forEach(({ renderer, scene, camera }) => {
        renderer.render(scene, camera);
      });

      this.frameId = requestAnimationFrame(loop);
    };

    this.frameId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = null;

    this.setTimeScale(0);
  }

  update(cb: (dt: number) => void) {
    this.updateCallbacks.add(cb);
    return () => this.updateCallbacks.delete(cb);
  }

  fixedUpdate(cb: (dt: number) => void) {
    this.fixedCallbacks.add(cb);
    return () => this.fixedCallbacks.delete(cb);
  }

  setPlaying(val: boolean) {
    this.playing = val;
  }

  /**
   * Pause the time manager (stops all updates and fixed updates)
   * @param isUserPause - If true, marks as user-initiated pause (prevents auto-resume on tab switch)
   */
  pause(isUserPause = true) {
    if (isUserPause) {
      this.userPaused = true;
    }
    this.setPlaying(false);
  }

  /**
   * Resume the time manager (resumes all updates and fixed updates)
   */
  resume() {
    this.userPaused = false;
    // Reset last timestamp to prevent large delta time jump
    this.last = performance.now();
    this.setPlaying(true);
  }

  /**
   * Check if user has manually paused the game
   */
  isUserPaused() {
    return this.userPaused;
  }

  /**
   * Set user paused state (for external control)
   */
  setUserPaused(paused: boolean) {
    this.userPaused = paused;
  }

  /**
   * Check if the time manager is currently paused
   */
  isPaused() {
    return !this.playing;
  }

  /**
   * Check if the time manager is currently playing
   */
  isPlaying() {
    return this.playing;
  }

  setTimeScale(val: number) {
    this.timeScale = val;
  }

  getTimeScale() {
    return this.timeScale;
  }
}

export default TimeManager;
