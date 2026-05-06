import React from "react";
import { SceneManager } from "./scene-manager";

export interface SceneTemplateProps {
  sceneName: string,
  children?: React.ReactNode,
}

export class SceneTemplate extends React.Component<{ children?: React.ReactNode }> {
  sceneManager: SceneManager | null = null;
  private _sceneName = "";
  private _isActive = false;
  protected content: React.ReactNode = null;

  constructor(props: SceneTemplateProps) {
    console.debug("SceneTemplate constructor called with props:", props);
    super(props);
    this._sceneName = props.sceneName;
    this.sceneInitial();
  }

  sceneInitial = () => {
    // console.debug(`SceneTemplate initialized with sceneName: ${this._sceneName}`);
  };
  sceneLoad = () => {
    this._isActive = true;
  };
  sceneUnload = () => {
    this._isActive = false;
  };
  sceneUpdate = (deltaTime: number, timeStamp: number) => {
    console.debug(
      `SceneTemplate.update called with deltaTime: ${deltaTime}, timeStamp: ${timeStamp}`
    );
  };

  isSceneActive = () => {
    return this._isActive;
  };

  getSceneName = () => {
    return this._sceneName;
  };

  render = (): JSX.Element => {
    // if (this.constructor !== SceneTemplate) {
    //   throw new Error("This method cannot be overridden.");
    // }
    return (
      <>
        {this.content}
        {this.props.children}
      </>
    );
  }
}
