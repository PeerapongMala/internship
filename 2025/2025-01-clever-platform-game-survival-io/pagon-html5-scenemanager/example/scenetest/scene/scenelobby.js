class SceneLobby extends SceneTemplate {
  constructor() {
    super(SceneState.Lobby);
    this.SceneInitial();
  }
  cube;

  SceneInitial = SceneName => {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    this.cube = new THREE.Mesh(geometry, material);
  };

  SceneLoad = SceneName => {
    scene.add(this.cube);
    this.cube.position.set(0, 0, 0);
  };

  SceneUnload = SceneName => {
    scene.remove(this.cube);
  };

  SceneUpdate = (deltaTime, timeStamp) => {
    const movementSpeed = 5 * deltaTime;

    if (gameInput.GetKey(KeyCode.A)) {
      this.cube.position.x -= movementSpeed;
    }

    if (gameInput.GetKey(KeyCode.D)) {
      this.cube.position.x += movementSpeed;
    }

    if (gameInput.GetKey(KeyCode.W)) {
      this.cube.position.y += movementSpeed;
    }

    if (gameInput.GetKey(KeyCode.S)) {
      this.cube.position.y -= movementSpeed;
    }

    if (gameInput.GetKeyDown(KeyCode.Space)) {
      console.log("Key Down");
    }

    if (gameInput.GetKeyUp(KeyCode.Space)) {
      console.log("Key Up");
    }

    if (gameInput.GetKeyDown(KeyCode.Alpha2)) {
      sceneManager.SetScene(SceneState.Chapter);
    }

    if (gameInput.GetKeyUp(KeyCode.F)) {
      console.log("X X :", this.SM.prop);
    }
    if (gameInput.GetKeyUp(KeyCode.G)) {
      this.SM.SetProp({ x: this.SM.prop.x + 1 });
      console.log("X X++ :", this.SM.prop.x);
    }
  };
}
