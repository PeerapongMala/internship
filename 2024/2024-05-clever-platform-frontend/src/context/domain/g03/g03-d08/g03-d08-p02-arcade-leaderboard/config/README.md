# Arcade Games Configuration

## Overview

This document explains how to configure arcade games URLs for different environments using environment variables.

## Environment Variable Format

The `VITE_ARCADE_URL` environment variable should be a JSON string containing an array of arcade game objects.

### Structure

```typescript
interface ArcadeGame {
  id: number; // Unique game identifier
  link_game: string; // URL to the game
}
```

### Example Values

#### Local Development

```bash
VITE_ARCADE_URL='[{"id":1,"link_game":"http://localhost:3001/"},{"id":2,"link_game":"http://localhost:3002/"},{"id":3,"link_game":"http://localhost:3003/"}]'
```

#### Development Environment

```bash
VITE_ARCADE_URL='[{"id":1,"link_game":"https://clever-arcade-1.nextgen-education.com"},{"id":2,"link_game":"https://clever-arcade-2.nextgen-education.com"},{"id":3,"link_game":"https://clever-arcade-3.nextgen-education.com"}]'
```

#### Production Environment

```bash
VITE_ARCADE_URL='[{"id":1,"link_game":"https://prod-arcade-1.example.com"},{"id":2,"link_game":"https://prod-arcade-2.example.com"},{"id":3,"link_game":"https://prod-arcade-3.example.com"}]'
```

## Implementation Details

The configuration is handled by the `arcade-games.ts` helper file which:

1. **Parses** the JSON string from `VITE_ARCADE_URL`
2. **Validates** the data structure
3. **Provides fallback** configuration if parsing fails
4. **Exports utilities** for finding games by ID

### Key Functions

- `getArcadeGames()`: Returns all arcade games from environment or fallback
- `findArcadeGameById(id)`: Finds a specific game by its ID

## Error Handling

If the environment variable is:

- **Missing**: Uses fallback configuration
- **Invalid JSON**: Uses fallback configuration and logs error
- **Wrong structure**: Uses fallback configuration

## Setup Instructions

1. Copy `.env.example` to `.env`
2. Modify `VITE_ARCADE_URL` with your environment-specific URLs
3. Ensure the JSON string is properly formatted (no line breaks, escaped quotes)
4. Restart your development server after changes

## Troubleshooting

### Common Issues

1. **JSON Parsing Error**: Check that the JSON string is valid and properly escaped
2. **Game Not Found**: Verify the game ID exists in your configuration
3. **Invalid URL**: Ensure URLs are complete and accessible

### Validation

The helper function validates that each game object has:

- `id` (number)
- `link_game` (string)

If validation fails, it falls back to the default configuration.
