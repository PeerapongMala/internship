import * as THREE from 'three';

export type EngineThreeGameLoopInterface = (
  props: EngineThreeGameLoopPropsInterface,
) => void;

export interface EngineThreeGameLoopPropsInterface {
  context: ContextInterface;
  deltaTime: number;
  timeStamp: number;
  frame?: XRFrame;
}

export interface ContextCameraInterface {
  main: THREE.PerspectiveCamera | THREE.OrthographicCamera;
  persp: THREE.PerspectiveCamera;
  ortho: THREE.OrthographicCamera;
  isMainCameraIsOrtho: boolean;
}

export interface IContextGameLoop {
  enableIs: boolean;
}

export interface ContextInterface {
  payload: any;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  gameloop: IContextGameLoop;
}

export class EngineThree {
  public context: ContextInterface;
  public gameLoop: EngineThreeGameLoopInterface;

  constructor({
    WebGLRendererParameters,
    gameLoop,
  }: {
    WebGLRendererParameters: THREE.WebGLRendererParameters;
    gameLoop: EngineThreeGameLoopInterface;
  }) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({
      canvas: WebGLRendererParameters.canvas,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    this.gameLoop = gameLoop;

    this.context = {
      payload: {},
      scene,
      camera,
      renderer,
      gameloop: {
        enableIs: true,
      },
    };

    this.context.renderer.render(this.context.scene, this.context.camera);
    this.context.renderer.setAnimationLoop(this.GameLoop.GameRender);
    window.addEventListener('resize', this.OnResize, false);
  }

  GameLoop = {
    fTimeStampStart: 0,
    fTimeStampLast: 0,

    GameRender: (timeStamp: number, frame?: XRFrame) => {
      // if (this.context.module.stats) {
      //   this.context.module.stats.begin();
      // }
      // ========= Calculate Deltatime =========
      if (this.GameLoop.fTimeStampStart === 0) {
        this.GameLoop.fTimeStampStart = timeStamp;
      }
      // Handle Set enable loop
      if (this.GameLoop.fTimeStampLast === 0) {
        this.GameLoop.fTimeStampLast = timeStamp;
      }

      const deltaTime = (timeStamp - this.GameLoop.fTimeStampLast) / 1000 || 0;
      this.GameLoop.fTimeStampLast = timeStamp;

      // ==============================================

      if (this.gameLoop) {
        this.gameLoop({
          context: this.context,
          deltaTime,
          timeStamp,
          frame,
        });
      }
      this.context.renderer.render(this.context.scene, this.context.camera);

      // pluginUpdate(this.context, deltaTime, timeStamp, frame);
      // if (this.context.module.sceneManager) {
      //   this.context.module.sceneManager.UpdateScene(
      //     this.context,
      //     deltaTime,
      //     timeStamp,
      //     frame
      //   );
      // }
      // if (Input) {
      //   Input.clearInput();
      // }
      // if (this.isMainCameraIsOrtho != this.context.isMainCameraIsOrtho) {
      //   this.isMainCameraIsOrtho = this.context.isMainCameraIsOrtho;
      //   this.context.cameraMain = this.isMainCameraIsOrtho
      //     ? this.context.cameraOrtho
      //     : this.context.cameraPersp;

      //   if (this.context.cameraMain) {
      //     const v3CameraPosition = this.context.cameraMain.position.clone();
      //     const m4Camera = this.context.cameraMain.matrix.clone();

      //     this.context.cameraMain.position.copy(v3CameraPosition);
      //     this.context.cameraMain.matrix.copy(m4Camera);
      //     this.context.cameraMain.updateProjectionMatrix();
      //   }
      // }

      // if (this.context.module.stats) {
      //   this.context.module.stats.end();
      // }

      // addEffectPass = (pass: any) => {
      //   GameRenderer.addEffectPass(this.context, pass);
      // };
      // removeEffectPass = (pass: any) => {
      //   GameRenderer.removeEffectPass(this.context, pass);
      // };
    },
  };
  OnResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // shink

    this.context.camera.aspect = width / height;
    this.context.camera.updateProjectionMatrix();
    this.context.renderer.setPixelRatio(1 / window.devicePixelRatio);
    // context.renderer.domElement.width = width;
    // context.renderer.domElement.height = height;

    this.context.renderer.setSize(
      width, // width * window.devicePixelRatio,
      height, // height * window.devicePixelRatio,
      true,
    );
    // handle ratina
    this.context.renderer.setSize(
      width * window.devicePixelRatio,
      height * window.devicePixelRatio,
      false,
    );

    this.context.renderer.render(this.context.scene, this.context.camera);
  };
}
