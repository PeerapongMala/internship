/* eslint-disable @typescript-eslint/naming-convention */

// declare assets import for 3d model
declare module '*.fbx' {
  const src: string;
  export default src;
}

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }

  interface Navigator {
    standalone: boolean;
  }
}
