import axios from 'axios';

// MOCK
const ARCADE_AUTH_MOCK_CONFIG = {
  inventory_id: 1,
  student_id: 'cd1592be-7302-4805-a172-86956b0bf2a1',
  model_data: {
    AvatarId: 2,
    ModelId: '4',
    LevelId: 1,
    Is_equipped: true,
  },
  arcade_game_id: 1,
  arcade_game_url: '',
  config_id: 0,
};

// configuration
// Lastwar = 1, Survivor.io = 2, Fruitninja = 3
let ARCADE_TOKEN: any = null;
let LOGIN_TOKEN: any = null;
let ARCADE_CONFIG: any = null;

// Usage example
/* 
  AutherizeArcadeSession(AracdeToken, LoginToken)
    .then((response) => {
      console.log(response);
  });

  Before using this method you have to Autherize first
  SendGameSessionInfo(1, 1).then((response) => {
    console.log(response);
  });
*/

/**
 * Sends game session information to the API.
 *
 * @param Score - The score achieved by the player during the game session.
 * @param Time_Used - The time taken by the player to complete the game session.
 *
 * @returns A promise that resolves to a success message if the game session information is successfully sent,
 *          or `null` if the player is not authenticated.
 *          If an error occurs during the request, it logs the error message and does not resolve the promise.
 *
 * @remarks
 * This function sends a POST request to the API with the game session information.
 * It requires the `ARCADE_TOKEN` and `LOGIN_TOKEN` to be set before calling this function.
 * If the tokens are not provided, it logs an error message and returns `null`.
 * If the request is successful, it resolves the promise with the success message.
 * If an error occurs during the request, it logs the error message and does not resolve the promise.
 */
export async function SendGameSessionInfo(Score: number, Time_Used: number) {
  if (ARCADE_TOKEN == null || LOGIN_TOKEN == null) {
    console.log('Player is not Authenticated');
    return null;
  }

  const API_LINK = import.meta.env.VITE_API_URL;
  const ARCADE_GAME_ID = import.meta.env.VITE_ARCADE_GAME_ID;

  const request = await axios
    .post(
      API_LINK + 'arcade-game/v1/arcade-game/' + ARCADE_GAME_ID,
      {
        score: Score,
        time_used: Time_Used,
        play_token: ARCADE_TOKEN,
      },
      {
        headers: {
          Authorization: `Bearer ${LOGIN_TOKEN?.toString()}`,
        },
      },
    )
    .then((_) => {
      return 'successfully post game session information';
    })
    .catch((error) => {
      console.log('Error when sending game session :' + error);
    });

  return request;
}

/**
 * Autherizes an arcade game session using the provided tokens.
 *
 * @param ArcadeToken - The token for the arcade game session.
 * @param LoginToken - The token for the user's login session.
 *
 * @returns A promise that resolves to the response data from the API, or "NO ACCESS" if the tokens are not provided.
 *
 * @remarks
 * This function sends a POST request to the API to authenticate the arcade game session.
 * If the tokens are valid, it updates the `ARCADE_TOKEN` and `LOGIN_TOKEN` variables and returns the response data.
 * If the tokens are not provided, it logs an error message and returns "NO ACCESS".
 */
export async function AutherizeArcadeSession(
  ArcadeToken: any,
  LoginToken: any,
): Promise<any> {
  if (import.meta.env.VITE_API_MOCK) {
    console.log('Using Mock configuration');
    ARCADE_CONFIG = ARCADE_AUTH_MOCK_CONFIG;
    return ARCADE_AUTH_MOCK_CONFIG;
  }

  if (ArcadeToken == null || LoginToken == null) {
    console.log('No Key Provided');
    return 'NO ACCESS';
  }

  const API_LINK = import.meta.env.VITE_API_URL;
  const ARCADE_GAME_ID = import.meta.env.VITE_ARCADE_GAME_ID;
  // Fetch arcade game information
  const request = await axios
    .post(
      API_LINK + '/arcade-game/v1/arcade-game/' + ARCADE_GAME_ID + '/' + ArcadeToken, //arcadeGameToken.data.data.play_token,
      {},
      {
        headers: {
          Authorization: `Bearer ${LoginToken?.toString()}`, // arcadeGameToken.data.data.play_token
        },
      },
    )
    .then((response) => {
      ARCADE_TOKEN = ArcadeToken;
      LOGIN_TOKEN = LoginToken?.toString();
      ARCADE_CONFIG = response.data.data;
      return response.data;
    })
    .catch((_) => {
      return 'NO ACCESS';
    });

  console.log('Arcade Game Autherized with data:', request.data);
  return request.data;
}

export function FetchArcadeConfig() {
  return ARCADE_CONFIG;
}

export function GetArcadeToken() {
  return ARCADE_TOKEN;
}

export function GetLoginToken() {
  return LOGIN_TOKEN;
}
