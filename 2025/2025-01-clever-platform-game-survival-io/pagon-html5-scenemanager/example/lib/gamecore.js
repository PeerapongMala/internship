// Root Container in html5
window.gameContainer = null;

// For 3D Scene
window.scene = null;
window.camera = null;
window.renderer = null;

// For UI Scene
window.gameUICanvas = null;
window.gameUICTX = null;

window.sceneUI = null;
window.cameraUI = null;

window.textureUI = null;
window.materialUI = null;
window.geoPlaneUI = null;
window.planeUI = null;

// For 3rd Party Library
window.gameInput = null;
window.sceneManager = null;

// Check Support Pagon HTML5 GameInput Library
if (typeof GameInput !== "undefined") {
  gameInput = new GameInput();
}

// Check Support Pagon HTML5 Scene Manager Library
if (typeof SceneManager !== "undefined") {
  sceneManager = new SceneManager();
}

// Game Initial
const gameInitial = (
  rendererJson,
  cameraFOV,
  cameraNear,
  cameraFar,
  cameraRatio
) => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Create Root Div
  gameContainer = document.createElement("div");
  document.body.appendChild(gameContainer);

  // =============== Set 3D Scene ===============
  // Set Camera
  camera = new THREE.PerspectiveCamera(
    cameraFOV || 75,
    cameraRatio || width / height,
    cameraNear || 0.1,
    cameraFar || 10000
  );
  camera.position.z = 5;

  // Set Scene
  scene = new THREE.Scene();

  // Set Renderer
  renderer = new THREE.WebGLRenderer(rendererJson || {});
  renderer.setSize(width, height);
  gameContainer.appendChild(renderer.domElement);
  renderer.autoClear = false;

  // =============== Set UI Scene ===============
  // Set UI Canvas
  gameUICanvas = document.createElement("canvas");
  gameUICanvas.width = width;
  gameUICanvas.height = height;

  // Set UI Context
  gameUICTX = gameUICanvas.getContext("2d");

  // Set Camera UI
  cameraUI = new THREE.OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    0,
    30
  );

  // Set Scene UI
  sceneUI = new THREE.Scene();

  // Add UI Canvas to Plane in UI Scene
  textureUI = new THREE.Texture(gameUICanvas);
  textureUI.needsUpdate = true;
  textureUI.minFilter = THREE.LinearFilter;

  materialUI = new THREE.MeshBasicMaterial({ map: textureUI });
  materialUI.transparent = true;

  // materialUI = new THREE.MeshBasicMaterial({ color: 0xffffff });

  geoPlaneUI = new THREE.PlaneGeometry(1, 1);
  planeUI = new THREE.Mesh(geoPlaneUI, materialUI);
  planeUI.scale.set(width, height, 1);
  sceneUI.add(planeUI);

  // ===========================================

  if (typeof TWEEN !== "undefined") {
    console.log("Have TWEEN");
  }

  // Update Reference Resolution Scale
  updateRefScale();

  // Set Event Listener Resize
  window.addEventListener("resize", onWindowResize, false);

  // Check Script Function Gameloop
  if (!gameLoop) {
    console.error("Error : GameLoop Not Found.");
  }

  // Start Update
  requestAnimationFrame(render);
};

let lastTimeStamp = 0;

const render = timeStamp => {
  // Calculate DeltaTime
  const deltaTime = (timeStamp - lastTimeStamp) / 1000;
  lastTimeStamp = timeStamp;

  // Clear Scene UI
  gameUICTX.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Update User Gameloop
  if (gameLoop) {
    gameLoop(deltaTime, timeStamp);
  }

  // =============== Update 3rd Party Library ===============
  // Update TWEEN JS
  if (typeof TWEEN !== "undefined") {
    TWEEN.update(timeStamp);
  }

  // Update Pagon HTML5 Scene Manager Library
  if (sceneManager) {
    sceneManager.UpdateScene(deltaTime, timeStamp);
  }
  // Clear GameInput for Pagon HTML5 GameInput Library
  if (gameInput) {
    gameInput.clearInput();
  }
  // ===========================================

  // Render 3D Scene
  renderer.render(scene, camera);
  // Render UI Scene
  textureUI.needsUpdate = true;
  renderer.render(sceneUI, cameraUI);
  // Update Gameloop
  requestAnimationFrame(render);
};

const refResolution = { width: 1280, height: 720 };
window.gameRefScale = { expand: 0, shrink: 0 };

// Set Reference Resolution for Rescale UI
const setRefResolution = (width, height) => {
  refResolution.width = width | refResolution.width;
  refResolution.height = height | refResolution.height;
};

const updateRefScale = () => {
  if (
    window.innerWidth / window.innerHeight >
    refResolution.width / refResolution.height
  ) {
    gameRefScale.expand = window.innerHeight / refResolution.height;
    gameRefScale.shrink = window.innerWidth / refResolution.width;
  } else {
    gameRefScale.expand = window.innerWidth / refResolution.width;
    gameRefScale.shrink = window.innerHeight / refResolution.height;
  }
};

const onWindowResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Update Ref Resolution
  updateRefScale();

  gameUICanvas.width = width;
  gameUICanvas.height = height;

  // ======== Change Size Camera UI ========
  // but i not sure for it not change have same result?

  // planeUI.scale.set(width, height, 1);
  // cameraUI.left = -width / 2;
  // cameraUI.right = width / 2;
  // cameraUI.top = height / 2;
  // cameraUI.bottom = -height / 2;
  // =======================================

  cameraUI.aspect = width / height;
  cameraUI.updateProjectionMatrix();

  // Update Camera 3D
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

window.gameInitial = gameInitial;
window.setRefResolution = setRefResolution;
