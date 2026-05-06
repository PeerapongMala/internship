import { DataAPIResponse, FailedAPIResponse } from '../type.ts';

export interface IBuyTokenRequest {
  arcadeGameId: number;
}

export interface IBuyTokenResponse {
  play_token: string;
}

export interface IGetDataRequest {
  play_token: string | null;
}

export interface IGetDataResponse {
  student_id: string;
  model_data: {
    model_id: string | undefined;
  };
  config_id: number;
}

export interface ISubmitResultRequest {
  play_token: string | null;
  score: number;
  time_used: number;
  wave: number;
}

export interface ISubmitResultResponse {
  score: number;
  time_used: number;
  wave: number;
}

export interface ISessionCheckRequest {
  arcadeGameId: number;
}

export interface ISessionCheckResponse {
  play_id_exist: boolean;
  play_token: string | null;
}

export interface ArcadeRepository {
  BuyToken(
    req: IBuyTokenRequest,
  ): Promise<DataAPIResponse<IBuyTokenResponse> | FailedAPIResponse>;
  SessionCheck(
    req: ISessionCheckRequest,
    accessToken: string,
  ): Promise<DataAPIResponse<ISessionCheckResponse> | FailedAPIResponse>;
  GetData(
    req: IGetDataRequest,
  ): Promise<DataAPIResponse<IGetDataResponse> | FailedAPIResponse>;
  GetModel(accessPlayToken: string): Promise<ArrayBuffer | FailedAPIResponse>;
  SubmitResult(
    req: ISubmitResultRequest,
  ): Promise<DataAPIResponse<ISubmitResultResponse> | FailedAPIResponse>;
}
