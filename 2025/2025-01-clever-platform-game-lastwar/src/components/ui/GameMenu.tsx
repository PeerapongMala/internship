import LeaderboardCard from './LeaderboardCard';
import { StartButton } from './StartButton';

export default function GameMenu() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-center text-3xl font-bold">Welcome to the Game</h1>
        <StartButton />
        <LeaderboardCard scores={[{ name: 'Player 1', score: 100 }]} />
      </div>
    </div>
  );
}
