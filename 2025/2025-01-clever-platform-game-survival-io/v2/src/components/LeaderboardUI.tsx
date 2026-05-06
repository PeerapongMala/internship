import { useLeaderboardStore } from '../store/leaderboardStore';

export function LeaderboardUI() {
  const { leaderboard } = useLeaderboardStore();

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '20px',
        borderRadius: '10px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        minWidth: '300px',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Leaderboard</h2>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {leaderboard.map((player, index) => (
          <div
            key={player.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              borderBottom: '1px solid rgba(255,255,255,0.2)',
              backgroundColor: index === 0 ? 'rgba(255,215,0,0.2)' : 'transparent',
            }}
          >
            <span>#{index + 1}</span>
            <span>{player.score}</span>
            <span>{new Date(player.timestamp).toLocaleDateString()}</span>
          </div>
        ))}
        {leaderboard.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px' }}>No scores yet</div>
        )}
      </div>
    </div>
  );
}
