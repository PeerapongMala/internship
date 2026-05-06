export interface ArcadeGame {
  id: number;
  link_game: string;
}

/**
 * Get arcade games configuration from environment variables
 * Falls back to default configuration if environment variable is not available or invalid
 */
export const getArcadeGames = (): ArcadeGame[] => {
  try {
    const arcadeUrlString = import.meta.env.VITE_ARCADE_URL;

    if (arcadeUrlString) {
      const parsed = JSON.parse(arcadeUrlString);

      // Validate the parsed data structure
      if (
        Array.isArray(parsed) &&
        parsed.every(
          (game) => typeof game.id === 'number' && typeof game.link_game === 'string',
        )
      ) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to parse VITE_ARCADE_URL from environment:', error);
  }

  // Fallback to default configuration
  console.warn('Using fallback arcade games configuration');
  return [
    {
      id: 1,
      link_game: 'http://localhost:3001/',
    },
    {
      id: 2,
      link_game: 'http://localhost:3002/',
    },
    {
      id: 3,
      link_game: 'http://localhost:3003/',
    },
  ];
};

/**
 * Find arcade game by ID
 */
export const findArcadeGameById = (gameId: string | number): ArcadeGame | undefined => {
  const games = getArcadeGames();
  return games.find((game) => game.id === Number(gameId));
};
