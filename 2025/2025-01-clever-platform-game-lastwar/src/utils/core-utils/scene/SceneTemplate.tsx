import React from 'react';
import { SceneManager } from './scene-manager';

export interface SceneTemplateProps {
  sceneName: string;
  children?: React.ReactNode;
}

export class SceneTemplate extends React.Component<
  { children?: React.ReactNode },
  { forceRenderKey: number }
> {
  sceneManager: SceneManager | null = null;
  private _sceneName = '';
  protected _isActive = false;
  protected content: React.ReactNode;
  protected background: string = '';

  constructor(props: SceneTemplateProps) {
    console.debug('SceneTemplate constructor called with props:', props);
    super(props);
    this._sceneName = props.sceneName;
    this.state = {
      forceRenderKey: 0,
    };
    this.sceneInitial();
  }

  componentDidMount() {
    // Silent mount
  }

  componentWillUnmount() {
    // Silent unmount
  }

  sceneInitial = () => {
    // console.debug(`SceneTemplate initialized with sceneName: ${this._sceneName}`);
  };
  sceneLoad = () => {
    this._isActive = true;
    this.forceRerender();
  };
  sceneUnload = () => {
    this._isActive = false;
    this.forceRerender();
  };

  isSceneActive = () => {
    return this._isActive;
  };

  getSceneName = () => {
    return this._sceneName;
  };

  forceRerender = () => {
    // Force re-render by updating state
    // this.setState((prev) => ({ forceRenderKey: prev.forceRenderKey + 1 }));
    // Also notify SceneManager to re-render
    if (this.sceneManager) {
      this.sceneManager.forceRerender();
    }
  };

  // Method to update background dynamically
  setBackground = (backgroundUrl: string) => {
    this.background = backgroundUrl;
    this.forceRerender();
  };

  getBackground = () => {
    return this.background;
  }

  // update = (deltaTime: number, timeStamp?: number, frameCount?: number) => {
  //   console.debug(
  //     `SceneTemplate.update called with deltaTime: ${deltaTime}, timeStamp: ${timeStamp}, frameCount: ${frameCount}`,
  //   );
  // };

  // fixedUpdate = (deltaTime: number) => {
  //   console.debug(
  //     `SceneTemplate.fixedUpdate called with deltaTime: ${deltaTime}`,
  //   );
  // };

  renderScene = () => {
    return <></>;
  };

  render = (): React.ReactNode => {
    // Use instance variables, state is only for forcing re-render
    return (
      <>
        {this._isActive && (
          <div className="absolute flex h-screen w-full items-center justify-center overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${this.background})`,
              }}
            />
            {this.content}
            {this.renderScene()}
            {this.props.children}
          </div>
        )}
      </>
    );
  };
}
