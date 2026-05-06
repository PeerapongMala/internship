class SceneManager {
  prop = {};

  constructor() {
    this._sceneList = [];
    this._sceneNow = null;
  }

  AddScene = scene => {
    if (scene instanceof SceneTemplate) {
      this._sceneList[scene.GetSceneName()] = scene;
      this._sceneList[scene.GetSceneName()].SM = this;
    } else {
      console.error("Error : AddScene only add SceneTemplate");
    }
  };

  ClearScene = () => {
    this._sceneList.length = 0;
  };

  SetScene = sceneNow => {
    if (this._sceneNow !== sceneNow) {
      this._sceneNow = sceneNow;

      // Unload First
      for (let key in this._sceneList) {
        if (key.toString() !== sceneNow.toString()) {
          this._sceneList[key].SetScene(sceneNow);
        }
      }

      // Load new Scene
      if (this._sceneList[sceneNow]) {
        this._sceneList[sceneNow].SetScene(sceneNow);
      }
    }
  };

  GetScene = sceneName => {
    if (!sceneName) {
      sceneName = this._sceneNow;
    }
    return this._sceneList[sceneName] || null;
  };

  UpdateScene = (deltaTime, timeStamp) => {
    this._sceneList[this._sceneNow].SceneUpdate(deltaTime, timeStamp);
  };

  GetSceneNow = () => {
    return this._sceneNow;
  };

  SetProp = prop => {
    if (typeof prop === "object") {
      this.prop = { ...this.prop, ...prop };
    }
  };
}

window.SceneManager = SceneManager;
