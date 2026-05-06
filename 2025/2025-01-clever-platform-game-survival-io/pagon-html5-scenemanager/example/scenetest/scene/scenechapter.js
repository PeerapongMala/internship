class SceneChapter extends SceneTemplate {
  constructor() {
    super(SceneState.Chapter);
    this.SceneInitial();
  }
  sphere;
  colorIndex = 0;
  colorList = [
    "#ff00ff",
    "#ffff00",
    "#00ff00",
    "#ff0000",
    "#0000ff",
    "#555555"
  ];
  SceneInitial = SceneName => {
    const geometry = new THREE.SphereGeometry(1, 60, 40);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
    this.sphere = new THREE.Mesh(geometry, material);
  };

  SceneLoad = SceneName => {
    scene.add(this.sphere);
    this.colorIndex = 0;
    this.sphere.material.color.set(this.colorList[this.colorIndex]);
  };

  SceneUnload = SceneName => {
    scene.remove(this.sphere);
  };

  SceneUpdate = (deltaTime, timeStamp) => {
    if (gameInput.GetKeyDown(KeyCode.A)) {
      this.colorIndex++;
      if (this.colorIndex >= this.colorList.length) {
        this.colorIndex = 0;
      }
      this.sphere.material.color.set(this.colorList[this.colorIndex]);
    }

    if (gameInput.GetKeyDown(KeyCode.D)) {
      this.colorIndex--;
      if (this.colorIndex < 0) {
        this.colorIndex = this.colorList.length - 1;
      }
      this.sphere.material.color.set(this.colorList[this.colorIndex]);
    }

    if (gameInput.GetKeyDown(KeyCode.Alpha1)) {
      sceneManager.SetScene(SceneState.Lobby);
    }
  };
}
