import {
  ArcadeRepository,
  IBuyTokenRequest,
  IBuyTokenResponse,
  IGetDataRequest,
  IGetDataResponse,
  ISessionCheckRequest,
  ISessionCheckResponse,
  ISubmitResultRequest,
  ISubmitResultResponse,
} from './arcade-repository.ts';
import { DataAPIResponse, FailedAPIResponse } from '../type.ts';
import { useAuthStore } from '../auth/auth-store.ts';
// import { useArcadeAuthStore } from '../../store/global/auth/index.ts';

// ใช้ค่าโดยตรงแทนการ import จาก index.ts เพื่อหลีกเลี่ยง circular dependency
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8001';

const ArcadeRestAPI: ArcadeRepository = {
  BuyToken: function (
    req: IBuyTokenRequest,
  ): Promise<DataAPIResponse<IBuyTokenResponse> | FailedAPIResponse> {
    const { accessToken } = useAuthStore.getState();
    const url = `${BACKEND_URL}/arcade-game/v1/platform/arcade/${req.arcadeGameId}/buy`;
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res: DataAPIResponse<IBuyTokenResponse> | FailedAPIResponse) => {
        return res;
      });
  },
  SessionCheck: function (
    req: ISessionCheckRequest,
    accessToken: string,
  ): Promise<DataAPIResponse<ISessionCheckResponse> | FailedAPIResponse> {
    // const { accessToken } = useArcadeAuthStore.getState();
    const url = `${BACKEND_URL}/arcade-game/v1/platform/arcade/${req.arcadeGameId}/check`;
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      });
  },
  GetData: function (
    req: IGetDataRequest,
  ): Promise<DataAPIResponse<IGetDataResponse> | FailedAPIResponse> {
    const url = `${BACKEND_URL}/arcade-game/v1/arcade-game/data`;

    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + req.play_token,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res: DataAPIResponse<IGetDataResponse> | FailedAPIResponse) => {
        return res;
      });
  },
  GetModel: function (accessPlayToken: string): Promise<ArrayBuffer | FailedAPIResponse> {
    const url = `${BACKEND_URL}/arcade-game/v1/arcade-game/asset`;
    return fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + accessPlayToken,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.arrayBuffer();
        } else {
          return res.json();
        }
      })
      .then((res: ArrayBuffer | FailedAPIResponse) => {
        return res;
      });
  },
  SubmitResult: function (
    req: ISubmitResultRequest,
  ): Promise<DataAPIResponse<ISubmitResultResponse> | FailedAPIResponse> {
    const url = `${BACKEND_URL}/arcade-game/v1/arcade-game/score`;

    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + req.play_token,
      },
      body: JSON.stringify({
        score: req.score,
        time_used: req.time_used,
        wave: req.wave,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        return res;
      });
  },
};
export { ArcadeRestAPI };
