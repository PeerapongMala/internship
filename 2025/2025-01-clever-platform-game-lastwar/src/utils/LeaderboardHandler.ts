interface LeaderboardEntry {
  name: string;
  score: number;
}

export class LeaderboardHandler {
  private static readonly STORAGE_KEY = 'leaderboardData';
  private static readonly MAX_ENTRIES = 10; // Optional: limit number of entries

  public static getLeaderboard(): LeaderboardEntry[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];

      const leaderboardData = JSON.parse(data) as LeaderboardEntry[];
      return Array.isArray(leaderboardData) ? leaderboardData : [];
    } catch (error) {
      console.error('Error reading leaderboard:', error);
      return [];
    }
  }

  public static updateLeaderboard(playerName: string, score: number): boolean {
    try {
      if (!playerName || typeof score !== 'number') {
        console.error('Invalid player data provided');
        return false;
      }

      const leaderboardData = this.getLeaderboard();
      const existingPlayer = leaderboardData.find((player) => player.name === playerName);

      if (existingPlayer) {
        existingPlayer.score = Math.max(existingPlayer.score, score);
      } else {
        leaderboardData.push({ name: playerName, score });
      }

      // Sort by score in descending order
      leaderboardData.sort((a, b) => b.score - a.score);

      // Optional: limit the number of entries
      if (this.MAX_ENTRIES > 0) {
        leaderboardData.splice(this.MAX_ENTRIES);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(leaderboardData));
      return true;
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      return false;
    }
  }

  public static resetLeaderboard(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error resetting leaderboard:', error);
      return false;
    }
  }

  public static getTopScores(limit: number = 5): LeaderboardEntry[] {
    const leaderboard = this.getLeaderboard();
    return leaderboard.slice(0, limit);
  }

  public static getPlayerRank(playerName: string): number {
    const leaderboard = this.getLeaderboard();
    const playerIndex = leaderboard.findIndex((entry) => entry.name === playerName);
    return playerIndex === -1 ? -1 : playerIndex + 1;
  }

  public static isHighScore(score: number): boolean {
    const leaderboard = this.getLeaderboard();
    if (leaderboard.length < this.MAX_ENTRIES) return true;
    return leaderboard.some((entry) => score > entry.score);
  }
}
