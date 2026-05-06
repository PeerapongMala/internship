import { type ReactElement } from 'react';
import { Environment } from '@react-three/drei';
import {
  ENVIRONMENT_PRESETS,
  EnvironmentEnum,
  type EnvironmentPreset,
} from './EnvironmentConfig';
import { SceneName } from '@/types/game';
import { SceneManager } from '@core-utils/scene/scene-manager';

interface GameEnvironmentProps {
  preset?: EnvironmentPreset;
}

export function GameEnvironment({
  preset = EnvironmentEnum.DAYTIME,
}: GameEnvironmentProps): ReactElement {
  // Select environment based on scene or preset prop
  const selectedPreset =
    SceneManager.getInstance().getCurrentSceneName() === SceneName.MENU
      ? EnvironmentEnum.SPACE
      : preset;
  const envConfig = ENVIRONMENT_PRESETS[selectedPreset];

  return (
    <Environment
      files={Object.values(envConfig.files)}
      // background={envConfig.background}
      blur={envConfig.blur}
    />
  );
}
