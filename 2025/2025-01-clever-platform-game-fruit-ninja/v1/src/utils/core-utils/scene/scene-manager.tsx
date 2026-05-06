import { SceneTemplate } from "./scene-template";
import { logger } from "../debug/logger";

export type SceneList = {
  [key: string]: SceneTemplate;
};

export class SceneManager {
  // #region Singleton instance
  private static instance: SceneManager;

  private constructor() {
    // Private constructor prevents direct instantiation
    console.debug(logger.getCallerMessage("SceneManager initialized"));
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
  private _sceneNameCurrent: string = "";

  addScene(scene: SceneTemplate): void {
    if (scene instanceof SceneTemplate) {
      console.debug(logger.getCallerMessage(scene));
      this._sceneList[scene.getSceneName()] = scene;
      this._sceneList[scene.getSceneName()].sceneManager = this;
    } else {
      console.error("Error : only SceneTemplate able to be added");
    }
  }
  // #endregion

  // # region set scene 
  private sceneChangeSubscribers: Array<(scene: string) => void> = [];

  setScene(sceneName: string): void {
    console.debug(logger.getCallerMessage(`Setting scene to: ${sceneName}`));

    if (this._sceneNameCurrent !== sceneName) {
      this._sceneNameCurrent = sceneName;

      // Unload First
      for (const key in this._sceneList) {
        if (key.toString() !== sceneName.toString()) {
          this._sceneList[key].sceneUnload();
        }
      }

      // Load new Scene
      if (this._sceneList[sceneName]) {
        this._sceneList[sceneName].sceneLoad();
      }
    }

    this._sceneNameCurrent = sceneName;

    // Notify all subscribers
    this.sceneChangeSubscribers.forEach((cb) => cb(sceneName));
  }

  subscribeSceneChange(callback: (scene: string) => void): void {
    this.sceneChangeSubscribers.push(callback);
  }

  unsubscribeSceneChange(callback: (scene: string) => void): void {
    this.sceneChangeSubscribers = this.sceneChangeSubscribers.filter(
      (cb) => cb !== callback
    );
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

  renderScene(
    // currentScene: string = SceneName.MENU
  ): JSX.Element {
    const scene = this._sceneList[this._sceneNameCurrent];
    if (!scene) {
      console.error(`Scene not found: ${this._sceneNameCurrent}`);
      return <div>Error: Scene not found</div>;
    }
    console.debug(logger.getCallerMessage(scene));
    return scene.render();
  }
}
