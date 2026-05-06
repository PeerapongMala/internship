import { DataAPIResponse } from '@core/helper/api-type';
import { LoginWithPinRequest } from '@domain/g02/g02-d01/local/type';
import { LevelSubmitData } from '../../g04-d03-p01-gameplay-quiz/type';
import {
  QuestionsDataResponse,
  SpeechToTextDataResponse,
  SpeechToTextRequest,
} from '../type';

export interface RepositoryPatternInterface {
  Helper: {
    SpeechToText(
      body: SpeechToTextRequest,
    ): Promise<DataAPIResponse<SpeechToTextDataResponse>>;
  };
  Level: {
    GetG02D05A29LevelListQuestion(
      levelId: string,
    ): Promise<DataAPIResponse<QuestionsDataResponse[]>>;
    GetG02D05A40LevelGet(
      levelId: string,
    ): Promise<DataAPIResponse<QuestionsDataResponse>>;
    CreateG04D03LearningGameplaySubmitResult(
      levelId: string,
      data: LevelSubmitData,
    ): Promise<DataAPIResponse<SpeechToTextDataResponse>>;
    CreateG04D03LearningGameplaySubmitResultWithUser(
      levelId: string,
      user: LoginWithPinRequest,
      data: LevelSubmitData,
    ): Promise<DataAPIResponse<SpeechToTextDataResponse>>;
  };
}
