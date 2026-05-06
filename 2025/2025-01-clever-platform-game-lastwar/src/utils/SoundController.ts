interface SoundAssets {
  readonly [key: string]: string;
}

interface SoundOptions {
  volume?: number;
  loop?: boolean;
}

const DEFAULT_SOUND_OPTIONS: Required<SoundOptions> = {
  volume: 0.5,
  loop: false,
} as const;

const SOUND_ASSETS: SoundAssets = {
  boost_hit: '/Sounds/boost_hit.wav',
  rock_hit: '/Sounds/rock_hit.wav',
  rock_destroy: '/Sounds/rock_destroy.wav',
  player_shoot: '/Sounds/laser.wav',
  ingame_music: '/Sounds/ingame_music.ogg',
  gameOver: '/Sounds/gameOver.mp3',
  Level_up: '/Sounds/Level UP.mp3',
} as const;

export class SoundController {
  private static ongoingSounds: HTMLAudioElement[] = [];

  public static playSound(
    soundName: keyof typeof SOUND_ASSETS,
    options: SoundOptions = {},
  ): void {
    const soundPath = SOUND_ASSETS[soundName];
    if (!soundPath) {
      console.error(`Sound '${soundName}' not found.`);
      return;
    }

    try {
      const audio = new Audio(soundPath);
      const mergedOptions = { ...DEFAULT_SOUND_OPTIONS, ...options };

      audio.volume = mergedOptions.volume;
      audio.loop = mergedOptions.loop;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error(`Error playing sound '${soundName}':`, error);
        });
      }

      if (mergedOptions.loop) {
        this.ongoingSounds.push(audio);
      }
    } catch (error) {
      console.error(`Error creating audio for '${soundName}':`, error);
    }
  }

  public static stopAllSounds(): void {
    this.ongoingSounds.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (error) {
        console.error('Error stopping sound:', error);
      }
    });

    this.ongoingSounds = [];
  }

  public static stopSound(soundName: keyof typeof SOUND_ASSETS): void {
    const soundsToStop = this.ongoingSounds.filter((audio) =>
      audio.src.includes(SOUND_ASSETS[soundName]),
    );

    soundsToStop.forEach((audio) => {
      try {
        audio.pause();
        audio.currentTime = 0;
        const index = this.ongoingSounds.indexOf(audio);
        if (index > -1) {
          this.ongoingSounds.splice(index, 1);
        }
      } catch (error) {
        console.error(`Error stopping sound '${soundName}':`, error);
      }
    });
  }

  public static setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.ongoingSounds.forEach((audio) => {
      try {
        audio.volume = clampedVolume;
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    });
  }

  public static isPlaying(soundName: keyof typeof SOUND_ASSETS): boolean {
    return this.ongoingSounds.some(
      (audio) =>
        audio.src.includes(SOUND_ASSETS[soundName]) &&
        !audio.paused &&
        audio.currentTime < audio.duration,
    );
  }
}

export const playSound = SoundController.playSound.bind(SoundController);
export const stopAllSound = SoundController.stopAllSounds.bind(SoundController);
