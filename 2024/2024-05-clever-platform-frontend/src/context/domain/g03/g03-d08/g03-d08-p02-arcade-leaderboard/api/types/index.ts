export interface ISessionCheckRequest {
  arcadeGameId: number;
}
export interface ISessionCheckResponse {
  play_id_exist: boolean;
  play_token: string | null;
}
export interface IBuyTokenRequest {
  arcadeGameId: number;
}

export interface IBuyTokenResponse {
  play_token: string;
}
