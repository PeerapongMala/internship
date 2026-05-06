import App from "../../../App";
import { SceneTemplateProps, SceneTemplate } from "./scene-template";

// Class that extends SceneTemplate and delegates rendering to the functional component
export class TempAppContainer extends SceneTemplate {
  constructor(props: SceneTemplateProps) {
    super(props);
    this.content = <App />;
    this.sceneInitial();
  }
}
