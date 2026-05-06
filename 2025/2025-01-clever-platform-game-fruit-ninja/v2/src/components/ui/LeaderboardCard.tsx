// components/LeaderboardCard.tsx
interface LeaderboardProps {
  scores: { name: string; score: number }[];
}

export default function LeaderboardCard({ scores }: LeaderboardProps) {
  return (
    <div className="leaderboard-card">
      <h2>Top Scores</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={index}>
            {score.name}: {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
