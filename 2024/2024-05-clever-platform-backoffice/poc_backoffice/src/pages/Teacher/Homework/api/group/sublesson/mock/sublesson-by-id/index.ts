import { APITypeAPIResponse } from '../../../../../../../../core/helper/api-type';
import { LessonDetail, SubjectLessons } from '../../../../../type';
import MockJson from './index.json';

const SublessonAllGet = (subjectId: string,): APITypeAPIResponse<SubjectLessons | undefined> => {
  return new Promise((resolve, reject) => {
    resolve({
      json: () => {
        return (MockJson as SubjectLessons[]).find((obj) => obj.id === subjectId);
      },
    });
  });
};

export default SublessonAllGet;
