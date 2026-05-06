import { SceneTemplate } from './SceneTemplate';
import { logger } from '../debug/logger';

export type SceneList = {
  [key: string]: SceneTemplate;
};

export class SceneManager {
  // #region Singleton instance
  private static instance: SceneManager;

  private constructor() {
    // Private constructor prevents direct instantiation
    console.debug(logger.getCallerMessage('SceneManager initialized'));
  }

  public static getInstance(): SceneManager {
    if (!SceneManager.instance) {
      SceneManager.instance = new SceneManager();
    }
    return SceneManager.instance;
  }
  // #endregion

  // #region Adding scene
  private _sceneList: SceneList = {};
  private _sceneNameCurrent: string = '';

  addScene(scene: SceneTemplate): void {
    if (scene instanceof SceneTemplate) {
      console.debug(logger.getCallerMessage(scene));
      this._sceneList[scene.getSceneName()] = scene;
      this._sceneList[scene.getSceneName()].sceneManager = this;

      // this._sceneElements = Object.values(this._sceneList).map((eachScene) => {
      //   console.log(eachScene);
      //   return eachScene.render();
      // });

      // if (!this._sceneElements.includes(scene as unknown as JSX.Element))
      // this._sceneElements.push(scene.render());
    } else {
      console.error('Error : only SceneTemplate able to be added');
    }
  }
  // #endregion

  // # region set scene
  private sceneChangeSubscribers: Array<(scene: string) => void> = [];
  private rerenderSubscribers: Array<() => void> = [];

  setScene(sceneName: string): void {
    console.debug(logger.getCallerMessage(`Setting scene to: ${sceneName}`));

    if (this._sceneNameCurrent !== sceneName) {
      this._sceneNameCurrent = sceneName;

      // Load new Scene
      if (this._sceneList[sceneName]) {
        this._sceneList[sceneName].sceneLoad();
      }

      // Unload
      for (const key in this._sceneList) {
        if (key.toString() !== sceneName.toString()) {
          this._sceneList[key].sceneUnload();
        }
      }
    }

    this._sceneNameCurrent = sceneName;
    console.debug(
      logger.getCallerMessage(`_sceneNameCurrent is now: ${this._sceneNameCurrent}`),
    );

    // Notify all subscribers
    this.sceneChangeSubscribers.forEach((cb) => cb(sceneName));
  }

  forceRerender(): void {
    // Notify all rerender subscribers
    this.rerenderSubscribers.forEach((cb) => cb());
  }

  subscribeRerender(callback: () => void): void {
    this.rerenderSubscribers.push(callback);
  }

  unsubscribeRerender(callback: () => void): void {
    this.rerenderSubscribers = this.rerenderSubscribers.filter((cb) => cb !== callback);
  }

  subscribeSceneChange(callback: (scene: string) => void): void {
    this.sceneChangeSubscribers.push(callback);
  }

  unsubscribeSceneChange(callback: (scene: string) => void): void {
    this.sceneChangeSubscribers = this.sceneChangeSubscribers.filter(
      (cb) => cb !== callback,
    );
  }

  unsubscribeSceneChangeAll(): void {
    this.sceneChangeSubscribers = [];
  }
  // # endregion

  public init(onSceneChange: (scene: string) => void): void {
    this.subscribeSceneChange(onSceneChange);
  }

  getSceneList(): SceneTemplate[] | undefined {
    console.debug(logger.getCallerMessage(this._sceneList));
    return Object.values(this._sceneList);
  }

  getCurrentScene() {
    const scene = this._sceneList[this._sceneNameCurrent];
    return scene;
  }

  public getCurrentSceneName(): string {
    return this._sceneNameCurrent;
  }
}
