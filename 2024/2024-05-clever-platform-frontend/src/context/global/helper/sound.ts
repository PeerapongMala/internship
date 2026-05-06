import StoreGlobalPersist from '@store/global/persist';

// public/assets/sounds/
export const SOUND_SOURCES = {
  // bg
  cartoon_intro_2: '/assets/sounds/bg/cartoon_game_musical_intro_2.mp3',
  cartoon_intro_3: '/assets/sounds/bg/cartoon_game_musical_intro_3.mp3',
  cartoon_intro_4: '/assets/sounds/bg/cartoon_game_musical_intro_4.mp3',
  puzzle_music: '/assets/sounds/bg/puzzle_game_music.mp3',

  // bonus
  candy_bonus: '/assets/sounds/bonus/crush_candy_bonus.mp3',

  // buy_item
  buy_1: '/assets/sounds/buy_item/game_buy_1.mp3',
  buy_2: '/assets/sounds/buy_item/game_buy_2.mp3',
  cantBuy: '/assets/sounds/buy_item/Cannot buy item.mp3',

  // click/button_click
  button_click: '/assets/sounds/click/button_click/button_click.mp3',

  // click/click_approve
  click_approve: '/assets/sounds/click/click_approve/click_approve.mp3',

  // click/game_click
  click_01: '/assets/sounds/click/game_click/game_click_01.mp3',

  // click/game_hit
  game_hit: '/assets/sounds/click/game_hit/game_hit.mp3',

  // fight/boss
  boss_fight_03: '/assets/sounds/fight/boss/game_fx_boss_fight_03.mp3',

  // fight/cartoon
  cartoon_fight_01: '/assets/sounds/fight/cartoon/cartoon_fight_01.mp3',
  cartoon_fight_02: '/assets/sounds/fight/cartoon/cartoon_fight_02.mp3',
  cartoon_fight_03: '/assets/sounds/fight/cartoon/cartoon_fight_03.mp3',

  // fight/whoosh
  fight_whoosh_1: '/assets/sounds/fight/whoosh/fight_whoosh_1.mp3',

  // level_failed
  game_over: '/assets/sounds/level_failed/game_over.mp3',
  puzzle_game_over: '/assets/sounds/level_failed/incomplete_puzzle_game_over.mp3',

  // level_passed
  puzzle_award: '/assets/sounds/level_passed/puzzle_game_award.mp3',
  winning: '/assets/sounds/level_passed/winning.mp3',

  // notification
  notification_79: '/assets/sounds/notification/game_notification_79.mp3',
  notification_80: '/assets/sounds/notification/game_notification_80.mp3',
  notification_81: '/assets/sounds/notification/game_notification_81.mp3',
  incoming_msg_8: '/assets/sounds/notification/incoming_message_8.mp3',
  console_notification: '/assets/sounds/notification/video_game_console_notification.mp3',

  // typing
  typing_puzzle: '/assets/sounds/typing/puzzle_game_typing.mp3',
  typing_game: '/assets/sounds/typing/typing_videogame.mp3',

  // upgrade
  upgrade: '/assets/sounds/upgrade/game_upgrade.mp3',

  // win
  win: '/assets/sounds/win/winning.mp3',
  no_sound: '',
};

export type SoundKey = keyof typeof SOUND_SOURCES;

export type SoundVolume = number | 'sfx' | 'bgm';

export interface SoundController {
  play: () => void;
  pause: () => void;
  stop: () => void;
  loop: (enable: boolean) => void;
  setVolume: (volumePercent: number) => void;
  destory: () => void;
}

interface SoundControllerOptions {
  autoplay?: boolean;
  loop?: boolean;
  volume?: SoundVolume;
}

// AudioContext single instance to manage audio context
const AUDIO_CONTEXT = new AudioContext();
const GAIN_SOURCE_NODE: Record<SoundKey | string, GainNode> = {};

/**
 * Creates a sound controller for a specific sound key.
 *
 * Usage example:
 * ```
 * import { createSoundController } from '@global/helper/sound';
 *
 * const sound = createSoundController('winning', { autoplay: true, loop: false, volume: 50 });
 * sound.play();
 * ```
 */
export function createSoundController(
  soundKey: SoundKey,
  options: SoundControllerOptions,
): SoundController | never {
  const soundUrl = SOUND_SOURCES[soundKey];
  if (!soundUrl) {
    throw new Error(`No sound "${soundKey}"`);
  }

  try {
    const audioElementId = `audio-key-${soundKey}`;

    let audioElement: HTMLAudioElement | null = document.getElementById(
      audioElementId,
    ) as HTMLAudioElement;

    // IF the audio element does not exist, create a new one and connect it to the audio context
    if (!audioElement) {
      // Load the sound file
      const audio = new Audio(soundUrl);
      audio.id = audioElementId; // Set the id to the sound key for easy reference
      // Append to the document body
      audioElement = document.body.appendChild(audio);

      const sourceNode = AUDIO_CONTEXT.createMediaElementSource(audioElement);
      const gainNode = AUDIO_CONTEXT.createGain();
      // push gainNode to GAIN_SOURCE_NODE for later use
      GAIN_SOURCE_NODE[soundKey] = gainNode;

      // get volume settings from settings store
      const {
        enableSFXMusic,
        SFXVolumn: sfxVolume,
        enableBackgroundMusic,
        backgroundMusicVolumn: bgmVolume,
      } = StoreGlobalPersist.MethodGet().getSettings();
      // set audio volume
      if (options?.volume === 'sfx') {
        gainNode.gain.value = enableSFXMusic
          ? Math.max(0, Math.min(sfxVolume / 100, 1))
          : 0;
      } else if (options?.volume === 'bgm') {
        gainNode.gain.value = enableBackgroundMusic
          ? Math.max(0, Math.min(bgmVolume / 100, 1))
          : 0;
      } else if (typeof options?.volume === 'number') {
        // get volume from options
        gainNode.gain.value = Math.max(0, Math.min(1, (options?.volume ?? 100) / 100)); // Ensure volume is between 0 and 1
      } else {
        gainNode.gain.value = 0.5; // Default volume
      }

      // sound flow should be: source (sound) -> gainNode (volume) -> destination
      sourceNode.connect(gainNode).connect(AUDIO_CONTEXT.destination);
    }

    audioElement.loop = options?.loop || false;
    audioElement.autoplay = options?.autoplay || false;

    const currentGainNode = GAIN_SOURCE_NODE[soundKey];
    if (options?.autoplay) {
      audioElement.play().catch((error) => {
        console.error('Error playing audio:', error);
        if (error.name === 'NotAllowedError') {
          console.warn(
            'Autoplay is not allowed. Adding click event listener to play audio.',
          );
          // Assume that autoplay is not allowed due autoplay policy for the browser,
          // so we need to add a click event listener to play the audio
          // This is a workaround for browsers that block autoplay
          document.body.addEventListener(
            'click',
            () => {
              // Check if context is in suspended state (autoplay policy)
              if (AUDIO_CONTEXT.state === 'suspended') {
                AUDIO_CONTEXT.resume();
              }
              audioElement.play().catch((error) => {
                console.error('Error playing audio:', error);
              });
            },
            { once: true },
          );
        }
      });
    }

    return {
      play: () => {
        audioElement.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      },
      pause: () => {
        audioElement.pause();
      },
      stop: () => {
        audioElement.pause();
        audioElement.currentTime = 0;
      },
      loop: (enable: boolean) => {
        audioElement.loop = enable;
      },
      setVolume: (volumePercent: number) => {
        // console.log(`Setting volume for sound "${soundKey}" to ${volumePercent}%`);
        currentGainNode.gain.value = Math.max(0, Math.min(1, volumePercent / 100)); // Ensure volume is between 0 and 1
      },
      destory: () => {
        // Stop the audio and clear the source to free up resources
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement/Audio#memory_usage_and_management
        audioElement.pause();
        audioElement.src = ''; // Clear the source to free up resources
        audioElement.load(); // Load the empty source
      },
    };
  } catch (err) {
    console.error(`Error creating sound controller for "${soundKey}":`, err);
    throw err;
  }
}
