import { useSceneScoreStore } from '@/scenes/scene-score/sceneScoreStore';

const SceneScoreDebugTool = () => {
  const { round, score, level, stars, seconds } = useSceneScoreStore();
  const { setProps } = useSceneScoreStore();

  // Example of updating (for testing purposes)
  // In a real scenario, these would be updated based on game events
  return (
    <div>
      <h1>Debug Tool</h1>
      <div className="flex flex-col">
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

        <label className="text-sm">Level:</label>
        <input
          className="w-full rounded border px-2 py-1"
          type="number"
          value={level}
          onChange={(e) => setProps({ level: parseFloat(e.target.value) })}
        />

        <label className="text-sm">Stars:</label>
        <input
          className="w-full rounded border px-2 py-1"
          type="number"
          value={stars}
          onChange={(e) => setProps({ stars: parseFloat(e.target.value) })}
        />

        <label className="text-sm">Seconds:</label>
        <input
          className="w-full rounded border px-2 py-1"
          type="number"
          value={seconds.toFixed(3)}
          onChange={(e) => setProps({ seconds: parseFloat(e.target.value) })}
        />
      </div>
    </div>
  );
};

export default SceneScoreDebugTool;
