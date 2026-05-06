import { SoundKey } from "../../../soundController";
import { useBackgroundMusicStore } from "../../../store/backgroundMusic";


export const CWSoundBackgoundControl = () => {
  const {
    playSound,
    pauseSound,
    resumeSound,
    stopSound,
    setVolume,
    volume,
    isPaused,
    currentSoundKey,
  } = useBackgroundMusicStore();

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(event.target.value);
    setVolume(newVolume);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
      <div className="flex gap-2">
        <button
          className="rounded bg-green-500 px-3 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          onClick={() => currentSoundKey && playSound(currentSoundKey as SoundKey)}
          disabled={!currentSoundKey}
        >
          Play
        </button>

        {isPaused ? (
          <button
            className="rounded bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            onClick={resumeSound}
            disabled={!currentSoundKey}
          >
            Resume
          </button>
        ) : (
          <button
            className="rounded bg-yellow-500 px-3 py-2 text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            onClick={pauseSound}
            disabled={!currentSoundKey || isPaused}
          >
            Pause
          </button>
        )}

        <button
          className="rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
          onClick={stopSound}
          disabled={!currentSoundKey}
        >
          Stop
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="volume" className="text-sm font-medium text-gray-700">
          Volume: {volume}%
        </label>
        <input
          id="volume"
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full max-w-xs"
        />
      </div>
    </div>
  );
};
