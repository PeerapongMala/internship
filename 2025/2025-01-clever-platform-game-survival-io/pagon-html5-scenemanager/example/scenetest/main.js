let sceneLobby = new SceneLobby();
let sceneChapter = new SceneChapter();

const init = () => {
  gameInitial();

  sceneManager.AddScene(sceneLobby);
  sceneManager.AddScene(sceneChapter);
  sceneManager.SetScene(SceneState.Lobby);
  console.log(sceneManager.GetScene());
  console.log(sceneManager.GetScene("ss"));
  console.log(sceneManager.GetScene(SceneState.Lobby));
  console.log(sceneManager.GetScene(1));
  console.log(sceneManager._sceneList);
  console.log(sceneManager.SetProp({ x: 10 }));
  console.log(sceneManager.prop.x);
  console.log(sceneManager.prop);
  console.log(sceneManager.SetProp({ x: 12, y: 10 }));
  console.log(sceneManager.prop.x);
  console.log(sceneManager.prop);
};

const gameLoop = (deltaTime, timeStamp) => {};

init();
