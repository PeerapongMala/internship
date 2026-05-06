class SceneTemplate {
  SM = null;
  constructor(sceneName) {
    this._isActive = false;
    this._sceneName = sceneName;
    this.SceneInitial(sceneName);
  }

  SetScene = sceneName => {
    const isScene = this._sceneName === sceneName;

    if (this._isActive !== isScene) {
      this._isActive = isScene;

      if (isScene) {
        this.SceneLoad(sceneName);
      } else {
        this.SceneUnload(sceneName);
      }
    }
  };

  SceneInitial = sceneName => {};

  SceneLoad = sceneName => {};

  SceneUnload = sceneName => {};

  SceneUpdate = (deltaTime, timeStamp) => {};

  GetSceneName = () => {
    return this._sceneName;
  };
}

window.SceneTemplate = SceneTemplate;
