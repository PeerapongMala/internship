import { responseOk } from '@core/helper/api-mock';
import { DataAPIResponse } from '@core/helper/api-type';
import { LessonEntity } from '@domain/g04/g04-d01/local/type';
import MockJson from './index.json';

const LessonByIdGet = (lessonId: string): Promise<DataAPIResponse<LessonEntity>> => {
  const found = MockJson.find((item) => item.id === lessonId);

  if (!found) {
    throw new Error('Lesson not found');
  }

  const lesson: LessonEntity = {
    ...found,
    id: Number(found.id),
  };

  return Promise.resolve(responseOk({ data: lesson }));
};

export default LessonByIdGet;
