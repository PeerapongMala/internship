import { useSceneGameplayStore } from '@/scenes/scene-gameplay/sceneGameplayStore';
import TimeManager from '@core-utils/timer/time-manager';

const SceneGameplayDebugTool = () => {
  const { round, score, lives, seconds } = useSceneGameplayStore();
  const { setProps } = useSceneGameplayStore();
  const timeManager = TimeManager.getInstance();

  // Example of updating (for testing purposes)
  // In a real scenario, these would be updated based on game events
  return (
    <div>
      <h1>Debug Tool</h1>

      <div className="flex flex-col">
        <label className="text-sm">Percent Time scale:</label>
        <div className="flex">
          <input
            type="range"
            min={0}
            max={200}
            step={1}
            // value={timeScale}
            value={timeManager.getTimeScale() * 100}
            onChange={(e) => {
              // setProps({ timeScale: parseFloat(e.target.value) });
              timeManager.setTimeScale(parseFloat(e.target.value) / 100);
            }}
          />
          <input
            className="ml-2 w-16 rounded border px-2 py-1 text-sm"
            type="number"
            // value={timeScale}
            value={timeManager.getTimeScale() * 100}
            onChange={(e) => {
              // setProps({ timeScale: parseFloat(e.target.value) });
              timeManager.setTimeScale(parseFloat(e.target.value) / 100);
            }}
          />
        </div>

        <label className="text-sm">Round:</label>
        <input
          className="w-full rounded border px-2 py-1"
          type="number"
          value={round}
          onChange={(e) => setProps({ round: parseFloat(e.target.value) })}
        />

        <label className="text-sm">Score:</label>
        <input
          className="w-full rounded border px-2 py-1"
          type="number"
          value={score}
          onChange={(e) => setProps({ score: parseFloat(e.target.value) })}
        />

        {/* <label className="text-sm">
          EXP:
        </label>
        <input
          className="border rounded px-2 py-1 w-full"
          type="number"
          value={exp}
          onChange={(e) =>
            setProps({ exp: parseFloat(e.target.value) })
          }
        />

        <label className="text-sm">
          Level:
        </label>
        <input
          className="border rounded px-2 py-1 w-full"
          type="number"
          value={level}
          onChange={(e) =>
            setProps({ level: parseFloat(e.target.value) })
          }
        /> */}

        <label className="text-sm">Seconds:</label>
        <input
          className="w-full rounded border px-2 py-1"
          type="number"
          value={seconds.toFixed(3)}
          onChange={(e) => setProps({ seconds: parseFloat(e.target.value) })}
        />

        <label className="text-sm">Lives:</label>
        <input
          className="w-full rounded border px-2 py-1"
          type="number"
          value={lives}
          onChange={(e) => setProps({ lives: parseFloat(e.target.value) })}
        />
      </div>
    </div>
  );
};

export default SceneGameplayDebugTool;
