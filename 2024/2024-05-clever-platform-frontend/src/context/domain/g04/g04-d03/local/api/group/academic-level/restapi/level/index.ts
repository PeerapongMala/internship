import {
  convertToDataResponse,
  convertToDataResponseList,
  DataAPIResponse,
} from '@core/helper/api-type';
import API from '@domain/g02/g02-d01/local/api';
import { LoginWithPinRequest } from '@domain/g02/g02-d01/local/type';
import { LevelSubmitData } from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import {
  QuestionsDataResponse,
  SpeechToTextDataResponse,
} from '@domain/g04/g04-d03/local/type';
import { fetchWithAuth, fetchWithCustomToken } from '@global/helper/fetch';
import StoreGlobal from '@store/global';
import { RepositoryPatternInterface } from '../../../../repository-pattern';

const backendURL = StoreGlobal.StateGetAllWithUnsubscribe().apiBaseURL;

// type FetchOptions = Omit<RequestInit, 'headers'> & {
//   headers?: HeadersInit;
// };

const GetG02D05A29LevelListQuestion = (
  levelId: string,
): Promise<DataAPIResponse<QuestionsDataResponse[]>> => {
  const url = `${backendURL}/academic-level/v1/levels/${levelId}/questions`;
  return fetchWithAuth(url)
    .then((res) => res.json())
    .then((res: DataAPIResponse<QuestionsDataResponse[]>) => {
      if (res.status_code === 200) return convertToDataResponseList(res);
      return res;
    });
};

const GetG02D05A40LevelGet = (
  levelId: string,
): Promise<DataAPIResponse<QuestionsDataResponse>> => {
  const url = `${backendURL}/academic-level/v1/levels/${levelId}`;
  return fetchWithAuth(url)
    .then((res) => res.json())
    .then((res: DataAPIResponse<QuestionsDataResponse>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};

const LoginWithPin = async (data: LoginWithPinRequest): Promise<string | null> => {
  try {
    const res = await API.Auth.LoginWithPin({
      pin: data.pin,
      student_id: data.student_id,
      school_code: data.school_code,
    });

    if (res.status_code === 200) {
      const { access_token } = res.data;
      return access_token;
    }

    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const CreateG04D03LearningGameplaySubmitResult = async (
  levelId: string,
  data: LevelSubmitData,
): Promise<DataAPIResponse<SpeechToTextDataResponse>> => {
  const url = `${backendURL}/learning-gameplay/v1/quiz/${levelId}/submit-result`;
  return fetchWithAuth(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<SpeechToTextDataResponse>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};

const CreateG04D03LearningGameplaySubmitResultWithUser = async (
  levelId: string,
  user: LoginWithPinRequest,
  data: LevelSubmitData,
): Promise<DataAPIResponse<SpeechToTextDataResponse>> => {
  const token = await LoginWithPin(user);
  if (!token) return { status_code: 400, message: 'Token not found' };

  const url = `${backendURL}/learning-gameplay/v1/quiz/${levelId}/submit-result`;
  return fetchWithCustomToken(url, token, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res: DataAPIResponse<SpeechToTextDataResponse>) => {
      if (res.status_code === 200) return convertToDataResponse(res);
      return res;
    });
};

const Level: RepositoryPatternInterface['Level'] = {
  GetG02D05A29LevelListQuestion,
  GetG02D05A40LevelGet,
  CreateG04D03LearningGameplaySubmitResult,
  CreateG04D03LearningGameplaySubmitResultWithUser,
};

export default Level;
