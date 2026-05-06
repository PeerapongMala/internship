import { SceneGameFlowState, useSceneGameplayStore } from '../sceneGameplayStore';

const SceneGameplayDebugTool = () => {
  const { flowState, round, score, level, exp, seconds } = useSceneGameplayStore();
  const { setProps } = useSceneGameplayStore();

  // Example of updating (for testing purposes)
  // In a real scenario, these would be updated based on game events
  return (
    <div>
      <h1>Debug Tool</h1>
      <div className="flex flex-col">
        <label className="text-sm">Flow:</label>
        <input
          className="w-full rounded border px-2 py-1"
          type="number"
          value={flowState}
          onChange={(e) =>
            setProps({
              flowState: Number(e.target.value) as unknown as SceneGameFlowState,
            })
          }
        />

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

        <label className="text-sm">EXP:</label>
        <input
          className="w-full rounded border px-2 py-1"
          type="number"
          value={exp}
          onChange={(e) => setProps({ exp: parseFloat(e.target.value) })}
        />

        <label className="text-sm">Level:</label>
        <input
          className="w-full rounded border px-2 py-1"
          type="number"
          value={level}
          onChange={(e) => setProps({ level: parseFloat(e.target.value) })}
        />

        <label className="text-sm">Seconds:</label>
        <input
          className="w-full rounded border px-2 py-1"
          type="number"
          value={seconds.toFixed(3)}
          onChange={(e) => setProps({ seconds: parseFloat(e.target.value) })}
        />

        {/* <label className="text-sm">
          Lives:
        </label>
        <input
          className="border rounded px-2 py-1 w-full"
          type="number"
          value={lives}
          onChange={(e) =>
            setProps({ lives: parseFloat(e.target.value)})
          }
        /> */}
      </div>
    </div>
  );
};

export default SceneGameplayDebugTool;
