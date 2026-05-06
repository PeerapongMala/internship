// utils/sound/sound.ts
export type SoundGroup = Record<string, string>;
export type SoundGroups = Record<string, SoundGroup>;

export type SoundSources = Record<string, string>;

export type SoundVolume = number | 'sfx' | 'bgm';
export type SoundKey = string;

export interface SoundController {
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  loop: (enable: boolean) => void;
  setVolume: (volumePercent: number) => void;
  destroy: () => void;
  getVolume: () => number;
  isPlaying: () => boolean;
}

interface SoundControllerOptions {
  autoplay?: boolean;
  loop?: boolean;
  volume?: SoundVolume;
}

// ============ Core Audio Management ============

let AUDIO_CONTEXT: AudioContext | null = null;
const GAIN_SOURCE_NODE: Record<string, GainNode> = {};
const ACTIVE_AUDIO_ELEMENTS: Record<string, HTMLAudioElement> = {};
let MASTER_GAIN_NODE: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!AUDIO_CONTEXT) {
    AUDIO_CONTEXT = new AudioContext();
  }
  return AUDIO_CONTEXT;
}
function getMasterGainNode(): GainNode {
  if (!MASTER_GAIN_NODE) {
    const context = getAudioContext();
    MASTER_GAIN_NODE = context.createGain();
    MASTER_GAIN_NODE.connect(context.destination);
  }
  return MASTER_GAIN_NODE;
}

async function resumeAudioContext(): Promise<void> {
  const context = getAudioContext();
  if (context.state === 'suspended') {
    try {
      await context.resume();
    } catch (error) {
      console.error('Failed to resume audio context:', error);
    }
  }
}

/**
 * Public function to unlock/resume the shared AudioContext
 * Should be called on first user interaction to enable audio playback
 */
export async function unlockAudioContext(): Promise<void> {
  try {
    await resumeAudioContext();
    console.log('✅ AudioContext unlocked and resumed');
  } catch (error) {
    console.error('❌ Failed to unlock audio context:', error);
  }
}

function parseVolumeOption(
  volumeOption: SoundVolume | undefined,
  defaultVolumes: { sfx: number; bgm: number },
): number {
  if (typeof volumeOption === 'number') {
    return Math.max(0, Math.min(1, volumeOption / 100));
  } else if (volumeOption === 'sfx') {
    return defaultVolumes.sfx;
  } else if (volumeOption === 'bgm') {
    return defaultVolumes.bgm;
  }
  return 0.5; // fallback
}

export function playOneShotSound(
  soundKey: string,
  soundSources: SoundSources,
  volumePercent: number = 100,
): void {
  const url = soundSources[soundKey];
  if (!url) {
    console.warn(`SFX "${soundKey}" not found`);
    return;
  }

  const audio = new Audio(url);
  const baseVolume = Math.max(0, Math.min(1, volumePercent / 100));

  const context = getAudioContext();
  const source = context.createMediaElementSource(audio);
  const gain = context.createGain();
  gain.gain.value = baseVolume;

  // เชื่อมผ่าน master gain
  source.connect(gain).connect(getMasterGainNode());

  resumeAudioContext().then(() => {
    audio.play().catch((err) => {
      console.warn(`Failed to play SFX "${soundKey}":`, err);
    });
  });

  audio.onended = () => {
    source.disconnect();
    gain.disconnect();
    audio.remove();
  };
}

/**
 * Create a sound controller for a given soundKey.
 * Handles AudioContext, gain node, autoplay, loop, and cleanup.
 */
export function createSoundController(
  soundKey: string,
  soundSources: SoundSources,
  defaultVolumes: { sfx: number; bgm: number },
  options: SoundControllerOptions = {},
): SoundController {
  const soundUrl = soundSources[soundKey];

  if (!soundUrl) {
    throw new Error(`No sound "${soundKey}"`);
  }
  // Special "no_sound" controller that does nothing
  if (soundKey === 'no_sound') {
    return {
      play: async () => {},
      pause: async () => {},
      stop: async () => {},
      loop: () => {},
      setVolume: () => {},
      destroy: () => {},
      getVolume: () => 0,
      isPlaying: () => false,
    };
  }

  try {
    const audioElementId = `audio-key-${soundKey}`;
    let audioElement = ACTIVE_AUDIO_ELEMENTS[audioElementId];
    let playPromise: Promise<void> | null = null;

    // Check if we need to create a new element
    const needNewElement =
      !audioElement ||
      (audioElement.src &&
        audioElement.src !== soundUrl &&
        audioElement.src !== new URL(soundUrl, window.location.origin).href);

    if (needNewElement) {
      // Clean up old element if exists
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        delete ACTIVE_AUDIO_ELEMENTS[audioElementId];
      }

      // Create new audio element
      console.log('🎼 Creating new audio element:', { soundKey, soundUrl });
      audioElement = new Audio(soundUrl);
      audioElement.id = audioElementId;
      audioElement.preload = 'auto';
      ACTIVE_AUDIO_ELEMENTS[audioElementId] = audioElement;

      // Debug: log when audio loads or errors
      audioElement.addEventListener(
        'loadeddata',
        () => {
          console.log('✅ Audio loaded successfully:', soundUrl);
        },
        { once: true },
      );
      audioElement.addEventListener(
        'error',
        (e) => {
          console.error('❌ Audio load failed:', soundUrl, e);
          // Check if the file exists
          fetch(soundUrl, { method: 'HEAD' })
            .then((res) =>
              console.log(
                '📡 File exists check:',
                res.status,
                res.headers.get('content-type'),
              ),
            )
            .catch((err) => console.error('📡 File fetch failed:', err));
        },
        { once: true },
      );

      const audioContext = getAudioContext();

      // Create or reuse gain node
      let gainNode = GAIN_SOURCE_NODE[soundKey];
      if (!gainNode) {
        gainNode = audioContext.createGain();
        GAIN_SOURCE_NODE[soundKey] = gainNode;

        const initialVolume = parseVolumeOption(options.volume, defaultVolumes);
        gainNode.gain.value = initialVolume;

        // Connect gain to master only once
        gainNode.connect(getMasterGainNode());
      }

      // Create source node and connect to existing gain
      try {
        const sourceNode = audioContext.createMediaElementSource(audioElement);
        sourceNode.connect(gainNode);
      } catch (error) {
        console.error('Failed to create MediaElementSource (already exists?):', error);
        // Element might already have a source, continue anyway
      }
    } else if (audioElement && !audioElement.src) {
      // Element exists but has no source (was destroyed)
      audioElement.src = soundUrl;
      audioElement.load();
    }

    audioElement.loop = options.loop || false;

    // Note: autoplay is deprecated in favor of calling play() explicitly
    // This is kept for backward compatibility but should not be used
    if (options.autoplay) {
      console.warn('⚠️ autoplay option is deprecated. Use controller.play() instead.');
    }

    const currentGainNode = GAIN_SOURCE_NODE[soundKey];

    return {
      play: async () => {
        // Wait for any pending play/pause to complete
        if (playPromise) {
          await playPromise.catch(() => {});
        }

        await resumeAudioContext();

        // Wait for audio to be ready if it's not loaded yet
        if (audioElement.readyState < 2) {
          await new Promise<void>((resolve) => {
            const onCanPlay = () => {
              cleanup();
              resolve();
            };
            const onError = (e: Event) => {
              console.warn('Audio load error, will try to play anyway:', e);
              cleanup();
              resolve(); // Continue anyway, play() will fail if it can't play
            };
            const cleanup = () => {
              audioElement.removeEventListener('canplay', onCanPlay);
              audioElement.removeEventListener('error', onError);
              clearTimeout(timeoutId);
            };

            audioElement.addEventListener('canplay', onCanPlay, { once: true });
            audioElement.addEventListener('error', onError, { once: true });

            // Timeout after 2 seconds
            const timeoutId = setTimeout(() => {
              cleanup();
              resolve(); // Try to play anyway
            }, 2000);
          });
        }

        playPromise = audioElement.play().catch((error) => {
          console.error('Error playing audio:', error);
          playPromise = null;
        });
        await playPromise;
      },
      pause: async () => {
        // Wait for any pending play to complete before pausing
        if (playPromise) {
          await playPromise.catch(() => {});
          playPromise = null;
        }
        audioElement.pause();
      },
      stop: async () => {
        // Wait for any pending play to complete before stopping
        if (playPromise) {
          await playPromise.catch(() => {});
          playPromise = null;
        }
        audioElement.pause();
        audioElement.currentTime = 0;
      },
      loop: (enable: boolean) => {
        audioElement.loop = enable;
      },
      setVolume: (volumePercent: number) => {
        const volumeValue = Math.max(0, Math.min(1, volumePercent / 100));
        if (currentGainNode) {
          currentGainNode.gain.value = volumeValue;
        }
      },
      getVolume: () => {
        return currentGainNode ? currentGainNode.gain.value * 100 : 0;
      },
      isPlaying: () => {
        return !audioElement.paused;
      },
      destroy: () => {
        audioElement.pause();
        audioElement.src = '';
        audioElement.load();

        if (audioElement.parentNode) {
          audioElement.parentNode.removeChild(audioElement);
        }

        const elementId = audioElement.id;
        delete ACTIVE_AUDIO_ELEMENTS[elementId];
        delete GAIN_SOURCE_NODE[soundKey];
      },
    };
  } catch (err) {
    console.error(`Error creating sound controller for "${soundKey}":`, err);
    throw err;
  }
}

/**
 * Preload multiple sounds to reduce delay on first playback
 */
export async function preloadSounds(
  soundKeys: string[],
  soundSources: SoundSources,
): Promise<void> {
  for (const key of soundKeys) {
    if (soundSources[key] && soundSources[key] !== '') {
      try {
        createSoundController(key, soundSources, { sfx: 0.7, bgm: 0.6 }, { volume: 0 });
      } catch (error) {
        console.warn(`Failed to preload sound "${key}":`, error);
      }
    }
  }
}

/**
 * Set master volume for all active sounds
 */
export function setMasterVolume(volumePercent: number): void {
  const volumeValue = Math.max(0, Math.min(1, volumePercent / 100));
  if (MASTER_GAIN_NODE) {
    MASTER_GAIN_NODE.gain.value = volumeValue;
  }
}

/**
 * Cleanup all active sounds and close AudioContext
 */
export function cleanupAllSounds(): void {
  Object.values(ACTIVE_AUDIO_ELEMENTS).forEach((audioElement) => {
    audioElement.pause();
    audioElement.src = '';
    if (audioElement.parentNode) {
      audioElement.parentNode.removeChild(audioElement);
    }
  });

  Object.keys(ACTIVE_AUDIO_ELEMENTS).forEach((key) => delete ACTIVE_AUDIO_ELEMENTS[key]);
  Object.keys(GAIN_SOURCE_NODE).forEach((key) => delete GAIN_SOURCE_NODE[key]);

  if (AUDIO_CONTEXT) {
    AUDIO_CONTEXT.close();
    AUDIO_CONTEXT = null;
  }
}
