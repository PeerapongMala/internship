import { AuthRestAPI } from './auth/rest-api.ts';
import { ArcadeRestAPI } from './arcade/rest-api.ts';

// import { AuthMockAPI } from './auth/mock-api.ts';
// import { ArcadeMockAPI } from './arcade/mock-api.ts';

const ARCADE_GAME_ID = import.meta.env.VITE_ARCADE_GAME_ID;
const GAME_BASE_URL = import.meta.env.VITE_GAME_BASE_URL;

const API = {
  auth: AuthRestAPI,
  arcade: ArcadeRestAPI,
};

export { API, ARCADE_GAME_ID, GAME_BASE_URL };
